import React, { useEffect, useState } from 'react';
import { getAvailableDraws } from '../../utils/helpers'

// material imports
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const PointsDistribution = ({
    tournament, 
    onConfirm,
    text
}) => {

    const [count, setCount] = useState(0)
    const [points, setPoints] = useState([])
    const [isDisabled, setIsDisabled] = useState(true)

    const availableDraws = getAvailableDraws(tournament)

    const handleChange = (e, key, name) => {

        const updatedPoints = [...points]
        const updatedItemIndex = points.findIndex(el => el.key === key)

        if (updatedItemIndex !== -1) {
            const updatedItem = updatedPoints[updatedItemIndex]
            updatedItem[name] = e.target.value

            setPoints(updatedPoints)
        }
    }

    // disable confirm button if not all fields are filled in
    useEffect(() => {
        let bool = false

        points.forEach(p => {
            for (let key in p) {
                if (!p[key]) {
                    bool = true
                }
            }
        })

        setIsDisabled(bool)
    }, [points])


    useEffect(() => {
        console.log(tournament)
    }, [tournament])

    return (
        <div className="flex-column justify-start full-width">
            <h3 className="accent-color section-title">Points distribution</h3>
            <div className="flex wrap justify-between align-center">
                {points.map(entry => {
                    return (
                        <div className="flex wrap" key={entry.key}>
                            <TextField
                                name="playerID"
                                label="Player ID"
                                variant="outlined"
                                size="small"
                                value={entry.playerID}
                                onChange={(e) => handleChange(e, entry.key, 'playerID')}
                                style={{minWidth: 200, margin: '0px 5px 10px 0px'}}
                            />
                            <TextField
                                type="number" 
                                name="pointsWon"
                                label="Points Won"
                                variant="outlined"
                                size="small"
                                value={entry.pointsWon}
                                onChange={(e) => handleChange(e, entry.key, 'pointsWon')}
                                style={{minWidth: 200, margin: '0px 5px 10px 0px'}}
                            />
                            <TextField
                                id="outlined-select-currency"
                                name="draw"
                                select
                                label="Draw"
                                value={entry.draw}
                                onChange={(e) => handleChange(e, entry.key, 'draw')}
                                size="small"
                                style={{width: 250, margin: '0px 5px 10px 0px'}}
                            >
                                {availableDraws.map((option, index) => (
                                    <MenuItem key={index} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button 
                                variant={'outlined'} 
                                sx={{height: 40, margin: '0px 5px 20px 0px !important'}} 
                                className="red-button"
                                onClick={() => {
                                    const updatedPoints = points.filter(el => el.key !== entry.key)
                                    setPoints(updatedPoints)
                                }}
                                startIcon={<DeleteOutlinedIcon />}
                            >Remove</Button>
                        </div>
                    )
                })}
            </div>
            <Button 
                variant={'outlined'} 
                sx={{height: 40, width: 200, margin: '0px !important'}} 
                onClick={() => {
                    setPoints([
                        ...points,
                        {
                            playerID: '',
                            pointsWon: '',
                            draw: '',
                            key: new Date().getTime()
                        }
                    ])
                }}
                startIcon={<AddIcon />}
            >Add Competitor</Button>
            <Button 
                variant={text === "Confirm Distribution" ? 'contained' : 'outlined'} 
                sx={{height: 40, margin: '30px 0px 0px 0px !important'}} 
                onClick={() => onConfirm(points)}
                disabled={!points.length || isDisabled}
                startIcon={<CheckIcon />}
            >{text}</Button>
        </div>
    )

}

export default PointsDistribution