import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';

import '../../firebase-config';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useHistory } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const authentication = getAuth()

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const history = useHistory();

    const handleRegister = () => {
        createUserWithEmailAndPassword(authentication, email, password)
            .then((response) => {
                console.log(response)
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
                history.push('/')
            })
            .catch((error) => {
                console.log(error.code)
                if (error.code === 'auth/invalid-email') {
                    toast.error('Invalid email. Please try again.')
                } else if (error.code === 'auth/email-already-in-use') {
                    toast.error('Email already in use.')
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
            <h3>Register Form</h3>
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
            <Button variant="contained" sx={{margin: '0 !important'}} onClick={handleRegister}>Register</Button>
            <ToastContainer autoClose={3000}/>
        </div>
    )
}

export default Register