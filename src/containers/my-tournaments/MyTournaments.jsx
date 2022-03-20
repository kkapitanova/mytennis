import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { sortData, getAge } from '../../utils/helpers'
import { useHistory, useLocation } from 'react-router';
import { ageGroups, genderGroups, months, years } from '../../data/constants';
import { mockTournamentData } from '../../data/dummyData';
import { getDateString } from '../../utils/helpers';

// material
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

//styles
import './MyTournaments.scss';

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
    'Location', 'Name', 'Start Date', 'End Date', 'Gender Group', 'Age Groups', 'Draw Types', 'Status'
]

const MyTournaments = () => {

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
    const [currentTournament, setCurrentTournament] = useState() // current tournament clicked on for which the modal is opened
    const [open, setOpen] = useState(false) // tournament info modal open state
    const [statusModalOpen, setStatusModalOpen] = useState(false) // tournament status update modal

    const [tournamentApprovalText, setTournamentApprovalText] = useState("Approve")
    const [tournamentCancellationText, setTournamentCancellationText] = useState("Decline")
    const [approvalButtonVariant, setApprovalButtonVariant] = useState("outlined")
    const [declineButtonVariant, setDeclineButtonVariant] = useState("outlined")
    const [statusColor, setStatusColor] = useState()

    //testing user roles
    const [userRole, setUserRole] = useState("admin")
    const clubRepTestID = '12345'
    const playerTestID = '99999'

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

    // status modal close
    const handleStatusModalClose = () => {
        setStatusModalOpen(false)
    }

    const getData = () => {
        let tournamentData = []

        mockTournamentData.forEach(t => {

            // display only the tournaments that match the following conditions:
            if (
                (search.ageGroup ? t.ageGroups.includes(search.ageGroup) : true) && 
                (search.genderGroup ? t.genderGroups.includes(search.genderGroup) : true) &&
                (t.location.city + t.location.country).toLowerCase().includes(search.location) &&
                t.name.toLowerCase().includes(search.name) && 
                (t.dates.startDate.toString() + t.dates.endDate.toString()).includes(search.month) &&
                (t.dates.startDate.toString() + t.dates.endDate.toString()).includes(search.year) &&

                // ADMIN VIEW
                ((userRole.toLowerCase() === 'admin') ? (t.status.toLowerCase() === "waiting for approval" || t.status.toLowerCase() === 'declined') : false) ||

                // CLUB REP VIEW
                (userRole.toLowerCase() === 'clubrep' && t.organizerID === clubRepTestID) ||

                // PLAYER VIEW 
                (userRole.toLowerCase() === 'player' && t.playersSignedUp && t.playersSignedUp.length && t.playersSignedUp.includes(playerTestID))
            ) {

                tournamentData.push({
                    location: `${t.location.city}, ${t.location.country}`,
                    name: t.name,
                    startDate: new Date (t.dates.startDate).getTime(),
                    endDate: new Date(t.dates.endDate).getTime(),
                    genderGroups: t.genderGroups,
                    ageGroups: t.ageGroups,
                    draws: t.draws,
                    status: t.status,
                    id: t.tournamentID
                })
            }
        })

        // sort data by start data in ascending order (sooner tournaments will appear first)
        const sortedTableData = userRole.toLowerCase() !== 'clubrep' ? sortData(tournamentData, "startDate", 'asc') : sortData(tournamentData, "startDate", 'desc')

        // format the tournaments' start and end dates
        const organizedTableData = sortedTableData.map(t => {
            return {...t, startDate: getDateString(t.startDate), endDate: getDateString(t.endDate)}
        })

        setDataByCategories([...organizedTableData])

        return organizedTableData
    }


    const handleRowClick = (tournamentData) => {
        const tournamentIndex = mockTournamentData.findIndex(el => el.tournamentID === tournamentData.id)
        const current = mockTournamentData[tournamentIndex]
        const color = current?.status.toLowerCase() === 'waiting for approval' || current?.status.toLowerCase() === 'postponed' ? 'orange' : current?.status.toLowerCase() === 'declined' ? 'red' : 'green'

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
                // if (item.id === currentTournament.tournamentID) {
                //     item.status = "Open"
                // }
                // return item

                if (item.id !== currentTournament.tournamentID) {
                    updatedData.push(item)
                } else {
                    item.status = "Open" //TODO: Replace with actual call that updates status
                }
            })

            setData(updatedData)
            handleClose()

            setTimeout(() => {
                setStatusModalOpen(true)
            }, 200)
            setTimeout(() => {
                setStatusModalOpen(false)
            }, 3000)
        }
    }

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

            setTimeout(() => {
                setStatusModalOpen(true)
            }, 200)
            setTimeout(() => {
                setStatusModalOpen(false)
            }, 3000)
        }
    }

    const refreshData = () => {
        //TODO: replace with actual call that fetches data
    }

    // scroll to top when opening the page for the first time
    useEffect(() => {
        window.scrollTo(0,0)
    }, [])

    useEffect(() => {
        setData(getData())
    }, [search.ageGroup, search.genderGroup, search.draws, userRole])

    // update data accordingly if the search query changes in the location 
    useEffect(() => {
        const searchGenderGroup = location?.state?.tournamentCalendar

        setSearch({
            ...search,
            genderGroup: searchGenderGroup === "women" ? 'Female' : searchGenderGroup === "men" ? 'Male' : searchGenderGroup === "mixed-doubles" ? 'Mixed' : ''
        })
    }, [location])

    return (
        <div style={{padding: '0 50px 50px 50px'}}>
            <h3 className="accent-color" style={{textAlign: 'left'}}>Search My Tournaments ({userRole} View)</h3>
            {userRole.toLowerCase() === 'admin' && 
                <div className="helper-text">
                    Here you can preview the tournaments submitted for approval and update their status by either rejecting or approving them. 
                    Approved tournaments will be moved to the tournament calendar.
                </div>
            }
            {userRole.toLowerCase() === 'clubrep' && 
                <div className="helper-text">
                    Here you can preview all of the tournaments you have submitted and their status. 
                    'Waiting for Approval' means that the tournament is waiting to be approved by an admin. 'Declined' means that the request for a tournament has been rejected.
                </div>
            }
            {userRole.toLowerCase() === 'player' && 
                <div className="helper-text">
                    Here you can preview the tournaments you have signed up for. 
                    You can withdraw from any tournament, but withdrawing meeans you will not be able to sign up for the tournament again.
                </div>
            }
            <div className="flex align-center">
                <Button sx={{height: 40, margin: '0px 10px 10px 0px !important'}} onClick={() => setUserRole("admin")} disabled={userRole.toLowerCase() === "admin"}>Switch to Admin</Button>
                <Button sx={{height: 40, margin: '0px 10px 10px 0px !important'}} onClick={() => setUserRole("clubRep")} disabled={userRole.toLowerCase() === "clubrep"}>Switch to Club Rep</Button>
                <Button sx={{height: 40, margin: '0px 10px 10px 0px !important'}} onClick={() => setUserRole("player")} disabled={userRole.toLowerCase() === "player"}>Switch to Player</Button>
                <div style={{color: "rgba(0, 0, 0, 0.5)"}}>Testing purposes</div>
            </div>
            <div className='flex wrap justify-between'>
                <div className="flex wrap" style={{minWidth: '250px', maxWidth: "60%"}}>
                    <TextField
                        name="location"
                        id="outlined-basic"
                        label="Search by location"
                        variant="outlined"
                        color="secondary"
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
                        color="secondary"
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
                        color="secondary"
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
                        color="secondary"
                        value={search.year}
                        onChange={(e) => handleSearchChange(e)}
                        size="small"
                        style={{width: 150, margin: '0 5px 10px 0'}}
                    >
                        {years.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="outlined-select-currency"
                        name="genderGroup"
                        select
                        label="Gender Group"
                        color="secondary"
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
                        color="secondary"
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
                    {filterApplied() && <Button variant="outlined" height={70} startIcon={<ClearIcon />} color='secondary' sx={{height: 40, minWidth: 180, margin: '0px !important'}} onClick={clearFilters}>Clear Search</Button>}
                </div>
            </div>
            {data && data.length > 0 && <Table tableData={data} rowHeaders={tableRowHeaders} onRowClick={handleRowClick}/>}
            {!data || !data.length > 0 && <div>No Results Found</div>}
            <Button variant="contained" sx={{height: 40, margin: '30px 10px 0px 0px !important'}} onClick={refreshData}>Refresh Data</Button>
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
                <Box sx={style}>
                    <div className="flex-column justify-center align-center">
                        <div className="flex-column">
                            <div className="flex justify-between align-center">
                                <h2 style={{fontWeight: '500'}}>{currentTournament?.name}</h2>
                                <div className={`status-indicator ${statusColor}`}>{currentTournament?.status.toUpperCase()}</div> 
                            </div>
                            <div style={{marginBottom: 5}}>
                                {currentTournament?.dates && <div>{getDateString(new Date (currentTournament?.dates?.startDate).getTime())} - {getDateString(new Date (currentTournament?.dates?.endDate).getTime())}</div>}
                            </div>
                            <div style={{marginBottom: 5}}>{currentTournament?.site}</div>
                            <div style={{marginBottom: 5}}>{currentTournament?.location?.city}, {currentTournament?.location?.country}</div>
                            <h3 style={{fontWeight: '600', marginTop: 40}}>Terms of Play</h3>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                            <h3 style={{fontWeight: '600', marginTop: 40}}>Section Title</h3>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                            <h3 style={{fontWeight: '600', marginTop: 40}}>Section Title</h3>
                            <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                        </div>
                        {userRole?.toLowerCase() === "admin" && currentTournament?.status.toLowerCase() === 'waiting for approval' && (
                            <div className="flex">
                                <Button variant={approvalButtonVariant} sx={{height: 40, margin: '30px 10px 0px 0px !important'}} onClick={() => confirmApproval()}>{tournamentApprovalText}</Button>
                                <Button className="red-button" variant={declineButtonVariant} sx={{height: 40, margin: '30px 0px 0px 10px !important'}} onClick={() => confirmDecline()}>{tournamentCancellationText}</Button>
                            </div>
                        )}
                    </div>
                </Box>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={statusModalOpen}
                onClose={handleStatusModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={statusModalOpen}>
                <Box sx={style}>
                    <div className="flex justify-center align-center">
                        <div>You have successfully updated the status of the tournament.</div>
                    </div>
                </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default MyTournaments