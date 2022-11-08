import React from 'react';
import {Avatar, Grid, IconButton} from "@mui/material";

export default function ClickableAvatar(props) {
    const {isPlayer, click_handler, data_id, sx, avatar, name} = props
    return (
        <Grid container direction='column' style={{display: 'flex', alignItems: 'center'}}>
            <IconButton onClick={click_handler} dataid={data_id}>
                <Avatar variant={isPlayer ? "circular": "rounded"} sx={sx} dataid={data_id}>{avatar}</Avatar>
            </IconButton>
            <span>{name}</span>
        </Grid>
    )
}