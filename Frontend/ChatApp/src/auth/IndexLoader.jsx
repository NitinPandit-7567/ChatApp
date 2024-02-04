
export async function LoadData() {
    const loadMessages = await fetch('http://localhost:3000/messages/index', {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        }
    })
    const load = await loadMessages.json();
    console.log('LoadMessages')
    setData(load)
    return getData()
}
export function setData(data) {
    if (data) {
        return sessionStorage.setItem('index_data', JSON.stringify(data))
    }
    else {

        return false;
    }
}

export function getData() {
    const data = sessionStorage.getItem('index_data');
    if (data) {
        return data;
    }
    else {
        return false;
    }
}