import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { 
    sortData, 
    getDateString, 
    objectToArrayConverter, 
    getDraws, 
    getDateTimeString, 
    getAge, 
    checkAgeGroupEligibility 
} from '../../utils/helpers'
import { useLocation } from 'react-router';
import { 
    ageGroups, 
    genderGroups, 
    months, 
    upcomingYears, 
    previousYears, 
    allYears 
} from '../../data/constants';

//firebase
import { getDatabase, ref, child, get, update} from "firebase/database";

// material
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CheckIcon from '@mui/icons-material/Check';

// toast
import { toast } from 'react-toastify';

import './TournamentCalendar.scss';

const database = getDatabase()
const dbRef = ref(database);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const tableRowHeaders = [
    'Location', 
    'Name', 
    'Start Date', 
    'End Date', 
    'Gender Group', 
    'Age Groups', 
    // 'Draw Types', 
    'Status'
]

const enteredPlayersTableRowHeaders = [
    'Name', 
    'Age', 
    'Gender',
    'Entry Date',
    'Status'
]

const withdrawedPlayersTableRowHeaders = [
    'Name', 
    'Age', 
    'Gender',
    'Withdrawal Date',
    'Status'
]

const TournamentCalendar = () => {
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {} // TODO: replace with function that fetches data from firebase
    const [allData, setAllData] = useState({}) // all data fetched from DB
    const location = useLocation()
    const [search, setSearch] = useState({
        name: '',
        location: '',
        ageGroup: '',
        genderGroup: '',
        draws: ['Singles'],
        month: '',
        year: ''
    }) 
    const [data, setData] = useState([]) // data displayed in the table
    const [dataByCategories, setDataByCategories] = useState([]) // data filtered by categories (gender, age, etc.)
    const [tournamentsDisplay, setTournamentsDisplay] = useState("upcoming") // toggle between past and upcoming tournaments

    const [currentTournament, setCurrentTournament] = useState()
    const [open, setOpen] = useState(false)

    const [withdrawalButtonText, setWithdrawalButtonText] = useState("Withdraw")
    const [entryButtonText, setEntryButtonText] = useState("Enter")
    const [statusColor, setStatusColor] = useState()

    // get the players signed up for the current tournament
    const getSignedUpPlayers = (playersSignedUp, withdrawed = false) => {
        const playersData = []
    
        Object.keys(playersSignedUp).map((key, index) => {
            const player = playersSignedUp[key]

            if (withdrawed && player.withdrawed && player.withdrawalTime) {
                playersData.push({
                    name: player.name,
                    age: player.age,
                    gender: player.gender,
                    time: getDateString(player.withdrawalTime),
                    status: 'Withdrawn',
                    id: player.playerID,
                })
            } else if (!withdrawed && !player.withdrawed && !player.withdrawalTime) {
                playersData.push({
                    name: player.name,
                    age: player.age,
                    gender: player.gender,
                    time: getDateString(player.signUpTime),
                    status: 'Entered',
                    id: player.playerID,
                })
            }
        })
    
        return playersData
    }

    const fetchTournaments = ( refresh = false ) => {
        if (refresh) {
            toast.info("The list has been refreshed successfully.")
        }

        get(child(dbRef, 'tournaments')).then((snapshot) => {
            if (snapshot.exists()) {
              setAllData(objectToArrayConverter(snapshot.val()))
            } else {
              console.log("No data available");
              setAllData([])
              toast.info("There is no data available currently.")
            }
            }).catch((error) => {
                console.error(error);
                toast.error("An error has occured.")
            });
    }

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => {
            setWithdrawalButtonText("Withdraw")
            setEntryButtonText("Enter")
        }, 300)
    }

    const getData = () => {
        let tournamentData = []

        allData && allData.length && allData.forEach(t => {
            if (
                (search.ageGroup ? t.ageGroups.includes(search.ageGroup) : true) && 
                (search.genderGroup ? t.genderGroup.includes(search.genderGroup) : true) &&
                (t.city + t.country).toLowerCase().includes(search.location) &&
                t.tournamentName.toLowerCase().includes(search.name) && 
                (t.startDate + t.endDate).includes(search.month) &&
                (t.startDate + t.endDate).includes(search.year) && 
                t.status.toLowerCase() !== 'waiting for approval' && t.status.toLowerCase() !== 'declined' &&
                
                // UPCOMING TOURNAMENTS VS pastD TOURNAMENTS VS ALL TOURNAMENTS
                (tournamentsDisplay === 'upcoming' ? new Date (t.endDate).getTime() > new Date ().getTime() : tournamentsDisplay === 'past' ? new Date (t.endDate).getTime() < new Date ().getTime() : true)
            ) {
                tournamentData.push({
                    location: `${t.city}, ${t.country}`,
                    name: t.tournamentName,
                    startDate: new Date (t.startDate).getTime(),
                    endDate: new Date(t.endDate).getTime(),
                    genderGroup: t.genderGroup,
                    ageGroups: t.ageGroups,
                    // draws: t.draws,
                    status: t.status,
                    id: t.tournamentID
                })
            }

        })

        const sortedTableData = sortData(tournamentData, "startDate", 'asc')
        const organizedTableData = sortedTableData.map(t => {
            return {...t, startDate: getDateString(t.startDate), endDate: getDateString(t.endDate)}
        })

        setDataByCategories([...organizedTableData])

        return organizedTableData
    }

    // open modal with tournament info
    const handleRowClick = (tournamentData) => {
        const tournamentIndex = allData.findIndex(el => el.tournamentID === tournamentData.id)
        const current = allData[tournamentIndex]
        const color = current?.status.toLowerCase() === 'waiting for approval' || 
                        current?.status.toLowerCase() === 'waiting for points distribution' || 
                        current?.status.toLowerCase() === 'postponed' ? 
                            'orange' : 
                        current?.status.toLowerCase() === 'concluded' ?
                            'blue' :
                        current?.status.toLowerCase() === 'declined' || 
                        current?.status.toLowerCase() === 'cancelled' ? 
                            'red' : 'green'
        setStatusColor(color)
        setCurrentTournament(current)
        setOpen(true)
    }

    const handleSearchChange = (e) => {

        const name = e.target.name
        const value = e.target.value

        setSearch({
            ...search,
            [name]: value
        })

        let sortedAndFilteredData = []

        if (name === 'month' || name === 'year') {
            sortedAndFilteredData = dataByCategories.filter(tournament => name === 'month' ? (tournament["startDate"].includes(value) || tournament["endDate"].includes(value)) && (tournament["startDate"].includes(search.year) || tournament["endDate"].includes(search.year)) : (tournament["startDate"].includes(value) || tournament["endDate"].includes(value)) && (tournament["startDate"].includes(search.month) || tournament["endDate"].includes(search.month)));
        } else {
            sortedAndFilteredData = dataByCategories.filter(tournament => tournament[name]?.toLowerCase().includes(value.toLowerCase()));
        }

        setData(sortedAndFilteredData)
    }

    const clearFilters = () => {
        setSearch({
            name: '',
            location: '',
            ageGroup: '',
            genderGroup: '',
            draws: ['Singles'],
            month: '',
            year: ''
        })
    }

    const filterApplied = () => {
        let bool = false

        for (const key in search) {
            if (typeof search[key] !== 'object' && search[key] !== '') {
                bool = true
            }
        }

        return bool
    }

    // PLAYER ROLE - confirm sign up for tournament
    const confirmSignUp = () => {
        if (entryButtonText === 'Enter') {
            setEntryButtonText("Confirm Entry")
        } else {
            const updates = {};
            updates['tournaments/' + currentTournament.tournamentID + '/playersSignedUp/' + userData.userID] = {
                name: `${userData.firstName}\xa0${userData.middleName}\xa0${userData.familyName}`,
                countryOfBirth: userData.countryOfBirth,
                signUpTime: new Date(), 
                signedUp: true,
                playerID: userData.userID, 
                age: getAge(userData.dateOfBirth),
                gender: userData.gender
            };

            update(dbRef, updates)
            .then(() => {
                fetchTournaments()
                toast.success("You have entered the tournament succesfully.")
                toast.info("You can view tournaments you've signed up for in the 'My Tournaments' section.")
            })
            .catch((error) => {
                console.log("Error: ", error)
                toast.error('An error has occured. Please try again.')
            })

            setOpen(false)
            setEntryButtonText("Enter")

        }
    }

    // PLAYER ROLE - confirm withdrawal from tournament
    const confirmWithdrawal = () => {
        if (withdrawalButtonText === 'Withdraw') {
            setWithdrawalButtonText("Confirm Withdrawal")
        } else {
            const updates = {};
            updates['tournaments/' + currentTournament.tournamentID + '/playersSignedUp/' + userData.userID + '/withdrawed'] = true;
            updates['tournaments/' + currentTournament.tournamentID + '/playersSignedUp/' + userData.userID + '/withdrawalTime'] = new Date();

            update(dbRef, updates)
            .then(() => {
                fetchTournaments()
                toast.success("You have withdrawn from the tournament successfully.")
                // toast.info("You can view tournaments you've signed up for in the 'My Tournaments' section.")
            })
            .catch((error) => {
                console.log("Error: ", error)
                toast.error('An error has occured. Please try again.')
            })

            setOpen(false)
            setWithdrawalButtonText("Withdraw")
        }
    }

    const refreshData = () => {
        fetchTournaments(true)
    }

    const isDisabled = () => {
        if ((currentTournament?.genderGroup?.toLowerCase() !== 'mixed' ? 
            currentTournament?.genderGroup?.toLowerCase() !== userData?.gender?.toLowerCase() : false) ||
            !checkAgeGroupEligibility(currentTournament?.ageGroups, getAge(userData?.dateOfBirth))
        ) {
            return true
        }

        return false
    }

    useEffect(() => {
        setData(getData())
    }, [search.ageGroup, search.genderGroup, search.draws, tournamentsDisplay, allData])

    useEffect(() => {
      window.scrollTo(0,0)
      fetchTournaments()
    }, [])

    useEffect(() => {

        const searchGenderGroup = location?.state?.tournamentCalendar

        setSearch({
            ...search,
            genderGroup: searchGenderGroup === "women" ? 'Female' : searchGenderGroup === "men" ? 'Male' : searchGenderGroup === "mixed-doubles" ? 'Mixed' : ''
        })
    }, [location])

    return (
        <div className='container'>
            <h3 className="accent-color" style={{textAlign: 'left'}}>Search Tournaments</h3>
            <div className="flex wrap align-center">
                    <ToggleButtonGroup
                        color="primary"
                        value={tournamentsDisplay}
                        sx={{height: 40, margin: '5px 5px 10px 0px'}}
                        exclusive
                        onChange={(e) => {
                            setTournamentsDisplay(e.target.value)
                        }}
                        >
                        <ToggleButton value={"past"}>past</ToggleButton>
                        <ToggleButton value={"all"}>All</ToggleButton>
                        <ToggleButton value={"upcoming"}>Upcoming</ToggleButton>
                    </ToggleButtonGroup>
                    {/* <div style={{color: "rgba(0, 0, 0, 0.5)"}}>{tournamentsDisplay === "past" ? 'Only past tournaments will be shown.' : tournamentsDisplay === "upcoming" ? 'Only upcoming tournaments will be shown.' : "All tournaments will be shown."}</div> */}
                </div>
            <div className='flex wrap justify-between'>
                <div className="flex wrap" style={{minWidth: '250px', maxWidth: "60%"}}>
                    <TextField
                        name="location"
                        id="outlined-basic"
                        label="Search by location"
                        variant="outlined"
                        size="small"
                        value={search.location}
                        onChange={handleSearchChange}
                        style={{minWidth: 200, margin: '0 5px 10px 0'}}
                    />
                    <TextField
                        name="name"
                        id="outlined-basic"
                        label="Search by name"
                        variant="outlined"
                        size="small"
                        value={search.name}
                        onChange={handleSearchChange}
                        style={{minWidth: 200, margin: '0 5px 10px 0'}}
                    />
                    <TextField
                        id="outlined-select-currency"
                        name="month"
                        select
                        label="Month"
                        value={search.month}
                        onChange={(e) => handleSearchChange(e)}
                        size="small"
                        style={{width: 150, margin: '0 5px 10px 0'}}
                    >
                        {months.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="outlined-select-currency"
                        name="year"
                        select
                        label="Year"
                        value={search.year}
                        onChange={(e) => handleSearchChange(e)}
                        size="small"
                        style={{width: 150, margin: '0 5px 10px 0'}}
                    >
                        {tournamentsDisplay === 'upcoming' &&
                            upcomingYears.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))
                        }
                        {tournamentsDisplay === 'past' &&
                            previousYears.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))
                        }
                        {/* all years limited to recent 5 */}
                        {tournamentsDisplay === 'all' &&
                            allYears.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                    <TextField
                        id="outlined-select-currency"
                        name="genderGroup"
                        select
                        label="Gender Group"
                        value={search.genderGroup}
                        onChange={(e) => handleSearchChange(e)}
                        size="small"
                        style={{width: 150, margin: '0 5px 10px 0'}}
                    >
                        {genderGroups.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="outlined-select-currency"
                        name="ageGroup"
                        select
                        label="Age Group"
                        value={search.ageGroup}
                        onChange={handleSearchChange}
                        size="small"
                        style={{width: 150, margin: '0 5px 10px 0'}}
                    >
                        {ageGroups.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                <div className='flex align-start'>
                    {filterApplied() && <Button variant="outlined" height={70} startIcon={<ClearIcon />} sx={{height: 40, minWidth: 180, margin: '0px !important'}} onClick={clearFilters}>Clear Search</Button>}
                </div>
            </div>
            <Table tableData={data} rowHeaders={tableRowHeaders} onRowClick={handleRowClick}/>
            <Button variant="contained" sx={{height: 40, margin: '30px 10px 0px 0px !important'}} onClick={refreshData} endIcon={<RefreshIcon />}>Refresh Data</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={open}>
                <Box sx={style} className="large-modal full-width">
                    <div className="flex-column justify-center align-center">
                        <div className='flex-column full-width' style={{marginBottom: 30}}>
                        <div className="flex justify-between align-center">
                                <div className="flex-column align-start tournament-header">
                                    <h2 className="accent-color" style={{fontWeight: '500'}}>{currentTournament?.tournamentName}</h2>
                                    <div className={`status-indicator ${statusColor}`}>{currentTournament?.status.toUpperCase()}</div> 
                                </div>
                                <ClearIcon className="pointer accent-color" onClick={handleClose}/>
                            </div>
                            <div style={{margin: '10px 0px 5px 0px'}}>
                                {currentTournament?.startDate && currentTournament?.endDate && <div>{getDateString(new Date (currentTournament?.startDate).getTime())} - {getDateString(new Date (currentTournament?.endDate).getTime())}</div>}
                            </div>
                            <div style={{marginBottom: 5}}>{currentTournament?.clubName}</div>
                            <div style={{marginBottom: 5}}>{currentTournament?.street}, {currentTournament?.city}, {currentTournament?.country} {currentTournament?.zipCode}</div>
                            <h3 className="accent-color section-title">General Information</h3>
                            <div className="flex-column">
                                <div style={{marginBottom: 15}}>{currentTournament?.description}</div>
                                {currentTournament?.onSiteSignupDeadline && <div style={{marginBottom: 5}}>On Site Signup Deadline: {getDateTimeString(new Date (currentTournament.onSiteSignupDeadline).getTime())}</div>}
                                <div style={{marginBottom: 5}}>{!currentTournament?.qualification ? "There is no qualifying draw." : 
                                    currentTournament?.qualification && currentTournament?.qualificationStartDate && currentTournament?.qualificationEndDate && 
                                        `Qualification Dates: ${getDateString(new Date (currentTournament?.qualificationStartDate).getTime())} - ${getDateString(new Date (currentTournament?.qualificationEndDate).getTime())}`
                                }</div>
                            </div>
                            <h3 className="accent-color section-title">Terms of Play</h3>
                            <div className="flex-column">
                                {currentTournament?.courtsNumber && currentTournament?.courtSurface && <div className="flex-column justify-start" style={{marginBottom: 30}}>
                                    <div style={{marginBottom: 5}}>Courts Available:</div>
                                    <div>{currentTournament?.courtsNumber} {currentTournament?.courtSurface} Courts</div>
                                </div>}
                                <div className="flex-column justify-start" style={{marginRight: 40}}> 
                                    <div style={{marginBottom: 5}}>Draw(s):</div>
                                    {getDraws(currentTournament?.ageGroups, currentTournament?.genderGroup, currentTournament?.drawType)}
                                </div>
                                <div className="flex-column justify-start" style={{marginBottom: 30}}> 
                                    <div style={{marginBottom: 5}}>Draw size(s):</div>
                                    {currentTournament?.drawType !== "doubles" && currentTournament?.singlesDrawSize && <div>Singles Draw: {currentTournament.singlesDrawSize}</div>}
                                    {currentTournament?.drawType !== "singles" && currentTournament?.doublesDrawSize && <div>Doubles Draw: {currentTournament.doublesDrawSize}</div>}
                                    {currentTournament?.drawType !== "singles" && currentTournament?.genderGroup?.toLowerCase() === "mixed" && currentTournament?.mixedDoublesDrawSize && <div>Mixed Doubles Draw: {currentTournament.mixedDoublesDrawSize}</div>}
                                </div>
                                <div className="flex-column justify-start"> 
                                    <div style={{marginBottom: 5}}>Entry Tax:</div>
                                    <div style={{marginBottom: 30}}>{currentTournament?.entryTax > 0 ? `${currentTournament?.entryTax} EUR` : 'No entry tax.'}</div>
                                </div>
                                <div className="flex-column justify-start"> 
                                    <div style={{marginBottom: 5}}>Prize Money:</div>
                                    <div style={{marginBottom: 30}}>{currentTournament?.prizeMoney > 0 ? `${currentTournament?.prizeMoney} EUR` : 'No prize money.'}</div>
                                </div>
                                <div>{currentTournament?.medicalTeamOnSite ? 'There will be a medical team available on site.' : 'No medical team available on site.'}</div>
                            </div>
                        </div>
                        {userData.role === 'player' && currentTournament?.status === "Sign Up Open" && <div className="flex">
                            {currentTournament?.playersSignedUp && 
                            currentTournament?.playersSignedUp[userData.userID] && 
                            currentTournament?.playersSignedUp[userData.userID].withdrawed !== true ? (<Button 
                                className="red-button" 
                                variant={withdrawalButtonText === 'Withdraw' ? 'outlined' : 'contained'} 
                                sx={{height: 40, margin: '0px 0px 5px 0px !important'}} 
                                onClick={confirmWithdrawal}
                                endIcon={<LogoutOutlinedIcon />}
                            >
                                {withdrawalButtonText}
                            </Button>) : (
                                <Button 
                                    variant={entryButtonText === 'Enter' ? 'outlined' : 'contained'} 
                                    sx={{height: 40, margin: '0px 5px 0px 0px !important'}} 
                                    onClick={confirmSignUp}
                                    disabled={
                                        (currentTournament?.playersSignedUp && 
                                        currentTournament?.playersSignedUp[userData.userID] &&
                                        currentTournament?.playersSignedUp[userData.userID].withdrawed === true) ||
                                        isDisabled()
                                    }
                                    startIcon={<CheckIcon />}
                                >{entryButtonText}</Button>
                            )}
                        </div>}
                        {isDisabled() && <div className="info-message">You are not eligible to sign up for this tournament.</div>}
                        {currentTournament?.playersSignedUp && 
                        currentTournament?.playersSignedUp[userData.userID] &&
                        currentTournament?.playersSignedUp[userData.userID].withdrawed === true && 
                        <div className="info-message">You have already withdrawn from this tournament. You cannot enter again.</div>}
                        {entryButtonText === "Confirm Entry" && <div className="info-message">Please keep in mind that you can enter a tournament only once. If you decide to withdraw, you will not be able to enter this tournament again.</div>}
                        {withdrawalButtonText === "Confirm Withdrawal" && <div className="info-message">Please keep in mind that after withdrawing, you will not be able to sign up for the tournament again.</div>}
                        {currentTournament?.playersSignedUp ? 
                        (<div className="flex-column full-width">
                            <div>
                                <h3 className="accent-color section-title">Signed Up Players</h3>
                                <Table tableData={getSignedUpPlayers(currentTournament.playersSignedUp)} rowHeaders={enteredPlayersTableRowHeaders} onRowClick={(e) => console.log(e)}/>
                            </div>
                            <div>
                                <h3 className="accent-color section-title">Withdrawn Players</h3>
                                <Table tableData={getSignedUpPlayers(currentTournament.playersSignedUp, true)} rowHeaders={withdrawedPlayersTableRowHeaders} onRowClick={(e) => console.log(e)}/>
                            </div>
                        </div>) : currentTournament?.status && currentTournament?.status === 'Sign Up Open' ? 
                        (<div className="info-message">
                            No people have signed up yet.
                        </div>) : (
                        <div></div>
                        )}
                    </div>
                </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default TournamentCalendar
//TODO: GOOGLE CALENDAR INTEGRATION