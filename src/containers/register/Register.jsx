import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// material
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
    const [userData, setUserData] = useState({
        firstName: '',
        familyName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [userRole, setUserRole] = useState('player')
    const history = useHistory();

    const handleChange = e => {
        const value = e.target.value
        const name = e.target.name

        setUserData({...userData, [name]: value})
    }

    const handleRegister = () => {

        if (!userData.password || !userData.email || !userData.confirmPassword) {
            toast.error('Please fill out all of the fields.')
        } else if (userData.password !== userData.confirmPassword) {
            toast.error('Passwords do not match.')
        } else {
            createUserWithEmailAndPassword(authentication, userData.email, userData.password)
            .then((response) => {
                console.log(response)
                const user = response?.user
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
                
                set(ref(database, 'users/' + user.uid), {
                    email: user.email,
                    role: userRole
                });

                localStorage.setItem('userData', JSON.stringify({
                    email: user.email
                }))

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
                {/* <TextField 
                    id="firstName" 
                    name="firstName" 
                    label="First Name*" 
                    variant="outlined" 
                    value={userData.firstName}
                    size="small"
                    sx={{marginTop: '15px'}}
                    onChange={handleChange}
                />
                <TextField 
                    id="familyName" 
                    name="familyName" 
                    label="Family Name*" 
                    variant="outlined" 
                    value={userData.familyName}
                    size="small"
                    sx={{marginTop: '15px'}}
                    onChange={handleChange}
                /> */}
                <TextField 
                    id="email" 
                    name="email"
                    label="Email*" 
                    variant="outlined" 
                    value={userData.email}
                    size="small"
                    sx={{marginTop: '15px'}}
                    onChange={handleChange}
                />
                <TextField 
                    id="password" 
                    name="password"
                    type="password"
                    label="Password*" 
                    variant="outlined" 
                    value={userData.password}
                    size="small"
                    sx={{marginTop: '15px'}}
                    onChange={handleChange}
                />
                <TextField 
                    id="confirmPassword"
                    name="confirmPassword" 
                    type="password"
                    label="Confirm password*" 
                    variant="outlined" 
                    value={userData.confirmPassword}
                    size="small"
                    sx={{marginTop: '15px'}}
                    onChange={handleChange}
                />
            </div>
            <Button variant="contained" sx={{margin: '10px !important'}} type="submit" onClick={handleRegister} disabled={!userData.email || !userData.password || !userData.confirmPassword}>Register</Button>
            <ToastContainer autoClose={3000}/>
        </div>
    )
}

export default Register