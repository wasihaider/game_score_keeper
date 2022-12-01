import React, {useEffect, useState} from 'react';
import LazyLoad from "react-lazy-load";
import {AppBar, Avatar, Button, Grid, IconButton, Slide, Toolbar, Typography} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import CloseIcon from '@mui/icons-material/Close';
import {AVATAR_LIMIT, AVATAR_DIR_PATH} from "../constants";

const StyledDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialog-paper': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
    }
}))


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const generate_paths = () => {
    let images = []
    Array.from(Array(AVATAR_LIMIT), (e, i) => {
        images.push({name: i + 1, path: `${AVATAR_DIR_PATH}${i + 1}.png`})
    })
    return images
}

const images = generate_paths()


export default function ChooseAvatar({openDialog, setOpenDialog, clickAvatarHandler}) {

    useEffect(() => {
    }, [])

    const clickHandler = e => {
        console.log(e.currentTarget.attributes.dataid.value)
        clickAvatarHandler(e.currentTarget.attributes.dataid.value)
        setOpenDialog(false)
    }

    return (
        <div>
            <StyledDialog
                open={openDialog}
                fullScreen
                TransitionComponent={Transition}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle>
                    <AppBar sx={{position: 'relative'}}>
                        <Toolbar>
                            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                                Choose Avatar
                            </Typography>
                            <IconButton
                                color="inherit"
                                onClick={() => setOpenDialog(false)}
                                aria-label="close"
                            >
                                <CloseIcon/>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} style={{display: 'flex', alignItems: 'center'}}>
                        {
                            images.map(({path, name}) => (
                                <Grid item xs={2} md={2} key={name}>
                                    <LazyLoad offset={300} height={96} width={96} threshold={0.95}>
                                        <IconButton onClick={clickHandler} dataid={name}>
                                            <Avatar src={path} sx={{width: 96, height: 96}}/>
                                        </IconButton>
                                    </LazyLoad>
                                </Grid>
                            ))
                        }
                    </Grid>
                </DialogContent>
            </StyledDialog>
        </div>

    )
}