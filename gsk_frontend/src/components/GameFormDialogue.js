import * as React from 'react';
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

export default function FormDialog(props) {
    const {state, handle_game, handle_cancel, handle_add} = props
    return (
        <div>
            <StyledDialog open={state} onClose={handle_cancel}>
                <DialogTitle>Add a new game</DialogTitle>
                <DialogContent>
                    <TextField
                        focused={true}
                        margin="dense"
                        id="name"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onChange={handle_game}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handle_cancel} color='secondary'>Cancel</Button>
                    <Button onClick={handle_add} color='secondary'>Add</Button>
                </DialogActions>
            </StyledDialog>
        </div>
    );
}
