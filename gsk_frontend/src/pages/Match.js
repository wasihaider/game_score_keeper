import React, {useEffect, useState} from 'react';
import MatchPlay from '../components/MatchPlay'
import axios from "axios";
import {BASE_API_URL, GAME_ENDPOINT, PLAYER_LIST_ENDPOINT} from "../constants";
import CustomAppBar from "../components/CustomAppBar";
import Toolbar from "@mui/material/Toolbar";
import {Box} from "@mui/material";
import SelectPlayers from "../components/SelectPlayers";
import MatchLeaderBoard from "../components/MatchLeaderBoard";


export default function Match() {
    const [players, setPlayers] = useState([])
    const [whoIsPlaying, setWhoIsPlaying] = useState([])
    const [play, setPlay] = useState(false)
    const [endPlay, setEndPlay] = useState(false)
    const [gameResults, setGameResults] = useState([])

    const gameId = localStorage.getItem("gameId")
    const handleSubmit = () => setPlay(true)

    const endGame = (gameData) => {
        setGameResults(gameData.results)
        setEndPlay(true)
    }

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
                    !endPlay ?
                        (play ?
                            <MatchPlay players={whoIsPlaying} endGame={endGame}/> :
                            <SelectPlayers players={players} whoIsPlaying={whoIsPlaying}
                                           setWhoIsPlaying={setWhoIsPlaying}
                                           handleSubmit={handleSubmit}/>):
                        <MatchLeaderBoard results={gameResults}/>
                }
            </Box>
        </>
    )
}