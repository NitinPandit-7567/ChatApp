import { ThemeProvider, createTheme } from '@mui/material/styles';
export function setTheme(mode) {
    sessionStorage.setItem('set', true)
    sessionStorage.setItem('theme', mode)
    return sessionStorage.getItem('theme')

}

export function getTheme() {
    if (sessionStorage.getItem('set')) {
        return sessionStorage.getItem('theme')
    }
    else {
        setTheme('light')
        sessionStorage.setItem('set', true)
        return sessionStorage.getItem('theme')
    }
}