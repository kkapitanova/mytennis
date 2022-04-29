import React, { useEffect, useState, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { visibilityOptions } from '../../data/constants';
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
import UpdateIcon from '@mui/icons-material/Update';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ClearIcon from '@mui/icons-material/Clear';

// country dropdown
import countryList from 'react-select-country-list'

// toast
import { toast } from 'react-toastify';

// firebase
import { getDatabase, ref, set } from "firebase/database";

const database = getDatabase();

const Profile = () => {

    const [userData, setUserData] = useState(JSON.parse(sessionStorage.getItem('userData')) || {}) // TODO: replace with redux store function with initial value from localstorage
    const [isCompleteProfile, setIsCompleteProfile] = useState(false)
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
        termsCheck: termsCheck,
        emailVisibility: userData.emailVisibility || 'Club Reps Only',
        phoneNumberVisibility: userData.phoneNumberVisibility || 'Club Reps Only'
    })
    const countryOptions = useMemo(() => countryList().getData(), [])    
    const history = useHistory()
    const location = useLocation()
    const [sectionSelected, setSectionSelected] = useState('Personal Information')
    const [playerHistoryLabel, setPlayerHistoryLabel] = useState("Match History")

    const dataUsageError = !(dataConfirmCheck && termsCheck)

    // input validation
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
            phoneNumber,
            emailVisibility,
            phoneNumberVisibility 
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
            phoneNumber !== userData.phoneNumber ||
            emailVisibility !== userData.emailVisibility ||
            phoneNumberVisibility !== userData.phoneNumberVisibility)
            ) {
                return true
            } else {
                return false
            }
    }

    // update DB
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
            userID,
            emailVisibility,
            phoneNumberVisibility
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
            termsCheck: termsCheck,
            emailVisibility: emailVisibility,
            phoneNumberVisibility: phoneNumberVisibility
        }

        setData(updatedData)
        setUserData(updatedData)

        set(ref(database, 'users/' + userID), updatedData)
        .then(() => {
            sessionStorage.setItem('userData', JSON.stringify(updatedData))
            toast.success("You have updated your profile successfully.")
            setIsCompleteProfile(true)
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

    const handlePlayStyleChange = (e, key) => {
        setData({...data, gameInfo: {
            ...data.gameInfo,
            [key]: e.target.value
        }})
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
        window.scrollTo(0,0) // avoid scroll preservation
    }, [])

    useEffect(() => {
        if (!userData.firstName) {
            setIsCompleteProfile(false) // complete profile indicator
        } else {
            setIsCompleteProfile(true)
        }
    }, [location.pathname, history])

    return (
        <div className="container flex-column align-center">
            {userData?.role ? <>
                <h3 className="accent-color" style={{textAlign: 'left'}}>My Profile</h3>
                {isCompleteProfile && (<div className='flex-column align-center justify-center'>
                    <div>Your profile is complete. Thank you, {data.firstName}!</div>
                </div>)}
                <div className="flex-column wrap align-center">
                    {!userData.firstName && <div>Before you continue, you must complete your profile.</div>}
                    <div className="flex profile-section-wrapper justify-center">
                        <div className={`flex-column profile-section-wrapper-left ${!!sectionSelected ? 'right-open' : ''}`}>
                            <div className="flex align-center user-name justify-start">
                                <AccountCircleIcon fontSize="large" className="accent-color"/>
                                <h3 className="accent-color name">{data.firstName} {data.familyName}</h3>
                            </div>
                            <div className={`profile-selection ${(sectionSelected === "Personal Information" || !sectionSelected) && 'active'}`} onClick={() => setSectionSelected("Personal Information")}>
                                <div>Personal Information</div>
                            </div>
                            <div className={`profile-selection ${sectionSelected === "Privacy" && 'active'}`} onClick={() => setSectionSelected("Privacy")}>
                                <div>Privacy</div>
                            </div>
                            <div className="profile-selection coming-soon" onMouseEnter={() => setPlayerHistoryLabel("Coming Soon")} onMouseLeave={() => setPlayerHistoryLabel("Match History")}>
                                <div>{playerHistoryLabel}</div>
                            </div>
                        </div>
                        <div className={`flex-column profile-section-wrapper-right ${!sectionSelected  ? 'left-open' : ''}`}>
                            <div className="flex selection-name justify-between align-center">
                                <h3 className="accent-color">{sectionSelected ? sectionSelected : "Personal Information"}</h3>
                                <ClearIcon className={`clear-button accent-color ${(sectionSelected === "Personal Information" || !sectionSelected) && 'main-section'}`} onClick={() => setSectionSelected('')}/>
                            </div>
                            {sectionSelected === "Privacy"  && <div className='flex justify-center align-center full-height'>
                                <div>We are working hard to provide you with all our information. We thank you for your patience!</div>
                            </div>}
                            {(sectionSelected === "Personal Information" || sectionSelected === "") && <div>
                                <div className="flex wrap justify-between fields-container">
                                    <div className="flex-column fields-wrapper">
                                        <TextField 
                                            id="firstName" 
                                            name="firstName"
                                            label="First Name" 
                                            variant="outlined" 
                                            value={data.firstName}
                                            size="small"
                                            sx={{marginTop: '15px', width: 250}}
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
                                            sx={{marginTop: '20px', width: 250}}
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
                                            sx={{marginTop: '20px', width: 250}}
                                            onChange={handleChange}
                                            required
                                            disabled={userData.familyName ? true : false}
                                        />
                                        <TextField 
                                            id="role" 
                                            name="role"
                                            label="User Role" 
                                            variant="outlined" 
                                            value={data.role === 'clubRep' ? 'Club Representative' : data.role === 'player' ? 'Player' : 'Admin'}
                                            size="small"
                                            sx={{marginTop: '20px', width: 250}}
                                            onChange={handleChange}
                                            required
                                            disabled={true}
                                        />
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
                                                    renderInput={(params) => <TextField required size="small" {...params} sx={{margin: '20px 0px 0px 0px !important', width: 250}}
                                                />}
                                                />
                                            </Stack>
                                        </LocalizationProvider>
                                        <FormControl sx={{margin: "20px 0px 0px 0px"}}>
                                            <FormLabel id="gender-label" sx={{textAlign: "left"}} required disabled={data.gender ? true : false}>Gender</FormLabel>
                                            <RadioGroup
                                                defaultValue="Female"
                                                name="radio-buttons-group"
                                                className="gender-radio-group"
                                            >
                                                <FormControlLabel 
                                                    value="Female" 
                                                    control={
                                                        <Radio 
                                                            name="gender"
                                                            checked={data.gender === "Female" ? true : false} 
                                                            onChange={handleChange}
                                                            disabled={userData.gender ? true : false}
                                                        />} 
                                                    label="Female" 
                                                />
                                                <FormControlLabel
                                                    value="Male" 
                                                    control={
                                                        <Radio
                                                            name="gender"
                                                            checked={data.gender === "Male" ? true : false} 
                                                            onChange={handleChange}
                                                            disabled={userData.gender ? true : false}
                                                        />} 
                                                    label="Male" 
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                        <FormControl sx={{ marginTop: '20px', minWidth: 120 }}>
                                            <InputLabel id="country-select-label" required>Country of Birth</InputLabel>
                                            <Select
                                                name="countryOfBirth"
                                                id="country-select"
                                                onChange={handleChange}
                                                value={data.countryOfBirth}
                                                label="Country of Birth"
                                                size="small"
                                                sx={{width: 250}}
                                                disabled={userData.countryOfBirth ? true : false}
                                            >
                                                {countryOptions.map(c => {
                                                    return (
                                                        <MenuItem value={c.label}>{c.label}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="flex-column fields-wrapper justify-between">
                                        <div>
                                            <div className="flex wrap align-center" style={{marginTop: '15px'}}>
                                                <TextField 
                                                    id="email" 
                                                    name="email"
                                                    label="Email" 
                                                    variant="outlined" 
                                                    value={data.email}
                                                    size="small"
                                                    sx={{width: 250, marginRight: '10px'}}
                                                    // onChange={handleChange}
                                                    disabled
                                                    required
                                                />
                                                <FormControl sx={{minWidth: 120 }}>
                                                    <InputLabel id="email-visibility-label">Email Visible To</InputLabel>
                                                    <Select
                                                        name="emailVisibility"
                                                        id="email-visibility"
                                                        onChange={handleChange}
                                                        value={data.emailVisibility}
                                                        label="Email Visible To"
                                                        size="small"
                                                        sx={{width: 250}}
                                                    >
                                                        {visibilityOptions.map(option => {
                                                            return (
                                                                <MenuItem value={option}>{option}</MenuItem>
                                                            )
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <div className="flex wrap align-center" style={{marginTop: '20px'}}>
                                                <TextField 
                                                    id="phone-number" 
                                                    name="phoneNumber"
                                                    label="Phone Number" 
                                                    variant="outlined" 
                                                    value={data.phoneNumber}
                                                    size="small"
                                                    sx={{width: 250, marginRight: '10px'}}
                                                    onChange={handleChange}
                                                />
                                                <FormControl sx={{minWidth: 120 }}>
                                                    <InputLabel id="phone-number-visibility-label">Phone Visible To</InputLabel>
                                                    <Select
                                                        name="phoneNumberVisibility"
                                                        id="phone-number-visibility"
                                                        onChange={handleChange}
                                                        value={data.phoneNumberVisibility}
                                                        label="Phone Visible To"
                                                        size="small"
                                                        sx={{width: 250}}
                                                    >
                                                        {visibilityOptions.map(option => {
                                                            return (
                                                                <MenuItem value={option}>{option}</MenuItem>
                                                            )
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex wrap align-center" style={{margin: '20px 0px 16px 0px'}}>
                                                <FormControl sx={{minWidth: 120, marginRight: '10px' }}>
                                                    <InputLabel id="game-info-plays-label">You Play</InputLabel>
                                                    <Select
                                                        id="game-info-plays" 
                                                        name={`gameInfo["plays"]`}
                                                        label="You Play"
                                                        onChange={e => handlePlayStyleChange(e, "plays")}
                                                        value={data.gameInfo?.plays}
                                                        size="small"
                                                        sx={{width: 250}}
                                                    >
                                                        <MenuItem value={"Right-handed"}>Right-handed</MenuItem>
                                                        <MenuItem value={"Left-handed"}>Left-handed</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <FormControl sx={{minWidth: 120 }}>
                                                    <InputLabel id="game-info-backhand-label">Play style</InputLabel>
                                                    <Select
                                                        name={`gameInfo["backhand"]`}
                                                        id="game-info-backhand"
                                                        onChange={e => handlePlayStyleChange(e, "backhand")}
                                                        value={data.gameInfo?.backhand}
                                                        label="Backhand"
                                                        size="small"
                                                        sx={{width: 250}}
                                                    >
                                                        <MenuItem value={"One-handed backhand"}>One-handed backhand</MenuItem>
                                                        <MenuItem value={"Two-handed backhand"}>Two-handed backhand</MenuItem>
                                                        <MenuItem value={"Two backhands"}>Two backhands</MenuItem>
                                                        <MenuItem value={"Two forehands"}>Two forehands</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <TextField 
                                                id="about" 
                                                name="about"
                                                multiline
                                                label="About Me" 
                                                variant="outlined" 
                                                value={data.about}
                                                rows={4}
                                                size="small"
                                                sx={{marginTop: '20px', width: 510}}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-column align-start checks-wrapper">
                                    <div>IMPORTANT: Please provide thruthful information as you will be asked for proof of identity at tournament site. Discrepancies may result in losing the ability to participate in the tournament and even losing your account here.</div>
                                    <FormControl sx={{ marginTop: '20px' }} component="fieldset" variant="standard" error={dataUsageError}>
                                        {/* <FormLabel component="legend">Assign responsibility</FormLabel> */}
                                        <FormGroup>
                                        <FormControlLabel
                                            control={
                                            <Checkbox checked={dataConfirmCheck} disabled={userData.dataConfirmCheck} onChange={(e) => setDataConfirmCheck(e.target.checked)} name="gilad" />
                                            }
                                            label="I agree to the T&Cs and allow my data to be used for purposes relating to this site.*"
                                        />
                                        <FormControlLabel
                                            control={
                                            <Checkbox checked={termsCheck} disabled={userData.termsCheck} onChange={(e) => setTermsCheck(e.target.checked)} name="jason" />
                                            }
                                            label="I confirm that all data I provide is truthful.*"
                                        />
                                        </FormGroup>
                                        <FormHelperText>You must agree to continue forward.</FormHelperText>
                                    </FormControl>
                                </div>
                                <div className="flex wrap align-center justify-center" style={{marginTop: 10}}>
                                    <Button variant="contained" sx={{margin: '10px 5px 0px 5px !important'}} type="submit" onClick={handleDataUpdate} disabled={isDisabled()} startIcon={<UpdateIcon />}>Update Profile</Button>
                                </div>
                                <div className="personal-id text-left grey">Note: Your unique personal ID is {data.userID}.</div>
                            </div>}
                        </div>
                    </div>
                </div>
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