import * as React from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import {Grid, Container} from '@mui/material';
import {AddRounded} from '@mui/icons-material'
import ClickableAvatar from "../components/ClickableAvatar";
import {useEffect, useState} from "react";
import {BASE_API_URL, GAME_ENDPOINT} from "../constants";
import CustomAppBar from "../components/CustomAppBar";
import GameFormDialogue from '../components/GameFormDialogue'


export default function Home() {

    const [games, setGames] = useState([])
    const [openDialogue, setOpenDialogue] = React.useState(false);
    const [gameName, setGameName] = useState("")
    const navigate = useNavigate()

    const handleClickOpen = () => setOpenDialogue(true);
    const handleCancel = () => setOpenDialogue(false);
    const handleGameInput = (e) => setGameName(e.target.value)

    const randomColor = () => {
        let hex = Math.floor(Math.random() * 0xFFFFFF);
        let color = "#" + hex.toString(16);

        return color;
    }

    const beginGameHandler = e => {
        const data_id = e.target.getAttribute('dataid')
        console.log('In begin game handler')
        navigate("game")
    }

    const handlerAddGame = () => {
        const game_data = {
            color: randomColor(),
            name: gameName
        }
        axios.post(`${BASE_API_URL}${GAME_ENDPOINT}`, game_data)
            .then(res => setGames([...games, res.data]))
            .catch(e => console.log(e))
        setOpenDialogue(false);
    }

    useEffect(() => {
        axios.get(`${BASE_API_URL}${GAME_ENDPOINT}`)
            .then(res => {
                setGames(res.data)
            })
            .catch(e => {
                console.log(e)
            })
    }, [])

    return (
        <>
            <CustomAppBar/>
            <div className='center-container'>
                <Grid container spacing={8}
                      className={games.length <= 5 ? 'center-grid-container' : 'left-grid-container'}>
                    <Grid item xs={3} md={2} key={0} className={'no-padding-grid-item'}>
                        <ClickableAvatar name='New Game' avatar={<AddRounded/>} click_handler={handleClickOpen} sx={{
                            width: '56px', height: '56px'
                        }}/>
                    </Grid>
                    <GameFormDialogue handle_open={handleClickOpen} handle_cancel={handleCancel} state={openDialogue}
                                      handle_game={handleGameInput} handle_add={handlerAddGame}/>
                    {
                        games.map(game => {
                            return (
                                <Grid item container xs={3} md={2} key={game.id} className={'no-padding-grid-item'}>
                                    <ClickableAvatar name={game.name} avatar={game.avatar} sx={{
                                        width: '56px', height: '56px', bgcolor: game.color
                                    }} click_handler={beginGameHandler} data_id={game.id}/>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </div>
        </>
    );
}
