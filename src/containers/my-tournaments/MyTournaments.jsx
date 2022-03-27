import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { useLocation } from 'react-router';
import { ageGroups, genderGroups, months, upcomingYears, previousYears, allYears } from '../../data/constants';
import { mockTournamentData } from '../../data/dummyData';
import { sortData, getDateString, objectToArrayConverter } from '../../utils/helpers'

// material
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import RefreshIcon from '@mui/icons-material/Refresh';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckIcon from '@mui/icons-material/Check';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

//firebase
import { getDatabase, ref, child, get, set, push, update} from "firebase/database";

// toast
import { toast } from 'react-toastify';

//styles
import './MyTournaments.scss';

const database = getDatabase()
const dbRef = ref(database);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
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
    'Entry Date',
    'Status'
]

const withdrawedPlayersTableRowHeaders = [
    'Name', 
    'Withdrawal Date',
    'Status'
]


// const fetchPlayerData = (playerID) => {
//     let playerData = {};

//     get(child(dbRef, `players/${playerID}`))
//     .then((snapshot) => {
//         if (snapshot.exists()) {
//             playerData = snapshot.val();
//             console.log("PLAYER DATA", playerData)
//         } else {
//           console.log("No data available");
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//         toast.error('An error has occured. Please try again.')
//       });

//       console.log('we return', playerData)
//       return playerData
// }

