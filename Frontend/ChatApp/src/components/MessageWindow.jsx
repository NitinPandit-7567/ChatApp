import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react'
import '../styles/messageWindow.css'
import FormControl from '@mui/material/FormControl';
import SendIcon from '@mui/icons-material/Send';
import { getUser } from '../auth/Auth'
import { showTime, notificationDate } from '../assets/convertDate'
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
export default function MessageWindow({ select }) {
    const [message, setMessage] = useState(select)
    useEffect(() => {
        return setMessage(data => { return select })
    }, [select])
    let data = ''
    let dataArray = [];
    if (message) {
        const sender = message.sender.username;
        const sender_id = message.sender._id;
        const receiver = message.receiver.username;
        const receiver_id = message.receiver._id;
        const messages = message.messages;
        if (messages) {
            data = { sender, sender_id, receiver, receiver_id, messages }
            for (let i of data.messages.messages) {
                if (i.message) {
                    i.message.time = showTime(i.message.timestamp);
                } else {
                    i.notification.time
                }
            }
        }
        else {
            const sender = message.sender.username;
            const sender_id = message.sender._id;
            const receiver = message.receiver.username;
            const receiver_id = message.receiver._id;
            data = { sender, sender_id, receiver, receiver_id }
        }
        dataArray = (data.messages.messages)
    }
    else {
        data = { sender: '', sender_id: '', receiver: '', receiver_id: '', messages: { messages: [] } }
    }
    // console.log('HERE: ', data.messages.messages)
    // console.log('Data Array: ', dataArray)
    let user = getUser();
    let tempDate = false;
    if (dataArray.length > 0) {
        if (dataArray[0].notification) {
            tempDate = notificationDate(dataArray[0].notification.timestamp);
        }
    }
    let notificationDay = false;
    return (<>
        <div className="messageWindow">
            <div className="title">
                <h2>{data.receiver}</h2>
            </div>
            <div className="messageBox">
                {dataArray.map((el, i) => {
                    if (i !== 0 && el.message) {
                        let temp = notificationDate(el.message.timestamp);
                        if (temp !== tempDate) {
                            console.log('Here')
                            notificationDay = <div key={'Day' + temp} className='notification'>{temp}</div>
                            console.log(notificationDay)
                        }
                        else {
                            notificationDay = false;
                        }
                    } else {
                        if (tempDate) {
                            notificationDay = <div key={'Day' + tempDate} className='notification'>{tempDate}</div>
                        }
                    }
                    if (el.notification) {
                        return <>{notificationDay ? notificationDay : ''} <div key={el._id} className='notification'>{el.notification.message}</div></>
                    }
                    else if (el.message) {
                        tempDate = notificationDate(el.message.timestamp);
                        return <>{notificationDay ? notificationDay : ''}<div key={el._id} className={'text ' + `${el.message.sender === user ? 'you' : 'friend'}`}>{el.message.text} <div className="time">{el.message.time}  {el.message.sender === user ? (el.message.seen ? <DoneAllIcon fontSize='small' className="tick seen" /> : <DoneIcon fontSize='small' className="tick" />) : ''}</div></div></>
                    }
                })}
            </div>
            <div className="textBox">
                <form action="">
                    <FormControl fullWidth sx={{ m: 1 }} variant="filled">
                        {/* <InputLabel htmlFor="ChatBox">Amount</InputLabel> */}
                        <TextField
                            id="outlined-textarea"
                            // label="Message"
                            placeholder="Type here to send a message"
                            variant="standard"
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="send-message"
                                            // onClick={handleClickShowPassword}
                                            // onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                            }}
                        />
                    </FormControl>
                </form>
            </div>
        </div>
    </>)
}