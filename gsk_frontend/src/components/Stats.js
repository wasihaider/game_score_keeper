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
    Box,
    Card,
    CardContent,
    Grid, Icon,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import axios from "axios";
import {BASE_API_URL, GAME_ENDPOINT, STATS} from "../constants";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";


export default function Stats() {

    const [stats, setStats] = useState([])
    const gameId = localStorage.getItem('gameId')

    const [period, setPeriod] = useState('30')
    const [startDate, setStartDate] = React.useState(dayjs().subtract(1, 'month').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = React.useState(dayjs().format('YYYY-MM-DD'))
    const [showDatePicker, setShowPicker] = useState(false)
    const [query, setQuery] = useState(`start_date=${
        dayjs().subtract(1, 'month').format('YYYY-MM-DD')
    }&end_date=${
        dayjs().format('YYYY-MM-DD')
    }`)

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
        setShowPicker(newPeriod === '-2');
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
        } else if (newPeriod === '-1') {
            setStartDate('')
            setEndDate(end)
            setQuery('')
        }
    };

    useEffect(() => {
        axios.get(`${BASE_API_URL}${GAME_ENDPOINT}${gameId}/${STATS}?${query}`)
            .then(res => setStats(res.data))
            .catch(e => console.log(e))
    }, [query])

    return (
        <>
            <Box sx={{flexGrow: 1, textAlign: 'center', mb: 1}}>
                <ToggleButtonGroup
                    color='secondary'
                    value={period}
                    exclusive
                    onChange={handleTogglePeriod}
                    aria-label='Periods'
                >
                    <ToggleButton value='-1' selected={period === '-1'} sx={{color: '#bdbdbd'}}>All times</ToggleButton>
                    <ToggleButton value='7' selected={period === '7'} sx={{color: '#bdbdbd'}}>7 days</ToggleButton>
                    <ToggleButton value='30' selected={period === '30'} sx={{color: '#bdbdbd'}}>Last
                        Month</ToggleButton>
                    <ToggleButton value='-2' selected={period === '-2'} sx={{color: '#bdbdbd'}}>Select
                        Period</ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {
                showDatePicker && (
                    <Box sx={{flexGrow: 1, textAlign: 'center', mb: 1, mt: 2}}>
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
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={2}>
                    {
                        stats.slice(0, 3).map(({color, name, position, rating, win, matches_total}) => (
                            <Grid item xs={4} md={4} key={name}>
                                <Card raised
                                      sx={{
                                          backgroundColor: alpha(color, 0.1),
                                          pb: 0,
                                          minHeight: '23vh',
                                          maxHeight: '23vh'
                                      }}>
                                    <CardContent>
                                        <Typography variant="h6">{name}</Typography>
                                        <Typography variant="h4">{position}</Typography>
                                        <Grid container direction='row' spacing={1}>
                                            <Grid item>
                                                <Typography variant='caption' color={color}>Rating: </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='body1'
                                                            color={color}>{
                                                    Math.round((rating + Number.EPSILON) * 100) / 100
                                                }</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
            <Grid item xs={12} sx={{m: 1}}>
                <Typography variant='h6'>Table</Typography>
            </Grid>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Position</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Matches</TableCell>
                            <TableCell>Win</TableCell>
                            <TableCell>Average</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Rating</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            stats.map(({
                                           name, color, matches_total, points_total,
                                           scores_average, win, rating, position
                                       }) => (
                                <TableRow key={name} sx={{bgcolor: alpha(color, 0.2)}}>
                                    <TableCell sx={{borderBottom: 'none'}}>{position}</TableCell>
                                    <TableCell sx={{borderBottom: 'none'}}>{name}</TableCell>
                                    <TableCell sx={{borderBottom: 'none'}}>{matches_total}</TableCell>
                                    <TableCell sx={{borderBottom: 'none'}}>{win}</TableCell>
                                    <TableCell sx={{borderBottom: 'none'}}>{
                                        Math.round((scores_average + Number.EPSILON) * 100) / 100
                                    }</TableCell>
                                    <TableCell sx={{borderBottom: 'none'}}>{
                                        Math.round((points_total + Number.EPSILON) * 100) / 100
                                    }</TableCell>
                                    <TableCell sx={{borderBottom: 'none'}}>{
                                        Math.round((rating + Number.EPSILON) * 100) / 100
                                    }</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}