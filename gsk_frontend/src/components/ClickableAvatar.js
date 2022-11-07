import React from 'react';
import {Avatar, Grid, IconButton} from "@mui/material";

export default function ClickableAvatar(props) {
    return (
        <Grid container direction='column' style={{display: 'flex', alignItems: 'center'}}>
            <IconButton onClick={props.click_handler} dataid={props.data_id}>
                <Avatar variant="rounded" sx={props.sx} dataid={props.data_id}>{props.avatar}</Avatar>
            </IconButton>
            <span>{props.name}</span>
        </Grid>
    )
}