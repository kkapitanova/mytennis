export const ageGroups = [
    'U40', 'U60', '60+'
]

export const genderGroups = [
    'Female', 'Male', 'Mixed'
]

export const upcomingYears = [
    new Date().getFullYear(),
    new Date().getFullYear() + 1
]

export const previousYears = [
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
    new Date().getFullYear() - 3,
]

export const allYears = [
    new Date().getFullYear() + 1,
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
    new Date().getFullYear() - 3,
]

export const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August', 
    'September', 
    'October', 
    'November', 
    'December'
]

export const tournamentSubmissionMinDate = () => {
    const currentMonth = new Date ().getMonth()
    const minDate = new Date().setMonth(currentMonth + 2)

    return minDate
}

export const tournamentOnSiteSignupDeadline = (tournamentStartDate) => {

    let minDate;

    if (tournamentStartDate) {
        const startDate =  new Date(tournamentStartDate).getDate()
        minDate = new Date(tournamentStartDate).setDate(startDate - 3)
    } else {
        const currentDate =  new Date().getDate()
        const currentMonth = new Date ().getMonth()
        const minDateMonth = new Date().setMonth(currentMonth + 2)
        minDate = new Date(minDateMonth).setDate(currentDate - 3)
    }
    return minDate

}

export const visibilityOptions = [
    "Club Reps Only",
    "Club Reps and Players",
    "Public"
]