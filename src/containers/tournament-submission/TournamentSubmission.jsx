import React, { useEffect, useState } from 'react';
import { getDateString } from '../../utils/helpers';

// material imports
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Stack from '@mui/material/Stack';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { Button, Checkbox, drawerClasses } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

//modal material
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

import MuiPhoneNumber from "material-ui-phone-number";

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

const initialTournamentData = {
    tournamentName: '',
    description: '',
    city: '',
    country: '',
    street: '',
    zipCode: '',
    clubName: '',
    startDate: '',
    endDate: '',
    tournamentDirector: '',
    tournamentDirectorPhone: '',
    genderGroup: '',
    ageGroups: [],
    drawType: '',
    entryTax: '',
    prizeMoney: '',
    medicalTeamOnSite: ''
}



const TournamentSubmission = () => {
    const [tournamentData, setTournamentData] = useState(initialTournamentData)
    const [open, setOpen] = useState(false)
    const [openSuccessScreen, setOpenSuccessScreen] = useState(false)
    const [displayError, setDisplayError] = useState(false)

    const validateFields = () => {
        let bool = false
        for (const key in tournamentData) {
            if (tournamentData[key] !== initialTournamentData[key]) {
                bool = true
            }
        }

        return bool
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('form submission', tournamentData)

        const valid = validateFields()

        if (valid) {
            setOpen(true)
            setDisplayError(false)
        } else {
            setDisplayError(true)
        }
    }

    const confirmSubmission = () => {
        console.log("submission confirmed", tournamentData)
        setTournamentData(initialTournamentData)
        setOpen(false)
        setTimeout(() => setOpenSuccessScreen(true), 300)
        setTimeout(() => setOpenSuccessScreen(false), 3300)
    }

    const handleSuccessModalClose = () => {
        setOpenSuccessScreen(false)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        setTournamentData({...tournamentData, [name]: value})
    }

    const handleMedicalTeamChange = (bool) => {
        setTournamentData({
            ...tournamentData,
            medicalTeamOnSite: bool
        })
    }

    const handleDrawChange = (e) => {
        const selectedOption = e.target.value

        setTournamentData({
            ...tournamentData,
            drawType: selectedOption
        })
    }

    const handleGenderGroupChange = (e) => {
        const selectedOption = e.target.value
        setTournamentData({
            ...tournamentData,
            genderGroup: selectedOption
        })
    }

    const handleAgeGroupChange = (e) => {
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

    const handleStartDateChange = (val) => {
        setTournamentData({...tournamentData, startDate: val})
    }

    const handleEndDateChange = (val) => {
        setTournamentData({...tournamentData, endDate: val})
    }

    const handlePhoneChange = (e) => {
        setTournamentData({
            ...tournamentData,
            tournamentDirectorPhone: e
        })
    }

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

    useEffect(() => {
        console.log(JSON.stringify(tournamentData))
    }, [tournamentData])

    return (
        <div className='container'>
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
                            value={tournamentData.tournamentName}
                            onChange={handleChange}
                            style={{minWidth: 200, maxWidth: 410, marginBottom: 10, width: "80vw"}}
                        />
                        <TextField 
                            type="text" 
                            name="description"
                            label="Tournament Description"
                            variant="outlined"
                            multiline
                            minRows={3}
                            maxRows={4}
                            value={tournamentData.description}
                            onChange={handleChange}
                            style={{minWidth: 200, maxWidth: 820, marginBottom: 10, width: "80vw"}}
                        />
                        <div className='flex wrap'>
                            <TextField 
                                type="text" 
                                name="tournamentDirector"
                                label="Tournament Director"
                                variant="outlined"
                                value={tournamentData.tournamentDirector}
                                onChange={handleChange}
                                style={{minWidth: 200, maxWidth: 410, marginBottom: 10, marginRight: 10, width: "80vw"}}
                            />
                            <MuiPhoneNumber
                                name="phone"
                                label="Phone Number"
                                data-cy="user-phone"
                                defaultCountry={"us"}
                                value={tournamentData.tournamentDirectorPhone}
                                onChange={handlePhoneChange}
                                style={{minWidth: 200, maxWidth: 400, marginBottom: 10, width: "80vw"}}
                            />
                        </div>
                    </div>
                    <div className='flex-column align-start' style={{marginBottom: 10}}>
                        <div style={{marginBottom: 10}}>Location*</div>
                        <div className='flex-column align-start'>
                            <TextField 
                                type="text" 
                                name="clubName"
                                label="Club Name"
                                variant="outlined" 
                                value={tournamentData.clubName}
                                onChange={handleChange}
                                style={{minWidth: 200, maxWidth: 410, marginBottom: 10, width: "80vw"}}
                            />
                        </div>
                        <div className="flex wrap">
                            <TextField 
                                type="text"
                                label="City" 
                                variant="outlined"
                                name="city"
                                value={tournamentData.city}
                                onChange={handleChange}
                                style={{marginRight: 10, marginBottom: 10, minWidth: 200}}

                            />
                            <TextField 
                                type="text" 
                                label="Country"
                                variant="outlined" 
                                name="country"
                                value={tournamentData.country}
                                onChange={handleChange}
                                style={{marginRight: 10, marginBottom: 10, minWidth: 200}}
                            />
                            <TextField 
                                type="text" 
                                label="Street"
                                variant="outlined" 
                                name="street"
                                value={tournamentData.street}
                                onChange={handleChange}
                                style={{marginRight: 10, marginBottom: 10, minWidth: 200}}
                            />
                            <TextField 
                                type="text" 
                                label="Zip Code"
                                variant="outlined" 
                                name="zipCode"
                                value={tournamentData.zipCode}
                                onChange={handleChange}
                                style={{marginRight: 10, marginBottom: 10, minWidth: 200}}
                            />
                        </div>
                    </div>
                    <div className='flex-column align-start' style={{marginBottom: 10}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={2}>
                                <div style={{textAlign: "left"}}>Play Dates*</div>
                                <div className="flex wrap">
                                    <DesktopDatePicker
                                        label="Start Date"
                                        minDate={new Date ()}
                                        value={tournamentData.startDate || null}
                                        onChange={handleStartDateChange}
                                        renderInput={(params) => <TextField {...params} sx={{margin: '0px 10px 10px 0px !important', width: 200}}
/>}
                                    />
                                    <DesktopDatePicker
                                        label="End Date"
                                        minDate={tournamentData.startDate || new Date ()}
                                        value={tournamentData.endDate || null}
                                        onChange={handleEndDateChange}
                                        renderInput={(params) => <TextField {...params} sx={{width: 200}}/>}
                                    />
                                </div>
                            </Stack>
                        </LocalizationProvider>
                    </div>
                    <div className="flex wrap">
                        <FormControl   sx={{margin: "0 50px 20px 0"}}>
                            <FormLabel id="demo-radio-buttons-group-label" sx={{textAlign: "left"}}>Gender Group*</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="women" control={<Radio   checked={tournamentData.genderGroup === "women" ? true : false} onChange={handleGenderGroupChange}/>} label="Women" />
                                <FormControlLabel value="men" control={<Radio   checked={tournamentData.genderGroup === "men"? true : false} onChange={handleGenderGroupChange}/>} label="Men" />
                                <FormControlLabel value="mixed" control={<Radio   checked={tournamentData.genderGroup === "mixed" ? true : false} disabled={tournamentData.drawType === "singles" ? true : false} onChange={handleGenderGroupChange}/>} label="Mixed" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl   sx={{margin: "0 50px 20px 0"}}>
                            <FormLabel id="demo-radio-buttons-group-label" sx={{textAlign: "left"}}>Draw Types*</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="singles" control={<Radio   checked={tournamentData.drawType === "singles" ? true : false} disabled={tournamentData.genderGroup === "mixed"? true : false} onChange={handleDrawChange}/>} label="Singles Only" />
                                <FormControlLabel value="doubles" control={<Radio   checked={tournamentData.drawType === "doubles" ? true : false} onChange={handleDrawChange}/>} label="Doubles Only" />
                                <FormControlLabel value="singlesAndDoubles" control={<Radio   checked={tournamentData.drawType === "singlesAndDoubles" ? true : false} onChange={handleDrawChange}/>} label="Singles & Doubles" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl   sx={{margin: "0 50px 20px 0"}}>
                            <FormLabel id="demo-radio-buttons-group-label" sx={{textAlign: "left"}}>Age Groups*</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="U40" control={<Checkbox   checked={tournamentData.ageGroups.includes("U40") ? true : false} onChange={handleAgeGroupChange}/>} label="U40" />
                                <FormControlLabel value="U60" control={<Checkbox   checked={tournamentData.ageGroups.includes("U60") ? true : false} onChange={handleAgeGroupChange}/>} label="U60" />
                                <FormControlLabel value="plus60" control={<Checkbox   checked={tournamentData.ageGroups.includes("plus60") ? true : false} onChange={handleAgeGroupChange}/>} label="60+" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className='flex-column align-start wrap'>
                        <div style={{marginBottom: 10}}>Entry Tax*</div>
                        <TextField 
                            type="number" 
                            name="entryTax"
                            inputProps={{min: 0}}
                            label="Amount (€)"
                            variant="outlined" 
                            value={tournamentData.entryTax}
                            onChange={handleChange}
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
                            value={tournamentData.prizeMoney}
                            onChange={handleChange}
                            sx={{width: 200, marginBottom: '10px', marginRight: '10px'}}
                        />
                    </div>
                    <div className='flex-column wrap align-start'>
                        <div style={{marginBottom: 10}}>Medical Team on Site*</div>
                        <FormControl   sx={{margin: "0 50px 20px 0"}}>
                            {/* <FormLabel id="demo-radio-buttons-group-label" sx={{textAlign: "left"}}>Draw Types*</FormLabel> */}
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                            >
                                <FormControlLabel value="yes" control={<Radio checked={tournamentData.medicalTeamOnSite ? true : false} onChange={() => handleMedicalTeamChange(true)}/>} label="Yes" />
                                <FormControlLabel value="no" control={<Radio checked={tournamentData.medicalTeamOnSite === false ? true : false} onChange={() => handleMedicalTeamChange(false)}/>} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="flex wrap">
                        {/* <button className='button action-button' type="submit" style={{marginRight: 10}} disabled={validateFields()}>Submit</button> */}
                        <Button variant="contained" sx={{height: 40, margin: '0px 10px 10px 0px !important'}} type="submit">Submit</Button> 
                        {/* //TODO: disabled state when not all data fields are entered*/}
                        <Button variant="contained" sx={{height: 40, margin: '0px 10px 10px 0px !important'}} onClick={() => setTournamentData({"tournamentName":"Test Tournament Name", "clubName": "Test Club Name", "description":"This is the tournament description","city":"Sofia","country":"Bulgaria","street":"ul. 671-va 3A","zipCode":"1632","startDate":"2023-02-15T12:04:46.000Z","endDate":"2023-02-18T12:04:47.000Z","tournamentDirector":"Kristina Kapitanova","tournamentDirectorPhone":"+1 (233) 23","genderGroup":"mixed","ageGroups":["U60"],"drawType":"singlesAndDoubles","entryTax":"75","prizeMoney":"20000","medicalTeamOnSite":false})}>FILL WITH TEST DATA</Button>
                        {checkIfInfoIsFilledIn() && <Button variant="outlined" height={70} startIcon={<ClearIcon />} sx={{height: 40, margin: '0px 10px 0px 0px !important'}} onClick={clearFields}>Clear Fields</Button>}
                    </div>
                    {displayError && <div className="error">Please fill in all of the fields above.</div>}
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
                        <Box sx={style}>
                            <div className="flex-column">
                                <h2 style={{fontWeight: '500'}}>{tournamentData?.tournamentName}</h2>
                                <div style={{marginBottom: 5}}>
                                    {(tournamentData?.startDate && tournamentData?.endDate) &&<div>{getDateString(new Date (tournamentData?.startDate).getTime())} - {getDateString(new Date (tournamentData?.endDate).getTime())}</div>}
                                </div>
                                <div style={{marginBottom: 5}}>{tournamentData?.clubName}</div>
                                <div style={{marginBottom: 5}}>{tournamentData?.city}, {tournamentData?.country}</div>
                                <h3 style={{fontWeight: '600', marginTop: 40}}>Terms of Play</h3>
                                <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                                <h3 style={{fontWeight: '600', marginTop: 40}}>Section Title</h3>
                                <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                                <h3 style={{fontWeight: '600', marginTop: 40}}>Section Title</h3>
                                <div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</div>
                                <div className='flex wrap justify-center' style={{marginTop: 40}}>
                                    <Button variant="contained" onClick={confirmSubmission} sx={{margin: '0 5px 0 0 !important'}}>Confirm Submission</Button>
                                    <Button variant="outlined" onClick={handleClose} sx={{margin: '0 0 0 5px !important'}}>Edit Submission</Button>
                                </div>
                            </div>
                        </Box>
                        </Fade>
                    </Modal>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={openSuccessScreen}
                        onClose={handleSuccessModalClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                        }}
                    >
                        <Fade in={openSuccessScreen}>
                        <Box sx={{...style, width: '400px'}}>
                            <div className="flex-column" style={{textAlign: 'center'}}>
                               You have successfully submitted your tournament!
                               You will be contacted when the tournament is approved.
                               Approved tournament will appear in the tournament calendar.
                            </div>
                        </Box>
                        </Fade>
                    </Modal>
                </div>
            </form>
        </div>
    )
}

export default TournamentSubmission