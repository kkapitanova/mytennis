import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Table } from '../../components';
import { sortData, getAge } from '../../utils/helpers'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useLocation } from 'react-router';
import { ageGroups, genderGroups, draws } from '../../data/constants';
import moment from 'moment';

// modal
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlined';

//firebase
import { getDatabase, ref, child, get, onValue} from "firebase/database";

// toast
import { toast } from 'react-toastify';

import './Rankings.scss';

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
    'Ranking', 'Name', 'Country of Birth', 'Age', 'Points Won'
]

const Rankings = ({ topTen = false }) => {
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {}
    const location = useLocation()
    const history = useHistory()
    const [search, setSearch] = useState({
        name: '',
        countryOfBirth: '',
        ageGroup: '',
        genderGroup: '',
        draw: 'Singles'
    }) 
    const [data, setData] = useState([])
    const [rankingData, setRankingData] = useState({})
    const [players, setPlayers] = useState([])
    const [categorizedData, setCategorizedData] = useState([])
    const [currentPlayer, setCurrentPlayer] = useState()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [initialLoad, setInitialLoad] = useState(true)

    // fetch the data for the players in the current ranking list
    const fetchPlayers = (keys) => {
        setIsLoading(true)

        let newPlayersData = []

        keys.forEach((key, index) => {
            get(child(dbRef, 'players/' + key)).then((snapshot) => {
                if (snapshot.exists()) {
                    const player = snapshot.val()
                    newPlayersData.push(player)

                    if (index === keys.length -1) {
                        setIsLoading(false)
                        setPlayers(newPlayersData)
                    }
                } else {
                    console.log("No data available");
                    setIsLoading(false)
                }

                }).catch((error) => {
                    console.error(error);
                    toast.error("An error has occured.")
                    setIsLoading(false)
                });   
        })
    }

    // fetch rankings for the current age-gender-draw combination
    const fetchRankings = (ageGroup, genderGroup, draw) => {
        setIsLoading(true)

        get(child(dbRef, `rankings/${ageGroup}${genderGroup}${draw}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const rankings = snapshot.val()
                setRankingData(rankings)
            } else {
                console.log("No data available");
                setPlayers([])
                setIsLoading(false)
            }
            }).catch((error) => {
                console.error(error);
                toast.error("An error has occured.")
                setIsLoading(false)
            });
    }

    // get the full player + ranking data sorted by number of points won
    const getData = () => {
        const tableData = []
        
        rankingData && Object.keys(rankingData).length && Object.keys(rankingData).map(p => {
            const currentPlayer = players.find(player => player.userID === p)
        
            tableData.push({
                name: `${currentPlayer?.firstName} ${currentPlayer?.familyName}`,
                countryOfBirth: currentPlayer?.countryOfBirth,
                age: getAge(currentPlayer?.dateOfBirth),
                pointsWon: rankingData[p]?.pointsWon,
                id: currentPlayer?.userID
            })
        })

        const sortedTableData = sortData(tableData, "pointsWon")
        const organizedTableData = sortedTableData.map((player, index) => {
            return {
                ranking: index + 1,
                ...player
            }
        })

        setCategorizedData([...organizedTableData])
        return organizedTableData
    }


    const handleClose = () => setOpen(false);

    // open modal with data for current player
    const handleRowClick = (playerData) => {
        const { ranking, pointsWon } = playerData
        const playerIndex = players.findIndex(el => el.userID === playerData.id)
        const current = players[playerIndex]

        setCurrentPlayer({ ...current, ranking: ranking, pointsWon: pointsWon })
        setOpen(true)
    }

    // handle search (name/nation) & filter (age/gender/draw) changes
    const handleSearchChange = (e) => {

        const name = e.target.name
        const value = e.target.value

        let sortedAndFilteredData = []

        if (name === 'genderGroup' && value === 'Mixed') {
            setSearch({
                ...search,
                [name]: value,
                draw: 'Doubles'
            })
        } else {
            setSearch({
                ...search,
                [name]: value
            })
        }

        if (name === "name") {
            sortedAndFilteredData = categorizedData.filter(player => player.name.toLowerCase().includes(value.toLowerCase())).filter(player => player.countryOfBirth.toLowerCase().includes(search.countryOfBirth.toLowerCase()));
        }

        if (name === "countryOfBirth") {
            sortedAndFilteredData = categorizedData.filter(player => player.name.toLowerCase().includes(search.name.toLowerCase())).filter(player => player.countryOfBirth.toLowerCase().includes(value.toLowerCase()));
        }

        setData(sortedAndFilteredData)
    }

    const filterApplied = () => {
        let bool = false

        for (const key in search) {
            if (search.name || search.countryOfBirth) {
                bool = true
            }
        }

        return bool
    }

    const clearFilters = () => {
        setSearch({...search, name: '', countryOfBirth: ''})
        setData(getData())
    }

    // fetch corresponding rankings when the age/gender/draw filter changes
    // also listen for changes to the database and update the rankings live
    useEffect(() => {
        fetchRankings(search.ageGroup, search.genderGroup, search.draw)

        if (search.ageGroup && search.genderGroup && search.draw) {
            const rankingsRef = ref(database, `rankings/${search.ageGroup}${search.genderGroup}${search.draw}`);
            onValue(rankingsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const rankings = snapshot.val();
                    setRankingData(rankings)
                }
            });
        }

    }, [search.ageGroup, search.genderGroup, search.draw])

    useEffect(() => {
        if (players && players.length && !isLoading) {
            getData()
            setData(getData())
        }

    }, [players, isLoading])

    useEffect(() => {
        if (rankingData) {
            fetchPlayers(Object.keys(rankingData))
        }
    }, [rankingData])

    useEffect(() => {
        const state = location?.state

        const rand = Math.floor(Math.random()*10)
        const randomGenderGroup = rand % 2 === 0 ? 'Female' : 'Male'
        const randomAgeGroup = rand % 3 === 0 ? 'U40' : rand % 2 === 0 ? 'U60' : '60+'

        // preserve filters from home page
        if (state) {
            setSearch({
                ...search,
                ...state
            })
        } else {
            setSearch({
                ...search,
                genderGroup: randomGenderGroup,
                ageGroup: randomAgeGroup
            })
        }
    }, [location])

    // avoid scroll preservation by router 
    useEffect(() => {
        window.scrollTo(0,0)
    }, [])

    useEffect(() => {
        console.log(currentPlayer)
    }, [currentPlayer])

    return (
        <div className='container'>
            <h3 className="accent-color" style={{textAlign: 'left'}}>{topTen ? 'Top Ranked Players Currently' : "Search through Rankings"}</h3>
            <div className='flex wrap justify-between'>
                <div className="flex-column wrap" style={{minWidth: '250px', maxWidth: "60%"}}>
                    <div className="flex wrap">
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
                            name="countryOfBirth"
                            id="outlined-basic"
                            label="Search by nation"
                            variant="outlined"
                            size="small"
                            value={search.countryOfBirth}
                            onChange={handleSearchChange}
                            style={{minWidth: 200, margin: '0 5px 10px 0'}}
                        />
                    </div>
                    <div className="flex wrap">
                        <TextField
                            id="outlined-select-currency"
                            name="ageGroup"
                            select
                            // label="Age Group"
                            value={search.ageGroup}
                            onChange={handleSearchChange}
                            size="small"
                            sx={{width: 150, margin: '0 5px 10px 0 !important'}}
                        >
                            {ageGroups.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="outlined-select-currency"
                            name="genderGroup"
                            select
                            // label="Gender Group"
                            value={search.genderGroup}
                            onChange={(e) => handleSearchChange(e)}
                            size="small"
                            sx={{width: 150, margin: '0 5px 10px 0'}}
                        >
                            {genderGroups.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="outlined-select-currency"
                            name="draw"
                            select
                            // label="List"
                            value={search.genderGroup !== 'Mixed' ? search.draw : 'Doubles'}
                            onChange={handleSearchChange}
                            size="small"
                            sx={{width: 200, margin: '0 5px 10px 0 !important'}}
                        >
                            {search.genderGroup !== 'Mixed' ? draws.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            )) : 
                                <MenuItem value={'Doubles'}>
                                    Doubles
                                </MenuItem>
                            }
                        </TextField>
                    </div>
                </div>
                <div className="flex align-start">
                    {filterApplied() && <Button variant="outlined" height={70} startIcon={<ClearIcon />} sx={{height: 40, margin: '0px !important'}} onClick={clearFilters}>Clear Search</Button>}
                </div>
            </div>
            <Table tableData={topTen ? data.slice(0,10) : data} rowHeaders={tableRowHeaders} onRowClick={handleRowClick}/>
            {topTen && <div className="flex justify-end" style={{marginTop: 10}}>
                <Button variant="contained" onClick={() =>  history.replace({pathname: '/rankings', state: { ...search}})} sx={{height: 40, margin: '0px !important'}} endIcon={<PeopleOutlineOutlinedIcon />}>See All</Button>
            </div>}
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
                <Box sx={style} className="flex-column large-modal">
                    <div className="flex justify-between align-center">
                        <div className="flex-column align-start rankings-header">
                            <h2 className="accent-color modal-title">{currentPlayer?.firstName}&nbsp;{currentPlayer?.familyName}</h2>
                            <div className="flex-column">Ranking:&nbsp;{currentPlayer?.ranking} ({search.ageGroup}&nbsp;{search.genderGroup}&nbsp;{search.draw})</div>
                            <div className="flex-column">Points Won:&nbsp;{currentPlayer?.pointsWon}</div>
                        </div>
                        <div className="close-icon"><ClearIcon className="pointer accent-color" onClick={handleClose}/></div>
                    </div>
                    <div className="flex-column info-section">
                        <h3 className="accent-color section-title">Personal Information</h3>
                        <div>Gender: {currentPlayer?.gender}</div>
                        <div>Nation Competing For:&nbsp;{currentPlayer?.countryOfBirth}</div>
                        <div>Date of Birth:&nbsp;{moment(new Date(currentPlayer?.dateOfBirth)).format('D MMMM YYYY')}</div>
                        <div>Age:&nbsp;{getAge(new Date(currentPlayer?.dateOfBirth))}</div>
                        {(currentPlayer?.gameInfo?.plays || currentPlayer?.gameInfo?.backhand) && <div>Plays:&nbsp;{currentPlayer?.gameInfo?.plays && `${currentPlayer?.gameInfo?.plays},\xa0`}{currentPlayer?.gameInfo?.backhand}</div>}
                        {currentPlayer?.about && <div className="about-section">{currentPlayer?.about}</div>}
                    </div>
                    <div className="flex-column info-section">
                        <h3 className="accent-color section-title">Contact Information</h3>
                        {(currentPlayer?.emailVisibility?.toLowerCase() === 'public' ||
                        userData?.role === 'clubRep') &&
                        <div>Email:&nbsp;{currentPlayer?.email}</div>}
                        {(currentPlayer?.phoneNumber && (currentPlayer?.phoneNumberVisibility?.toLowerCase() === 'public' ||
                        userData?.role === 'clubRep')) &&
                        <div>Phone Number:&nbsp;{currentPlayer?.phoneNumber}</div>}
                    </div>
                </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default Rankings