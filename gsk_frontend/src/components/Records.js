import React, {useEffect, useState} from 'react';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {alpha} from "@mui/material/styles";
import TableContainer from "@mui/material/TableContainer";
import {
    Avatar,
    Box, FormHelperText,
    Grid, MenuItem, OutlinedInput, Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import axios from "axios";
import {AVATAR_DIR_PATH, BASE_API_URL, GAME_ENDPOINT, RECORDS} from "../constants";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import FormControl from "@mui/material/FormControl";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const pageData = {
    score: {
        title: 'Highest Score in 1 Match',
        columns: [
            {field: 'score', label: 'Score', type: 'int'},
            {field: 'date', label: 'Date', type: 'date'}
        ]
    },
    scoreAverage: {
        title: "Highest Score Average",
        columns: [
            {field: 'score_average', label: "Score Average", type: 'float'}
        ]
    }
}


function getHumanDate(date) {
    const d = new Date(date);
    const day = dayjs(d.toLocaleString())
    return day.format("ddd, MMM D, YYYY");
}


function RecordTable({columns, records}) {

    console.log("records", records)

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table" size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontSize: 14}}>Rank</TableCell>
                        <TableCell sx={{fontSize: 14}}>Player</TableCell>
                        {
                            columns.map(({label}, idx) => (
                                <TableCell key={idx} sx={{fontSize: 14}}>{label}</TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        records.map((record, idx) => (
                            <TableRow key={idx} sx={{bgcolor: alpha(record.color, 0.2)}}>
                                <TableCell sx={{borderBottom: 'none', fontSize: 18}}>{idx + 1}</TableCell>
                                <TableCell sx={{borderBottom: 'none', fontSize: 18}}>
                                    <Grid container>
                                        <Avatar src={`${AVATAR_DIR_PATH}${record.avatar}.png`}/>
                                        <Typography variant='body' fontSize={18}
                                                    sx={{ml: 1, mt: 1}}>{record.name}</Typography>
                                    </Grid>
                                </TableCell>
                                {
                                    columns.map(({field, type}, idx) => (
                                        <TableCell key={idx} sx={{borderBottom: 'none', fontSize: 18}}>
                                            {type === 'date' ?
                                                getHumanDate(record[field]) :
                                                type === 'float' ?
                                                    Math.round((parseFloat(record[field]) + Number.EPSILON) * 100) / 100 :
                                                    record[field]
                                            }
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default function Stats() {

    const [records, setRecords] = useState([])
    const gameId = localStorage.getItem('gameId')

    const [period, setPeriod] = useState('-3')
    const [startDate, setStartDate] = React.useState(dayjs().startOf('month').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = React.useState(dayjs().format('YYYY-MM-DD'))
    const [showDatePicker, setShowPicker] = useState(false)
    const [query, setQuery] = useState(`start_date=${
        dayjs().startOf('month').format('YYYY-MM-DD')
    }&end_date=${
        dayjs().format('YYYY-MM-DD')
    }`)
    const [filter, setFilter] = useState('score')

    const handleDateChange = (dateType, value) => {
        const formattedValue = value.format('YYYY-MM-DD')
        if (dateType === 'start') {
            setStartDate(formattedValue)
            setQuery(`start_date=${formattedValue}&end_date=${endDate}`)
        } else {
            setEndDate(formattedValue)
            setQuery(`start_date=${startDate}&end_date=${formattedValue}`)
        }
    }

    const handleTogglePeriod = (event, newPeriod) => {
        setShowPicker(newPeriod === '-2');  // Select Date
        setPeriod(newPeriod);
        const end = dayjs().format('YYYY-MM-DD')
        if (newPeriod === '7') {
            const start = dayjs().subtract(7, 'days').format('YYYY-MM-DD')
            setStartDate(start)
            setEndDate(end)
            setQuery(`start_date=${start}&end_date=${end}`)
        } else if (newPeriod === '30') {
            const start = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
            setStartDate(start)
            setEndDate(end)
            setQuery(`start_date=${start}&end_date=${end}`)
        } else if (newPeriod === '-1') {  //All times
            setStartDate('')
            setEndDate(end)
            setQuery('')
        } else if (newPeriod === '-3') {  // This month only
            const start = dayjs().startOf('month').format('YYYY-MM-DD')
            setStartDate(start)
            setEndDate(end)
            setQuery(`start_date=${start}&end_date=${end}`)
        }
    };

    const handleFilterChange = e => {
        setFilter(e.target.value)
    }

    useEffect(() => {
        const url = `${BASE_API_URL}${GAME_ENDPOINT}${gameId}/${RECORDS}?${query}&filter=${filter}`
        axios.get(url)
            .then(res => setRecords(res.data.results))
            .catch(e => console.log(e))
    }, [query, filter])

    return (
        <>
            <Box sx={{flexGrow: 1, textAlign: 'center', mb: 2}}>
                <FormControl fullWidth focused={true} sx={{ minWidth: 300 }} >
                    <FormHelperText sx={{fontSize: 18}}>Select Record Type</FormHelperText>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={filter}
                        color='secondary'
                        label="filter"
                        MenuProps={MenuProps}
                        input={<OutlinedInput/>}
                        onChange={handleFilterChange}
                    >
                        {
                            Object.keys(pageData).map((key, idx) => (
                                <MenuItem key={idx} value={key}>{pageData[key].title}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{flexGrow: 1, textAlign: 'center', mb: 2}}>
                <ToggleButtonGroup
                    color='secondary'
                    value={period}
                    exclusive
                    onChange={handleTogglePeriod}
                    aria-label='Periods'
                >
                    <ToggleButton value='7' selected={period === '7'} sx={{
                        color: period === '7' ? '#bdbdbd' : '#585858'
                    }}>7 days</ToggleButton>
                    <ToggleButton value='30' selected={period === '30'} sx={{
                        color: period === '30' ? '#bdbdbd' : '#585858'
                    }}>30 days</ToggleButton>
                    <ToggleButton value='-3' selected={period === '-3'} sx={{
                        color: period === '-3' ? '#bdbdbd' : '#585858'
                    }}>This month</ToggleButton>
                    <ToggleButton value='-1' selected={period === '-1'} sx={{
                        color: period === '-1' ? '#bdbdbd' : '#585858'
                    }}>All times</ToggleButton>
                    <ToggleButton value='-2' selected={period === '-2'} sx={{
                        color: period === '-2' ? '#bdbdbd' : '#585858'
                    }}>Select
                        Period</ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {
                showDatePicker && (
                    <Box sx={{flexGrow: 1, textAlign: 'center', mb: 2, mt: 2}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                onChange={(value) => handleDateChange('start', value)}
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
                                onChange={(value) => handleDateChange('end', value)}
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
                )
            }
            <RecordTable columns={pageData[filter].columns} records={records}/>
        </>
    )
}