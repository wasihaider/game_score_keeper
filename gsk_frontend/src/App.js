import React, {Component} from 'react';
import {Routes, Route} from "react-router-dom";
import Home from './pages/home';
import Game from "./pages/Game";

class App extends Component {
    render() {
        return (
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path={'game'} element={<Game />} />
            </Routes>
        )
    }
}

export default App