import React, {Component} from 'react';
import {Routes, Route} from "react-router-dom";
import Home from './pages/home';
import Game from "./pages/Game";
import Players from './components/Players'
import Matches from "./components/Matches";
import Stats from "./components/Stats"
import PlayerDetails from "./pages/player";


class App extends Component {
    render() {
        return (
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path={'game/:gameId'} element={<Game />}>
                    <Route index element={<Players />} />
                    <Route path='players' element={<Players />}/>
                    <Route path='matches' element={<Matches />}/>
                    <Route path='stats' element={<Stats />}/>
                </Route>
                <Route path='player/:playerId' element={<PlayerDetails />} />
            </Routes>
        )
    }
}

export default App