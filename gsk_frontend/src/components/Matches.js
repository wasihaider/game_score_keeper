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
import TableFooter from '@mui/material/TableFooter'
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Fab, TablePagination, TextField, useTheme} from "@mui/material";
import {useEffect, useState} from "react";
import {BASE_API_URL, GAME_ENDPOINT, MATCH_LIST_ENDPOINT} from "../constants";
import {useNavigate, useParams} from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import {alpha} from '@mui/material/styles'

function createData(id, date, results) {
    return {
        id,
        date,
        results,
    };
}


function TablePaginationActions(props) {
    const theme = useTheme();
    const {count, page, rowsPerPage, onPageChange} = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{flexShrink: 0, ml: 2.5}}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
                color='inherit'
            >
                {theme.direction === 'rtl' ? <LastPageIcon color='inherit'/> : <FirstPageIcon color='inherit'/>}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
                color='inherit'
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRightIcon color='inherit'/> :
                    <KeyboardArrowLeftIcon color='inherit'/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
                color='inherit'
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeftIcon color='inherit'/> :
                    <KeyboardArrowRightIcon color='inherit'/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
                color='inherit'
            >
                {theme.direction === 'rtl' ? <FirstPageIcon color='inherit'/> : <LastPageIcon color='inherit'/>}
            </IconButton>
        </Box>
    );
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
                                Match Result
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Position</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Score</TableCell>
                                        <TableCell>Points</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.results.map(({id, name, position, score, points, color}) => (
                                        <TableRow key={id} sx={{ bgcolor: alpha(color, 0.25) }}>
                                            <TableCell component="th" scope="row" sx={{textDecorationColor: color}}>
                                                {position}
                                            </TableCell>
                                            <TableCell>{name}</TableCell>
                                            <TableCell>{score}</TableCell>
                                            <TableCell>
                                                {Math.round((points + Number.EPSILON) * 100) / 100}
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

export default function Matches() {

    const {gameId} = useParams()
    const navigate = useNavigate()

    const [rows, setRows] = useState([])

    const [startDate, setStartDate] = React.useState(dayjs().subtract(1, 'month').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = React.useState(dayjs().format('YYYY-MM-DD'))

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rowCount, setRowCount] = React.useState(0);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    useEffect(() => {
        const query = `ordering=-created_on&start_date=${startDate.toString()}&end_date=${endDate.toString()}`
        const pquery = page !== 0 ? `page=${page + 1}&page_size=${rowsPerPage}` : `page_size=${rowsPerPage}`
        axios.get(`${BASE_API_URL}${GAME_ENDPOINT}${gameId}/${MATCH_LIST_ENDPOINT}?${query}&${pquery}`)
            .then(res => {
                setRows(res.data.results.map(match => {
                    const d = new Date(match.created_on);
                    return createData(match.id, d.toLocaleString(), match.results);
                }))
                setRowCount(res.data.count)
                console.log(res.data)
            })
            .catch(e => console.log(e))
    }, [startDate, endDate, page])

    return (
        <>
            <Box sx={{'& > :not(style)': {m: 1}}}>
                <Fab color="secondary" variant='extended' aria-label="add" onClick={() => navigate("/newMatch")}>
                    <AddIcon sx={{mr: 1}}/>
                    New Match
                </Fab>
            </Box>
            <Box sx={{flexGrow: 1, margin: 'auto', textAlign: 'center'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        onChange={(value) => setStartDate(value.format('YYYY-MM-DD'))}
                        value={startDate}
                        inputFormat='YYYY-MM-DD'
                        renderInput={(params) => <TextField {...params}
                                                            sx={{
                                                                svg: {color: '#fff'},
                                                                input: {color: '#fff'},
                                                            }}
                        />}
                        color='secondary'
                        label='Start Date'
                        PaperProps={{
                            sx: {
                                "& .MuiPickersCalendarHeader-root": {
                                    "& .MuiPickersArrowSwitcher-root": {
                                        '& .MuiIconButton-root': {
                                            color: '#fff'
                                        }
                                    }
                                }
                            }
                        }}
                    />
                    <DesktopDatePicker
                        onChange={(value) => setEndDate(value.format('YYYY-MM-DD'))}
                        value={endDate}
                        inputFormat='YYYY-MM-DD'
                        renderInput={(params) => <TextField {...params}
                                                            sx={{
                                                                svg: {color: '#fff'},
                                                                input: {color: '#fff'},
                                                            }}
                        />}
                        color='secondary'
                        label='End Date'
                        PaperProps={{
                            sx: {
                                "& .MuiPickersCalendarHeader-root": {
                                    "& .MuiPickersArrowSwitcher-root": {
                                        '& .MuiIconButton-root': {
                                            color: '#fff'
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </LocalizationProvider>
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
                        {emptyRows > 0 && (
                            <TableRow strle={{height: 53 * emptyRows}}>
                                <TableCell colSpan={6}/>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                colSpan={3}
                                count={rowCount}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    );
}