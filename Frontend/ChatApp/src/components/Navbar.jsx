import { useState, useEffect } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import '../styles/navbar.css'
import { nativeSelectClasses } from '@mui/material';
import { getTheme, setTheme } from '../assets/theme'
import ThemeSwitch from './ThemeSwitch';
import Badge from '@mui/material/Badge';
import { setUser, getUser } from '../auth/Auth'
import { useNavigate, useLocation } from 'react-router-dom';
import { getData } from '../auth/IndexLoader'
export default function Navbar({ mode }) {
    const [collapse, setCollapse] = useState(false)
    const location = useLocation();
    const isLoggedin = getUser()
    const messageData = JSON.parse(getData());
    let count = 0;
    if (messageData !== undefined && messageData) {
        // console.log(messageData)
        for (let i of messageData) {
            count += i.unseen;
        }
    }
    else {
        count = false
    }
    const [messageBadge, setMessageBadge] = useState(count)
    const navigate = useNavigate();
    const navlinks = [
        <Button href="/">Home</Button>,
        <Button href="/Messages"><Badge badgeContent={messageBadge} color="primary" invisible={!messageBadge && true} >Messages</Badge></Button>,
        <Button href="#text-buttons">Friends</Button>,
        <Button href="#text-buttons">About</Button>
    ];
    useEffect(() => {
        if (window.visualViewport.width < 800) {
            let col = document.querySelector('.navs');
            col.classList.toggle('collapse')
            setCollapse(current => { return current = true })
        }
    }, [])
    window.addEventListener('resize', function (event) {
        if (window.visualViewport.width < 800) {
            let col = document.querySelector('.navs');
            col.classList.toggle('collapse')
            setCollapse(current => { return current = true })
        }
        else {
            setCollapse(current => { return current = false })
        }
    }, true);
    const checker = getTheme()
    function handleTheme(e) {
        if (e.target.checked) {
            setTheme('dark')
            return mode(currentMode => { return getTheme() })
        }
        else {
            setTheme('light')
            return mode(currentMode => { return getTheme() })
        }
    }
    function collapser(evt) {
        let col = document.querySelector('.navs');
        col.classList.toggle('collapse')
    }
    async function handleLogout(e) {
        const user = getUser();
        if (user) {
            setUser('');
            const logoutResponse = await fetch('http://localhost:3000/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
            })
            if (logoutResponse) {
                const logout = await logoutResponse.json();
                sessionStorage.removeItem('index_data')
                setUser(false);
                window.location.reload(false)
                return navigate('/')
            }
        }
    }
    return (<>
        <nav className="navbar">
            <img src="src/logos/ChatApp.png" alt="App_Logo" />
            {collapse && <MenuIcon fontSize="large" className="collapser" onClick={collapser} />}
            <div className='navs'>
                <div className="navLinks">
                    <ul>
                        {navlinks.map((el, i) => { return <li key={'Navbar' + i}>{el}</li> })}
                    </ul>
                </div>
                <div className="userButtons">
                    <ThemeSwitch changeHandler={handleTheme} checker={checker} />
                    {isLoggedin === 'false' && location.pathname != '/Register' ? <Button variant="contained" color="primary" href="/Register">Register</Button> : null}
                    {isLoggedin === 'false' && location.pathname != '/Login' ? <Button variant="contained" color="success" href="/Login">Login</Button> : null}
                    {isLoggedin !== 'false' ? <Button variant="contained" color="warning" onClick={handleLogout}>Logout</Button> : null}
                </div>
            </div>
        </nav >
    </>)
}