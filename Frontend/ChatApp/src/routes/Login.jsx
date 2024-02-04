import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import TextField from '@mui/material/TextField';
import '../styles/login.css'
import { useState } from 'react'
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getTheme } from '../assets/theme'
import CssBaseline from '@mui/material/CssBaseline';
import { setUser } from '../auth/Auth'
import { LoadData } from '../auth/IndexLoader'
export default function Login() {
    const navigate = useNavigate();
    const [formData, setForm] = useState({ username: "", password: "" })
    const [error, setError] = useState(false);
    const helperText = 'Incorrect username/password'
    function handleChange(evt) {
        const field = evt.target.id;
        const value = evt.target.value;
        setForm(cd => { return { ...cd, [field]: value } })
    }
    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Submitted: ', formData)
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        })
        const res = await response.json();
        if (res.status === 'error') {
            setError(err => { return true })
        } else {
            setError(err => { return false })
            setUser(res.session_id)
            await LoadData()
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
                <div className='login'>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <TextField id="username" label="Username" variant="outlined" fullWidth value={formData.username} onChange={handleChange} error={error} helperText={error ? helperText : ''} />
                        <br></br>
                        <br></br>
                        <TextField fullWidth id="password" label="Password" type="password" variant="outlined" value={formData.password} onChange={handleChange} error={error} helperText={error ? helperText : ''} />
                        <br></br>
                        <br></br>
                        <Button variant="contained" color="success" type="submit">Login</Button>
                    </form>
                </div>
            </div>
        </ThemeProvider>
    </>)
}