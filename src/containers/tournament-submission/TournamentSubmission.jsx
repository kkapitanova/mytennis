import React, { useEffect, useState } from 'react';

import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Stack from '@mui/material/Stack';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const initialTournamentData = {
    name: '',
    description: '',
    location: '',
    city: '',
    country: '',
    street: '',
    zipCode: '',
    clubName: '',
    startDate: '',
    endDate: '',
    tournamentDirector: ''
}

const TournamentSubmission = () => {
    const [initialLoad, setInitialLoad] = useState(false)
    const [tournamentData, setTournamentData] = useState(initialTournamentData)

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('form submission', tournamentData)
    }

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        setTournamentData({...tournamentData, [name]: value})
    }

    const handleStartDateChange = (val) => {
        setTournamentData({...tournamentData, startDate: val})
    }

    const handleEndDateChange = (val) => {
        setTournamentData({...tournamentData, endDate: val})
    }

    const checkIfInfoIsFilledIn = () => {

        let bool = false

        for (const key in tournamentData) {
            if (tournamentData[key] !== '') {
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
        setInitialLoad(true)
      }, [initialLoad])

    return (
        <div style={{padding: "0px 50px 50px"}}>
            <h3 className="accent-color left-align-text">Tournament Submission</h3>
            <form onSubmit={handleSubmit}>
                <div className='flex-column align-start'>
                    <div className='flex-column align-start' style={{marginBottom: 10}}>
                        <div style={{marginBottom: 10}}>Main Information</div>
                        <TextField 
                            type="text" 
                            name="name"
                            label="Name"
                            variant="outlined"
                            color="secondary"
                            value={tournamentData.name}
                            onChange={handleChange}
                            style={{marginBottom: 10, minWidth: 300}}
                        />
                        <TextField 
                            type="text" 
                            name="description"
                            label="Description"
                            variant="outlined"
                            color="secondary"
                            multiline
                            minRows={3}
                            maxRows={4}
                            value={tournamentData.description}
                            onChange={handleChange}
                            style={{marginBottom: 10, width: "50vw", minWidth: 200}}
                        />
                    </div>
                    <div className='flex-column align-start' style={{marginBottom: 10}}>
                        <div style={{marginBottom: 10}}>Location</div>
                        <div className='flex-column align-start'>
                            <TextField 
                                type="text" 
                                name="clubName"
                                label="Club Name"
                                variant="outlined" 
                                color="secondary"
                                value={tournamentData.site}
                                onChange={handleChange}
                                style={{minWidth: 300, marginBottom: 10}}
                            />
                        </div>
                        <div className="flex wrap">
                            <TextField 
                                type="text"
                                label="City" 
                                variant="outlined"
                                name="city"
                                color="secondary"
                                value={tournamentData.city}
                                onChange={handleChange}
                                style={{marginRight: 10, marginBottom: 10, minWidth: 200}}

                            />
                            <TextField 
                                type="text" 
                                label="Country"
                                variant="outlined" 
                                name="country"
                                color="secondary"
                                value={tournamentData.country}
                                onChange={handleChange}
                                style={{marginRight: 10, marginBottom: 10, minWidth: 200}}
                            />
                            <TextField 
                                type="text" 
                                label="Street"
                                variant="outlined" 
                                name="street"
                                color="secondary"
                                value={tournamentData.street}
                                onChange={handleChange}
                                style={{marginRight: 10, marginBottom: 10, minWidth: 200}}
                            />
                            <TextField 
                                type="text" 
                                label="Zip Code"
                                variant="outlined" 
                                name="zipCode"
                                color="secondary"
                                value={tournamentData.zipCode}
                                onChange={handleChange}
                                style={{marginRight: 10, marginBottom: 10, minWidth: 200}}
                            />
                        </div>
                    </div>
                    <div className='flex-column align-start' style={{marginBottom: 10}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={2}>
                                <div style={{textAlign: "left"}}>Play Dates</div>
                                <div className="flex wrap">
                                    <DesktopDatePicker
                                        label="Start Date"
                                        color="secondary"
                                        minDate={new Date ()}
                                        value={tournamentData.startDate || null}
                                        onChange={handleStartDateChange}
                                        renderInput={(params) => <TextField {...params} style={{marginRight: 10, marginBottom: 10, minWidth: 200}}
/>}
                                    />
                                    <DesktopDatePicker
                                        label="End Date"
                                        color="secondary"
                                        minDate={tournamentData.startDate || new Date ()}
                                        value={tournamentData.endDate || null}
                                        onChange={handleEndDateChange}
                                        renderInput={(params) => <TextField {...params} style={{minWidth: 200}}/>}
                                    />
                                </div>
                            </Stack>
                        </LocalizationProvider>
                    </div>
                    <div className="flex">
                        <button className='button action-button' type="submit" style={{marginRight: 10}}>Submit</button>
                        {checkIfInfoIsFilledIn() && <Button variant="outlined" height={70} startIcon={<ClearIcon />} color='secondary' sx={{height: 40, margin: '0px !important'}} onClick={clearFields}>Clear Fields</Button>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default TournamentSubmission