const MyTournaments = () => {
    const [allData, setAllData] = useState({})
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {} // TODO: replace with function that fetches data from firebase
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

    const [signedUpPlayersData, setSignedUpPlayersData] = useState([])
    const [data, setData] = useState([]) // data displayed in the table
    const [dataByCategories, setDataByCategories] = useState([]) // all data filtered by categories (gender group, age group, dates)
    const [currentTournament, setCurrentTournament] = useState() // current tournament clicked on for which the modal is opened
    const [open, setOpen] = useState(false) // tournament info modal open state
    const [tournamentsTime, setTournamentsTime] = useState("upcoming") // toggle between archive and upcoming tournaments
    const [tournamentsDisplay, setTournamentsDisplay] = useState(userData.role === 'player' ? 'entered' : '') // toggle between enterd and withdrawn from tournaments for player view only
    const [withdrawalButtonText, setWithdrawalButtonText] = useState("Withdraw")
    const [tournamentApprovalText, setTournamentApprovalText] = useState("Approve")
    const [tournamentCancellationText, setTournamentCancellationText] = useState("Decline")
    const [approvalButtonVariant, setApprovalButtonVariant] = useState("outlined")
    const [declineButtonVariant, setDeclineButtonVariant] = useState("outlined")
    const [statusColor, setStatusColor] = useState()

    //testing user roles
    const userRole = userData.role
    const userID = userData.userID

    const getSignedUpPlayers = (playersSignedUp, withdrawed = false) => {

        const test = [{
            name: "Kristina Kapitanova",
            date: getDateString(new Date ().toString()),
            status: "Entered"
        }]    

        const playersData = []
    
        Object.keys(playersSignedUp).map((key, index) => {
            const player = playersSignedUp[key]
            console.log(player)

            if (withdrawed && player.withdrawed && player.withdrawalTime) {
                playersData.push({
                    name: player.name,
                    time: getDateString(player.withdrawalTime),
                    status: 'Withdrawn'
                })
            } else if (!withdrawed && !player.withdrawed && !player.withdrawalTime) {
                playersData.push({
                    name: player.name,
                    time: getDateString(player.signUpTime),
                    status: 'Entered'
                })
            }
        })
    
        console.log(playersData)
        return playersData
    }

    const fetchTournaments = ( refresh = false) => {
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

    // tournament info modal close
    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setTournamentApprovalText("Approve")
            setApprovalButtonVariant("outlined")
            setTournamentCancellationText("Decline")
            setDeclineButtonVariant("outlined")
        }, 300)
    }

    const getData = () => {
        let tournamentData = []
        
        allData && allData.length && allData.forEach(t => {
            if (
                (search.ageGroup ? t.ageGroups && t.ageGroups.includes(search.ageGroup) : true) && 
                (search.genderGroup ? t.genderGroup && t.genderGroup.includes(search.genderGroup) : true) &&
                (t.city + t.country)?.toLowerCase().includes(search.location) &&
                t.tournamentName?.toLowerCase().includes(search.name) && 
                (t.startDate + t.endDate).includes(search.month) &&
                (t.startDate + t.endDate).includes(search.year) && 
                // (t.status.toLowerCase() === 'waiting for approval' || t.status.toLowerCase() === 'declined') &&
                
                /// UPCOMING TOURNAMENTS VS ARCHIVED TOURNAMENTS VS ALL TOURNAMENTS
                (tournamentsTime === 'upcoming' ? new Date (t.endDate).getTime() > new Date ().getTime() : tournamentsTime === 'archive' ? new Date (t.endDate).getTime() < new Date ().getTime() : true) &&

                // ADMIN VIEW
                (((userRole && userRole.toLowerCase() === 'admin') ? (t.status?.toLowerCase() === "waiting for approval" || t.status?.toLowerCase() === 'declined') : false) ||

                // CLUB REP VIEW
                (userRole && userRole.toLowerCase() === 'clubrep' && t.submittedBy === userData.userID) ||

                // PLAYER VIEW - show only tournaments you've signed up for/withdrawn from
                (userRole && userRole.toLowerCase() === 'player' &&  t.playersSignedUp && Object.keys(t.playersSignedUp) && t.playersSignedUp[userID] && ((tournamentsDisplay === 'entered' ? !t.playersSignedUp[userID].withdrawalTime : tournamentsDisplay === 'withdrawn' ? t.playersSignedUp[userID].withdrawalTime : true))))
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

        // sort data by start data in ascending order (sooner tournaments will appear first)
        const sortedTableData = userRole?.toLowerCase() !== 'clubrep' ? sortData(tournamentData, "startDate", 'asc') : sortData(tournamentData, "startDate", 'desc')

        // format the tournaments' start and end dates
        const organizedTableData = sortedTableData.map(t => {
            return {...t, startDate: getDateString(t.startDate), endDate: getDateString(t.endDate)}
        })

        setDataByCategories([...organizedTableData])

        return organizedTableData
    }


    const handleRowClick = (tournamentData) => {
        const tournamentIndex = allData.findIndex(el => el.tournamentID === tournamentData.id)
        const current = allData[tournamentIndex]
        const color = current?.status?.toLowerCase() === 'waiting for approval' || current?.status?.toLowerCase() === 'postponed' ? 'orange' : current?.status?.toLowerCase() === 'declined' ? 'red' : 'green'

        setStatusColor(color)
        setCurrentTournament(current)
        setOpen(true)
    }

    // handle search changes (filters applied, etc.)
    const handleSearchChange = (e) => {

        const name = e.target.name
        const value = e.target.value

        setSearch({
            ...search,
            [name]: value
        })

        let sortedAndFilteredData = []

        if (name === 'month' || name === 'year') { // if a filter for the dates is applied, then the filter should consider both the start date and the end date
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

    const confirmApproval = () => {
        setApprovalButtonVariant("contained")
        setTournamentApprovalText("Confirm Approval")

        if (tournamentApprovalText === "Confirm Approval") {
            const updatedData = []
            
            data.forEach(item => {
                if (item.id !== currentTournament.tournamentID) {
                    updatedData.push(item)
                } else {
                    item.status = "Open" //TODO: Replace with actual call that updates status
                }
            })

            setData(updatedData)
            handleClose()

            let updatedTournament = currentTournament;
            updatedTournament.status = 'Open'

            const updates = {};
            updates['/tournaments/' + currentTournament.tournamentID] = updatedTournament;

            update(dbRef, updates)
            .then(() => {
                toast.success("You have approved a tournament successfully.")
                toast.info("The tournament is now shown in the tournament calendar.")
                console.log("submission confirmed")
            })
            .catch((error) => {
                console.log("Error: ", error)
                toast.error('An error has occured. Please try again.')
            })
        }
    }

    // admin tournament decline
    const confirmDecline = () => {
        setDeclineButtonVariant("contained")
        setTournamentCancellationText("Confirm Decline")

        if (tournamentCancellationText === "Confirm Decline") {
            const updatedData = []
            
            data.forEach(item => {
                if (item.id === currentTournament.tournamentID) {
                    item.status = "Declined" //TODO: Replace with actual call that updates status
                }
                updatedData.push(item)
            })

            setData(updatedData)
            handleClose()

            let updatedTournament = currentTournament;
            updatedTournament.status = 'Declined'

            const updates = {};
            updates['/tournaments/' + currentTournament.tournamentID] = updatedTournament;

            update(dbRef, updates)
            .then(() => {
                toast.success("You have declined a tournament successfully.")
                toast.info("The tournament will stay archived only for you and the club representative to see.")
                console.log("submission confirmed")
            })
            .catch((error) => {
                console.log("Error: ", error)
                toast.error('An error has occured. Please try again.')
            })
        }
    }

    // player withdrawal from tournament
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

    // scroll to top when opening the page for the first time
    useEffect(() => {
        window.scrollTo(0,0)
        fetchTournaments()
    }, [])

    useEffect(() => {
        setData(getData())
    }, [search.ageGroup, search.genderGroup, search.draws, userRole, tournamentsTime, tournamentsDisplay, allData])

    // update data accordingly if the search query changes in the location 
    useEffect(() => {
        const searchGenderGroup = location?.state?.tournamentCalendar

        setSearch({
            ...search,
            genderGroup: searchGenderGroup === "women" ? 'Female' : searchGenderGroup === "men" ? 'Male' : searchGenderGroup === "mixed-doubles" ? 'Mixed' : ''
        })
    }, [location])

    return (
        <div className="container">
            <h3 className="accent-color" style={{textAlign: 'left'}}>My Tournaments - {userRole === "clubRep" ? 'Club Representative' : userRole === 'player' ? 'Player' : 'Admin'} View</h3>
            {userData?.role?.toLowerCase() === 'admin' && 
                <div className="helper-text">
                    Here you can preview the tournaments submitted for approval and update their status by either rejecting or approving them. 
                    Approved tournaments will be moved to the tournament calendar.
                </div>
            }
            {userData?.role?.toLowerCase() === 'clubrep' && 
                <div className="helper-text">
                    Here you can preview all of the tournaments you have submitted and their status. 
                    'Waiting for Approval' means that the tournament is waiting to be approved by an admin. 'Declined' means that the request for a tournament has been rejected.
                </div>
            }
            {userData?.role?.toLowerCase() === 'player' && 
                <div className="helper-text">
                    Here you can preview the tournaments you have signed up for. 
                    You can withdraw from any tournament, but withdrawing meeans you will not be able to sign up for the tournament again.
                </div>
            }
            {/* <div className="flex wrap align-center">
                <ToggleButtonGroup
                    color="primary"
                    value={userRole}
                    sx={{height: 40, margin: '10px 5px 5px 0px'}}
                    exclusive
                    onChange={(e) => {
                        setUserRole(e.target.value)
                    }}
                    >
                    <ToggleButton value="admin">Admin</ToggleButton>
                    <ToggleButton value="clubRep">Club Rep</ToggleButton>
                    <ToggleButton value="player">Player</ToggleButton>
                </ToggleButtonGroup>
                <div style={{color: "rgba(0, 0, 0, 0.5)"}}>Testing accounts</div>
            </div> */}
            {userRole && userRole === 'player' && <div className="flex wrap align-center">
                <ToggleButtonGroup
                    color="primary"
                    value={tournamentsDisplay}
                    sx={{height: 40, margin: '5px 5px 10px 0px'}}
                    exclusive
                    onChange={(e) => {
                        setTournamentsDisplay(e.target.value)
                    }}
                    >
                    <ToggleButton value={"withdrawn"} className="red-option">Withdrawn from</ToggleButton>
                    <ToggleButton value={"entered"}>Entered</ToggleButton>
                </ToggleButtonGroup>
                {/* <div style={{color: "rgba(0, 0, 0, 0.5)"}}>{tournamentsDisplay === "archive" ? 'Only past tournaments will be shown.' : tournamentsDisplay === "upcoming" ? 'Only upcoming tournaments will be shown.' : "All tournaments will be shown."}</div> */}
            </div>}
            <div className="flex wrap align-center">
                <ToggleButtonGroup
                    color="primary"
                    value={tournamentsTime}
                    sx={{height: 40, margin: '5px 5px 10px 0px'}}
                    exclusive
                    onChange={(e) => {
                        setTournamentsTime(e.target.value)
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
                        {tournamentsTime === 'upcoming' &&
                            upcomingYears.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))
                        }
                        {tournamentsTime === 'archive' &&
                            previousYears.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))
                        }
                        {tournamentsTime === 'all' &&
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
                        <div className="flex-column">
                            <div className="flex justify-between align-center tournament-header">
                                <h2 className="accent-color" style={{fontWeight: '500'}}>{currentTournament?.tournamentName}</h2>
                                <div className={`status-indicator ${statusColor}`}>{currentTournament?.status.toUpperCase()}</div> 
                            </div>
                            <div style={{marginBottom: 5}}>
                                {currentTournament?.startDate && currentTournament?.endDate && <div>{getDateString(new Date (currentTournament?.startDate).getTime())} - {getDateString(new Date (currentTournament?.endDate).getTime())}</div>}
                            </div>
                            <div style={{marginBottom: 5}}>{currentTournament?.clubName}</div>
                            <div style={{marginBottom: 5}}>{currentTournament?.city}, {currentTournament?.country}</div>
                            <h3 className="accent-color section-title">Terms of Play</h3>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                            <h3 className="accent-color section-title">Section Title</h3>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                            <h3 className="accent-color section-title">Section Title</h3>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                        </div>
                        {userData?.role?.toLowerCase() === "admin" && currentTournament?.status?.toLowerCase() === 'waiting for approval' && (
                            <div className="flex">
                                <Button variant={approvalButtonVariant} sx={{height: 40, margin: '30px 10px 0px 0px !important'}} onClick={() => confirmApproval()} startIcon={<CheckIcon />}>{tournamentApprovalText}</Button>
                                <Button className="red-button" variant={declineButtonVariant} sx={{height: 40, margin: '30px 0px 0px 10px !important'}} onClick={() => confirmDecline()} endIcon={<CancelOutlinedIcon />}>{tournamentCancellationText}</Button>
                            </div>
                        )}
                        {userData?.role?.toLowerCase() === 'player' && <div className="flex">
                            {currentTournament?.playersSignedUp && 
                            currentTournament?.playersSignedUp[userData.userID] && 
                            currentTournament?.playersSignedUp[userData.userID].withdrawed !== true ? 
                            (<Button 
                                className="red-button" 
                                variant={withdrawalButtonText === 'Withdraw' ? 'outlined' : 'contained'} 
                                sx={{height: 40, marginTop: '30px !important'}} 
                                onClick={confirmWithdrawal}
                                endIcon={<LogoutOutlinedIcon />}
                            >
                                {withdrawalButtonText}
                            </Button>) : (
                                <Button 
                                    variant={'outlined'} 
                                    sx={{height: 40, marginTop: '30px !important'}} 
                                    disabled
                                    startIcon={<CheckIcon />}
                                >Enter</Button>
                            )}
                        </div>}
                        {currentTournament?.playersSignedUp && 
                        currentTournament?.playersSignedUp[userData.userID] &&
                        currentTournament?.playersSignedUp[userData.userID].withdrawed === true && 
                        <div>You have already withdrawn from this tournament. You cannot enter again.</div>}
                        {withdrawalButtonText === "Confirm Withdrawal" && <div>Please keep in mind that after withdrawing, you will not be able to sign up for the tournament again.</div>}
                        {userRole === 'clubRep' && (currentTournament?.playersSignedUp ? 
                        (<div className="flex-column full-width">
                            <div>
                                <h3 className="accent-color section-title">Signed Up Players</h3>
                                <Table tableData={getSignedUpPlayers(currentTournament.playersSignedUp)} rowHeaders={enteredPlayersTableRowHeaders}/>
                            </div>
                            <div>
                                <h3 className="accent-color section-title">Withdrawn Players</h3>
                                <Table tableData={getSignedUpPlayers(currentTournament.playersSignedUp, true)} rowHeaders={withdrawedPlayersTableRowHeaders}/>
                            </div>
                        </div>) : currentTournament?.status && currentTournament?.status?.toLowerCase() === 'open' ? 
                        (<div>
                            No people have signed up yet.
                        </div>) : (
                        <div></div>
                        ))}
                    </div>
                </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default MyTournaments