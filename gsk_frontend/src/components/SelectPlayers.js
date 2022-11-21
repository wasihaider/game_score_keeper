import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import {Button, Checkbox, Typography} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


export default function MultipleSelectChip({players, whoIsPlaying, setWhoIsPlaying, handleSubmit}) {

    const handleSelect = (event) => {
        const {
            target: {value},
        } = event;
        setWhoIsPlaying(value);
    };

    return (
        <Box sx={{flexGrow: 1, margin: 'auto', textAlign: 'center'}}>
            <Typography variant='h4' sx={{mb: 1}}>Who's playing?</Typography>
            <FormControl sx={{m: 1, minWidth: 300}}>
                <InputLabel id='select-label' color='secondary'>Select Players</InputLabel>
                <Select
                    variant='outlined'
                    color='secondary'
                    labelId='select-label'
                    id='select-players'
                    multiple
                    fullWidth
                    value={whoIsPlaying}
                    onChange={handleSelect}
                    input={<OutlinedInput label="Tag"/>}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map(({id, name, color, avatar}) => (
                                <Chip color='secondary' variant='outlined' sx={{ color: color }} key={id} label={name}/>
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {
                        players.map((player) => (
                            <MenuItem key={player.id} value={player} >
                                <Checkbox sx={{
                                    '&.Mui-checked': {
                                        color: player.color,
                                    },
                                }} checked={whoIsPlaying.indexOf(player) > -1}/>
                                <ListItemText primary={player.name}/>
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <br/><br/>
            <Button variant='outlined' color='secondary' onClick={handleSubmit}>PLAY</Button>
        </Box>
    );
}