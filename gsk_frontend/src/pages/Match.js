import React, {useEffect, useState} from 'react';
import MatchPlay from '../components/MatchPlay'
import axios from "axios";
import {BASE_API_URL, GAME_ENDPOINT, PLAYER_LIST_ENDPOINT} from "../constants";
import CustomAppBar from "../components/CustomAppBar";
import Toolbar from "@mui/material/Toolbar";
import {Box, Typography} from "@mui/material";
import SelectPlayers from "../components/SelectPlayers";


export default function Match() {
    const [players, setPlayers] = useState([])
    const [whoIsPlaying, setWhoIsPlaying] = useState([])
    const [play, setPlay] = useState(false)

    const gameId = localStorage.getItem("gameId")

    useEffect(() => {
        axios.get(`${BASE_API_URL}${GAME_ENDPOINT}${gameId}/${PLAYER_LIST_ENDPOINT}`)
            .then(res => setPlayers(res.data))
            .catch(e => console.log(e))
    }, [])

    return (
        <>
            <CustomAppBar/>
            <Box
                component="main"
                sx={{flexGrow: 1, p: 3}}
            >
                <Toolbar/>
                {
                    play ?
                        <MatchPlay players={whoIsPlaying}/> :
                        <SelectPlayers />
                }
            </Box>
        </>
    )
}