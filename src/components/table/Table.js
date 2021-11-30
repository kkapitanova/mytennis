import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { sortData } from '../../utils/helpers';

const BasicTable = ({ tableData, rowHeaders, onRowClick }) => {
  return (
    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    {rowHeaders.map((header, index) => (
                        <TableCell align={`${index === rowHeaders.length - 1 ? "right" : 'left'}`}>{header}</TableCell>
                    ))}
                    {/* <TableCell>Ranking</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Competes For</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell align="right">Points Won</TableCell> */}
                </TableRow>
            </TableHead>
            <TableBody>
                {tableData.map((dataItem, index) => (
                    <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        {Object.keys(dataItem).map((key, index) => (
                            <TableCell align={`${index === Object.keys(dataItem).length - 1 ? "right" : 'left'}`} onClick={() => onRowClick(dataItem)}>{dataItem[key]}</TableCell>
                        ))}

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
}

export default BasicTable