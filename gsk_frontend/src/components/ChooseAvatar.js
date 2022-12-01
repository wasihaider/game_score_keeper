import React, {useEffect, useState} from 'react';
import {Avatar, Grid, IconButton, Typography} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";

const StyledDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialog-paper': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
    }
}))


export default function ChooseAvatar({state, handleClick}) {

    const [images, setImages] = useState([])

    // useEffect(() => {
    //     const folder = '/avatars/'
    //     const fs = require('fs')
    //
    //     fs.readdir(folder, (err, files) => {
    //         files.forEach(file => {
    //             console.log(file)
    //         })
    //     })
    //
    // }, [])

    const clickHandler = e => {
        handleClick(e.currentTarget.attributes.dataid.value)
    }

    return (
        <div>
            <StyledDialog open={state}>
                <DialogTitle>Choose Avatar</DialogTitle>
                <DialogContent>
                    {
                        images.map(({path, name}) => (
                            <Grid container spacing={8} style={{display: 'flex', alignItems: 'center'}}>
                                <Grid item xs={1} md={1}>
                                    <IconButton onClick={clickHandler} dataid={name}>
                                        <Avatar src={path} sx={{ width: 56, height: 56 }}/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))
                    }
                </DialogContent>
            </StyledDialog>
        </div>

    )
}