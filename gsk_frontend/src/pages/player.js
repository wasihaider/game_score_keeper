import React from 'react';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ResponsiveDrawer from "../components/ResponsiveDrawer";
import PollIcon from '@mui/icons-material/Poll';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


const pages = [
    {icon: <ManageAccountsIcon/>, label: 'Details', path: 'players'},
    {icon: <PollIcon/>, label: 'Stats', path: 'matches'},
    {icon: <ArrowBackIosNewIcon/>, label: 'Go Back', path: 'stats'},
];

export default function Game(props) {
    const {top_details} = props
    return <ResponsiveDrawer pages={pages} top_details={top_details}/>
}