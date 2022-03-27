import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { sortData, getDateString, objectToArrayConverter } from '../../utils/helpers'
import { useLocation } from 'react-router';
import { ageGroups, genderGroups, months, upcomingYears, previousYears, allYears } from '../../data/constants';
// import { newMockTournamentData } from '../../data/dummyData';

//firebase
import { getDatabase, ref, child, get, set, push, update} from "firebase/database";

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

const TournamentCalendar = () => {
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {} // TODO: replace with function that fetches data from firebase
    const [allData, setAllData] = useState({})
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
    const [data, setData] = useState([])
    const [dataByCategories, setDataByCategories] = useState([])
    const [currentTournament, setCurrentTournament] = useState()
    const [open, setOpen] = useState(false)
    const [withdrawalButtonText, setWithdrawalButtonText] = useState("Withdraw")
    const [entryButtonText, setEntryButtonText] = useState("Enter")
    const [statusColor, setStatusColor] = useState()
    const [tournamentsDisplay, setTournamentsDisplay] = useState("upcoming") // toggle between archive and upcoming tournaments

    const fetchTournaments = ( refresh = false ) => {
        if (refresh) {
            toast.info("The list has been refreshed.")
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
                
                // UPCOMING TOURNAMENTS VS ARCHIVED TOURNAMENTS VS ALL TOURNAMENTS
                (tournamentsDisplay === 'upcoming' ? new Date (t.endDate).getTime() > new Date ().getTime() : tournamentsDisplay === 'archive' ? new Date (t.endDate).getTime() < new Date ().getTime() : true)
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

    const handleRowClick = (tournamentData) => {
        const tournamentIndex = allData.findIndex(el => el.tournamentID === tournamentData.id)
        const current = allData[tournamentIndex]
        const color = current?.status.toLowerCase() === 'waiting for approval' || current?.status.toLowerCase() === 'postponed' ? 'orange' : current?.status.toLowerCase() === 'declined' ? 'red' : 'green'

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

    const confirmSignUp = () => {
        if (entryButtonText === 'Enter') {
            setEntryButtonText("Confirm Entry")
        } else {
            const updates = {};
            updates['tournaments/' + currentTournament.tournamentID + '/playersSignedUp/' + userData.userID] = {
                name: `${userData.firstName}  ${userData.familyName}`,
                signUpTime: new Date(), 
                signedUp: true,
                playerID: userData.userID, 
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

    const refreshData = () => {
        fetchTournaments(true)
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
                        <ToggleButton value={"archive"}>Archive</ToggleButton>
                        <ToggleButton value={"all"}>All</ToggleButton>
                        <ToggleButton value={"upcoming"}>Upcoming</ToggleButton>
                    </ToggleButtonGroup>
                    {/* <div style={{color: "rgba(0, 0, 0, 0.5)"}}>{tournamentsDisplay === "archive" ? 'Only past tournaments will be shown.' : tournamentsDisplay === "upcoming" ? 'Only upcoming tournaments will be shown.' : "All tournaments will be shown."}</div> */}
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
                        {tournamentsDisplay === 'archive' &&
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
                <Box sx={style} className="large-modal">
                    <div className="flex-column justify-center align-center">
                        <div className='flex-column' style={{marginBottom: 30}}>
                            <div className="flex justify-between align-center">
                                <h2 className="accent-color" style={{fontWeight: '500'}}>{currentTournament?.tournamentName}</h2>
                                <div className={`status-indicator ${statusColor}`}>{currentTournament?.status.toUpperCase()}</div> 
                            </div>
                            <div style={{marginBottom: 5}}>
                                {currentTournament?.startDate && currentTournament?.endDate && <div>{getDateString(new Date (currentTournament?.startDate).getTime())} - {getDateString(new Date (currentTournament?.endDate).getTime())}</div>}
                            </div>
                            <div style={{marginBottom: 5}}>{currentTournament?.clubName}</div>
                            <div style={{marginBottom: 5}}>{currentTournament?.city}, {currentTournament?.country}</div>
                            <h3 className="accent-color" style={{marginTop: 40}}>Terms of Play</h3>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                            <h3 className="accent-color" style={{marginTop: 40}}>Section Title</h3>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                            <h3 className="accent-color" style={{marginTop: 40}}>Section Title</h3>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                        </div>
                        {userData.role === 'player' && <div className="flex">
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
                                        currentTournament?.playersSignedUp && 
                                        currentTournament?.playersSignedUp[userData.userID] &&
                                        currentTournament?.playersSignedUp[userData.userID].withdrawed === true
                                    }
                                    startIcon={<CheckIcon />}
                                >{entryButtonText}</Button>
                            )}
                        </div>}
                        {currentTournament?.playersSignedUp && 
                        currentTournament?.playersSignedUp[userData.userID] &&
                        currentTournament?.playersSignedUp[userData.userID].withdrawed === true && 
                        <div>You have already withdrawn from this tournament. You cannot enter again.</div>}
                        {entryButtonText === "Confirm Entry" && <div>Please keep in mind that you can enter a tournament only once. If you decide to withdraw, you will not be able to enter this tournament again.</div>}
                        {withdrawalButtonText === "Confirm Withdrawal" && <div>Please keep in mind that after withdrawing, you will not be able to sign up for the tournament again.</div>}
                    </div>
                </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default TournamentCalendar
//TODO: GOOGLE CALENDAR INTEGRATION