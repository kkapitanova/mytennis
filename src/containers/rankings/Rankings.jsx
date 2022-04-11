import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { sortData, getAge } from '../../utils/helpers'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useLocation } from 'react-router';
import { ageGroups, genderGroups, draws } from '../../data/constants';
import { mockPlayerData, mockRanking } from '../../data/dummyData';
import moment from 'moment';

// modal
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';

//firebase
import { getDatabase, ref, child, get, update} from "firebase/database";

// toast
import { toast } from 'react-toastify';

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
    'Ranking', 'Name', 'Competes For', 'Age', 'Points Won'
]

const Rankings = () => {

    const location = useLocation()
    const [search, setSearch] = useState({
        name: '',
        nationCompetingFor: '',
        ageGroup: 'U60',
        genderGroup: 'Male',
        draw: 'Singles'
    }) 
    const [data, setData] = useState([])
    const [rankingData, setRankingData] = useState({})
    const [players, setPlayers] = useState([])
    const [categorizedData, setCategorizedData] = useState([])
    const [currentPlayer, setCurrentPlayer] = useState()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

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

    const fetchRankings = (ageGroup, genderGroup, draw) => {
        setIsLoading(true)

        get(child(dbRef, `rankings/${ageGroup}${genderGroup}${draw}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const rankings = snapshot.val()
                setRankingData(rankings)
                fetchPlayers(Object.keys(rankings))
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

    const getData = () => {
        const tableData = Object.keys(rankingData).map(p => {
            const currentPlayer = players.find(player => player.userID === p)
        
            return {
                name: `${currentPlayer?.firstName} ${currentPlayer?.familyName}`,
                nationCompetingFor: currentPlayer?.countryOfBirth,
                age: getAge(currentPlayer?.dateOfBirth),
                pointsWon: rankingData[p]?.pointsWon,
                id: currentPlayer?.userID
            }
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


    const handleRowClick = (playerData) => {
        const playerIndex =  players.findIndex(el => el.playerId === playerData.id)
        const current = players[playerIndex]

        setCurrentPlayer(current)
        setOpen(true)
    }

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
            sortedAndFilteredData = categorizedData.filter(player => player.name.toLowerCase().includes(value.toLowerCase())).filter(player => player.nationCompetingFor.toLowerCase().includes(search.nationCompetingFor.toLowerCase()));
        }

        if (name === "nationCompetingFor") {
            sortedAndFilteredData = categorizedData.filter(player => player.name.toLowerCase().includes(search.name.toLowerCase())).filter(player => player.nationCompetingFor.toLowerCase().includes(value.toLowerCase()));
        }

        setData(sortedAndFilteredData)
    }

    const filterApplied = () => {
        let bool = false

        for (const key in search) {
            if (search.name || search.nationCompetingFor) {
                bool = true
            }
        }

        return bool
    }

    const clearFilters = () => {
        setSearch({...search, name: '', nationCompetingFor: ''})
        setData(getData())
    }

    useEffect(() => {
        fetchRankings(search.ageGroup, search.genderGroup, search.draw)
    }, [search.ageGroup, search.genderGroup, search.draw])

    useEffect(() => {
        if (players && players.length && !isLoading) {
            getData()
            setData(getData())
        }

    }, [players, isLoading])

    useEffect(() => {
      window.scrollTo(0,0)
    }, [])

    useEffect(() => {

        const searchGenderGroup = location?.state?.rankings

        const rand = Math.floor(Math.random()*10)
        // const randomGenderGroup = rand % 2 === 0 ? 'Female' : 'Male'

        const randomGenderGroup = 'Male'


        setSearch({
            ...search,
            genderGroup: searchGenderGroup === "women" ? 'Female' : searchGenderGroup === "men" ? 'Male' : searchGenderGroup === "mixed-doubles" ? 'Mixed' : randomGenderGroup
        })
    }, [location])

    return (
        <div className='container'>
            <h3 className="accent-color" style={{textAlign: 'left'}}>Search through Rankings</h3>
            <div className='flex wrap justify-between'>
                <div className="flex wrap" style={{minWidth: '250px', maxWidth: "60%"}}>
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
                        name="nationCompetingFor"
                        id="outlined-basic"
                        label="Search by nation"
                        variant="outlined"
                        size="small"
                        value={search.nationCompetingFor}
                        onChange={handleSearchChange}
                        style={{minWidth: 200, margin: '0 5px 10px 0'}}
                    />
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
                            <MenuItem key={index} value={option}>
                                {option}
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
                        {draws.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                <div clasName="flex align-start">
                    {filterApplied() && <Button variant="outlined" height={70} startIcon={<ClearIcon />} sx={{height: 40, margin: '0px !important'}} onClick={clearFilters}>Clear Search</Button>}
                </div>
            </div>
            <Table tableData={data} rowHeaders={tableRowHeaders} onRowClick={handleRowClick}/>
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
                    <div className="flex-column">
                        <h2 className="accent-color" style={{fontWeight: '500'}}>{currentPlayer?.firstName}&nbsp;{currentPlayer?.familyName}</h2>
                        <div style={{marginBottom: 5}}>Gender: {currentPlayer?.gender}</div>
                        <div style={{marginBottom: 5}}>Nation Competing For:&nbsp;{currentPlayer?.nationCompetingFor}</div>
                        <div style={{marginBottom: 5}}>Date of Birth:&nbsp;{moment(new Date(currentPlayer?.dateOfBirth)).format('D MMMM YYYY')}</div>
                    </div>
                </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default Rankings