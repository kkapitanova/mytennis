import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { sortData, getAge } from '../../utils/helpers'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useHistory } from 'react-router';
import { ageGroups, genderGroups } from '../../data/constants';
import { mockPlayerData, mockRanking } from '../../data/dummyData';
import sampleBackground from '../../assets/images/sample_background.jpeg';
import moment from 'moment';

// modal
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
    'Ranking', 'Name', 'Competes For', 'Age', 'Points Won'
]

const Home = () => {

    const history = useHistory();
    const [initialLoad, setInitialLoad] = useState(false)
    const [search, setSearch] = useState({
        name: '',
        nationCompetingFor: '',
        ageGroup: 'U40',
        genderGroup: 'Female'
    })
    const [open, setOpen] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState()

    const handleRowClick = (playerData) => {
        const playerIndex =  mockPlayerData.findIndex(el => el.playerId === playerData.id)
        const current = mockPlayerData[playerIndex]

        console.log("current", current)
        setCurrentPlayer(current)
        setOpen(true)
    }


    const handleClose = () => setOpen(false); 

    let rankingData = []
    
    mockRanking.forEach(r => {
        if (r.ageGroup === search.ageGroup && r.genderGroup.toLowerCase() === search.genderGroup.toLowerCase()) {
            rankingData = r.players
        }
    })

    const tableData = rankingData.map(p => {
        const currentPlayer = mockPlayerData.find(player => player.playerId === p.playerId)
    
        return {
            pointsWon: p.pointsWon,
            name: `${currentPlayer?.firstName} ${currentPlayer?.familyName}`,
            age: getAge(currentPlayer?.dateOfBirth),
            id: currentPlayer?.playerId,
            nationCompetingFor: currentPlayer?.nationCompetingFor
        }
    })

    const sortedTableData = sortData(tableData, "pointsWon")
    const organizedTableData = sortedTableData.map((player, index) => {
        return {
            ranking: index + 1,
            name: player.name,
            nationCompetingFor: player.nationCompetingFor,
            age: player.age,
            pointsWon: player.pointsWon,
            id: player.id
        }
    })

    const handleSearchChange = (e) => {
        const val = e.target.value
        const name = e.target.name
        setSearch({...search, [name]: val})
    }

    useEffect(() => {
    }, [])

    useEffect(() => {
      window.scrollTo(0,0)
      setInitialLoad(true)
    }, [initialLoad])

    return (
        <div>
            <img alt="" src={sampleBackground} width="100%" height="400px"/>
            <div style={{margin: 50}}>
                <div className="flex justify-between align-center">
                    <h3 className="accent-color" style={{textAlign: "left"}}>Top Players Currently</h3>
                    <div>
                        <TextField
                            id="outlined-select-currency"
                            name="ageGroup"
                            select
                            label="Age Group"
                            color="secondary"
                            value={search.ageGroup}
                            onChange={(e) => handleSearchChange(e)}
                            size="small"
                            style={{width: 150, marginRight: 10}}
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
                            label="Gender Group"
                            color="secondary"
                            value={search.genderGroup}
                            onChange={(e) => handleSearchChange(e)}
                            size="small"
                            style={{width: 150}}
                        >
                            {genderGroups.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                </div>
                {organizedTableData && organizedTableData.length > 0 && <Table tableData={organizedTableData.slice(0, 10)} rowHeaders={tableRowHeaders} onRowClick={handleRowClick}/>}
                {organizedTableData && !organizedTableData.length && <div>NO RESULTS FOUND</div>}
                <div className="flex justify-end" style={{marginTop: 10}}><button className="secondary-button small" onClick={() => history.push('/rankings/')}>See All</button></div>
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
                            <h2 style={{fontWeight: '500'}}>{currentPlayer?.firstName}&nbsp;{currentPlayer?.familyName}</h2>
                            <div style={{marginBottom: 5}}>Gender: {currentPlayer?.gender}</div>
                            <div style={{marginBottom: 5}}>Nation Competing For:&nbsp;{currentPlayer?.nationCompetingFor}</div>
                            <div style={{marginBottom: 5}}>Date of Birth:&nbsp;{moment(new Date(currentPlayer?.dateOfBirth)).format('D MMMM YYYY')}</div>
                        </div>
                    </Box>
                    </Fade>
                </Modal>
            </div>
        </div>
    )
}

export default Home