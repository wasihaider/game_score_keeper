import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {styled} from "@mui/material/styles";
import ColorPicker from "./ColorPicker";
import {useState} from "react";
import {Avatar, Box, IconButton} from "@mui/material";
import ChooseAvatar from "./ChooseAvatar";
import {AVATAR_DIR_PATH} from "../constants";

const StyledDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialog-paper': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
    }
}))

export default function PlayerForm({
                                       openDialog,
                                       handleName,
                                       handle_cancel,
                                       handle_add,
                                       playerColor,
                                       handleColorOnChange,
                                       handleAvatar
                                   }) {

    const [openAvatarDialog, setOpenAvatarDialog] = useState(false)
    const [avatarImage, setAvatarImage] = useState('')

    const avatarClickHandler = value => {
        setAvatarImage(`${AVATAR_DIR_PATH}${value}.png`)
        handleAvatar(value)
    }

    return (
        <div>
            <StyledDialog open={openDialog} onClose={handle_cancel}>
                <DialogTitle>Add new player</DialogTitle>
                <DialogContent>
                    <Box sx={{flexGrow: 1, m: 'auto', textAlign: 'center', mb: 2}}>
                        <IconButton onClick={() => setOpenAvatarDialog(true)}>
                            <Avatar src={avatarImage} sx={{height: 56, width: 56}}/>
                        </IconButton>
                    </Box>
                    <TextField
                        focused={true}
                        margin="dense"
                        id="name"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onChange={handleName}
                    />
                    <ColorPicker color={playerColor} onChange={handleColorOnChange}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handle_cancel} color='secondary'>Cancel</Button>
                    <Button onClick={handle_add} color='secondary'>Add</Button>
                </DialogActions>
            </StyledDialog>
            <ChooseAvatar
                openDialog={openAvatarDialog}
                setOpenDialog={setOpenAvatarDialog}
                clickAvatarHandler={avatarClickHandler}
            />
        </div>
    );
}
