import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { getAge } from '../../utils/helpers'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { ageGroups, genderGroups } from '../../data/constants';
import moment from 'moment';

// modal
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';

//firebase
import { getDatabase, ref, child, get, onValue } from "firebase/database";

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
    'Name', 
    'Competes For', 
    'Age', 
    'Gender',
]

const checkAgeGroupMatch = (age, ageGroup) => {
    switch (ageGroup) {
        case 'U40':
            return age <= 40
        case 'U60':
            return age <= 60
        case '60+':
            return age > 60
        default:
            return true
    }

}

const Rankings = () => {
    const [search, setSearch] = useState({
        name: '',
        countryOfBirth: '',
        ageGroup: 'All Ages',
        genderGroup: 'All'
    }) 
    const [data, setData] = useState([])
    const [players, setPlayers] = useState([])
    const [categorizedData, setCategorizedData] = useState([])
    const [currentPlayer, setCurrentPlayer] = useState()
    const [open, setOpen] = useState(false)

    const handleClose = () => setOpen(false);

    const fetchPlayers = () => {
        get(child(dbRef, 'players')).then((snapshot) => {
            const playersArr = []

            if (snapshot.exists()) {
                const playersObj = snapshot.val()
                
                Object.keys(playersObj).map(key => {
                    playersArr.push(playersObj[key])
                })
                

            } else {
                console.log("No data available");
                // setIsLoading(false)
            }

            setPlayers(playersArr)

            }).catch((error) => {
                console.error(error);
                toast.error("An error has occured.")
                // setIsLoading(false)
            });   
    }

    const getData = () => {
        // display only the players which match the filters
        const tableData = players.map(player => {
            if ((search.genderGroup === 'All' || player.gender.toLowerCase() === search.genderGroup.toLowerCase()) &&
                checkAgeGroupMatch(getAge(player?.dateOfBirth), search.ageGroup)) {
                return {
                    name: `${player?.firstName} ${player?.familyName}`,
                    countryOfBirth: player?.countryOfBirth,
                    age: getAge(player?.dateOfBirth),
                    gender: player.gender,
                    id: player.userID
                }
            }
        })

        // sort table by player name
        const sortedTableData = tableData.sort((a, b) => {
            if (a.name < b.name) { 
                return -1; 
            }

            if (a.name > b.bame) { 
                return 1; 
            }

            return 0;
        })

        setCategorizedData([...sortedTableData])

        return sortedTableData
    }


    const handleRowClick = (playerData) => {
        const playerIndex = players.findIndex(el => el.userID === playerData.id)
        const current = players[playerIndex]

        setCurrentPlayer(current)
        setOpen(true)
    }

    // display the players that match the search
    const handleSearchChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        let sortedAndFilteredData = []

        setSearch({
            ...search,
            [name]: value
        })

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

    useEffect(() => {
        getData()
        setData(getData())
    }, [search.ageGroup, search.genderGroup, players])

    useEffect(() => {
      window.scrollTo(0,0) // avoid scroll preservation because of react router
      fetchPlayers()

      // listen for changes to the database and display them live
      const playersRef = ref(database, 'players');
      onValue(playersRef, (snapshot) => {
          const playersArr = []
          const playersObj = snapshot.val();

          Object.keys(playersObj).map(key => {
              playersArr.push(playersObj[key])
            })

          setPlayers(playersArr)
      });
    }, [])

    return (
        <div className='container'>
            <h3 className="accent-color" style={{textAlign: 'left'}}>Search through Players</h3>
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
                        name="countryOfBirth"
                        id="outlined-basic"
                        label="Search by nation"
                        variant="outlined"
                        size="small"
                        value={search.countryOfBirth}
                        onChange={handleSearchChange}
                        style={{minWidth: 200, margin: '0 5px 10px 0'}}
                    />
                    <TextField
                        id="outlined-select-currency"
                        name="genderGroup"
                        select
                        label="Gender Group"
                        value={search.genderGroup}
                        onChange={(e) => handleSearchChange(e)}
                        size="small"
                        sx={{width: 150, margin: '0 5px 10px 0'}}
                    >
                        {['Female', 'Male', 'All'].map((option, index) => (
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
                        sx={{width: 150, marginBottom: '10px !important'}}
                    >
                        {[...ageGroups, 'All Ages'].map((option, index) => (
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
                        <div style={{marginBottom: 5}}>Country of Birth:&nbsp;{currentPlayer?.countryOfBirth}</div>
                        <div style={{marginBottom: 5}}>Date of Birth:&nbsp;{moment(new Date(currentPlayer?.dateOfBirth)).format('D MMMM YYYY')}</div>
                    </div>
                </Box>
                </Fade>
            </Modal>
        </div>
    )
}

export default Rankings