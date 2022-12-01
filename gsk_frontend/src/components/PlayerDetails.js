import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Avatar, Box, Button, IconButton} from "@mui/material";
import {AVATAR_DIR_PATH, BASE_API_URL, GAME_ENDPOINT, PLAYER_RU_ENDPOINT} from "../constants";
import {useParams} from "react-router-dom";
import TextField from "@mui/material/TextField";
import ColorPicker from './ColorPicker'
import ChooseAvatar from "./ChooseAvatar";

function getAvatarImagePath(avatar) {
    return `${AVATAR_DIR_PATH}${avatar}.png`
}

export default function PlayerDetails() {
    const [player, setPlayer] = useState({})
    const {playerId} = useParams()
    const [success, setSuccess] = useState(false)
    const [openAvatarDialog, setOpenAvatarDialog] = useState(false)
    const [avatarImage, setAvatarImage] = useState('')

    useEffect(() => {
        axios.get(`${BASE_API_URL}${GAME_ENDPOINT}${PLAYER_RU_ENDPOINT}/${playerId}`)
            .then(res => {
                setPlayer(res.data)
                setAvatarImage(getAvatarImagePath(res.data.avatar))
            })
            .catch(e => console.log(e));
    }, []);

    const onSubmit = (event) => {
        event.preventDefault()
        axios.put(`${BASE_API_URL}${GAME_ENDPOINT}${PLAYER_RU_ENDPOINT}/${playerId}`, {
            name: player.name,
            color: player.color,
            avatar: player.avatar,
            game: player.game
        })
            .then(res => {
                setPlayer(res.data)
                setSuccess(true)
            })
            .catch(e => console.log(e))
    }

    const avatarClickHandler = avatar => {
        setAvatarImage(getAvatarImagePath(avatar))
        setPlayer({...player, avatar: avatar})
    }

    return (
        <div className='center-container'>
            <form onSubmit={onSubmit}>
                <Box sx={{flexGrow: 1, m: 'auto', textAlign: 'center', mb: 2}}>
                    <IconButton onClick={() => setOpenAvatarDialog(true)}>
                        <Avatar src={avatarImage} sx={{height: 64, width: 64}}/>
                    </IconButton>
                </Box>
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
                <Button
                    fullWidth
                    type='submit'
                    variant='contained'
                    sx={{mt: '1rem'}}
                    color={success ? "success" : "primary"}
                >
                    {success ? "Saved!" : "Save"}
                </Button>
            </form>
            <ChooseAvatar
                openDialog={openAvatarDialog}
                setOpenDialog={setOpenAvatarDialog}
                clickAvatarHandler={avatarClickHandler}
            />
        </div>
    )
}
