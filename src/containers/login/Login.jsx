import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';

import '../../firebase-config';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const authentication = getAuth()

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const history = useHistory()

    const handleLogin = () => {
        signInWithEmailAndPassword(authentication, email, password)
            .then((response) => {
                history.push('/')
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
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

    useEffect(() => {
        window.scrollTo(0,0)
      }, [])

    return (
        <div className="flex-column justify-center align-center container">
            <h3>Login Form</h3>
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
            <ToastContainer autoClose={3000} />
        </div>
    )
}

export default Login