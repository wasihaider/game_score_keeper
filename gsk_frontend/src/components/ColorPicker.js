import React, {useCallback, useRef, useState} from "react";
import {HexColorPicker} from "react-colorful";
import {InputAdornment} from "@mui/material";
import useClickOutside from "./useClickOutside";
import TextField from "@mui/material/TextField";

export default function ColorPicker({color, onChange}) {
    const popover = useRef();
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    useClickOutside(popover, close);

    return (
        <div className="picker">
            <TextField
                focused={true}
                margin="dense"
                id="color"
                label="Avatar Color"
                fullWidth
                variant="outlined"
                color="secondary"
                value={color}
                onChange={e => onChange(e.target.value)}
                sx={{mt: '1rem'}}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <div
                                className="swatch"
                                style={{backgroundColor: color}}
                                onClick={() => toggle(true)}
                            />
                        </InputAdornment>
                    ),
                }}
            />

            {isOpen && (
                <div className="popover" ref={popover}>
                    <HexColorPicker color={color} onChange={onChange}/>
                </div>
            )}
        </div>
    );
}
;
