import React, {useEffect, useState} from 'react';
import { Prompt } from 'react-router'
import {Box, Button, Fab, Grid, IconButton, TextField, Typography} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import axios from "axios";
import {BASE_API_URL, GAME_ENDPOINT, NEW_MATCH} from "../constants";

const initialTurnScore = (players) => {
    let score = {}
    players.map(({id}) => score[id.toString()] = '')
    return score
}

const row = (data, idx, players, handleRemove, startEditing, editingIdx, handleUpdate, stopEditing) => {
    const currentlyEditing = editingIdx === idx
    return (
        <TableRow key={idx}>
            <TableCell sx={{borderBottom: 'none'}}>{idx + 1}</TableCell>
            {players.map(player => (
                <TableCell sx={{borderBottom: 'none'}} key={player.id}>
                    {currentlyEditing ?
                        <TextField
                            name={player.id.toString()}
                            onChange={e => handleUpdate(e, player.id.toString(), idx)}
                            value={data[player.id.toString()]}
                            focused={true}
                            size='small'
                            color='secondary'
                        /> :
                        data[player.id.toString()]}
                </TableCell>
            ))}
            <TableCell sx={{borderBottom: 'none'}}>
                {currentlyEditing ?
                    <IconButton color='secondary' onClick={stopEditing}><CheckIcon/></IconButton> :
                    <IconButton color='secondary' onClick={() => startEditing(idx)}><EditIcon/></IconButton>
                }
            </TableCell>
            <TableCell sx={{borderBottom: 'none'}}>
                <IconButton color='secondary' onClick={() => handleRemove(idx)}><DeleteIcon/></IconButton>
            </TableCell>
        </TableRow>
    )
}

export default function MatchPlay({players, endGame}) {

    const [turnScore, setTurnScore] = useState(initialTurnScore(players))
    const [tableData, setTableData] = useState([])
    const [editIdx, setEditIdx] = useState(-1)
    const gameId = localStorage.getItem('gameId')

    const handleRemove = (idx) => {
        setTableData(prevState => prevState.filter((data, i) => idx !== i && data))
    }

    const handleUpdate = (e, field, idx) => {
        const {value} = e.target;
        setTableData(prevState => prevState.map(
            (row, i) => (idx === i ? {...row, [field]: value} : row)
        ))
    }

    const startEditing = idx => setEditIdx(idx)
    const stopEditing = () => setEditIdx(-1)


    const handleFormChange = (e) => {
        setTurnScore(prevState => {
            return {...prevState, [e.target.name]: e.target.value}
        })
    }

    const handleTurnScoreSubmit = (e) => {
        e.preventDefault()
        setTableData([...tableData, turnScore])
        setTurnScore(initialTurnScore(players))
    }

    const handleEndGame = () => {
        let scores = []
        players.map(({id}) => {
            let score = {}
            score.player = id
            score.score = tableData.reduce((accumulator, object) => {
                return accumulator + parseInt(object[id.toString()]);
            }, 0);
            scores.push(score)
        })

        axios.post(`${BASE_API_URL}${GAME_ENDPOINT}${gameId}/${NEW_MATCH}`, scores)
            .then(res => {
                endGame(res.data)
            })
            .catch(e => console.log(e))
    }

    useEffect(() => {

    }, [])

    return (
        <>
            <Prompt>

            </Prompt>
            <Box sx={{flexGrow: 1, textAlign: 'right'}}>
                <Fab sx={{mb: 2}} color="secondary" variant='extended' aria-label="add" onClick={handleEndGame}>
                    End Game
                </Fab>
            </Box>
            <Box sx={{flexGrow: 1, textAlign: 'center', mb: 2}}>
                <form onSubmit={handleTurnScoreSubmit}>
                    <Grid container spacing={2} direction='row'>
                        {
                            players.map(player => (
                                <Grid item key={player.id}>
                                    <TextField
                                        focused={true}
                                        margin="dense"
                                        id={player.id.toString()}
                                        label={player.name}
                                        variant="outlined"
                                        color="secondary"
                                        name={player.id.toString()}
                                        value={turnScore[player.id.toString()]}
                                        onChange={e => handleFormChange(e)}
                                        size='small'
                                        type='number'
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>
                    <Button type='submit' color='secondary' variant='contained' sx={{mt: 2}}>Add Score</Button>
                </form>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant='h6'>Turn</Typography></TableCell>
                            {
                                players.map(player => (
                                    <TableCell key={player.id}>
                                        <Typography variant='h6'>{player.name}</Typography>
                                    </TableCell>
                                ))
                            }
                            <TableCell/>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            tableData.map((data, idx) => row(
                                data, idx, players,
                                handleRemove, startEditing, editIdx, handleUpdate, stopEditing
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
