import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import {ThemeProvider, createTheme} from "@mui/material/styles";
import './index.css';
import App from './App';
import {CssBaseline} from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#7b1fa2'
        },
        secondary: {
            main: '#9575cd'
        },
        background: {
            default: '#00030e',
        },
        error: {
            main: '#ff1744',
        },
        info: {
            main: '#546e7a',
        },
        text: {
            primary: "#ffffff",
            secondary: 'rgba(255, 255, 255, 0.7)'
        }
    },
    spacing: 8,
    shape: {
        borderRadius: 4,
    },
    props: {
        MuiTooltip: {
            arrow: true,
        },
    },
});

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
