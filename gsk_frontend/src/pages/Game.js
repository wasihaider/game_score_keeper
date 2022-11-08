import React from 'react';

import People from '@mui/icons-material/People';
import {Scoreboard, Poll} from '@mui/icons-material'
import ResponsiveDrawer from "../components/ResponsiveDrawer";


const pages = [
    {icon: <People/>, label: 'Players', path: 'players'},
    {icon: <Scoreboard/>, label: 'Matches', path: 'matches'},
    {icon: <Poll/>, label: 'Stats', path: 'stats'},
];

export default function Game() {
    return <ResponsiveDrawer pages={pages}/>
}