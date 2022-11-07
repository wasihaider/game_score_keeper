import * as React from 'react';
import {useNavigate} from 'react-router-dom'
import {Grid, Container} from '@mui/material';
import {AddRounded} from '@mui/icons-material'
import ClickableAvatar from "../components/ClickableAvatar";
import {useEffect, useState} from "react";
import {BASE_API_URL, GAME_ENDPOINT} from "../constants";
import CustomAppBar from "../components/CustomAppBar";
import App from "../App";


export default function Home() {

    const [games, setGames] = useState([])
    const [gameId, setGameId] = useState(1)
    const navigate = useNavigate()

    const randomColor = () => {
        let hex = Math.floor(Math.random() * 0xFFFFFF);
        let color = "#" + hex.toString(16);

        return color;
    }

    const addNewHandler = () => {
        setGames([...games, {'id': gameId, name: `Game ${gameId}`, avatar: `G${gameId}`, color: randomColor()}])
        setGameId(gameId + 1)
    }

    const beginGameHandler = e => {
        const data_id = e.target.getAttribute('dataid')
        console.log('In begin game handler')
        navigate("game")
    }

    return (
        <>
            <CustomAppBar/>
            <div className='center-container'>
                <Grid container spacing={8}
                      className={games.length <= 5 ? 'center-grid-container' : 'left-grid-container'}>
                    <Grid item xs={3} md={2} key={0} className={'no-padding-grid-item'}>
                        <ClickableAvatar name='New Game' avatar={<AddRounded/>} click_handler={addNewHandler} sx={{
                            width: '56px', height: '56px'
                        }}/>
                    </Grid>
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
