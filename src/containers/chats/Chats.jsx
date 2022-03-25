import React, { useEffect, useState } from 'react';
import './Chats.scss';
import { sortData } from '../../utils/helpers';

// material
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import ClearIcon from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';

const testCurrent = {
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
}

const userID = '12345'
const test = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]
const testMessages = [
    {
        sent: new Date("03/20/2022 16:55:01").getTime(), //6
        senderID: "12345",
        receiverID: "99999",
        message: "Tuesday at 8pm?",
        id: 6,
    },
    {
        sent: new Date("03/20/2022 16:56:01").getTime(), //7
        senderID: "12345",
        receiverID: "99999",
        message: "Is that convenient for you?",
        id: 7,
    },
    {
        sent: new Date("03/20/2022 16:57:01").getTime(), //8
        senderID: "12345",
        receiverID: "99999",
        message: "Tuesday at 8pm?",
        id: 8,
    },
    {
        sent: new Date("03/20/2022 16:57:01").getTime(), //9
        senderID: "12345",
        receiverID: "99999",
        message: "Tuesday at 8pm?",
        id: 9,
    },
    {
        sent: new Date("03/20/2022 16:57:01").getTime(), //10
        senderID: "12345",
        receiverID: "99999",
        message: "Tuesday at 8pm?",
        id: 10,
    },
    {
        sent: new Date("03/20/2022 16:57:01").getTime(), //10
        senderID: "12345",
        receiverID: "99999",
        message: "Tuesday at 8pm?",
        id: 11
    },
    {
        sent: new Date("03/20/2022 16:57:02").getTime(), //10
        senderID: "12345",
        receiverID: "99999",
        message: "Tuesday at 8pm?",
        id: 12
    },
    {
        sent: new Date("03/20/2022 16:57:03").getTime(), //10
        senderID: "12345",
        receiverID: "99999",
        message: "Tuesday at 8pm?",
        id: 13
    },
    {
        sent: new Date("03/20/2022 16:57:04").getTime(), //10
        senderID: "12345",
        receiverID: "99999",
        message: "Tuesday at 8pm?",
        id: 14,
    },
    {
        sent: new Date('12/11/2021 16:55:01').getTime(), //2
        senderID: "99999",
        receiverID: "12345",
        message: "Hi there!",
        id: 1
    },
    {
        sent: new Date('12/11/2021 16:54:32').getTime(), //1
        senderID: "12345",
        receiverID: "99999",
        message: "Hi",
        id: 2
    },
    {
        sent: new Date('12/11/2021 16:59:01').getTime(), //4
        senderID: "99999",
        receiverID: "12345",
        message: "Yeah sure!",
        id: 4
    },
    {
        sent: new Date('12/11/2021 16:55:58').getTime(), //3
        senderID: "12345",
        receiverID: "99999",
        message: "Do you want to play?",
        id: 3
    },
    {
        sent: new Date('12/11/2021 16:59:13').getTime(), //5
        senderID: "99999",
        receiverID: "12345",
        message: "When",
        id: 5
    },
]

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
    const [current, setCurrent] = useState()
    const [chatMessages, setChatMessages] = useState(testMessages)

    const getTimeStamp = (dateString, allMessages, currentMessageIndex) => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = date.getMonth()
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const currentDate = new Date().getDate()
    
        let previousDate;

        if (currentMessageIndex !== 0) {
            previousDate = new Date(allMessages[currentMessageIndex - 1].sent)
        }
    
        let timestamp = ''
    
        if (previousDate &&
            previousDate.getFullYear() === year && 
            previousDate.getMonth() === month && 
            previousDate.getDate() === date.getDate() &&
            previousDate.getHours() === hours &&
            previousDate.getMinutes() === minutes) {
                return timestamp

        } else if (year === new Date().getFullYear()) {

            if (currentDate === date.getDate()) { //timestamp for today in format of hours:minutes (12:34)
                timestamp = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
            } else {
                timestamp = `${date.getDate()}/${month + 1}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` //timestamp for current year in format of date/month, hours:minutes (12/3, 12:34)
            }

        } else { //timestamp for past years in format of date/month/year, hours:minutes (12/3, 12:34)
            timestamp = `${date.getDate()}/${month + 1}/${year}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        }
    
        return timestamp
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value)
    }

    const handleClick = () => {
        setCurrent(testCurrent)
    }

    const onKeyDown = (e) => {
        if (e.keyCode === 13 && e.target.value) { // check if message is not empty & enter has been clicked
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
            scrollToBottom("chat-messages")
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
            scrollToBottom("chat-messages")
        }
    }

    const handleDisplayInfo = () => {
        console.log("displaying info")
    }

    const scrollToBottom = (id) => {
        const element = document.getElementById(id);

        if (element) {
            element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
        }
    }

    const handleClearChat = () => {
        setCurrent()
    }

    useEffect(() => {
        scrollToBottom("chat-messages")
    }, [current])

    // scroll to top when opening the page for the first time
    useEffect(() => {
        window.scrollTo(0,0)
    }, [])

    useEffect(() => {
        setMessage() //clear input when switching between chats
    }, [current])

    return (
        <div className="container">
            <h3 className="accent-color" style={{textAlign: 'left'}}>Chats</h3>
            <div className="flex" style={{height: '80vh'}}>
                <div className={`flex-column left-container ${current ? 'right-open' : ''}`}>
                    <div className="search-container">
                        <TextField
                            id="search-input"
                            // label="Search for User"
                            placeholder="Search through existing chats"
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
                            sx={{width: '100%', fontSize: '18px !important'}}
                        />
                    </div>
                    <div className="chats-container">
                        {test && test.length && test.map((chat, index) => {
                            return (
                                <div className="flex justify-start align-center chat-summary" onClick={handleClick} key={index}>
                                    <AccountCircleIcon fontSize="medium"/>
                                    <div className="flex-column summary">
                                        <div className="author">John Doe</div>
                                        <div className="last-message">{index % 2 === 0 ? "Test" : "This is a super long message that when overflowing will show an ellipsis"}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className={`flex-column right-container justify-between relative ${!current ? 'left-open' : ''}`}>
                    {current && <>
                        <div>
                            <div className="flex align-center justify-between chat-header">
                                <div className="flex align-center recipient-container" onClick={handleDisplayInfo}>
                                    <AccountCircleIcon fontSize="large" />
                                    <div className='recipient-details'>{current.firstName + " " + current.familyName}</div>
                                </div>
                                <div>
                                    <InfoIcon className="info-button" onClick={handleDisplayInfo}/>
                                    <ClearIcon className="clear-button" onClick={handleClearChat}/>
                                </div>
                            </div>
                            <div className="flex-column chat-messages" id="chat-messages">
                                {chatMessages && chatMessages.length && sort(chatMessages).map((m, index) => {                                    
                                    return (
                                        <div key={m.id} className={`flex-column message-container align-${m.senderID === userID ? 'end' : 'start'}`}>
                                            <div className="flex align-center">
                                                <div className="message">{m.message}</div>
                                                <div className="timestamp">{getTimeStamp(m.sent, chatMessages, index)}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
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
                                        <SendIcon className={`send-button ${message ? "active" : ''}`} fontSize="medium" onClick={handleMessageSubmit} />
                                    </InputAdornment>
                                    )
                                }}
                                sx={{width: '100%', fontSize: '18px !important'}}
                            />
                        </div>
                    </>}
                    {!current && <div className="flex justify-center align-center full-height">
                        <div>Open up a chat to see your messages or start a new converstation by searching for a player in the search bar.</div>
                    </div>}
                </div>
            </div>
        </div>
    )

}

export default Chats