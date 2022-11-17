import React, {useEffect, useState} from 'react';
import {Fab, Grid, Typography} from "@mui/material";
import CustomAppBar from "../components/CustomAppBar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from '@mui/material/TableContainer';
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import axios from "axios";
import {BASE_API_URL, GAME_ENDPOINT, NEW_MATCH, PLAYER_LIST_ENDPOINT} from "../constants";
import AddIcon from "@mui/icons-material/Add";
import ScoreDialog from "../components/ScoreDialog";


function createData(id, data) {
    return {
        id,
        data,
    };
}

function getInitialState(players) {
    let score = {}
    players.map(player => {
        score[player.id] = ''
    })
    return score
}

export default function Match({players}) {
    const [scoreRow, setScoreRow] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [turnScore, setTurnScore] = useState({})
    const [totalScore, setTotalScore] = useState({})

    const gameId = localStorage.getItem('gameId')

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCancelDialog = () => setOpenDialog(false);
    const handleScoreChange = (index, event) => {
        let update = {}
        update[index] = parseInt(event.target.value)
        setTurnScore({...turnScore, ...update})
    }

    const addScore = () => {
        setTotalScore(() => {
            let updated = {}
            Object.keys(turnScore).map(key => {
                updated[key] = totalScore[key] + turnScore[key]
            })
            return updated
        })
        handleCancelDialog()
        setTurnScore(getInitialState(players))
        setScoreRow([...scoreRow, createData(scoreRow.length + 1, Object.values(turnScore))])
    }

    const handleEndGame = () => {
        let data = []
        Object.keys(totalScore).map(key => {
            data.push({"player": parseInt(key), "score": totalScore[key]})
        })
        axios.post(`${BASE_API_URL}${GAME_ENDPOINT}${gameId}/${NEW_MATCH}`, data)
            .then(res => {
                console.log(res.data)
            })
            .catch(e => console.log(e))
    }


    useEffect(() => {
        let scores = {}
        players.map(player => {
            scores[player.id] = 0
        })
        setTotalScore(scores)
        setTurnScore(getInitialState(players))
    }, [])

    return (
        <>


            <Box sx={{'& > :not(style)': {mx: 1, mb: 1}, display: 'flex'}}>
                <Grid container spacing={2}>
                    <Grid item sm={6} md={6}>
                        <Fab color="secondary" variant='extended' aria-label="add" onClick={handleOpenDialog}>
                            <AddIcon sx={{mr: 1}}/>
                            Add Scores
                        </Fab>
                    </Grid>
                    <Grid container item sm={6} md={6} direction='row-reverse'>
                        <Fab color="secondary" variant='extended' aria-label="add" onClick={handleEndGame}>
                            End Game
                        </Fab>
                    </Grid>
                </Grid>
            </Box>

            <TableContainer component={Paper}>
                <Table aria-label="collapsible table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant='h6'>Turn</Typography></TableCell>
                            {
                                players.map(player => <TableCell key={player.id}>
                                    <Typography variant='h6'>{player.name}</Typography>
                                </TableCell>)
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            scoreRow.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row" sx={{borderBottom: 'none'}}>
                                        {row.id}
                                    </TableCell>
                                    {
                                        row.data.map(
                                            (score, scoreId) => <TableCell key={scoreId}
                                                                           sx={{borderBottom: 'none'}}>{score}</TableCell>)
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>


            <ScoreDialog state={openDialog} handleCancel={handleCancelDialog}
                         handleAdd={addScore} dialogTitle='Add Scores' players={players}
                         handleScoreChange={handleScoreChange}/>
        </>
    )
}