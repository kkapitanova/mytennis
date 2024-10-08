import * as React from 'react';

// material imports
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// styles
import './Table.scss'

const BasicTable = ({ tableData, rowHeaders, onRowClick, noRowClickEvent = false }) => {

    if (tableData && tableData.length) {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {rowHeaders.map((header, index) => (
                                <TableCell key={index} align={`${index === rowHeaders.length - 1 ? "right" : 'left'}`}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData && tableData.map((dataItem, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {dataItem && Object.keys(dataItem).map((key, index) => { 

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
                                                onClick={() => !noRowClickEvent && onRowClick(dataItem)} 
                                                className={`${ typeof value === 'string' &&
                                                    (value.toLowerCase() === 'waiting for approval' || value.toLowerCase() === 'postponed' || value.toLowerCase() === 'waiting for points distribution' ? 'orange' : 
                                                    value.toLowerCase() === 'declined' || value.toLowerCase() === 'withdrawn' || value.toLowerCase() === 'canceled' ? 'red' :
                                                    value.toLowerCase() === 'concluded' ? "blue" :
                                                    value.toLowerCase() === 'sign up open' || value.toLowerCase() === 'in progress' || value.toLowerCase() === 'entered' ? 'green' : '')
                                                }`}
                                            >
                                                {value}
                                            </TableCell>
                                        )
                                    }
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    } else {
        return <div className="no-data-message full-width">No data available.</div>
    }
}

export default BasicTable