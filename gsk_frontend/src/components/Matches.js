import * as React from 'react';
import axios from "axios";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Fab, TablePagination} from "@mui/material";
import {useEffect, useState} from "react";
import {BASE_API_URL, GAME_ENDPOINT, MATCH_LIST_ENDPOINT} from "../constants";
import {useNavigate, useParams} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

function createData(id, date) {
    return {
        id,
        date,
        history: [
            {
                date: '2020-01-05',
                customerId: '11091700',
                amount: 3,
            },
            {
                date: '2020-01-02',
                customerId: 'Anonymous',
                amount: 1,
            },
        ],
    };
}

function Row(props) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow>
                <TableCell sx={{borderBottom: 'none'}}>
                    <IconButton color='inherit'
                                aria-label="expand row"
                                size="small"
                                onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" sx={{borderBottom: 'none'}}>
                    {row.id}
                </TableCell>
                <TableCell align="right" sx={{borderBottom: 'none'}}>{row.date}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                                History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Total price ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.history.map((historyRow) => (
                                        <TableRow key={historyRow.date}>
                                            <TableCell component="th" scope="row">
                                                {historyRow.date}
                                            </TableCell>
                                            <TableCell>{historyRow.customerId}</TableCell>
                                            <TableCell align="right">{historyRow.amount}</TableCell>
                                            <TableCell align="right">
                                                {Math.round(historyRow.amount * row.price * 100) / 100}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function CollapsibleTable() {

    const {gameId} = useParams()
    const navigate = useNavigate()

    const [rows, setRows] = useState([])

    useEffect(() => {
        const query = "ordering=-created_on"
        axios.get(`${BASE_API_URL}${GAME_ENDPOINT}${gameId}/${MATCH_LIST_ENDPOINT}?${query}`)
            .then(res => {
                setRows(res.data.map(match => {
                    const d = new Date(match.created_on);
                    return createData(match.id, d.toLocaleString());
                }))
            })
            .catch(e => console.log(e))
    }, [])

    return (
        <>
            <Box sx={{'& > :not(style)': {m: 1}}}>
                <Fab color="secondary" variant='extended' aria-label="add" onClick={() => navigate("/newMatch")}>
                    <AddIcon sx={{ mr: 1 }}/>
                    New Match
                </Fab>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>Match ID</TableCell>
                            <TableCell align="right">Date played on</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.id} row={row}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}