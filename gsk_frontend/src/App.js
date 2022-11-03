import React, {Component} from 'react';
import {Routes, Route} from "react-router-dom";
import Home from './components/home';
import {AppBar, Toolbar, Typography} from '@mui/material'

class App extends Component {
    render() {
        return (
            <>
                <AppBar position='static'>
                    <Toolbar variant='dense'>
                        <Typography variant="h6" color="inherit" component="div">
                            Game Score Keeper
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                </Routes>
            </>
        )
    }
}

export default App