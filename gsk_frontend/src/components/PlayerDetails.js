import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Button, FormGroup} from "@mui/material";
import {BASE_API_URL, GAME_ENDPOINT, PLAYER_RU_ENDPOINT} from "../constants";
import {useParams} from "react-router-dom";
import TextField from "@mui/material/TextField";
import ColorPicker from './ColorPicker'

export default function PlayerDetails() {
    const [player, setPlayer] = useState({})
    const {playerId} = useParams()
    const gameId = localStorage.getItem("gameId")
    const [openColorPicker, setOpenColorPicker] = useState(false)

    useEffect(() => {
        axios.get(`${BASE_API_URL}${GAME_ENDPOINT}${PLAYER_RU_ENDPOINT}/${playerId}`)
            .then(res => {
                setPlayer(res.data)
            })
            .catch(e => console.log(e));
    }, []);

    const onSubmit = (event) => {
        event.preventDefault()
        axios.put(`${BASE_API_URL}${GAME_ENDPOINT}${PLAYER_RU_ENDPOINT}/${playerId}`, {
            name: player.name,
            color: player.color,
            game: player.game
        })
            .then(res => {})
            .catch(e => console.log(e))
    }

    return (
        <div className='center-container'>
            <form onSubmit={onSubmit}>
                <TextField
                    focused={true}
                    margin="dense"
                    id="name"
                    label="Player Name"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    value={player.name}
                    onChange={e => setPlayer({...player, name: e.target.value})}
                />
                <ColorPicker color={player.color} onChange={
                    color => setPlayer({...player, color: color})
                }/>
                <Button fullWidth type='submit' variant='contained' sx={{mt: '1rem'}}>Save</Button>
            </form>
        </div>
    )
}
