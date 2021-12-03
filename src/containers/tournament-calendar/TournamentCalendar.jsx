// import React, { useState, useEffect } from 'react';
// import { Table } from '../../components';
// import { sortData } from '../../utils/helpers'
// import TextField from '@mui/material/TextField';
// import MenuItem from '@mui/material/MenuItem';
// import { useHistory } from 'react-router';
// import { ageGroups } from '../../data/constants';
// import { mockPlayerData, mockRanking } from '../../data/dummyData';

// const getAge = (dateOfBirth) => { 

//     const birthDate = new Date(dateOfBirth);

//     let age = new Date().getFullYear() - birthDate.getFullYear();
//     const month = new Date().getMonth() - birthDate.getMonth();

//     if (month < 0 || (month === 0 && new Date().getDate() < birthDate.getDate())) {
//         age--;
//     }
    
//     return age;
// }


// const tableData = mockRanking.map(p => {

//     const currentPlayer = mockPlayerData.find(player => player.playerId === p.playerId)

//     return {
//         pointsWon: p.pointsWon,
//         name: `${currentPlayer.firstName} ${currentPlayer.familyName}`,
//         age: getAge(currentPlayer.dateOfBirth),
//         id: currentPlayer.playerId,
//         nationCompetingFor: currentPlayer.nationCompetingFor
//     }
// })

// const sortedTableData = sortData(tableData, "pointsWon")

// console.log(sortedTableData)
// const organizedTableData = sortedTableData.map((player, index) => {
//     return {
//         ranking: index + 1,
//         name: player.name,
//         nationCompetingFor: player.nationCompetingFor,
//         age: player.age,
//         pointsWon: player.pointsWon,
//     }
// })

// const tableRowHeaders = [
//     'Ranking', 'Name', 'Competes For', 'Age', 'Points Won'
// ]

// const TournamentCalendar = () => {

//     const history = useHistory();
//     const [initialLoad, setInitialLoad] = useState(false)


//     const [search, setSearch] = useState({
//         name: '',
//         nationCompetingFor: '',
//         age: null,
//         pointsWon: null,
//     }) 

//     const [tableData, setTableData] = useState(organizedTableData)

//     const handleSearchChange = (e) => {

//         console.log("value", e)

//         const name = e.target.name
//         const value = e.target.value

//         setSearch({
//             ...search,
//             [name]: value
//         })

//         const sortedAndFilteredData = organizedTableData.filter(player => player[name].toLowerCase().includes(value.toLowerCase()));

//         setTableData(sortedAndFilteredData)

//     }

//     const handleRowClick = (playerData) => {
//         console.log(playerData)
//     }

//     useEffect(() => {
//         setInitialLoad(false)
//     }, [])

//     useEffect(() => {
//       window.scrollTo(0,0)
//     }, [initialLoad])

//     return (
//         <div style={{padding: '0 50px 50px 50px'}}>
//             <h3 className="accent-color" style={{textAlign: 'left'}}>Search Players</h3>
//             <div className="flex">
//                 <TextField
//                     name="name"
//                     id="outlined-basic"
//                     label="Search by name"
//                     variant="outlined"
//                     color="secondary"
//                     size="small"
//                     value={search.name}
//                     onChange={handleSearchChange}
//                     style={{marginRight: 10}}
//                 />
//                 <TextField
//                     name="nationCompetingFor"
//                     id="outlined-basic"
//                     label="Search by nation"
//                     variant="outlined"
//                     color="secondary"
//                     size="small"
//                     value={search.nationCompetingFor} onChange={handleSearchChange}
//                     style={{marginRight: 10}}
//                 />
//                 <TextField
//                     id="outlined-select-currency"
//                     name="ageGroup"
//                     select
//                     label="Age Group"
//                     color="secondary"
//                     value={search.ageGroups}
//                     onChange={(e) => {console.log(e)}}
//                     size="small"
//                     style={{width: 150}}
//                 >
//                     {ageGroups.map((option, index) => (
//                         <MenuItem key={index} value={option}>
//                             {option}
//                         </MenuItem>
//                     ))}
//                 </TextField>
//             </div>
//             <Table tableData={tableData} rowHeaders={tableRowHeaders} onRowClick={handleRowClick}/>
//         </div>
//     )
// }

// export default TournamentCalendar


import React from 'react'
const TournamentCalendar = () => {
    return <div>test</div>

}

export default TournamentCalendar