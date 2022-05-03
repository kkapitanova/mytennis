import React, { useEffect, useState } from 'react';
import './Chats.scss';
import { objectToArrayConverter, sortData, getMessageTimeStamp } from '../../utils/helpers';

// material
import TextField from '@mui/material/TextField';
import Search from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import ClearIcon from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

// firebase
import { getDatabase, ref, onValue, update, get, child, push } from "firebase/database";

// toast
import { toast } from 'react-toastify';

const database = getDatabase();
const dbRef = ref(database);

const testCurrent = {
    playerID: '99999',
    firstName: 'Jane',
    familyName: 'Doe',
    gender: 'Female',
    nationCompetingFor: 'Bulgaria',
    dateOfBirth: 'November 13, 2000 03:24:00',
}

const userID = '12345'
const test = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]


const sort = (data) => {
    const sortedData = sortData(data, "sent", 'asc')

    const organizedData = sortedData.map(m => {
        return {...m, sent: new Date(m.sent)}
    })

    return organizedData
}

const Chats = () => {
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {} 
    const [search, setSearch] = useState()
    const [message, setMessage] = useState()
    const [current, setCurrent] = useState()
    const [chatMessages, setChatMessages] = useState({})
    const [currentChatID, setCurrentChatID] = useState()

    const fetchConversation = receiver => {
        get(child(dbRef, "chats/chatsInfo")).then((snapshot) => {
            if (snapshot.exists()) {
                const chatsInfo = snapshot.val();
                Object.keys(chatsInfo).map(key => {
                    const chat = chatsInfo[key]
                    if (chat.recipients.includes(receiver.playerID) && chat.recipients.includes('12345')) {
                        setCurrentChatID(chat.chatID)
                        
                        get(child(dbRef, "chats/" + chat.chatID))
                        .then((snapshot) => {
                            setChatMessages(snapshot.val())
                        })
                    }
                })
            } else {
                toast.info('There is no data available currently.')
            }
          }).catch((error) => {
            console.error(error);
            toast.error('An error has occured. Please try again.')
          });
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
            const newPostKey = push(child(dbRef, 'chats/' + currentChatID)).key;
            setChatMessages({
                ...chatMessages,
                [newPostKey]: {
                    sent: new Date().getTime(),
                    senderID: "12345",
                    receiverID: "99999",
                    message: message
                }
            })
            setMessage('')
            scrollToBottom("chat-messages")
        }
    }

    const handleMessageSubmit = () => {
        if (message) { // check if message is not empty
            const newPostKey = push(child(dbRef, 'chats/' + currentChatID)).key;
            setChatMessages({
                ...chatMessages,
                [newPostKey]: {
                    sent: new Date().getTime(),
                    senderID: "12345",
                    receiverID: "99999",
                    message: message
                }
            })
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

        const messagesRef = ref(database, 'chats');
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            console.log("UPDATED DATA", data)
            scrollToBottom("chat-messages")
        });
    }, [])

    useEffect(() => {
        setMessage() //clear input when switching between chats
        if (current) {
            fetchConversation(current)
        }
    }, [current])

    useEffect(() => {
        console.log(currentChatID)
        if (currentChatID) {
            const updates = {};
            updates['chats/' + currentChatID] = chatMessages
            // updates['tournaments/' + currentTournament.tournamentID + '/playersSignedUp/' + userData.userID + '/withdrawalTime'] = new Date();
    
            update(dbRef, updates)
            .then(() => {
                // toast.info("You can view tournaments you've signed up for in the 'My Tournaments' section.")
            })
            .catch((error) => {
                console.log("Error: ", error)
                toast.error('An error has occured. Please try again.')
            })
        }
    }, [chatMessages, currentChatID])

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
                                {chatMessages && Object.keys(chatMessages).length && sort(objectToArrayConverter(chatMessages)).map((m, index) => {                                    
                                    return (
                                        <div key={m.id} className={`flex-column message-container align-${m.senderID === userID ? 'end' : 'start'}`}>
                                            <div className="flex align-center">
                                                <div className="message">{m.message}</div>
                                                <div className="timestamp">{getMessageTimeStamp(m.sent, sort(objectToArrayConverter(chatMessages)), index)}</div>
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
                        <div className="chats-info">Open up a chat to see your messages or start a new converstation by searching for a player in the search bar.</div>
                    </div>}
                </div>
            </div>
            {current && <Button variant="outlined" sx={{marginTop: '10px'}} onClick={() => {
                const randomID = `${new Date().getTime()}2432523`

                setChatMessages({
                    ...chatMessages,
                    [randomID]: {
                        sent: new Date().getTime(),
                        senderID: current.playerID,
                        receiverID: "12345",
                        message: "Test Receiver Message"
                    }
                })}

            }>Send Test Receiver Message</Button>}
        </div>
    )

}

export default Chats