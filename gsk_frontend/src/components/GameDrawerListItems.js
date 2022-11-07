import * as React from 'react';
import Box from '@mui/material/Box';
import {styled, ThemeProvider, createTheme} from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import People from '@mui/icons-material/People';
import {Scoreboard, Poll, SportsEsports} from '@mui/icons-material'
import {useState} from "react";

const data = [
    {icon: <People/>, label: 'Players'},
    {icon: <Scoreboard/>, label: 'Matches'},
    {icon: <Poll/>, label: 'Stats'},
];

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

export default function GameDrawerListItems() {
    const [selectedIndex, setSelectedIndex] = useState(1);

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
                                data.map((item, index) => (
                                    <ListItemButton
                                        key={item.label}
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
                                ))}
                        </Box>
                    </FireNav>
                </Paper>
            </ThemeProvider>
        </Box>
    );
}


// import React from "react";
//
// import List from '@mui/material/List'
// import {ListItemIcon} from "@mui/material";
// import {ListItemText} from "@mui/material";
// import Divider from '@mui/material/Divider'
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import DraftsIcon from '@mui/icons-material/Drafts'
// import ListItemButton from "@mui/material/ListItemButton";
//
// export default function GameDrawerListItems() {
//   const [selectedIndex, setSelectedIndex] = React.useState(1);
//
//   const handleListItemClick = (event, index) => {
//     setSelectedIndex(index);
//   };
//
//   return (
//     <div style={{
//       "&$selected": {
//       backgroundColor: "red",
//       color: "white",
//       "& .MuiListItemIcon-root": {
//         color: "white"
//       }
//     },
//     "&$selected:hover": {
//       backgroundColor: "purple",
//       color: "white",
//       "& .MuiListItemIcon-root": {
//         color: "white"
//       }
//     },
//     "&:hover": {
//       backgroundColor: "blue",
//       color: "white",
//       "& .MuiListItemIcon-root": {
//         color: "white"
//       }
//     }
//     }}>
//       <List component="nav" aria-label="main mailbox folders">
//         <ListItemButton
//           button
//           selected={selectedIndex === 0}
//           onClick={(event) => handleListItemClick(event, 0)}
//         >
//           <ListItemIcon>
//             <InboxIcon />
//           </ListItemIcon>
//           <ListItemText primary="Inbox" />
//         </ListItemButton>
//         <ListItemButton
//           button
//           selected={selectedIndex === 1}
//           onClick={(event) => handleListItemClick(event, 1)}
//         >
//           <ListItemIcon>
//             <DraftsIcon />
//           </ListItemIcon>
//           <ListItemText primary="Drafts" />
//         </ListItemButton>
//       </List>
//       <Divider />
//       <List component="nav" aria-label="secondary mailbox folder">
//         <ListItemButton
//           button
//           selected={selectedIndex === 2}
//           onClick={(event) => handleListItemClick(event, 2)}
//         >
//           <ListItemText primary="Trash" />
//         </ListItemButton>
//         <ListItemButton
//           button
//           selected={selectedIndex === 3}
//           onClick={(event) => handleListItemClick(event, 3)}
//         >
//           <ListItemText primary="Spam" />
//         </ListItemButton>
//       </List>
//     </div>
//   );
// }