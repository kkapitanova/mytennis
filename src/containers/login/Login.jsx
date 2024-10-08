import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { handleLogout } from '../../utils/helpers';

// material
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';

// firebase
import '../../firebase-config';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, child, get } from "firebase/database";

// toast
import { toast } from 'react-toastify';

const authentication = getAuth()
const database = getDatabase();
const dbref = ref(database);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const history = useHistory()
    const [loggedIn, setLoggedIn] = useState(false)
    const [userData, setUserData] = useState({})

    const handleLogin = () => {
        signInWithEmailAndPassword(authentication, email, password)
            .then((response) => {
                const user = response?.user

                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)

                get(child(dbref, `users/${user.uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        sessionStorage.setItem('userData', JSON.stringify(data))
                        setUserData(data)
                        history.push('/profile')
                    }
                  }).catch((error) => {
                    console.error(error);
                    toast.error('An error has occured. Please try again.')
                  });

            })
            .catch((error) => {
                console.log(error.code)
                if (error.code === 'auth/wrong-password') {
                    toast.error("The password you've entered is incorrect. Please try again.")
                } else if (error.code === 'auth/user-not-found') {
                    toast.error("The email you've entered is incorrect. Please try again.")
                } else {
                    toast.error('An error has occured. Please try again.')
                }
            })
    }

    const onLogout = () => {
        handleLogout()
        setLoggedIn(false)
    }

    useEffect(() => {
        window.scrollTo(0,0)
        const authToken = sessionStorage.getItem('Auth Token')

        if (authToken) {
            setLoggedIn(true)
        }

        if (!authToken) {
            setLoggedIn(false)
        }
    }, [])

    return (
        <div className="flex-column justify-center align-center container login">
            {!loggedIn ? (<div className="flex-column justify-center align-center">
                <h3 className="accent-color">Login Form</h3>
                <TextField 
                    id="email" 
                    label="Enter email" 
                    variant="outlined" 
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{marginTop: '20px', width: 250}}
                />
                <TextField 
                    id="password" 
                    type="password"
                    size="small"
                    label="Enter password" 
                    variant="outlined" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{marginTop: '20px', width: 250}}
                />
                <Button variant="contained" sx={{margin: '10px !important'}} onClick={handleLogin}>Login</Button>
                <div>You are new? <span className="underlined pointer" onClick={() => history.push('/register')}>Register here.</span></div>
                </div>) : 
                (<div>
                    <h3 className="accent-color">Hi, {userData.firstName}!</h3>
                    <div>You are already logged in!</div>
                    <div>If you wish to log into another account, please click the button below.</div>
                    <Button variant="contained" sx={{margin: '20px 0px 0px 0px !important'}} onClick={onLogout}>Logout</Button>
                </div>)
            }
        </div>
    )
}

export default Login