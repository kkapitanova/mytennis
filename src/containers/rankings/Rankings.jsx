import React, { useState, useEffect } from 'react';
import { Table } from '../../components';
import { sortData, getAge } from '../../utils/helpers'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useHistory, useLocation } from 'react-router';
import { ageGroups, genderGroups } from '../../data/constants';
import { mockPlayerData, mockRanking } from '../../data/dummyData';

const tableRowHeaders = [
    'Ranking', 'Name', 'Competes For', 'Age', 'Points Won'
]

const Rankings = () => {

    const location = useLocation()
    const [initialLoad, setInitialLoad] = useState(false)
    const [search, setSearch] = useState({
        name: '',
        nationCompetingFor: '',
        ageGroup: 'U40',
        genderGroup: 'Male'
    }) 
    const [data, setData] = useState([])
    const [dataByAgeGroup, setDataByAgeGroup] = useState([])

    const getData = () => {
        let rankingData = []

        mockRanking.forEach(r => {
            if ((search.ageGroup ? r.ageGroup === search.ageGroup : true) && (search.genderGroup ? r.genderGroup.toLowerCase() === search.genderGroup.toLowerCase() : true)) {
                rankingData = r.players
            }
        })

        const tableData = rankingData.map(p => {
            const currentPlayer = mockPlayerData.find(player => player.playerId === p.playerId)
        
            return {
                name: `${currentPlayer?.firstName} ${currentPlayer?.familyName}`,
                nationCompetingFor: currentPlayer?.nationCompetingFor,
                age: getAge(currentPlayer?.dateOfBirth),
                pointsWon: p.pointsWon,
            }
        })

        const sortedTableData = sortData(tableData, "pointsWon")
        const organizedTableData = sortedTableData.map((player, index) => {
            return {
                ranking: index + 1,
                ...player
            }
        })

        setDataByAgeGroup([...organizedTableData])

        return organizedTableData
    }


    const handleRowClick = (playerData) => {
        console.log(playerData)
    }

    const handleSearchChange = (e) => {

        const name = e.target.name
        const value = e.target.value

        setSearch({
            ...search,
            [name]: value
        })

        const sortedAndFilteredData = dataByAgeGroup.filter(player => player[name]?.toLowerCase().includes(value.toLowerCase()));

        setData(sortedAndFilteredData)
    }

    useEffect(() => {
        getData()
        setData(getData())
    }, [search.ageGroup, search.genderGroup])

    useEffect(() => {
      window.scrollTo(0,0)
      setInitialLoad(true)
    }, [initialLoad])

    useEffect(() => {

        const searchGenderGroup = location.pathname.split('/')[2]

        const rand = Math.floor(Math.random()*10)
        const randomGenderGroup = rand % 2 === 0 ? 'Female' : 'Male'

        setSearch({
            ...search,
            genderGroup: searchGenderGroup === "women" ? 'Female' : searchGenderGroup === "men" ? 'Male' : searchGenderGroup === "mixed-doubles" ? 'Mixed' : randomGenderGroup
        })
    }, [location])

    return (
        <div style={{padding: '0 50px 50px 50px'}}>
            <h3 className="accent-color" style={{textAlign: 'left'}}>Search Players</h3>
            <div className="flex wrap">
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
                    name="nationCompetingFor"
                    id="outlined-basic"
                    label="Search by nation"
                    variant="outlined"
                    color="secondary"
                    size="small"
                    value={search.nationCompetingFor}
                    onChange={handleSearchChange}
                    style={{minWidth: 200, margin: '0 5px 10px 0'}}
                />
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
        </div>
    )
}

export default Rankings