import React, {Component} from 'react';
import {Routes, Route} from "react-router-dom";
import Home from './pages/home';
import Game from "./pages/Game";
import Players from './components/Players'
import Matches from "./components/Matches";
import Stats from "./components/Stats"
import PlayerDetails from "./components/PlayerDetails";
import PlayerStats from "./components/PlayerStats";
import Player from "./pages/player";
import Match from "./pages/Match";
import Records from "./components/Records";


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
                    <Route path='records' element={<Records />} />
                </Route>
                <Route path='player/:playerId' element={<Player />}>
                    <Route index element={<PlayerStats />} />
                    <Route path='details' element={<PlayerDetails />} />
                    <Route path='stats' element={<PlayerStats />} />
                </Route>
                <Route path='newMatch' element={<Match />} />
            </Routes>
        )
    }
}

export default App