import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { useLocation } from 'react-router';
import { ageGroups, genderGroups, months, upcomingYears, previousYears, allYears } from '../../data/constants';
import { sortData, getDateString, objectToArrayConverter, getDraws, getDateTimeString } from '../../utils/helpers';
import PointsDistribution from './PointsDistribution';

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
import { getDatabase, ref, child, get, update} from "firebase/database";

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

const MyTournaments = () => {
    const [allData, setAllData] = useState({}) // all data fetched from db
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

    const [data, setData] = useState([]) // data displayed in the table
    const [dataByCategories, setDataByCategories] = useState([]) // all data filtered by categories (gender group, age group, dates)
    const [currentTournament, setCurrentTournament] = useState() // current tournament modal
    const [open, setOpen] = useState(false) // tournament info modal open state
    const [tournamentsTime, setTournamentsTime] = useState("upcoming") // toggle between past and upcoming tournaments
    const [tournamentsDisplay, setTournamentsDisplay] = useState(userData.role === 'player' ? 'entered' : '') // toggle between enterd and withdrawn from tournaments for player view only
    
    const [withdrawalButtonText, setWithdrawalButtonText] = useState("Withdraw")
    const [approvalText, setApprovalText] = useState("Approve")
    const [declinatureText, setDeclinatureText] = useState("Decline")
    const [conclusionText, setConclusionText] = useState("Conclude Tournament")
    const [cancellationText, setCancellationText] = useState("Cancel Tournament")
    const [pointsDistributionText, setPointsDistributionText] = useState("Distribute Points")
    const [signUpClosureText, setSignUpClosureText] = useState("Close Sign Up")
    const [statusColor, setStatusColor] = useState()

    //testing user roles
    const userRole = userData.role
    const userID = userData.userID


    const updateCurrentPlayerPoints = (draw, id, pointsWon) => {
        const updates = {}

        get(child(dbRef, `rankings/${draw}/${id}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const currentPlayerPoints = snapshot.val().pointsWon
                updates[`/rankings/${draw}/${id}`] = { playerID: id, pointsWon: parseInt(pointsWon) + currentPlayerPoints, updated: new Date() };

            } else {
                updates[`/rankings/${draw}/${id}`] = { playerID: id, pointsWon: parseInt(pointsWon), updated: new Date()};
                console.log("No data available");
            }

            update(dbRef, updates)
                .then(() => {
                    // toast.success("You have distributed the points successfully.")
                    // toast.info("We thank you for this tournament!")
                })
                .catch((error) => {
                    console.log("Error: ", error)
                    toast.error('An error has occured. Please try again.')
                })


            }).catch((error) => {
                console.error(error);
                toast.error("An error has occured.")
            });
    }

    // get the players signed up for the current tournament
    const getSignedUpPlayers = (playersSignedUp, withdrawed = false) => {

        const test = [{
            name: "Kristina Kapitanova",
            date: getDateString(new Date ().toString()),
            status: "Entered"
        }]    

        const playersData = []
    
        Object.keys(playersSignedUp).map((key, index) => {
            const player = playersSignedUp[key]

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
    
        return playersData
    }

    const fetchTournaments = (refresh = false) => {
        if (refresh) {
            toast.info("The list has been refreshed.")
        }

        get(child(dbRef, 'tournaments')).then((snapshot) => {
            if (snapshot.exists()) {
              setAllData(objectToArrayConverter(snapshot.val()))
            } else {
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
            setApprovalText("Approve")
            setDeclinatureText("Decline")
            setSignUpClosureText("Close Sign Up")
            setConclusionText("Conclude Tournament")
            setCurrentTournament()
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
                
                /// UPCOMING TOURNAMENTS VS PAST TOURNAMENTS VS ALL TOURNAMENTS
                (tournamentsTime === 'upcoming' ? new Date (t.endDate).getTime() > new Date ().getTime() : tournamentsTime === 'past' ? new Date (t.endDate).getTime() < new Date ().getTime() : true) &&

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


    // open details modal upon row click
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
                        current?.status.toLowerCase() === 'canceled' ? 
                            'red' : 'green'

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

    // ADMIN VIEW - tournament approval
    const confirmApproval = () => {
        if (approvalText === "Confirm Approval") {
            const updatedData = []
            
            data.forEach(item => {
                if (item.id !== currentTournament.tournamentID) {
                    updatedData.push(item)
                } else {
                    item.status = "Sign Up Open"
                }
            })

            setData(updatedData)
            handleClose()

            let updatedTournament = currentTournament;
            updatedTournament.status = 'Sign Up Open'

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
        } else {
            setApprovalText("Confirm Approval")
        }
    }

    // ADMIN VIEW - tournament decline
    const confirmDecline = () => {
        if (declinatureText === "Confirm Decline") {
            const updatedData = []
            
            data.forEach(item => {
                if (item.id === currentTournament.tournamentID) {
                    item.status = "Declined"
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
                toast.info("The tournament will stay pastd only for you and the club representative to see.")
                console.log("submission confirmed")
            })
            .catch((error) => {
                console.log("Error: ", error)
                toast.error('An error has occured. Please try again.')
            })
        } else {
            setDeclinatureText("Confirm Decline")
        }
    }

    // PLAYER VIEW - withdrawal from tournament
    const confirmWithdrawal = () => {
        if (withdrawalButtonText === 'Confirm Withdrawal') {
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
        } else {
            setWithdrawalButtonText("Confirm Withdrawal")
        }
    }

    // CLUB REP VIEW - Close sign up for tournaments
    const confirmSignUpClosure = () => {
        if (signUpClosureText === "Confirm Sign Up Closure") {
            const updatedData = []
            
            data.forEach(item => {
                if (item.id === currentTournament.tournamentID) {
                    item.status = "In Progress"
                }
                updatedData.push(item)
            })

            setData(updatedData)
            handleClose()

            let updatedTournament = currentTournament;
            updatedTournament.status = 'In Progress'

            const updates = {};
            updates['/tournaments/' + currentTournament.tournamentID] = updatedTournament;

            update(dbRef, updates)
            .then(() => {
                toast.success("You have closed the sign up for this tournament successfully.")
                toast.info("The tournament is now considered 'In Progress'.")
                console.log("submission confirmed")
            })
            .catch((error) => {
                console.log("Error: ", error)
                toast.error('An error has occured. Please try again.')
            })
        } else {
            setSignUpClosureText("Confirm Sign Up Closure")
        }
    }

    // CLUB REP VIEW - Confirm tournament conclusion
    const confirmConclusion = () => { // TODO: make updating functions more reusable
        if (conclusionText === "Confirm Conclusion") {
            const updatedData = []
            
            data.forEach(item => {
                if (item.id === currentTournament.tournamentID) {
                    item.status = "Waiting for Points Distribution"
                }
                updatedData.push(item)
            })

            setData(updatedData)
            handleClose()

            let updatedTournament = currentTournament;
            updatedTournament.status = 'Waiting for Points Distribution'

            const updates = {};
            updates['/tournaments/' + currentTournament.tournamentID] = updatedTournament;

            update(dbRef, updates)
            .then(() => {
                toast.success("You have concluded this tournament successfully.")
                toast.info("You will now need to enter all of the points won by each player.")
            })
            .catch((error) => {
                console.log("Error: ", error)
                toast.error('An error has occured. Please try again.')
            })
        } else {
            setConclusionText("Confirm Conclusion")
        }
    }

    // CLUB REP & ADMIN VIEW - Cancel tournament
    const confirmCancellation = () => {
        if (cancellationText === "Confirm Cancellation") {
            const updatedData = []
            
            data.forEach(item => {
                if (item.id === currentTournament.tournamentID) {
                    item.status = "Canceled"
                }
                updatedData.push(item)
            })

            setData(updatedData)
            handleClose()

            let updatedTournament = currentTournament;
            updatedTournament.status = 'Canceled'

            const updates = {};
            updates['/tournaments/' + currentTournament.tournamentID] = updatedTournament;

            update(dbRef, updates)
            .then(() => {
                toast.success("You have canceled this tournament successfully.")
                toast.info("We hope that you will have another opportunity to host a tournament!")
            })
            .catch((error) => {
                console.log("Error: ", error)
                toast.error('An error has occured. Please try again.')
            })
        } else {
            setCancellationText("Confirm Cancellation")
        }
    }


    // CLUB REP - Points distribution
    const confirmPointsDistribution = (points) => {
        if (pointsDistributionText === "Confirm Distribution") {            
            const signedUpPlayers = { ...currentTournament.playersSignedUp }
            const updates = {};

            for (let key in signedUpPlayers) {
                points.map(p => {
                    if (key === p.playerID) {
                        signedUpPlayers[key].pointsWon = p.pointsWon
                        updateCurrentPlayerPoints(`${p.draw}`, p.playerID, p.pointsWon) // update ranking points in DB
                    }
                })
            }

            const updatedData = []
            
            data.forEach(item => {
                if (item.id === currentTournament.tournamentID) {
                    item.status = "Concluded"
                }
                updatedData.push(item)
            })

            setData(updatedData)
            handleClose()

            const updatedTournament = currentTournament
            updatedTournament.status = 'Concluded'
            updatedTournament.playersSignedUp = signedUpPlayers

            // update points won within current tournament in DB
            updates['/tournaments/' + currentTournament.tournamentID] = updatedTournament; 

            update(dbRef, updates)
            .then(() => {
                toast.success("You have distributed the points successfully.")
                toast.info("We thank you for this tournament!")
            })
            .catch((error) => {
                console.log("Error: ", error)
                toast.error('An error has occured. Please try again.')
            })
        } else {
            setPointsDistributionText("Confirm Distribution")
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
            {userData?.role?.toLowerCase() === 'admin' ?
                (<div className="helper-text">
                    Here you can preview the tournaments submitted for approval and update their status by either rejecting or approving them. 
                    Approved tournaments will be moved to the tournament calendar.
                </div>) :
            userData?.role?.toLowerCase() === 'clubrep' ? 
                (<div className="helper-text">
                    Here you can preview all of the tournaments you have submitted and their status. 
                    'Waiting for Approval' means that the tournament is waiting to be approved by an admin. 'Declined' means that the request for a tournament has been rejected.
                </div>) :
            userData?.role?.toLowerCase() === 'player' &&
                <div className="helper-text">
                    Here you can preview the tournaments you have signed up for. 
                    You can withdraw from any tournament, but withdrawing meeans you will not be able to sign up for the tournament again.
                </div>
            }
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
                {/* <div style={{color: "rgba(0, 0, 0, 0.5)"}}>{tournamentsDisplay === "past" ? 'Only past tournaments will be shown.' : tournamentsDisplay === "upcoming" ? 'Only upcoming tournaments will be shown.' : "All tournaments will be shown."}</div> */}
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
                        {tournamentsTime === 'upcoming' &&
                            upcomingYears.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))
                        }
                        {tournamentsTime === 'past' &&
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
                <Box sx={style} className="large-modal full-width">
                    <div className="flex-column justify-center align-center">
                        <div className="flex-column full-width">
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
                        {userData?.role?.toLowerCase() === "admin" && currentTournament?.status?.toLowerCase() === 'waiting for approval' && (
                            <div className="flex">
                                <Button variant={approvalText === "Confirm Approval" ? 'contained' : 'outlined'} sx={{height: 40, margin: '30px 10px 0px 0px !important'}} onClick={() => confirmApproval()} startIcon={<CheckIcon />}>{approvalText}</Button>
                                <Button className="red-button" variant={declinatureText === "Confirm Decline" ? 'contained' : 'outlined'} sx={{height: 40, margin: '30px 0px 0px 10px !important'}} onClick={() => confirmDecline()} endIcon={<CancelOutlinedIcon />}>{declinatureText}</Button>
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
                                disabled={currentTournament?.status.toLowerCase() !== 'sign up open'}
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
                        {currentTournament?.status?.toLowerCase() !== 'sign up open' && 
                        currentTournament?.playersSignedUp && 
                        currentTournament?.playersSignedUp[userData.userID] &&
                        currentTournament?.playersSignedUp[userData.userID].withdrawed !== true && 
                        <div>You cannot withdraw from this tournament because the deadline has passed.</div>}
                        {withdrawalButtonText === "Confirm Withdrawal" && <div>Please keep in mind that after withdrawing, you will not be able to sign up for the tournament again.</div>}
                        {currentTournament?.playersSignedUp ? 
                        (<div className="flex-column full-width">
                            <div>
                                <h3 className="accent-color section-title">Signed Up Players</h3>
                                <Table tableData={getSignedUpPlayers(currentTournament.playersSignedUp)} rowHeaders={enteredPlayersTableRowHeaders}/>
                            </div>
                            <div>
                                <h3 className="accent-color section-title">Withdrawn Players</h3>
                                <Table tableData={getSignedUpPlayers(currentTournament.playersSignedUp, true)} rowHeaders={withdrawedPlayersTableRowHeaders}/>
                            </div>
                        </div>) : currentTournament?.status && currentTournament?.status === 'Sign Up Open' ? 
                        (<div>
                            No people have signed up yet.
                        </div>) : (
                        <div></div>
                        )}
                        {userRole === 'clubRep' && currentTournament?.status?.toLowerCase() === 'sign up open' && <Button 
                            variant={signUpClosureText === "Confirm Sign Up Closure" ? 'contained' : 'outlined'} 
                            className="red-button"
                            sx={{height: 40, margin: '30px 0px 0px 0px !important'}} 
                            onClick={confirmSignUpClosure}
                            startIcon={<CancelOutlinedIcon />}
                        >{signUpClosureText}</Button>}
                        <div className="flex">
                            {userRole === 'clubRep' && currentTournament?.status?.toLowerCase() === 'in progress' && <Button 
                                variant={conclusionText === "Confirm Conclusion" ? 'contained' : 'outlined'} 
                                sx={{height: 40, margin: '30px 10px 0px 0px !important'}} 
                                onClick={confirmConclusion}
                                startIcon={<CheckIcon />}
                            >{conclusionText}</Button>}
                            {(userRole === 'clubRep' || userRole === 'admin') && currentTournament?.status?.toLowerCase() === 'in progress' && <Button 
                                variant={cancellationText === "Confirm Cancellation" ? 'contained' : 'outlined'} 
                                sx={{height: 40, margin: '30px 0px 0px 10px !important'}} 
                                className="red-button"
                                onClick={confirmCancellation}
                                startIcon={<CancelOutlinedIcon />}
                            >{cancellationText}</Button>}
                        </div>
                        {userRole === 'clubRep' && currentTournament?.status?.toLowerCase() === 'waiting for points distribution' && 
                            <PointsDistribution tournament={currentTournament} onConfirm={confirmPointsDistribution} text={pointsDistributionText}/>
                        }
                    </div>
                </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default MyTournaments