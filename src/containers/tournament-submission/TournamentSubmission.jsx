import React, { useEffect, useState } from 'react';
import {
    getDateString, 
    handleLogout, 
    getDraws, 
    getDateTimeString,
    getTournamentSubmissionMinDate, 
    getTournamentOnSiteSignupDeadline  
} from '../../utils/helpers';
import { useHistory } from 'react-router-dom';
import { courtSurfaces, initialTournamentData } from '../../data/constants';

// material imports
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Stack from '@mui/material/Stack';
import { Button, Checkbox } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

//modal material
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import MuiPhoneNumber from "material-ui-phone-number";

// firebase
import { getDatabase, ref, child, push, update} from "firebase/database";

// toast
import { toast } from 'react-toastify';

const database = getDatabase()
const dbRef = ref(database);

//modal style
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const TournamentSubmission = () => {
    const userData = JSON.parse(sessionStorage.getItem('userData')) || {} 
    const [tournamentData, setTournamentData] = useState(initialTournamentData)
    const [open, setOpen] = useState(false)
    const history = useHistory()

    // uncomment for testing purposes
    // const fillWithTestData = () => { 
    //     setTournamentData(testTournamentData)
    // }

    // check if all required fields are filled in based on tournament configurations
    const validateFields = () => {
        let bool = false

        for (const key in tournamentData) {
            if (((tournamentData.qualification === false ? key !== 'qualifyingDrawSize' &&
                key !== 'qualificationStartDate' &&
                key !== 'qualificationEndDate' : true) &&
                (tournamentData.drawType === 'singles' ? 
                key !== 'doublesDrawSize' && 
                key !== 'mixedDoublesDrawSize' : tournamentData.drawType === 'doubles' ? 
                key !== 'singlesDrawSize' : true) &&
                (tournamentData.genderGroup !== 'Mixed' ? key !== 'mixedDoublesDrawSize' : true)) &&
                tournamentData[key] === initialTournamentData[key]
                ) {
                bool = true
            }
        }

        return bool
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setOpen(true)
    }

    // preview tournament details and confirm submission
    const confirmSubmission = () => {
        const newPostKey = push(child(dbRef, 'tournaments')).key;
        const updates = {};
        updates['/tournaments/' + newPostKey] = {...tournamentData, status: "Waiting for Approval", submittedBy: userData.userID, submissionTime: new Date (), tournamentID: newPostKey};

        update(dbRef, updates)
        .then(() => {
            toast.success("You have submitted a tournament successfully.")
            toast.info("You can view your tournaments in the 'My Tournaments' section.")
        })
        .catch((error) => {
            console.log("Error: ", error)
            toast.error('An error has occured. Please try again.')
        })

        setTournamentData(initialTournamentData)
        setOpen(false)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleTextFieldChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        setTournamentData({...tournamentData, [name]: value})
    }

    const handleRadioButtonChange = (e, key) => {
        if (typeof e === "boolean" || key === 'courtSurface') {
            setTournamentData({
                ...tournamentData,
                [key]: e
            })
        } else {
            setTournamentData({
                ...tournamentData,
                [key]: e.target.value
            })
        }
    }

    const handleCheckboxChange = (e) => {
        const selectedOption = e.target.value
        
        if (!e.target.checked) {
            setTournamentData({
                ...tournamentData,
                ageGroups: tournamentData.ageGroups.filter(el => el !== selectedOption)
            })
        } else {
            setTournamentData({
                ...tournamentData,
                ageGroups: [...tournamentData.ageGroups, selectedOption]
            })
        }
    }

    const handleChange = (val, key) => {
        setTournamentData({...tournamentData, [key]: val})

    }

    // submit button validation
    const checkIfInfoIsFilledIn = () => {
        let bool = false

        for (const key in tournamentData) {
            if (typeof tournamentData[key] !== 'object' ? tournamentData[key] !== '' : tournamentData[key].length > 0) {
                bool = true
            }
        }

        return bool
    }

    const clearFields = () => {
        setTournamentData(initialTournamentData)
    }

    useEffect(() => {
        window.scrollTo(0,0)     
    }, [])

    return (
        <div className='container'>
            {userData && userData.role === 'clubRep' ? (
            <div>
                <h3 className="accent-color left-align-text">Tournament Submission</h3>
                <form onSubmit={handleSubmit}>
                    <div className='flex-column align-start'>
                        <div className='flex-column align-start' style={{marginBottom: 10}}>
                            <div style={{marginBottom: 10}}>Main Information*</div>
                            <TextField 
                                type="text" 
                                name="tournamentName"
                                label="Tournament Name"
                                variant="outlined"
                                required
                                // // size="small"
                                value={tournamentData.tournamentName}
                                onChange={handleTextFieldChange}
                                style={{minWidth: 200, maxWidth: 410, marginBottom: 10, width: "80vw"}}
                            />
                            <TextField 
                                type="text" 
                                name="description"
                                label="Tournament Description"
                                variant="outlined"
                                required
                                // size="small"
                                multiline
                                minRows={3}
                                maxRows={4}
                                value={tournamentData.description}
                                onChange={handleTextFieldChange}
                                style={{minWidth: 200, maxWidth: 820, marginBottom: 10, width: "80vw"}}
                            />
                            <div className='flex wrap'>
                                <TextField 
                                    type="text" 
                                    name="tournamentDirector"
                                    label="Tournament Director"
                                    required
                                    // size="small"
                                    variant="outlined"
                                    value={tournamentData.tournamentDirector}
                                    onChange={handleTextFieldChange}
                                    style={{minWidth: 200, maxWidth: 410, marginBottom: 10, marginRight: 10, width: "80vw"}}
                                />
                                <MuiPhoneNumber
                                    name="phone"
                                    label="Phone Number"
                                    data-cy="user-phone"
                                    required
                                    // size="small"
                                    defaultCountry={"us"}
                                    value={tournamentData.tournamentDirectorPhone}
                                    onChange={val => handleChange(val, "tournamentDirectorPhone")}
                                    style={{minWidth: 200, maxWidth: 400, marginBottom: 10, width: "80vw"}}
                                />
                            </div>
                        </div>
                        <div className='flex-column align-start' style={{marginBottom: 10}}>
                            <div style={{marginBottom: 10}}>Venue*</div>
                            <div className='flex-column align-start'>
                                <TextField 
                                    type="text" 
                                    name="clubName"
                                    label="Club Name"
                                    required
                                    // size="small"
                                    variant="outlined" 
                                    value={tournamentData.clubName}
                                    onChange={handleTextFieldChange}
                                    style={{minWidth: 200, maxWidth: 410, marginBottom: 10, width: "80vw"}}
                                />
                            </div>
                            <div className="flex wrap">
                                <TextField 
                                    type="text"
                                    label="City" 
                                    variant="outlined"
                                    required
                                    // size="small"
                                    name="city"
                                    value={tournamentData.city}
                                    onChange={handleTextFieldChange}
                                    style={{marginRight: 10, marginBottom: 10, minWidth: 200}}

                                />
                                <TextField 
                                    type="text" 
                                    label="Country"
                                    variant="outlined" 
                                    name="country"
                                    required
                                    // size="small"
                                    value={tournamentData.country}
                                    onChange={handleTextFieldChange}
                                    style={{marginRight: 10, marginBottom: 10, minWidth: 200}}
                                />
                                <TextField 
                                    type="text" 
                                    label="Street"
                                    variant="outlined" 
                                    name="street"
                                    required
                                    // size="small"
                                    value={tournamentData.street}
                                    onChange={handleTextFieldChange}
                                    style={{marginRight: 10, marginBottom: 10, minWidth: 200}}
                                />
                                <TextField 
                                    type="text" 
                                    label="Zip Code"
                                    variant="outlined" 
                                    name="zipCode"
                                    required
                                    // size="small"
                                    value={tournamentData.zipCode}
                                    onChange={handleTextFieldChange}
                                    style={{marginRight: 10, marginBottom: 10, minWidth: 200}}
                                />
                            </div>
                            <div className='flex-column align-start wrap'>
                                <TextField 
                                    type="number" 
                                    name="courtsNumber"
                                    inputProps={{min: 1}}
                                    label="Number of Courts"
                                    variant="outlined" 
                                    required
                                    // size="small"
                                    value={tournamentData.courtsNumber}
                                    onChange={handleTextFieldChange}
                                    sx={{width: 200, marginBottom: '20px', marginRight: '10px'}}
                                />
                            </div>
                            <div className='flex-column wrap align-start'>
                                <FormControl   sx={{margin: "0 50px 20px 0"}}>
                                    <FormLabel id="surface-label" sx={{textAlign: "left"}} required>Court Surface</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="surface-label"
                                        name="radio-buttons-group"
                                    >
                                        {courtSurfaces.map(surface => {
                                            return (
                                                <FormControlLabel value={surface} control={<Radio checked={tournamentData.courtSurface === surface} onChange={() => handleRadioButtonChange(surface, "courtSurface")}/>} label={surface} />
                                            )
                                        })}
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div className='flex-column align-start' style={{marginBottom: 10}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack spacing={2}>
                                    <div style={{textAlign: "left"}}>Tournament Play Dates*&nbsp;<span className="grey">Must start at least 2 months from now</span></div>
                                    <div className="flex wrap">
                                        <DesktopDatePicker
                                            label="Start Date"
                                            minDate={getTournamentSubmissionMinDate()}
                                            value={tournamentData.startDate || null}
                                            onChange={val => handleChange(val, "startDate")}
                                            renderInput={(params) => <TextField {...params} sx={{margin: '0px 10px 10px 0px !important', width: 200}} required/>}
                                        />
                                        <DesktopDatePicker
                                            label="End Date"
                                            minDate={tournamentData.startDate || getTournamentSubmissionMinDate()}
                                            value={tournamentData.endDate || null}
                                            onChange={val => handleChange(val, "endDate")}
                                            renderInput={(params) => <TextField {...params} sx={{width: 200}} required/>}
                                        />
                                    </div>
                                </Stack>
                            </LocalizationProvider>
                        </div>
                        <div className='flex-column align-start' style={{marginBottom: 10}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack spacing={2}>
                                    <div style={{textAlign: "left"}}>On Site Sign Up Deadline*&nbsp;<span className="grey">Must be between 1-3 days before the start date</span></div>
                                    <div className="flex wrap">
                                        <DateTimePicker
                                            label="Deadline"
                                            maxDate={tournamentData.startDate ? getTournamentOnSiteSignupDeadline(tournamentData.startDate, "max") : null}
                                            minDate={tournamentData.startDate ? getTournamentOnSiteSignupDeadline(tournamentData.startDate, "min") : getTournamentOnSiteSignupDeadline(getTournamentSubmissionMinDate(), "min")}
                                            value={tournamentData.onSiteSignupDeadline || null}
                                            onChange={val => handleChange(val, "onSiteSignupDeadline")}
                                            renderInput={(params) => <TextField {...params} sx={{margin: '0px 10px 10px 0px !important', width: 220}} required/>}
                                        />
                                    </div>
                                </Stack>
                            </LocalizationProvider>
                        </div>                        
                        <div className='flex-column wrap align-start'>
                            <FormControl   sx={{margin: "0 50px 20px 0"}}>
                                <FormLabel id="qualification-label" sx={{textAlign: "left"}} required>Qualification</FormLabel>
                                <RadioGroup
                                    aria-labelledby="qualification-label"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="yes" control={<Radio checked={tournamentData.qualification ? true : false} onChange={() => handleRadioButtonChange(true, "qualification")}/>} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio checked={tournamentData.qualification === false ? true : false} onChange={() => handleRadioButtonChange(false, "qualification")}/>} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        {tournamentData.qualification && <div className='flex-column align-start' style={{marginBottom: 10}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack spacing={2}>
                                    <div style={{textAlign: "left"}}>Qualifiying Draw Dates*</div>
                                    <div className="flex wrap">
                                        <DesktopDatePicker
                                            label="Start Date"
                                            minDate={tournamentData.startDate || getTournamentSubmissionMinDate()}
                                            maxDate={tournamentData.endDate}
                                            value={tournamentData.qualificationStartDate || null}
                                            onChange={val => handleChange(val, "qualificationStartDate")}
                                            renderInput={(params) => <TextField {...params} sx={{margin: '0px 10px 10px 0px !important', width: 200}} required/>}
                                        />
                                        <DesktopDatePicker
                                            label="End Date"
                                            minDate={tournamentData.qualificationStartDate || tournamentData.startDate || getTournamentSubmissionMinDate()}
                                            maxDate={tournamentData.endDate}
                                            value={tournamentData.qualificationEndDate || null}
                                            onChange={val => handleChange(val, "qualificationEndDate")}
                                            renderInput={(params) => <TextField {...params} sx={{width: 200}} required/>}
                                        />
                                    </div>
                                </Stack>
                            </LocalizationProvider>
                        </div>}
                        <div className="flex wrap">
                            <FormControl sx={{margin: "0 50px 20px 0"}}>
                                <FormLabel id="gender-group-label" sx={{textAlign: "left"}} required>Gender Group</FormLabel>
                                <RadioGroup
                                    aria-labelledby="gender-group-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="Female" control={<Radio checked={tournamentData.genderGroup === "Female"} onChange={(e) => handleRadioButtonChange(e, "genderGroup")}/>} label="Women" />
                                    <FormControlLabel value="Male" control={<Radio checked={tournamentData.genderGroup === "Male"} onChange={(e) => handleRadioButtonChange(e, "genderGroup")}/>} label="Men" />
                                    <FormControlLabel value="Mixed" control={<Radio checked={tournamentData.genderGroup === "Mixed"} disabled={tournamentData.drawType === "singles"} onChange={(e) => handleRadioButtonChange(e, "genderGroup")}/>} label="Mixed" />
                                </RadioGroup>
                            </FormControl>
                            <FormControl sx={{margin: "0 50px 20px 0"}}>
                                <FormLabel id="draw-types-label" sx={{textAlign: "left"}} required>Draw Types</FormLabel>
                                <RadioGroup
                                    aria-labelledby="draw-types-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="singles" control={<Radio checked={tournamentData.drawType === "singles"} disabled={tournamentData.genderGroup.toLowerCase() === "mixed"} onChange={(e) => handleRadioButtonChange(e, "drawType")}/>} label="Singles Only" />
                                    <FormControlLabel value="doubles" control={<Radio checked={tournamentData.drawType === "doubles"} onChange={(e) => handleRadioButtonChange(e, "drawType")}/>} label="Doubles Only" />
                                    <FormControlLabel value="singlesAndDoubles" control={<Radio checked={tournamentData.drawType === "singlesAndDoubles"} onChange={(e) => handleRadioButtonChange(e, "drawType")}/>} label="Singles & Doubles" />
                                </RadioGroup>
                            </FormControl>
                            <FormControl   sx={{margin: "0 50px 20px 0"}}>
                                <FormLabel id="age-groups-label" sx={{textAlign: "left"}} required>Age Groups</FormLabel>
                                <RadioGroup
                                    aria-labelledby="age-groups-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="U40" control={<Checkbox checked={tournamentData.ageGroups.includes("U40") ? true : false} onChange={handleCheckboxChange}/>} label="U40" />
                                    <FormControlLabel value="U60" control={<Checkbox checked={tournamentData.ageGroups.includes("U60") ? true : false} onChange={handleCheckboxChange}/>} label="U60" />
                                    <FormControlLabel value="60+" control={<Checkbox checked={tournamentData.ageGroups.includes("60+") ? true : false} onChange={handleCheckboxChange}/>} label="60+" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <div className="flex wrap justify-start">
                            {tournamentData.drawType !== 'doubles' && <FormControl sx={{margin: "0 50px 20px 0"}}>
                                <FormLabel id="main-draw-size-label" sx={{textAlign: "left"}} required>Singles Draw Size</FormLabel>
                                <RadioGroup
                                    aria-labelledby="main-draw-size-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="8" control={<Radio checked={tournamentData.singlesDrawSize === "8"} onChange={(e) => handleRadioButtonChange(e, "singlesDrawSize")}/>} label="8" />
                                    <FormControlLabel value="16" control={<Radio checked={tournamentData.singlesDrawSize === "16"} onChange={(e) => handleRadioButtonChange(e, "singlesDrawSize")}/>} label="16" />
                                    <FormControlLabel value="32" control={<Radio checked={tournamentData.singlesDrawSize === "32"} onChange={(e) => handleRadioButtonChange(e, "singlesDrawSize")}/>} label="32" />
                                    <FormControlLabel value="64" control={<Radio checked={tournamentData.singlesDrawSize === "64"} onChange={(e) => handleRadioButtonChange(e, "singlesDrawSize")}/>} label="64" />
                                    <FormControlLabel value="128" control={<Radio checked={tournamentData.singlesDrawSize === "128"} onChange={(e) => handleRadioButtonChange(e, "singlesDrawSize")}/>} label="128" />
                                </RadioGroup>
                            </FormControl>}
                            {tournamentData.qualification && <FormControl sx={{margin: "0 50px 20px 0"}}>
                                <FormLabel id="qualifying-draw-size-label" sx={{textAlign: "left"}} required>Qualifiying Draw Size</FormLabel>
                                <RadioGroup
                                    aria-labelledby="qualifying-draw-size-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="8" control={<Radio checked={tournamentData.qualifyingDrawSize === "8"} onChange={(e) => handleRadioButtonChange(e, "qualifyingDrawSize")}/>} label="8" />
                                    <FormControlLabel value="16" control={<Radio checked={tournamentData.qualifyingDrawSize === "16"} onChange={(e) => handleRadioButtonChange(e, "qualifyingDrawSize")}/>} label="16" />
                                    <FormControlLabel value="32" control={<Radio checked={tournamentData.qualifyingDrawSize === "32"} onChange={(e) => handleRadioButtonChange(e, "qualifyingDrawSize")}/>} label="32" />
                                    <FormControlLabel value="64" control={<Radio checked={tournamentData.qualifyingDrawSize === "64"} onChange={(e) => handleRadioButtonChange(e, "qualifyingDrawSize")}/>} label="64" />
                                    <FormControlLabel value="128" control={<Radio checked={tournamentData.qualifyingDrawSize === "128"} onChange={(e) => handleRadioButtonChange(e, "qualifyingDrawSize")}/>} label="128" />
                                </RadioGroup>
                            </FormControl>}
                            {tournamentData.drawType && tournamentData.drawType !== "singles" && <FormControl sx={{margin: "0 50px 20px 0"}}>
                                <FormLabel id="doubles-draw-size-label" sx={{textAlign: "left"}} required>Doubles Draw Size</FormLabel>
                                <RadioGroup
                                    aria-labelledby="doubles-draw-size-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="8" control={<Radio checked={tournamentData.doublesDrawSize === "8"} onChange={(e) => handleRadioButtonChange(e, "doublesDrawSize")}/>} label="8" />
                                    <FormControlLabel value="16" control={<Radio checked={tournamentData.doublesDrawSize === "16"} onChange={(e) => handleRadioButtonChange(e, "doublesDrawSize")}/>} label="16" />
                                    <FormControlLabel value="32" control={<Radio checked={tournamentData.doublesDrawSize === "32"} onChange={(e) => handleRadioButtonChange(e, "doublesDrawSize")}/>} label="32" />
                                    <FormControlLabel value="64" control={<Radio checked={tournamentData.doublesDrawSize === "64"} onChange={(e) => handleRadioButtonChange(e, "doublesDrawSize")}/>} label="64" />
                                    <FormControlLabel value="128" control={<Radio checked={tournamentData.doublesDrawSize === "128"} onChange={(e) => handleRadioButtonChange(e, "doublesDrawSize")}/>} label="128" />
                                </RadioGroup>
                            </FormControl>}
                            {tournamentData.genderGroup === "Mixed" && tournamentData.drawType && tournamentData.drawType !== "singles" && <FormControl sx={{margin: "0 50px 20px 0"}}>
                                <FormLabel id="mixed-doubles-draw-size-label" sx={{textAlign: "left"}} required>Mixed Doubles Draw Size</FormLabel>
                                <RadioGroup
                                    aria-labelledby="mixed-doubles-draw-size-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="8" control={<Radio checked={tournamentData.mixedDoublesDrawSize === "8"} onChange={(e) => handleRadioButtonChange(e, "mixedDoublesDrawSize")}/>} label="8" />
                                    <FormControlLabel value="16" control={<Radio checked={tournamentData.mixedDoublesDrawSize === "16"} onChange={(e) => handleRadioButtonChange(e, "mixedDoublesDrawSize")}/>} label="16" />
                                    <FormControlLabel value="32" control={<Radio checked={tournamentData.mixedDoublesDrawSize === "32"} onChange={(e) => handleRadioButtonChange(e, "mixedDoublesDrawSize")}/>} label="32" />
                                    <FormControlLabel value="64" control={<Radio checked={tournamentData.mixedDoublesDrawSize === "64"} onChange={(e) => handleRadioButtonChange(e, "mixedDoublesDrawSize")}/>} label="64" />
                                    <FormControlLabel value="128" control={<Radio checked={tournamentData.mixedDoublesDrawSize === "128"} onChange={(e) => handleRadioButtonChange(e, "mixedDoublesDrawSize")}/>} label="128" />
                                </RadioGroup>
                            </FormControl>}
                        </div>
                        <div className='flex-column align-start wrap'>
                            <div style={{marginBottom: 10}}>Entry Tax*</div>
                            <TextField 
                                type="number" 
                                name="entryTax"
                                inputProps={{min: 0}}
                                label="Amount (€)"
                                variant="outlined" 
                                required
                                // size="small"
                                value={tournamentData.entryTax}
                                onChange={handleTextFieldChange}
                                sx={{width: 200, marginBottom: '10px', marginRight: '10px'}}
                            />
                        </div>
                        <div className='flex-column align-start wrap'>
                            <div style={{marginBottom: 10}}>Prize Money*</div>
                            <TextField 
                                type="number" 
                                name="prizeMoney"
                                inputProps={{min: 0}}
                                label="Amount (€)"
                                variant="outlined" 
                                required
                                // size="small"
                                value={tournamentData.prizeMoney}
                                onChange={handleTextFieldChange}
                                sx={{width: 200, marginBottom: '10px', marginRight: '10px'}}
                            />
                        </div>
                        <div className='flex-column wrap align-start'>
                            <div style={{marginBottom: 10}}>Medical Team on Site*</div>
                            <FormControl   sx={{margin: "0 50px 20px 0"}}>
                                <RadioGroup
                                    aria-labelledby="medical-team-on-site"
                                    defaultValue="no"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value="yes" control={<Radio checked={tournamentData.medicalTeamOnSite ? true : false} onChange={() => handleRadioButtonChange(true, "medicalTeamOnSite")}/>} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio checked={tournamentData.medicalTeamOnSite === false ? true : false} onChange={() => handleRadioButtonChange(false, "medicalTeamOnSite")}/>} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <div className="flex wrap">
                            <Button variant="contained" sx={{height: 40, margin: '0px 10px 10px 0px !important'}} type="submit" disabled={validateFields()} endIcon={<SendIcon />}>Submit</Button> 
                            {/* <Button variant="contained" sx={{height: 40, margin: '0px 10px 10px 0px !important'}} onClick={fillWithTestData}>FILL WITH TEST DATA</Button> uncomment for test purposes only */}
                            {checkIfInfoIsFilledIn() && <Button variant="outlined" height={70} startIcon={<ClearIcon />} sx={{height: 40, margin: '0px 10px 0px 0px !important'}} onClick={clearFields}>Clear Fields</Button>}
                        </div>
                        {checkIfInfoIsFilledIn() && validateFields() && <div className="error">Please fill in all of the fields above.</div>}
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                            timeout: 500,
                            }}
                        >
                            <Fade in={open}>
                            <Box sx={style} className="large-modal full-width">
                                <div className="flex-column justify-center align-center">
                                    <div className='flex-column full-width' style={{marginBottom: 30}}>
                                        <div className="flex justify-between align-center">
                                            <h2 className="accent-color modal-title">{tournamentData?.tournamentName}</h2>
                                            <div className="close-icon"><ClearIcon className="pointer accent-color" onClick={handleClose}/></div>
                                        </div>
                                        <div style={{marginBottom: 5}}>
                                            {tournamentData?.startDate && tournamentData?.endDate && <div>{getDateString(new Date (tournamentData?.startDate).getTime())} - {getDateString(new Date (tournamentData?.endDate).getTime())}</div>}
                                        </div>
                                        <div style={{marginBottom: 5}}>{tournamentData?.clubName}</div>
                                        <div style={{marginBottom: 5}}>{tournamentData?.street}, {tournamentData?.city}, {tournamentData?.country} {tournamentData?.zipCode}</div>
                                        <h3 className="accent-color section-title">General Information</h3>
                                        <div className="flex-column">
                                            <div style={{marginBottom: 15}}>{tournamentData?.description}</div>
                                            {tournamentData?.onSiteSignupDeadline && <div style={{marginBottom: 5}}>On Site Signup Deadline: {getDateTimeString(new Date (tournamentData.onSiteSignupDeadline).getTime())}</div>}
                                            <div style={{marginBottom: 5}}>{!tournamentData.qualification ? "There is no qualifying draw." : 
                                                tournamentData?.qualification && tournamentData?.qualificationStartDate && tournamentData?.qualificationEndDate && 
                                                    `Qualification Dates: ${getDateString(new Date (tournamentData?.qualificationStartDate).getTime())} - ${getDateString(new Date (tournamentData?.qualificationEndDate).getTime())}`
                                            }</div>
                                        </div>
                                        <h3 className="accent-color section-title">Terms of Play</h3>
                                        <div className="flex-column">
                                            {tournamentData?.courtsNumber && tournamentData?.courtSurface && <div className="flex-column justify-start" style={{marginBottom: 30}}>
                                                <div style={{marginBottom: 5}}>Courts Available:</div>
                                                <div>{tournamentData?.courtsNumber} {tournamentData?.courtSurface} Courts</div>
                                            </div>}
                                            <div className="flex-column justify-start"> 
                                                <div style={{marginBottom: 5}}>Draw(s):</div>
                                                {getDraws(tournamentData?.ageGroups, tournamentData?.genderGroup, tournamentData?.drawType)}
                                            </div>
                                            <div className="flex-column justify-start" style={{marginBottom: 30}}> 
                                                <div style={{marginBottom: 5}}>Draw size(s):</div>
                                                {tournamentData.drawType !== "doubles" && tournamentData.singlesDrawSize && <div>Main Draw: {tournamentData.singlesDrawSize}</div>}
                                                {tournamentData.drawType !== "singles" && tournamentData.doublesDrawSize && <div>Doubles Draw: {tournamentData.doublesDrawSize}</div>}
                                                {tournamentData.drawType !== "singles" && tournamentData.genderGroup?.toLowerCase() === "mixed" && tournamentData.mixedDoublesDrawSize && <div>Mixed Doubles Draw: {tournamentData.mixedDoublesDrawSize}</div>}
                                            </div>
                                            <div className="flex-column justify-start"> 
                                                <div style={{marginBottom: 5}}>Entry Tax:</div>
                                                <div style={{marginBottom: 30}}>{tournamentData?.entryTax > 0 ? `${tournamentData?.entryTax} EUR` : 'No entry tax.'}</div>
                                            </div>
                                            <div className="flex-column justify-start"> 
                                                <div style={{marginBottom: 5}}>Prize Money:</div>
                                                <div style={{marginBottom: 30}}>{tournamentData?.prizeMoney > 0 ? `${tournamentData?.prizeMoney} EUR` : 'No prize money.'}</div>
                                            </div>
                                            <div>{tournamentData?.medicalTeamOnSite ? 'There will be a medical team available on site.' : 'No medical team available on site.'}</div>
                                        </div>
                                        <div className='flex wrap justify-center' style={{marginTop: 40}}>
                                            <Button variant="contained" onClick={confirmSubmission} sx={{margin: '0 5px 0 0 !important'}} startIcon={<CheckIcon />}>Confirm Submission</Button>
                                            <Button variant="outlined" onClick={handleClose} sx={{margin: '0 0 0 5px !important'}} endIcon={<EditIcon />}>Edit Submission</Button>
                                        </div>
                                    </div>
                                </div>
                            </Box>
                            </Fade>
                        </Modal>
                    </div>
                </form>
            </div>) :
            (<div className="flex-column justify-center align-center">
                <div>You do not have access to this page because it is accessible only by club representatives. </div>
                <div>If you believe this is a mistake, please contact an administrator.</div>
                {userData && userData.role && userData.role !== 'clubRep' && <div> 
                    <div style={{marginTop: 20}}>If you wish to log into another account, please click the button below.</div>
                    <Button variant="contained" sx={{margin: '10px 0px 0px 0px !important'}} onClick={() => handleLogout()}>Logout</Button>
                </div>}
                {!Object.keys(userData).length && <div> 
                    <div style={{marginTop: 20}}>If you wish to log into your account, please click the button below.</div>
                    <Button variant="contained" sx={{margin: '10px 0px 0px 0px !important'}} onClick={() => history.push('/login')}>Login</Button>
                </div>}
            </div>)}
        </div>
    )
}

export default TournamentSubmission