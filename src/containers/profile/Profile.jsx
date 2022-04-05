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
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import EditIcon from '@mui/icons-material/Edit';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import UpdateIcon from '@mui/icons-material/Update';

// country dropdown
// import Select from 'react-select'
import countryList from 'react-select-country-list'

// toast
import { toast } from 'react-toastify';

// firebase
import { getDatabase, ref, set } from "firebase/database";

const database = getDatabase();

// trim trailing and leading spaces
// replace(/^\s+|\s+$/gm,'')

const Profile = () => {
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {} // TODO: replace with redux store function with initial value from localstorage
    const [showForm, setShowForm] = useState(false)
    const [dataConfirmCheck, setDataConfirmCheck] = useState(userData.dataConfirmCheck)
    const [termsCheck, setTermsCheck] = useState(userData.termsCheck)
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
        userID: userData.userID,
        dataConfirmCheck:  dataConfirmCheck,
        termsCheck: termsCheck
    })
    const countryOptions = useMemo(() => countryList().getData(), [])    
    const history = useHistory()
    const location = useLocation()

    const dataUsageError = !(dataConfirmCheck && termsCheck)

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

        if (!dataConfirmCheck || !termsCheck ||
            (!firstName || !middleName ||
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
            userID: userID,
            dataConfirmCheck: dataConfirmCheck,
            termsCheck: termsCheck
        }

        console.log("updatedData", updatedData)

        set(ref(database, 'users/' + userID), updatedData)
        .then(() => {
            sessionStorage.setItem('userData', JSON.stringify(updatedData))
            toast.success("You have updated your profile successfully.")
            setShowForm(false)
        })
        .catch((error) => {
            console.log("error: ", error)
            toast.error("An error has occured. Please try again.")
        })

        if (role === 'player') {
            set(ref(database, 'players/' + userID), updatedData)
        }
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
            {userData?.role ? <>
                <h3 className="accent-color" style={{textAlign: 'left'}}>My Profile</h3>
                {!showForm ? (<div className='flex-column align-center justify-center'>
                    <div>Your profile is complete. Thank you!</div>
                    <Button variant="contained" onClick={() => setShowForm(true)} sx={{margin: '20px 0px 0px 0px !important'}} endIcon={<EditIcon />}>Edit Profile</Button>
                </div>) :
                (<div className="flex-column wrap align-center">
                    {!userData.firstName && <div>Before you continue, you must complete your profile.</div>}
                    <TextField 
                        id="firstName" 
                        name="firstName"
                        label="First Name" 
                        variant="outlined" 
                        value={data.firstName}
                        size="small"
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
                        size="small"
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
                        size="small"
                        sx={{marginTop: '15px', width: 300}}
                        onChange={handleChange}
                        required
                        disabled={userData.familyName ? true : false}
                    />
                    <TextField 
                        id="email" 
                        name="email"
                        label="Email" 
                        variant="outlined" 
                        value={data.email}
                        size="small"
                        sx={{marginTop: '15px', width: 300}}
                        // onChange={handleChange}
                        disabled
                        required
                    />
                    <div className='flex align-start justify-start' style={{width: '300px'}}>
                        <FormControl sx={{margin: "10px 0px 0px 0px"}}>
                                    <FormLabel id="gender-label" sx={{textAlign: "left"}} required disabled={data.gender ? true : false}>Gender</FormLabel>
                                    <RadioGroup
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
                                maxDate={new Date().setFullYear(new Date().getFullYear() - 18)}// only 18+ allowed
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
                        size="small"
                        sx={{marginTop: '10px', width: 300}}
                        onChange={handleChange}
                    />
                    <div className="flex-column align-start">
                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard" error={dataUsageError}>
                            {/* <FormLabel component="legend">Assign responsibility</FormLabel> */}
                            <FormGroup>
                            <FormControlLabel
                                control={
                                <Checkbox checked={dataConfirmCheck} disabled={userData.dataConfirmCheck} onChange={(e) => setDataConfirmCheck(e.target.checked)} name="gilad" />
                                }
                                label="I agree to the T&Cs and allow my data to be used for purposes relating to this site."
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={termsCheck} disabled={userData.termsCheck} onChange={(e) => setTermsCheck(e.target.checked)} name="jason" />
                                }
                                label="I confirm that all data I provide is correct and in accordance to my passport details."
                            />
                            </FormGroup>
                            <FormHelperText>
                                <div className="flex-column">
                                    <div>You must agree to continue forward.</div>
                                    <div>It is important to be truthful when filling this data, as club representatives will use it confirm your identity.</div>
                                </div>
                            </FormHelperText>
                        </FormControl>
                    </div>
                    <div className="flex wrap align-center justify-center" style={{marginTop: 10}}>
                        <Button variant="contained" sx={{margin: '10px 5px 0px 5px !important'}} type="submit" onClick={handleDataUpdate} disabled={isDisabled()} startIcon={<UpdateIcon />}>Update Profile</Button>
                        {userData.firstName && <Button variant="outlined" sx={{margin: '10px 5px 0px 5px !important'}} type="submit" onClick={() => setShowForm(false)} endIcon={<CancelOutlinedIcon />}>Cancel Edit</Button>}
                    </div>
                </div>)}
            </> : <>
                <div>You do not have access to this page.</div>
                <div>Please login or register to gain access.</div>
                <div className="flex">
                    <Button variant="contained" sx={{margin: '10px 5px 0px 0px !important'}} onClick={() => history.push('/login')}>Login</Button>
                    <Button variant="outlined" sx={{margin: '10px 0px 0px 5px !important'}} onClick={() => history.push('/register')}>Register</Button>
                </div>
            </>}
        </div>
    )
}

export default Profile
//TODO CHATS PERMISSION - I want people to chat with me