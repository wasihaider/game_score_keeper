import React, {useEffect, useState} from 'react';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {Button, Fab} from "@mui/material";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


export default function MatchLeaderBoard({results}) {

    const navigate = useNavigate()

    return (
        <>
            <Box sx={{'& > :not(style)': {m: 1}}}>
                <Fab color="secondary" variant='extended' aria-label="add" onClick={() => navigate(-1)}>
                    <ArrowBackIosNewIcon sx={{ mr: 1 }}/>
                    Go Back
                </Fab>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Position</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            results.map(result => (
                                <TableRow key={result.position} sx={{
                                    '.MuiTableRow-hover': {color: result.color}
                                }} hover={true}>
                                    <TableCell sx={{borderBottom: 'none'}}>{result.position}</TableCell>
                                    <TableCell sx={{borderBottom: 'none'}}>{result.name}</TableCell>
                                    <TableCell sx={{borderBottom: 'none'}}>{result.score}</TableCell>
                                    <TableCell sx={{borderBottom: 'none'}}>{
                                        Math.round((result.points + Number.EPSILON) * 100) / 100
                                    }</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}