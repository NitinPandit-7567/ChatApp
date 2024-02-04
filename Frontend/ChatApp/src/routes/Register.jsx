import Navbar from '../components/Navbar';
import TextField from '@mui/material/TextField';
import '../styles/register.css'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getTheme } from '../assets/theme'
import CssBaseline from '@mui/material/CssBaseline';
import { setUser, getUser } from '../auth/Auth'
import { useNavigate } from 'react-router-dom'
import { LoadData } from '../auth/IndexLoader'
export default function Register() {
    const [formData, setForm] = useState({ username: "", email: "", password: "", phone: "" })
    const navigate = useNavigate();
    function handleChange(evt) {
        const field = evt.target.id;
        const value = evt.target.value;
        console.log({ ...formData, [field]: value })
        setForm(cd => { return { ...cd, [field]: value } })
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const data = { username: formData.username, email: formData.email, password: formData.password, contact: formData.phone };
        console.log('Submitted: ', data)
        const resgisterResponse = await fetch('http://localhost:3000/users/new', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        const res = await resgisterResponse.json();
        console.log(res)
        if (res.session_id) {
            setUser(res.session_id)
            return navigate('/')
        }

    }
    const [mode, setMode] = useState(getTheme())
    const theme = createTheme({
        palette: {
            mode: mode,
        },
    });
    return (<>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar mode={setMode} />
            <div className="main">
                <div className='register'>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <TextField id="username" label="Username" variant="outlined" fullWidth value={formData.username} onChange={handleChange} />
                        <br></br>
                        <br></br>
                        <TextField fullWidth id="password" label="Password" type="password" variant="outlined" value={formData.password} onChange={handleChange} />
                        <br></br>
                        <br></br>
                        <TextField id="email" label="Email" variant="outlined" fullWidth type="email" value={formData.email} onChange={handleChange} />
                        <br></br>
                        <br></br>
                        <TextField id="phone" label="Phone" variant="outlined" fullWidth type="number" value={formData.phone} onChange={handleChange} />
                        <br></br>
                        <br></br>
                        <Button variant="contained" color="primary" type="submit">Register</Button>
                    </form>
                </div>
            </div>
        </ThemeProvider>
    </>)
}