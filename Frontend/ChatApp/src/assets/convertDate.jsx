const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export function showDate(date) {
    const currentDate = new Date();
    const d = new Date(date)
    const result = (currentDate - d) / (1000 * 60 * 60 * 24);
    if (Math.floor(result) === 1 || (currentDate.getDate() - d.getDate()) === 1) {
        return 'Yesterday'
    }
    else if ((currentDate.getDate() - d.getDate()) === 0) {
        return `${d.getHours()}:${d.getMinutes()} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
    }
    else {
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }
}

export function showTime(date) {
    const time = new Date(date)
    const minutes = time.getMinutes();
    const hours = time.getHours();
    const ToD = hours >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ToD}`
}

export function notificationDate(date) {
    const currentDate = new Date();
    const d = new Date(date)
    const result = (currentDate - d) / (1000 * 60 * 60 * 24);
    if ((currentDate.getDate() - d.getDate()) === 0) {
        console.log('RESULT: ', 'Today');
        return 'Today'
    }
    else if (Math.floor(result) === 1 || (currentDate.getDate() - d.getDate()) === 1) {
        console.log('RESULT: ', 'Yesterday');
        return 'Yesterday'
    }
    else if ((currentDate.getDate() - d.getDate()) <= 7) {
        console.log('RESULT: ', day[(currentDate.getDate() - d.getDate())]);
        return day[(currentDate.getDate() - d.getDate())]
    }
    else if (currentDate.getFullYear() - d.getFullYear() === 0) {
        console.log('RESULT: ', `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`);
        return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    }
    // else {
    //     return 'Older...'
    // }
}