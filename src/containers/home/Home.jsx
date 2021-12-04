import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { sortData, getAge } from '../../utils/helpers'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useHistory } from 'react-router';
import { ageGroups, genderGroups } from '../../data/constants';
import { mockPlayerData, mockRanking } from '../../data/dummyData';
import sampleBackground from '../../assets/images/sample_background.jpeg';

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
            pointsWon: player.pointsWon
        }
    })

    const handleSearchChange = (e) => {
        const val = e.target.value
        const name = e.target.name
        setSearch({...search, [name]: val})
    }


    const handleRowClick = (playerData) => {
        console.log(playerData)
    }

    useEffect(() => {
        setInitialLoad(true)
    }, [])

    useEffect(() => {
      window.scrollTo(0,0)
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
            </div>
        </div>
    )
}

export default Home