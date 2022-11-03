import * as React from 'react';
import {Grid, Container} from '@mui/material';
import {AddRounded} from '@mui/icons-material'
import ClickableAvatar from "./ClickableAvatar";
import {useEffect, useState} from "react";


export default function Home() {

    const [games, setGames] = useState([])
    const [gameId, setGameId] = useState(1)

    const addNewHandler = () => {
        setGames([...games, {'id': gameId, name: `Game ${gameId}`, avatar: `G${gameId}`}])
        setGameId(gameId + 1)
    }

    const beginGameHandler = () => {
        console.log('In begin game handler')
    }

    return (
        <Container maxWidth="md" style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <Grid container spacing={8}>
                <Grid item xs={3} md={2} key={0}>
                    <ClickableAvatar name='New Game' avatar={<AddRounded/>} sx={{
                        width: '56px', height: '56px'
                    }} click_handler={addNewHandler}/>
                </Grid>
                {
                    games.map(game => {
                        return (
                            <Grid item container xs={3} md={2} key={game.id}>
                                <ClickableAvatar name={game.name} avatar={game.avatar} sx={{
                                    width: '56px', height: '56px', bgcolor: '#9575cd'
                                }} click_handler={beginGameHandler}/>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </Container>
    );
}
