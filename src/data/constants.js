import { getTournamentSubmissionMinDate } from "../utils/helpers"

export const ageGroups = [
    'U40', 'U60', '60+'
]

export const genderGroups = [
    {
        label: `Women's`,
        value: 'Female'
    },
    {
        label: `Men's`,
        value: 'Male'
    },
    {
        label: 'Mixed',
        value: 'Mixed'
    }
]

export const draws = [
    'Singles', 'Doubles'
]

export const tournamentDrawsOptions = [
    {
        label: 'Singles Only',
        value: 'singles'
    },
    {
        label: 'Doubles Only',
        value: 'doubles'
    },
    {
        label: 'Singles & Doubles',
        value: 'singlesAndDoubles'
    },
    {
        label: 'All Draw Types',
        value: 'All Draw Types'
    },
    
]

export const courtSurfaces = [
    'Indoor Clay',
    'Outdoor Clay',
    'Indoor Hard', 
    'Outdoor Hard',
    'Outdoor Grass',
]

// all draw combinations (age, gender, draw type)
export const allDrawCombinations = [
    `U40 Women's Singles`,
    `U40 Women's Doubles`,
    `U40 Men's Singles`,
    `U40 Men's Doubles`,
    `U40 Mixed Doubles`,
    `U60 Women's Singles`,
    `U60 Women's Doubles`,
    `U60 Men's Singles`,
    `U60 Men's Doubles`,
    `U60 Mixed Doubles`,
    `60+ Women's Singles`,
    `60+ Women's Doubles`,
    `60+ Men's Singles`,
    `60+ Men's Doubles`,
    `60+ Mixed Doubles`
]

// years options for the dropdown depending on the toggle button's value
// 'UPCOMING' as value of the toggle for tournaments
export const upcomingYears = [
    'All',
    new Date().getUTCFullYear(),
    new Date().getUTCFullYear() + 1
]

// 'PREVIOUS' as value of the toggle for tournaments
export const previousYears = [
    'All',
    new Date().getUTCFullYear(),
    new Date().getUTCFullYear() - 1,
    new Date().getUTCFullYear() - 2,
    new Date().getUTCFullYear() - 3,
]


// 'ALL' as value of the toggle for tournaments
export const allYears = [
    'All',
    new Date().getUTCFullYear() + 1,
    new Date().getUTCFullYear(),
    new Date().getUTCFullYear() - 1,
    new Date().getUTCFullYear() - 2,
    new Date().getUTCFullYear() - 3,
]

export const months = [
    {
        label: 'All',
        value: 'All'
    },
    {
        label: 'January',
        value: 0
    },
    {
        label: 'February',
        value: 1
    },
    {
        label: 'March',
        value: 2
    },
    {
        label: 'April',
        value: 3
    },
    {
        label: 'May',
        value: 4
    },
    {
        label: 'June',
        value: 5
    },
    {
        label: 'July',
        value: 6
    },
    {
        label: 'August',
        value: 7
    },
    {
        label: 'September',
        value: 8
    },
    {
        label: 'October',
        value: 9
    },
    {
        label: 'November',
        value: 10
    },
    {
        label: 'December',
        value: 11
    }
]

// profile settings visibility options
export const visibilityOptions = [
    "Club Reps Only",
    "Club Reps and Players",
    "Public"
]

// initial tournament state
export const initialTournamentData = {
    tournamentName: '',
    description: '',
    city: '',
    country: '',
    courtSurface: '',
    courtsNumber: '',
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
    medicalTeamOnSite: '',
    onSiteSignupDeadline: '',
    qualification: '',
    qualificationStartDate: '',
    qualificationEndDate: '',
    singlesDrawSize: '',
    qualifyingDrawSize: '',
    doublesDrawSize: '',
    mixedDoublesDrawSize: ''
}
