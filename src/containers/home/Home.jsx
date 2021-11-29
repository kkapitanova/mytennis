import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { sortData } from '../../utils/helpers'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const ageGroups = [
    'U40', 'U60', '60+'
]

const mockRanking = [
    {
        playerId: 1,
        pointsWon: 200,
    },
    {
        playerId: 2,
        pointsWon: 300,
    },
    {
        playerId: 3,
        pointsWon: 450,
    },
    {
        playerId: 4,
        pointsWon: 450,
    }
]

const mockPlayerData = [
    {
        playerId: 1,
        firstName: 'Kristina',
        familyName: 'Kapitanova',
        gender: 'female',
        nationCompetingFor: 'Bulgaria',
        dateOfBirth: 'November 13, 2000 03:24:00'
    },
    {
        playerId: 2,
        firstName: 'Maria',
        familyName: 'Sharapova',
        gender: 'female',
        nationCompetingFor: 'Russia',
        dateOfBirth: 'December 17, 1995 03:24:00'
    },
    {
        playerId: 3,
        firstName: 'Simona',
        familyName: 'Halep',
        gender: 'female',
        nationCompetingFor: 'Romania',
        dateOfBirth: 'January 17, 1989 03:24:00'
    },
    {
        playerId: 4,
        firstName: 'Kristina',
        familyName: 'Pliskova',
        gender: 'female',
        nationCompetingFor: 'Czech Republic',
        dateOfBirth: 'May 2, 1992 03:24:00'
    },
]

const getAge = (dateOfBirth) => { 

    const birthDate = new Date(dateOfBirth);

    let age = new Date().getFullYear() - birthDate.getFullYear();
    const month = new Date().getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && new Date().getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}


const tableData = mockRanking.map(p => {

    const currentPlayer = mockPlayerData.find(player => player.playerId === p.playerId)

    return {
        pointsWon: p.pointsWon,
        name: `${currentPlayer.firstName} ${currentPlayer.familyName}`,
        age: getAge(currentPlayer.dateOfBirth),
        id: currentPlayer.playerId,
        nationCompetingFor: currentPlayer.nationCompetingFor
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

const tableRowHeaders = [
    'Ranking', 'Name', 'Competes For', 'Age', 'Points Won'
]

const Home = () => {

    const [search, setSearch] = useState({
        name: '',
        nationCompetingFor: '',
        age: null,
        pointsWon: null,
    }) 

    const [tableData, setTableData] = useState(organizedTableData)

    const handleSearchChange = (e) => {

        console.log("value", e)

        const name = e.target.name
        const value = e.target.value

        setSearch({
            ...search,
            [name]: value
        })

        const sortedAndFilteredData = organizedTableData.filter(player => player[name].toLowerCase().includes(value.toLowerCase()));

        setTableData(sortedAndFilteredData)

    }

    const handleRowClick = (playerData) => {
        console.log(playerData)
    }

    return (
        <div style={{padding: '0 50px 50px 50px'}}>
            <div style={{textAlign: 'left', marginBottom: 10}}>Search Options (in construction, age group is not working)</div>
            <div className="flex">
                <TextField
                    name="name"
                    id="outlined-basic"
                    label="Search by name"
                    variant="outlined"
                    size="small"
                    value={search.name}
                    onChange={handleSearchChange}
                    style={{marginRight: 10}}
                />
                <TextField
                    name="nationCompetingFor"
                    id="outlined-basic"
                    label="Search by nation"
                    variant="outlined"
                    size="small"
                    value={search.nationCompetingFor} onChange={handleSearchChange}
                    style={{marginRight: 10}}
                />
                <TextField
                    id="outlined-select-currency"
                    name="ageGroup"
                    select
                    label="Age Group"
                    value={search.ageGroups}
                    onChange={(e) => {console.log(e)}}
                    size="small"
                    style={{width: 150}}
                >
                    {ageGroups.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                    </TextField>
            </div>
            <Table tableData={tableData} rowHeaders={tableRowHeaders} onRowClick={handleRowClick}/>
        </div>
    )
}

export default Home