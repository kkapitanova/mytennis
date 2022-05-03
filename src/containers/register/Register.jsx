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
import { toast } from 'react-toastify';

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
                    role: userRole,
                    userID: user.uid
                })
                .then(() => {
                    sessionStorage.setItem('userData', JSON.stringify({
                        email: user.email,
                        role: userRole,
                        userID: user.uid
                    }))
    
                    history.push('/profile')
                    toast.success("You have registerd and logged in successfully.")
                })
                .catch((error) => {
                    console.log("Error: ", error)
                    toast.error('An error has occured. Please try again.')
                })
            })
            .catch((error) => {
                console.log("Error: ", error)
                if (error.code === 'auth/invalid-email') {
                    toast.error('Invalid email. Please try again.')
                } else if (error.code === 'auth/email-already-in-use') {
                    toast.error('Email already in use.')
                } else if (error.code === "auth/weak-password"){
                    toast.error('Password should be at least 6 characters long.')
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
        <div className="flex-column justify-center align-center container register">
            <h3 className="accent-color">Register Form</h3>
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
            <TextField 
                id="email" 
                name="email"
                label="Email*" 
                variant="outlined" 
                value={userData.email}
                size="small"
                onChange={handleChange}
                sx={{marginTop: '20px', width: 250}}
            />
            <TextField 
                id="password" 
                name="password"
                type="password"
                label="Password*" 
                variant="outlined" 
                value={userData.password}
                size="small"
                onChange={handleChange}
                sx={{marginTop: '20px', width: 250}}
            />
            <TextField 
                id="confirmPassword"
                name="confirmPassword" 
                type="password"
                label="Confirm password*" 
                variant="outlined" 
                value={userData.confirmPassword}
                size="small"
                onChange={handleChange}
                sx={{marginTop: '20px', width: 250}}
            />
            <Button variant="contained" sx={{margin: '20px 0px 10px 0px!important'}} type="submit" onClick={handleRegister} disabled={!userData.email || !userData.password || !userData.confirmPassword}>Register</Button>
            <div className="flex-column">
                <div>Already a member?</div>
                <div className="underlined pointer" onClick={() => history.push('/login')}>Login here.</div>
            </div>
        </div>
    )
}

export default Register