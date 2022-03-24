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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const authentication = getAuth()
const database = getDatabase();

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

                const dbref = ref(getDatabase());

                get(child(dbref, `users/${user.uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        localStorage.setItem('userData', JSON.stringify(data))
                        setUserData(data)
                        history.push('/profile')
                        toast.success("You have logged in successfully.")
                    } else {
                      console.log("No data available");
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
        <div className="flex-column justify-center align-center container">
            {!loggedIn ? (<div>
                <h3 className="accent-color">Login Form</h3>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField 
                        id="email" 
                        label="Enter email" 
                        variant="outlined" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField 
                        id="password" 
                        type="password"
                        label="Enter password" 
                        variant="outlined" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Box>
                <Button variant="contained" sx={{margin: '0 !important'}} onClick={handleLogin}>Login</Button>
                </div>) : 
                (<div>
                    <h3 className="accent-color">Hi, {userData.firstName}!</h3>
                    <div>You are already logged in!</div>
                    <div>If you wish to log into another account, please click the button below.</div>
                    <Button variant="contained" sx={{margin: '20px 0px 0px 0px !important'}} onClick={onLogout}>Logout</Button>
                </div>)
            }
            <ToastContainer autoClose={3000} />
        </div>
    )
}

export default Login