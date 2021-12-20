import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { sortData, getAge } from '../../utils/helpers'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useHistory, useLocation } from 'react-router';
import { ageGroups, genderGroups, months, years } from '../../data/constants';
import { mockTournamentData } from '../../data/dummyData';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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

const getDateString = dateMillis => {
    const UTCString = new Date(dateMillis).toUTCString();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const date = new Date(UTCString);
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

    return formattedDate
}

const TournamentCalendar = () => {

    const location = useLocation()
    const [initialLoad, setInitialLoad] = useState(false)
    const [search, setSearch] = useState({
        name: '',
        location: '',
        ageGroup: 'U40',
        genderGroup: '',
        draws: ['Singles'],
        month: '',
        year: ''
    }) 
    const [data, setData] = useState([])
    const [dataByCategories, setDataByCategories] = useState([])
    const [currentTournament, setCurrentTournament] = useState()
    const [open, setOpen] = useState(false)

    const handleClose = () => setOpen(false);

    const getData = () => {
        let tournamentData = []

        mockTournamentData.forEach(t => {
            
            if (
                (search.ageGroup ? t.ageGroups.includes(search.ageGroup) : true) && 
                (search.genderGroup ? t.genderGroups.includes(search.genderGroup) : true) &&
                (t.location.city + t.location.country).toLowerCase().includes(search.location) &&
                t.name.toLowerCase().includes(search.name) && 
                (t.dates.startDate.toString() +  t.dates.endDate.toString()).includes(search.month) &&
                (t.dates.startDate.toString() +  t.dates.endDate.toString()).includes(search.year)
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

        const sortedTableData = sortData(tournamentData, "startDate", 'asc')
        const organizedTableData = sortedTableData.map(t => {
            return {...t, startDate: getDateString(t.startDate), endDate: getDateString(t.endDate)}
        })

        setDataByCategories([...organizedTableData])

        return organizedTableData
    }

    const handleRowClick = (tournamentData) => {
        const tournamentIndex =  mockTournamentData.findIndex(el => el.tournamentID === tournamentData.id)
        const current = mockTournamentData[tournamentIndex]

        console.log(current)
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
            console.log(dataByCategories)
            sortedAndFilteredData = dataByCategories.filter(tournament => name === 'month' ? tournament["startDate"].includes(value) && tournament["startDate"].includes(search.year) : tournament["startDate"].includes(value) && tournament["startDate"].includes(search.month));
        } else {
            sortedAndFilteredData = dataByCategories.filter(tournament => tournament[name]?.toLowerCase().includes(value.toLowerCase()));
        }

        setData(sortedAndFilteredData)
    }

    useEffect(() => {
        setData(getData())
    }, [search.ageGroup, search.genderGroup, search.draws])

    useEffect(() => {
      window.scrollTo(0,0)
      setInitialLoad(true)
    }, [initialLoad])

    useEffect(() => {

        const searchGenderGroup = location.pathname.split('/')[2]

        setSearch({
            ...search,
            genderGroup: searchGenderGroup === "women" ? 'Female' : searchGenderGroup === "men" ? 'Male' : searchGenderGroup === "mixed-doubles" ? 'Mixed' : ''
        })
    }, [location])

    return (
        <div style={{padding: '0 50px 50px 50px'}}>
            <h3 className="accent-color" style={{textAlign: 'left'}}>Search Tournaments</h3>
            <div className="flex wrap">
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
                    style={{width: 150, marginBottom: 10}}
                >
                    {ageGroups.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            {data && data.length > 0 && <Table tableData={data} rowHeaders={tableRowHeaders} onRowClick={handleRowClick}/>}
            {!data || !data.length > 0 && <div>No Results Found</div>}
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
                    <div className="flex-column">
                        <h2 style={{fontWeight: '500'}}>{currentTournament?.name}</h2>
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
                </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default TournamentCalendar