import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {styled} from "@mui/material/styles";

const StyledDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialog-paper': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
    }
}))

export default function ScoreDialog({state, handleCancel, handleAdd, dialogTitle, players, handleScoreChange}) {
    return (
        <div>
            <StyledDialog open={state} onClose={handleCancel}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    {
                        players.map(player => (
                            <TextField
                                key={player.id}
                                focused={true}
                                margin="dense"
                                sx={{m: 2}}
                                id={player.id.toString()}
                                label={player.name}
                                variant="outlined"
                                color="secondary"
                                onChange={event => handleScoreChange(player.id, event)}
                            />
                        ))
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color='secondary'>Cancel</Button>
                    <Button onClick={handleAdd} color='secondary'>Add</Button>
                </DialogActions>
            </StyledDialog>
        </div>
    );
}
