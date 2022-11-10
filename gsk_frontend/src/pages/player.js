import React from 'react';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ResponsiveDrawer from "../components/ResponsiveDrawer";
import PollIcon from '@mui/icons-material/Poll';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function Player() {
    const pages = [
        {icon: <PollIcon/>, label: 'Stats', path: 'stats'},
        {icon: <ManageAccountsIcon/>, label: 'Details', path: 'details'},
        {icon: <ArrowBackIosNewIcon/>, label: 'Go Back', path: `/game/${localStorage.getItem('gameId')}`},
    ];
    return <ResponsiveDrawer pages={pages}/>
}