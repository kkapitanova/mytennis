import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const BasicTable = ({ tableData, rowHeaders, onRowClick }) => {

    if (tableData && tableData.length) {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {rowHeaders.map((header, index) => (
                                <TableCell key={index} align={`${index === rowHeaders.length - 1 ? "right" : 'left'}`}>{header}</TableCell>
                            ))}
                            {/* <TableCell>Ranking</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Competes For</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell align="right">Points Won</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData && tableData.map((dataItem, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {Object.keys(dataItem).map((key, index) => { 

                                    let value = dataItem[key]

                                    if (typeof dataItem[key] === 'object') {
                                        let newValue = ''

                                        dataItem[key].map((item, index) => {
                                            newValue = index < dataItem[key].length - 1 ? newValue + item + ", " : newValue + item
                                        })

                                        value = newValue
                                    }

                                    if (index < rowHeaders.length) {
                                        return (
                                            <TableCell 
                                                key={index + new Date().getTime()} 
                                                align={`${index === rowHeaders.length - 1 ? "right" : 'left'}`} 
                                                onClick={() => onRowClick(dataItem)} 
                                                className={`${ typeof value === 'string' &&
                                                    (value.toLowerCase() === 'waiting for approval' || value.toLowerCase() === 'postponed' ? 'orange' : 
                                                    value.toLowerCase() === 'declined' || value.toLowerCase() === 'withdrawn' ? 'red' :
                                                    value.toLowerCase() === 'open' || value.toLowerCase() === 'concluded' || value.toLowerCase() === 'entered' ? 'green' : '')
                                                }`}
                                            >
                                                {value}
                                            </TableCell>
                                        )
                                    }
                                })}

                                {/* <TableCell>{index + 1}</TableCell>
                                <TableCell>{player.name}</TableCell>
                                <TableCell>{player.nationCompetingFor}</TableCell>
                                <TableCell>{player.age}</TableCell> 
                                <TableCell align="right">{player.pointsWon}</TableCell>  */}
                                {/* <TableCell sortDirection={orderBy === headCell.id ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={createSortHandler(headCell.id)}
                                    >
                                        {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                    </TableSortLabel>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    } else {
        return <div>No data available.</div>
    }
}

export default BasicTable