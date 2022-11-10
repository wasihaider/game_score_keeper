import * as React from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom'
import {Grid, Container} from '@mui/material';
import {AddRounded, Face} from '@mui/icons-material'
import ClickableAvatar from "../components/ClickableAvatar";
import {useEffect, useState} from "react";
import {BASE_API_URL, GAME_ENDPOINT, PLAYER_LIST_ENDPOINT} from "../constants";
import GameFormDialogue from '../components/GameFormDialogue'
import {randomColor} from "../utils";


export default function Players() {
    const {gameId} = useParams()

    const [players, setPlayers] = useState([])
    const [openDialogue, setOpenDialogue] = React.useState(false);
    const [playerName, setPlayerName] = useState("")
    const [playerColor, setPlayerColor] = useState(randomColor())
    const navigate = useNavigate()

    const handleClickOpen = () => setOpenDialogue(true);
    const handleCancel = () => setOpenDialogue(false);
    const handleGameInput = (e) => setPlayerName(e.target.value)

    const handleClickPlayer = e => {
        const data_id = e.target.attributes.dataid.value
        navigate(`/player/${data_id}`)
    }

    const handleClickNewPlayer = () => {
        const player_data = {
            name: playerName,
            color: playerColor,
        }
        axios.post(`${BASE_API_URL}${GAME_ENDPOINT}${gameId}/${PLAYER_LIST_ENDPOINT}`, player_data)
            .then(res => setPlayers([...players, res.data]))
            .catch(e => console.log(e))
        setOpenDialogue(false)
    }

    useEffect(() => {
        axios.get(`${BASE_API_URL}${GAME_ENDPOINT}${gameId}/${PLAYER_LIST_ENDPOINT}`)
            .then(res => {
                setPlayers(res.data)
            })
            .catch(e => {
                console.log(e)
            })
    }, [])

    return (
        <div className='center-container'>
            <Grid container spacing={8}
                  className={players.length <= 5 ? 'center-grid-container' : 'left-grid-container'}>
                <Grid item xs={3} md={2} key={0} className={'no-padding-grid-item'}>
                    <ClickableAvatar name='New Player' avatar={<AddRounded/>} click_handler={handleClickOpen} sx={{
                        width: '56px', height: '56px'
                    }} isPlayer={true}/>
                </Grid>
                <GameFormDialogue handle_open={handleClickOpen} handle_cancel={handleCancel} state={openDialogue}
                                  handle_game={handleGameInput} handle_add={handleClickNewPlayer}
                                  title="Add new player" gameColor={playerColor} handleColorOnChange={
                    color => setPlayerColor(color)
                }/>
                {
                    players.map(player => {
                        return (
                            <Grid item container xs={3} md={2} key={player.id} className={'no-padding-grid-item'}>
                                <ClickableAvatar name={player.name} avatar={<Face dataid={player.id}/>} sx={{
                                    width: '56px', height: '56px', bgcolor: player.color
                                }} click_handler={handleClickPlayer} data_id={player.id} isPlayer={true}/>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
    );
}
