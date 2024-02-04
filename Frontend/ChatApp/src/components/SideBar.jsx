import { getUser } from '../auth/Auth';
import { getData, LoadData } from '../auth/IndexLoader'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import '../styles/sidebar.css'
import { showDate } from '../assets/convertDate'
export default function SideBar({ select, setSelect }) {
    const data = JSON.parse(getData());
    const isLoggedin = (getUser() !== 'false');
    const user = getUser();
    const navigate = useNavigate()
    let loaderData = false
    if (data && isLoggedin) {
        loaderData = data;
    }
    const [messages, setMessages] = useState(loaderData)
    useEffect(() => {
        async function setLoaderData() {
            if (isLoggedin) {
                return await LoadData();
            }
            else {
                return navigate('/Login')
            }
        }
        if (messages === false) {
            setMessages(async (data) => {
                return data = await setLoaderData()
            })
        }
        setLoaderData();
        console.log("Loaded Data again!")
    }, [])
    // let currentDate = new Date();
    // if (messages) {
    //     for (let i of messages) {
    //         i.date = new Date(i.date)
    //         let result = (currentDate - i.date) / (1000 * 60 * 60 * 24);
    //         if (Math.floor(result) === 1 || (currentDate.getDate() - i.date.getDate()) === 1) {
    //             i.PrintDate = 'Yesterday'
    //         }
    //         else if ((currentDate.getDate() - i.date.getDate()) === 0) {
    //             // i.PrintDate = '';
    //             i.PrintDate = `${i.date.getHours()}:${i.date.getMinutes()} ${i.date.getHours() >= 12 ? 'PM' : 'AM'}`;
    //         }
    //         else {
    //             i.PrintDate = `${i.date.getDate()}/${i.date.getMonth() + 1}/${i.date.getFullYear()}`;
    //         }
    //     }
    // }
    if (messages) {
        for (let i of messages) {
            i.PrintDate = showDate(i.date)
        }
    }
    async function handleClick(evt) {
        if (select) {
            const el = document.getElementById(select.messages._id);
            if (el) {
                el.classList.toggle('selected')
            }
        }
        const el = document.getElementById(evt.target.id);
        if (el && el.tagName === 'DIV') {
            el.classList.toggle('selected')
            const messagesResponse = await fetch(`http://localhost:3000/messages/${evt.target.id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const messages = await messagesResponse.json();
            console.log('Messages: ', messages)
            return setSelect(selection => {
                return { ...messages }

            })
        } else {
            return setSelect(selection => { return false })
        }
    }

    return (<div className='sidebar'> <h1>Chats</h1>{isLoggedin && messages.map((el, i) => {
        return (
            <div key={el.message_id} className="messageCard" id={el.message_id} onClick={handleClick} >
                <div className='profilePicDiv' key={el.user_id}>
                    {/* <PersonIcon /> */}
                    <img className="profilePic" src="src/logos/default_profile.png" alt="" />
                </div>
                <div className="info" onClick={() => { console.log('clicked') }}>
                    <h3>{el.username} <span className="date">{el.PrintDate}</span></h3>
                    <p>{el.sender === user ? `You: ${el.message}` : el.message} {el.unseen > 0 && <span className="notificationCount">{el.unseen}</span>}</p>
                    <br></br>
                    {/* <span>{`${el.date.getHours()}:${el.date.getMinutes()} ${el.date.getHours() >= 12 ? 'PM' : 'AM'}`}</span> */}
                </div>
            </div>
        )
    })}
    </div >)
}