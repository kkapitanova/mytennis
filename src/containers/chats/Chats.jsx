import React, { useState } from 'react';
import './Chats.scss';
import { sortData } from '../../utils/helpers';

// material
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';

const userID = '12345'
const test = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]
const testMessages = [
    {
        sent: new Date().getTime(), //6
        senderID: "12345",
        receiverID: "99999",
        message: "Tuesday at 8pm?"
    },
    {
        sent: new Date('12/11/2021 16:55:01').getTime(), //1
        senderID: "99999",
        receiverID: "12345",
        message: "Hi there!"
    },
    {
        sent: new Date('12/11/2021 16:54:32').getTime(), //2
        senderID: "12345",
        receiverID: "99999",
        message: "Hi"
    },
    {
        sent: new Date('12/11/2021 16:59:01').getTime(), //4
        senderID: "99999",
        receiverID: "12345",
        message: "Yeah sure!"
    },
    {
        sent: new Date('12/11/2021 16:55:58').getTime(), //3
        senderID: "12345",
        receiverID: "99999",
        message: "Do you want to play?"
    },
    {
        sent: new Date('12/11/2021 16:59:13').getTime(), //5
        senderID: "99999",
        receiverID: "12345",
        message: "When"
    },
]

const getTimeStamp = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const currentDate = new Date().getDate()

    let timestamp = ''

    if (year === new Date().getFullYear()) {
        if (currentDate == date.getDate()) { //timestamp for today in format of hours:minutes (12:34)
            timestamp = `${hours}:${minutes}`
        } else {
            timestamp = `${date.getDate()}/${month + 1}, ${hours}:${minutes}` //timestamp for current year in format of date/month, hours:minutes (12/3, 12:34)
        }
    } else { //timestamp for past years in format of date/month/year, hours:minutes (12/3, 12:34)
        timestamp = `${date.getDate()}/${month + 1}/${year}, ${hours === 0 ? "00" : hours}:${minutes === 0 ? "00" : minutes}`
    }

    return timestamp
}

const sort = (data) => {
    const sortedData = sortData(data, "sent", 'asc')

    const organizedData = sortedData.map(m => {
        return {...m, sent: new Date(m.sent)}
    })

    return organizedData
}

const Chats = () => {

    const [search, setSearch] = useState()
    const [message, setMessage] = useState()
    const [current, setCurrent] = useState({
        playerId: 1,
        firstName: 'Jane',
        familyName: 'Doe',
        gender: 'Female',
        nationCompetingFor: 'Bulgaria',
        dateOfBirth: 'November 13, 2000 03:24:00',
        chatMessages: [
            {
                sent: new Date(),
                senderID: "12345",
                receiverID: "99999",
                message: "Hi"
            },
            {
                sent: new Date(),
                senderID: "12345",
                receiverID: "99999",
                message: "Hi there!"
            }
        ]
    })

    const [chatMessages, setChatMessages] = useState(testMessages)

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value)
    }

    const handleClick = () => {
        alert("clicked")
    }

    const onKeyDown = (e) => {
        if (e.keyCode == 13 && e.target.value) { // check if message is not empty & enter has been clicked
            setChatMessages([
                ...chatMessages,
                {
                    sent: new Date().getTime(),
                    senderID: "12345",
                    receiverID: "99999",
                    message: e.target.value
                }
            ])
            setMessage('')
        }
    }

    const handleMessageSubmit = () => {
        if (message) { // check if message is not empty
            setChatMessages([
                ...chatMessages,
                {
                    sent: new Date().getTime(),
                    senderID: "12345",
                    receiverID: "99999",
                    message: message
                }
            ])
            setMessage('')
        }
    }

    const handleDisplayInfo = () => {
        console.log("displaying info")
    }

    return (
        <div className="container">
            <h3 className="accent-color" style={{textAlign: 'left'}}>Chats</h3>
            <div className="flex" style={{height: '80vh'}}>
                <div className="flex-column left-container">
                    <div className="search-container">
                        <TextField
                            id="search-input"
                            // label="Search for User"
                            placeholder="Search"
                            variant="standard"
                            size="medium"
                            value={search}
                            onChange={handleSearchChange}
                            className="messages-search"
                            InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Search />
                                  </InputAdornment>
                                )
                            }}
                            sx={{width: '320px', fontSize: '18px !important'}}
                        />
                    </div>
                    <div className="chats-container">
                        {test && test.length && test.map((chat, index) => {
                            return (
                                <div className="flex justify-start align-center chat-summary" onClick={handleClick} key={index}>
                                    <AccountCircleIcon fontSize="medium"/>
                                    <div className="flex-column summary">
                                        <div className="author">John Doe</div>
                                        <div className="last-message">{index % 2 === 0 ? "Test" : "This is a super long message that will overflow and show an ellipsis"}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex-column right-container justify-between">
                    {current && <div>
                        <div className="flex align-center justify-between chat-header">
                            <div className="flex align-center recipient-container" onClick={handleDisplayInfo}>
                                <AccountCircleIcon fontSize="large" />
                                <div className='recipient-details'>{current.firstName + " " + current.familyName}</div>
                            </div>
                            <InfoIcon className="info-button" onClick={handleDisplayInfo}/>
                        </div>
                        <div className="flex-column chat-messages">
                            {chatMessages && chatMessages.length && sort(chatMessages).map((m, index) => {
                                return (
                                    <div key={index} className={`flex-column message-container align-${m.senderID === userID ? 'end' : 'start'}`}>
                                        <div className="flex align-center">
                                            <div className="message">{m.message}</div>
                                            <div className="timestamp">{getTimeStamp(m.sent)}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
                    <div className="flex align-center">
                    <TextField
                            id="message-input"
                            placeholder="Type in message"
                            variant="standard"
                            size="medium"
                            value={message}
                            onChange={handleMessageChange}
                            onKeyDown={onKeyDown}
                            className="message-input"
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    <SendIcon className="send-button" fontSize="large" onClick={handleMessageSubmit} />
                                  </InputAdornment>
                                )
                            }}
                            sx={{width: '100%', fontSize: '18px !important'}}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Chats