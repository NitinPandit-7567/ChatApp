import Navbar from '../components/Navbar'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getTheme } from '../assets/theme'
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react'
import SideBar from '../components/SideBar';
import MessageWindow from '../components/MessageWindow';
import { getData } from '../auth/IndexLoader'
import { getUser } from '../auth/Auth'
import '../styles/newUser.css'
import { useNavigate } from 'react-router-dom';
export default function Messages() {
    const navigate = useNavigate()
    const [mode, setMode] = useState(getTheme())
    const [selected, setSelected] = useState(false)
    const theme = createTheme({
        palette: {
            mode: mode,
        },
    });
    const data = JSON.parse(getData());
    const isLoggedin = (JSON.parse(getUser() !== 'false'))
    useEffect(() => {
        if (!isLoggedin) {
            return navigate('/Login')
        }
    })
    return (<>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar mode={setMode} />
            {/* {isLoggedin ? console.log(isLoggedin) : handleNavigate} */}
            {data.length > 0 ?
                <div style={{ display: 'flex', postion: 'relative' }}>
                    <SideBar select={selected} setSelect={setSelected} />
                    <MessageWindow select={selected} />
                </div>
                : <div className='empty'>
                    <h1>Start a new conversation with your friends for a chat to appear here!</h1>
                </div>}
        </ThemeProvider >
    </>)
}