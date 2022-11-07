import React, {useState} from "react";
import {AppBar, Toolbar, Typography, Menu, Box, IconButton, MenuItem, Button, Tooltip, Avatar} from "@mui/material";
import {VideogameAsset, MenuOutlined} from '@mui/icons-material';
import MenuIcon from "@mui/icons-material/Menu";

export default function CustomAppBar(props, theme) {
    const {drawer, drawer_handler, custom_sx} = props

    return (
        <AppBar position='absolute' sx={drawer ? {maxHeight: '20vh', ...custom_sx} : {maxHeight: '20vh'}}>
            <Toolbar variant={'dense'}>
                {
                    drawer && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={drawer_handler}
                            sx={{mr: 2, display: {sm: 'none'}}}
                        >
                            <MenuIcon/>
                        </IconButton>
                    )
                }
                <VideogameAsset sx={{display: 'flex', mr: 1}}/>
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                        mr: 2,
                        display: 'flex',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.2rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    GAME SCORE KEEPER
                </Typography>
            </Toolbar>
        </AppBar>
    )
}