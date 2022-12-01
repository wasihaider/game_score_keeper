import * as React from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom'
import {Grid, IconButton, Avatar} from '@mui/material';
import {AddRounded} from '@mui/icons-material'
import ClickableAvatar from "../components/ClickableAvatar";
import {useEffect, useState} from "react";
import {AVATAR_DIR_PATH, BASE_API_URL, GAME_ENDPOINT, PLAYER_LIST_ENDPOINT} from "../constants";
import {randomColor} from "../utils";
import PlayerForm from "./PlayerForm";


export default function Players() {
    const {gameId} = useParams()

    const [players, setPlayers] = useState([])
    const [openDialogue, setOpenDialogue] = React.useState(false);
    const [playerName, setPlayerName] = useState("")
    const [playerColor, setPlayerColor] = useState(randomColor())
    const [playerAvatar, setPlayerAvatar] = useState('')
    const navigate = useNavigate()

    const handleClickOpen = () => setOpenDialogue(true);
    const handleCancel = () => setOpenDialogue(false);
    const handlePlayerNameInput = (e) => setPlayerName(e.target.value)

    const handleClickPlayer = e => {
        const data_id = e.currentTarget.attributes.dataid.value
        navigate(`/player/${data_id}`)
    }

    const handleClickNewPlayer = () => {
        const player_data = {
            name: playerName,
            color: playerColor,
            avatar: playerAvatar
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
                console.log(res.data)
            })
            .catch(e => {
                console.log(e)
            })
    }, [])

    return (
        <div className='center-container'>
            <Grid container spacing={8}
                  className={players.length <= 5 ? 'center-grid-container' : 'left-grid-container'}>
                <Grid item xs={3} md={2} key={0} sx={{my: 2}} className={'no-padding-grid-item'}>
                    <ClickableAvatar name='New Player' avatar={<AddRounded sx={{
                        width: 84, height: 84
                    }}/>} click_handler={handleClickOpen} sx={{
                        width: '96px', height: '96px'
                    }} isPlayer={true}/>
                </Grid>
                <PlayerForm handle_cancel={handleCancel} openDialog={openDialogue}
                            handleName={handlePlayerNameInput} handle_add={handleClickNewPlayer}
                            playerColor={playerColor} handleAvatar={avatar => setPlayerAvatar(avatar)}
                            handleColorOnChange={
                    color => setPlayerColor(color)
                }/>
                {
                    players.map(player => {
                        return (
                            <Grid item container xs={3} md={2} sx={{my: 2}} key={player.id}
                                  className={'no-padding-grid-item'}>
                                <Grid container direction='column' style={{display: 'flex', alignItems: 'center'}}>
                                    <IconButton onClick={handleClickPlayer} dataid={player.id}>
                                        <Avatar
                                            alt={player.name}
                                            src={`${AVATAR_DIR_PATH}${player.avatar}.png`}
                                            sx={{width: 96, height: 96}}
                                        />
                                    </IconButton>
                                    <span style={{ fontSize: 18 }}>{player.name}</span>
                                </Grid>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
    );
}
