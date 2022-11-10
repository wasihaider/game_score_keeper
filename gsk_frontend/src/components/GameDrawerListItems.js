import * as React from 'react';
import {Link} from 'react-router-dom'
import Box from '@mui/material/Box';
import {styled, ThemeProvider, createTheme} from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import {SportsEsports} from '@mui/icons-material'
import {useState} from "react";

const FireNav = styled(List)({
    '& .MuiListItemButton-root': {
        paddingLeft: 24,
        paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: 16,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 20,
    },
});

export default function GameDrawerListItems(props) {
    const {pages} = props
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleListItemClick = (e, index) => setSelectedIndex(index);

    return (
        <Box sx={{display: 'flex'}}>
            <ThemeProvider
                theme={createTheme({
                    components: {
                        MuiListItemButton: {
                            defaultProps: {
                                disableTouchRipple: true,
                            },
                            justifyContent: 'center'
                        },
                    },
                    palette: {
                        mode: 'dark',
                        background: {paper: 'inherit'},
                    },
                })}
            >
                <Paper elevation={0} sx={{minWidth: 230}}>
                    <FireNav component="nav" disablePadding>
                        <ListItemButton component="a" href="/">
                            <ListItemIcon sx={{fontSize: 54}}><SportsEsports style={{fontSize: 24}}/></ListItemIcon>
                            <ListItemText
                                sx={{my: 0}}
                                primary="GSK"
                                primaryTypographyProps={{
                                    fontSize: 20,
                                    fontWeight: 'medium',
                                    letterSpacing: 4,
                                }}
                            />
                        </ListItemButton>
                        <Divider/>
                        <Box>
                            {
                                pages.map((item, index) => (
                                    <Link to={item.path} key={index} style={{textDecoration: "none", color: 'inherit'}}>
                                        <ListItemButton
                                            sx={{py: 0, minHeight: 56, color: 'inherit'}}
                                            selected={selectedIndex === index}
                                            onClick={(event) => handleListItemClick(event, index)}
                                        >
                                            <ListItemIcon sx={{color: 'inherit'}}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.label}
                                                primaryTypographyProps={{fontSize: 14, fontWeight: 'medium'}}
                                            />
                                        </ListItemButton>
                                    </Link>
                                ))}
                        </Box>
                    </FireNav>
                </Paper>
            </ThemeProvider>
        </Box>
    );
}
