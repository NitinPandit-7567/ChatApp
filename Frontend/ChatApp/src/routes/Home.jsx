import Navbar from "../components/Navbar";
import { getTheme } from '../assets/theme'
import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { dark } from "@mui/material/styles/createPalette";
import CssBaseline from '@mui/material/CssBaseline';
import { getUser } from '../auth/Auth'
import io from "socket.io-client";
export default function Home() {
    const [mode, setMode] = useState(getTheme())
    const theme = createTheme({
        palette: {
            mode: mode,
        },
    });
    const [login, setLogin] = useState((getUser() !== 'false'))
    useEffect(() => {
        setLogin(data => {
            return data = (getUser() !== 'false')
        })
    })
    var socket = io('http://localhost:3000', {
        withCredentials: true
    });
    socket.emit('chat message', 'Hello There');
    return (<>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar mode={setMode} />
            {login ? <div>You're Logged in !!!</div> :
                <div>
                    <h1>Hello World!!</h1>
                </div>
            }
        </ThemeProvider>
    </>)
}