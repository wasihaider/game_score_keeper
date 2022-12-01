import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Grid, Typography, Box, CardContent, Card, Avatar, IconButton} from "@mui/material";
import {alpha} from '@mui/material/styles'
import LinearProgressBar from "./LinearProgressBar";
import {AVATAR_DIR_PATH, BASE_API_URL, GAME_ENDPOINT, PLAYER_DETAIL_ENDPOINT} from "../constants";
import {useParams} from "react-router-dom";

export default function PlayerStats() {
    const {playerId} = useParams()
    const [player, setPlayer] = useState({color: "#ffffff"})

    useEffect(() => {
        axios.get(`${BASE_API_URL}${GAME_ENDPOINT}${PLAYER_DETAIL_ENDPOINT}/${playerId}`)
            .then(res => {
                console.log(res.data)
                setPlayer(res.data)
            })
            .catch(e => console.log(e))
    }, [])

    return (
        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <Card raised sx={{backgroundColor: alpha(player.color, 0.1), pb: 0}}>
                        <CardContent color={player.color}>
                            <Grid container spacing={0}>
                                <Grid item xs={6} md={6}>
                                    <Box sx={{flexGrow: 1, m: 'auto', textAlign: 'left', alignItems: 'center'}}>
                                        <Typography variant='h4' color={player.color}>{player.name}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <Box sx={{flexGrow: 1, m: 'auto', textAlign: 'right'}}>
                                        <IconButton>
                                            <Avatar src={`${AVATAR_DIR_PATH}${player.avatar}.png`} sx={{
                                                height: 96, width: 96
                                            }}/>
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='body1'>All Times</Typography>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Card raised
                          sx={{backgroundColor: alpha(player.color, 0.1), pb: 0, minHeight: '25vh', maxHeight: '25vh'}}>
                        <CardContent>
                            <Typography variant="h6">Rank</Typography>
                            <Typography variant="h3" color={player.color}>{player.rank}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Card raised
                          sx={{backgroundColor: alpha(player.color, 0.1), pb: 0, minHeight: '25vh', maxHeight: '25vh'}}>
                        <CardContent>
                            <Typography variant="h6">Rating</Typography>
                            <Typography
                                variant="h3"
                                color={player.color}>{Math.round((player.rating + Number.EPSILON) * 100) / 100}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Card raised
                          sx={{backgroundColor: alpha(player.color, 0.1), pb: 0, minHeight: '25vh', maxHeight: '25vh'}}>
                        <CardContent>
                            <Typography variant="h6">Matches</Typography>
                            <Grid container direction='row' spacing={1}>
                                <Grid item>
                                    <Typography variant='caption'>Total: </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant='body1' color={player.color}>{player.total_matches}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container direction='row' spacing={1}>
                                <Grid item>
                                    <Typography variant='caption'>Win: </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant='body1' color={player.color}>{player.win}</Typography>
                                </Grid>
                            </Grid>
                            <LinearProgressBar customColor={player.color}
                                               value={player.win / player.total_matches * 100}/>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Card raised
                          sx={{backgroundColor: alpha(player.color, 0.1), pb: 0, minHeight: '25vh', maxHeight: '25vh'}}>
                        <CardContent>
                            <Typography variant="h6">Scores</Typography>
                            <Grid container direction='row' spacing={1}>
                                <Grid item>
                                    <Typography variant='caption'>Total: </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant='body1' color={player.color}>{player.total_scores}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container direction='row' spacing={1}>
                                <Grid item>
                                    <Typography variant='caption'>Average: </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant='body1'
                                        color={player.color}>{Math.round((player.scores_average + Number.EPSILON) * 100) / 100}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Card raised
                          sx={{backgroundColor: alpha(player.color, 0.1), pb: 0, minHeight: '25vh', maxHeight: '25vh'}}>
                        <CardContent>
                            <Typography variant="h6">Points</Typography>
                            <Grid container direction='row' spacing={1}>
                                <Grid item>
                                    <Typography variant='caption'>Total: </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant='body1'
                                        color={player.color}>{Math.round((player.points + Number.EPSILON) * 100) / 100}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container direction='row' spacing={1}>
                                <Grid item>
                                    <Typography variant='caption'>Average: </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant='body1'
                                        color={player.color}>{Math.round((player.points_average + Number.EPSILON) * 100) / 100}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}