import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// material
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// firebase
import '../../firebase-config';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, ref, set } from "firebase/database";

// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const authentication = getAuth()
const database = getDatabase()

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [userRole, setUserRole] = useState('player')
    const history = useHistory();

    const handleRegister = () => {

        if (!password || !email || !confirmPassword) {
            toast.error('Please fill out all of the fields.')
        } else if (password !== confirmPassword) {
            toast.error('Passwords do not match.')
        } else {
            createUserWithEmailAndPassword(authentication, email, password)
            .then((response) => {
                console.log(response)
                const userData = response?.user
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
                
                set(ref(database, 'users/' + userData.uid), {
                    email: userData.email,
                    role: userRole
                });

                history.push('/profile')
                toast.success("You have registerd and logged in successfully.")
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
    }

    useEffect(() => {
        window.scrollTo(0,0)
    }, [])

    return (
        <div className="flex-column justify-center align-center container">
            <h3>Register Form</h3>
            <div>I want to register as a:</div>
            <ToggleButtonGroup
                color="primary"
                value={userRole}
                sx={{height: 40, margin: '10px 5px 5px 0px'}}
                exclusive
                onChange={(e) => {
                    setUserRole(e.target.value)
                }}
                >
                <ToggleButton value="clubRep">Club Rep</ToggleButton>
                <ToggleButton value="player">Player</ToggleButton>
            </ToggleButtonGroup>
            <div className="flex-column">
                <TextField 
                    id="email" 
                    label="Email*" 
                    variant="outlined" 
                    value={email}
                    size="small"
                    sx={{marginTop: '15px'}}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField 
                    id="password" 
                    type="password"
                    label="Password*" 
                    variant="outlined" 
                    value={password}
                    size="small"
                    sx={{marginTop: '15px'}}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField 
                    id="confirmPassword" 
                    type="password"
                    label="Confirm password*" 
                    variant="outlined" 
                    value={confirmPassword}
                    size="small"
                    sx={{marginTop: '15px'}}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <Button variant="contained" sx={{margin: '10px !important'}} type="submit" onClick={handleRegister} disabled={!email || !password || !confirmPassword}>Register</Button>
            <ToastContainer autoClose={3000}/>
        </div>
    )
}

export default Register