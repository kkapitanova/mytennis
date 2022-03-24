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
    const userData = JSON.parse(localStorage.getItem('userData')) // TODO: replace with function that fetches data from firebase
    const [showForm, setShowForm] = useState(false)
    const [data, setData] = useState({
        firstName: userData.firstName,
        middleName: userData.middleName,
        familyName: userData.familyName,
        email: userData.email,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        countryOfBirth: userData.countryOfBirth || '',
        phoneNumber: userData.phoneNumber,
        gameInfo: {
            backhand: userData.gameInfo?.backhand,
            plays: userData.gameInfo?.plays
        },
        about: userData.about,
        role: userData.role,
        userID: userData.userID
    })
    const countryOptions = useMemo(() => countryList().getData(), [])    
    const history = useHistory()
    const location = useLocation()

    const isDisabled = () => {
        const { firstName, middleName, familyName, gender, countryOfBirth, dateOfBirth } = data

        if ((!firstName || !middleName ||
            !familyName || !gender || 
            !countryOfBirth || !dateOfBirth ||
            !firstName.replace(/^\s+|\s+$/gm,'') || !middleName.replace(/^\s+|\s+$/gm,'') ||
            !familyName.replace(/^\s+|\s+$/gm,'') || !gender.replace(/^\s+|\s+$/gm,'') || 
            !countryOfBirth.replace(/^\s+|\s+$/gm,'')) ||
            !(firstName !== userData.firstName ||
            middleName !== userData.middleName ||
            familyName !== userData.familyName)
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
            set(ref(database, 'users/' + "EkoT8ey757TssILatOqjQc9lh7y1"), {
                firstName: firstName || userData.firstName,
                middleName: middleName || userData.middleName,
                familyName: familyName || userData.familyName,
                email: email || userData.email,
                gender: gender || userData.gender,
                dateOfBirth: dateOfBirth || userData.dateOfBirth,
                countryOfBirth: countryOfBirth || userData.countryOfBirth || '',
                phoneNumber: phoneNumber || userData.phoneNumber || '',
                gameInfo: {
                    backhand: gameInfo?.backhand || userData.gameInfo?.backhand || '',
                    plays: gameInfo?.plays || userData.gameInfo?.plays || ''
                },
                about: about || userData.about || '',
                role: role || userData.role || '',
                userID: userID || userData.userID || ''
            })
            .then(() => {
                localStorage.setItem('userData', JSON.stringify(data))
                toast.success("You have updated your profile successfully.")
            })
            .catch((error) => {
                console.log("error: ", error)
                toast.error("An error has occured. Please try again.")
            })

        setShowForm(false)
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
            {!showForm && <div className='flex-column align-center justify-center'>
                <div>Your profile is complete. Thank you!</div>
                <Button variant="contained" onClick={() => setShowForm(true)} sx={{margin: '20px 0px 0px 0px !important'}}>Edit Profile</Button>
            </div>}
            {showForm && <div className="flex-column wrap align-center">
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
                                <FormLabel id="demo-radio-buttons-group-label" sx={{textAlign: "left"}} required>Gender</FormLabel>
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
                    {userData.firstName && <Button variant="outlined" sx={{margin: '10px 5px 0px 5px !important'}} type="submit" onClick={() => setShowForm(false)}>Cancel Update</Button>}
                </div>
            </div>}
            <ToastContainer autoClose={3000} />
        </div>
    )
}

export default Profile