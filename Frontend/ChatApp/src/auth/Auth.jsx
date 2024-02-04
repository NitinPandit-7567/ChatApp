export function setUser(user) {
    if (user !== false) {
        return sessionStorage.setItem('session_id', user)
    }
    else {
        return sessionStorage.setItem('session_id', false)
    }

}

export function getUser() {
    let user = sessionStorage.getItem('session_id');
    if (user) {
        return user;
    } else {
        return false;
    }
}