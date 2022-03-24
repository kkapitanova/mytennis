import React, { useEffect, useState, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './Profile.scss';

// material
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Stack from '@mui/material/Stack';

// country dropdown
// import Select from 'react-select'
import countryList from 'react-select-country-list'

// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// firebase
import { getDatabase, ref, set } from "firebase/database";

const database = getDatabase();

// trim trailing and leading spaces
// replace(/^\s+|\s+$/gm,'')

const Profile = () => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {} // TODO: replace with redux store function with initial value from localstorage
    const [showForm, setShowForm] = useState(false)
    const [data, setData] = useState({
        firstName: userData.firstName,
        middleName: userData.middleName,
        familyName: userData.familyName,
        email: userData.email,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        countryOfBirth: userData.countryOfBirth || '',
        phoneNumber: userData.phoneNumber  || '',
        gameInfo: {
            backhand: userData.gameInfo?.backhand  || '',
            plays: userData.gameInfo?.plays  || ''
        },
        about: userData.about  || '',
        role: userData.role,
        userID: userData.userID
    })
    const countryOptions = useMemo(() => countryList().getData(), [])    
    const history = useHistory()
    const location = useLocation()

    const isDisabled = () => {
        const { 
            firstName, 
            middleName, 
            familyName, 
            gender, 
            countryOfBirth, 
            dateOfBirth, 
            about, 
            gameInfo, 
            phoneNumber 
        } = data

        if ((!firstName || !middleName ||
            !familyName || !gender || 
            !countryOfBirth || !dateOfBirth ||
            !firstName.replace(/^\s+|\s+$/gm,'') || !middleName.replace(/^\s+|\s+$/gm,'') ||
            !familyName.replace(/^\s+|\s+$/gm,'') || !gender.replace(/^\s+|\s+$/gm,'') || 
            !countryOfBirth.replace(/^\s+|\s+$/gm,'')) ||
            !(about !== userData.about || 
            gameInfo?.backhand !== userData.gameInfo?.backhand || 
            gameInfo?.plays !== userData.gameInfo?.plays || 
            phoneNumber !== userData.phoneNumber)
            ) {
                return true
            } else {
                return false
            }
    }

    const handleDataUpdate = () => {
        const {
            firstName, 
            middleName, 
            familyName, 
            gender, 
            countryOfBirth, 
            dateOfBirth, 
            email, 
            phoneNumber,
            gameInfo, 
            about, 
            role,
            userID
        } = data

        const updatedData = {
            firstName: firstName,
            middleName: middleName,
            familyName: familyName,
            email: email,
            gender: gender,
            dateOfBirth: dateOfBirth.toString(),
            countryOfBirth: countryOfBirth,
            phoneNumber: phoneNumber,
            gameInfo: {
                backhand: gameInfo?.backhand,
                plays: gameInfo?.plays
            },
            about: about,
            role: role,
            userID: userID
        }

        console.log("updatedData", updatedData)

        set(ref(database, 'users/' + userID), updatedData)
        .then(() => {
            localStorage.setItem('userData', JSON.stringify(data))
            toast.success("You have updated your profile successfully.")
            setShowForm(false)
        })
        .catch((error) => {
            console.log("error: ", error)
            toast.error("An error has occured. Please try again.")
        })
        // history.push('/')
    }

    const handleChange = e => {
        const name = e.target.name
        const value = e.target.value

        setData({...data, [name]: value})
    }

    const handleDOBChange = value => {
        setData({...data, dateOfBirth: value})
    }

    useEffect(() => {
        window.scrollTo(0,0)
    }, [])

    useEffect(() => {
        if (!userData.firstName) {
            setShowForm(true)
        } else {
            setShowForm(false)
        }
    }, [location.pathname, history])

    return (
        <div className="container flex-column align-center">
            <h3 className="accent-color" style={{textAlign: 'left'}}>My Profile</h3>
            {!showForm ? (<div className='flex-column align-center justify-center'>
                <div>Your profile is complete. Thank you!</div>
                <Button variant="contained" onClick={() => setShowForm(true)} sx={{margin: '20px 0px 0px 0px !important'}}>Edit Profile</Button>
            </div>) :
            (<div className="flex-column wrap align-center">
                {!userData.firstName && <div>Before you continue, you must complete your profile.</div>}
                <TextField 
                    id="firstName" 
                    name="firstName"
                    label="First Name" 
                    variant="outlined" 
                    value={data.firstName}
                    // size="small"
                    sx={{marginTop: '15px', width: 300}}
                    onChange={handleChange}
                    required
                    disabled={userData.firstName ? true : false}
                />
                <TextField 
                    id="middleName" 
                    name="middleName"
                    label="Middle Name" 
                    variant="outlined" 
                    value={data.middleName}
                    // size="small"
                    sx={{marginTop: '15px', width: 300}}
                    onChange={handleChange}
                    required
                    disabled={userData.middleName ? true : false}
                />
                <TextField 
                    id="familyName" 
                    name="familyName"
                    label="Family Name" 
                    variant="outlined" 
                    value={data.familyName}
                    // size="small"
                    sx={{marginTop: '15px', width: 300}}
                    onChange={handleChange}
                    required
                    disabled={duserDataata.familyName ? true : false}
                />
                <TextField 
                    id="email" 
                    name="email"
                    label="Email" 
                    variant="outlined" 
                    value={data.email}
                    // size="small"
                    sx={{marginTop: '15px', width: 300}}
                    // onChange={handleChange}
                    disabled
                    required
                />
                <div className='flex align-start justify-start' style={{width: '300px'}}>
                    <FormControl sx={{margin: "10px 0px 0px 0px"}}>
                                <FormLabel id="demo-radio-buttons-group-label" sx={{textAlign: "left"}} required disabled={data.gender ? true : false}>Gender</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel 
                                        value="female" 
                                        control={
                                            <Radio 
                                                name="gender"
                                                checked={data.gender === "female" ? true : false} 
                                                onChange={handleChange}
                                                disabled={userData.gender ? true : false}
                                            />} 
                                        label="Female" 
                                    />
                                    <FormControlLabel
                                        value="male" 
                                        control={
                                            <Radio
                                                name="gender"
                                                checked={data.gender === "male" ? true : false} 
                                                onChange={handleChange}
                                                disabled={userData.gender ? true : false}
                                            />} 
                                        label="Male" 
                                    />
                                </RadioGroup>
                    </FormControl>
                </div>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="country-select-label" required>Country of Birth</InputLabel>
                    <Select
                        name="countryOfBirth"
                        id="country-select"
                        onChange={handleChange}
                        value={data.countryOfBirth}
                        label="Country of Birth"
                        sx={{width: 300}}
                        disabled={userData.countryOfBirth ? true : false}
                    >
                        {countryOptions.map(c => {
                            return (
                                <MenuItem value={c.label}>{c.label}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={1}>
                        <DesktopDatePicker
                            label="Date of Birth"
                            name="dateOfBirth"
                            className="dob-picker"
                            minDate={new Date().setFullYear(new Date().getFullYear() - 18)} // only 18+ allowed
                            maxDate={new Date ()}
                            value={data.dateOfBirth || null}
                            onChange={handleDOBChange}
                            disabled={userData.dateOfBirth ? true : false}
                            renderInput={(params) => <TextField required {...params} sx={{margin: '10px 0px 0px 0px !important', width: 300}}
                        />}
                        />
                    </Stack>
                </LocalizationProvider>
                <TextField 
                    id="about" 
                    name="about"
                    multiline
                    label="About Me" 
                    variant="outlined" 
                    value={data.about}
                    rows={4}
                    // size="small"
                    sx={{marginTop: '10px', width: 300}}
                    onChange={handleChange}
                />
                <div className="flex wrap align-center justify-center" style={{marginTop: 10}}>
                    <Button variant="contained" sx={{margin: '10px 5px 0px 5px !important'}} type="submit" onClick={handleDataUpdate} disabled={isDisabled()}>Update Profile</Button>
                    {userData.firstName && <Button variant="outlined" sx={{margin: '10px 5px 0px 5px !important'}} type="submit" onClick={() => setShowForm(false)}>Cancel Edit</Button>}
                </div>
            </div>)}
            <ToastContainer autoClose={3000} />
        </div>
    )
}

export default Profile