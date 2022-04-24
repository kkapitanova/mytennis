import { toast } from 'react-toastify';

export const sortData = (data, sortingParameter, direction = 'desc') => {

    let sortedData = []

    if (data) {
        sortedData = data.sort((a, b) => {
            if (direction === 'desc') {
                return b[sortingParameter] - a[sortingParameter]
            } else if (direction === 'asc') {
                return a[sortingParameter] - b[sortingParameter]
            }
        });
    }

    return sortedData
}

export const filterData = (data, filteringParameter, filterValue) => {

    let filteredData = []

    if (data) {
        filteredData = data.filter((item) => item[filteringParameter] === filterValue);
    }

    return filteredData
}

export const getAge = (dateOfBirth) => { 

    const birthDate = new Date(dateOfBirth);

    let age = new Date().getFullYear() - birthDate.getFullYear();
    const month = new Date().getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && new Date().getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

export const getDateString = dateMillis => {
    const UTCString = new Date(dateMillis).toString();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const date = new Date(UTCString);
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

    return formattedDate
}

export const getDateTimeString = dateMillis => {
    const UTCString = new Date(dateMillis).toString();
    const options = { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" };
    const date = new Date(UTCString);
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

    return formattedDate
}

export const handleLogout = () => {
    sessionStorage.removeItem('Auth Token');
    sessionStorage.removeItem('userData');
    toast.success("You have been logged out successfully.")
}

export const objectToArrayConverter = (obj) => {

    const arr = []
 
    for (const key in obj) {
        arr.push(obj[key])
    }

    return arr
}

export const getMessageTimeStamp = (dateString, allMessages, currentMessageIndex) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const currentDate = new Date().getDate()

    let previousDate;

    if (currentMessageIndex !== 0) {
        previousDate = new Date(allMessages[currentMessageIndex - 1].sent)
    }

    let timestamp = ''

    if (previousDate &&
        previousDate.getFullYear() === year && 
        previousDate.getMonth() === month && 
        previousDate.getDate() === date.getDate() &&
        previousDate.getHours() === hours &&
        previousDate.getMinutes() === minutes) {
            return timestamp

    } else if (year === new Date().getFullYear()) {

        if (currentDate === date.getDate()) { //timestamp for today in format of hours:minutes (12:34)
            timestamp = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        } else {
            timestamp = `${date.getDate()}/${month + 1}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` //timestamp for current year in format of date/month, hours:minutes (12/3, 12:34)
        }

    } else { //timestamp for past years in format of date/month/year, hours:minutes (12/3, 12:34)
        timestamp = `${date.getDate()}/${month + 1}/${year}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    return timestamp
}

export const alphabeticalSort = (arr, sortingParameter) => {
    arr.sort((a, b) => {
        if (a[sortingParameter] < b[sortingParameter]) { 
            return -1; 
        }

        if (a[sortingParameter] > b[sortingParameter]) {
             return 1; 
        }
        
        return 0;
    })
}

export const getDraws = (ageGroups, genderGroup, drawType) => {

    const drawDisplayName = drawType === 'singles' ? 'Singles' : drawType === 'doubles' ? 'Doubles' : 'Singles & Doubles'
    const genderGroupDisplayName = genderGroup === "Female" ? "Women" : "Men"

    return (
        <div className="flex wrap">
            {ageGroups && genderGroup && drawType && ageGroups.map(ag => {
                return (
                    <div className="flex-column draws-wrapper">
                        <div>{ag}</div>
                        {genderGroup === "Mixed" && drawType === 'singlesAndDoubles' ? (
                            <div>
                                <div>Women's {drawDisplayName}</div>
                                <div>Men's {drawDisplayName}</div>
                                <div>Mixed Doubles</div>
                            </div>
                        ) : genderGroup === "Mixed" && drawType !== 'singlesAndDoubles' ? (
                            <div>
                                <div>Women's {drawDisplayName}</div>
                                <div>Men's {drawDisplayName}</div>
                            </div>
                        ) : (
                            <div>{genderGroupDisplayName}'s {drawDisplayName}</div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export const getAvailableDraws = tournament => {
    const draws = []
    
    tournament.ageGroups.forEach(ag => {

        if (tournament.genderGroup === "Mixed" && tournament.drawType === "singlesAndDoubles") {
            draws.push({
                label: `${ag} Women's Singles`,
                value: `${ag}FemaleSingles`
            })

            draws.push({
                label: `${ag} Men's Singles`,
                value: `${ag}MaleSingles`
            })

            draws.push({
                label: `${ag} Women's Doubles`,
                value: `${ag}FemaleDoubles`
            })

            draws.push({
                label: `${ag} Men's Doubles`,
                value: `${ag}MaleDoubles`
            })

            draws.push({
                label: `${ag} Mixed Doubles`,
                value: `${ag}MixedDoubles`
            })

        } else if (tournament.genderGroup === "Mixed" && tournament.drawType === "doubles") {
            draws.push({
                label: `${ag} Women's Doubles`,
                value: `${ag}FemaleSingles`
            })

            draws.push({
                label: `${ag} Women's Doubles`,
                value: `${ag}FemaleSingles`
            })

            draws.push({
                label: `${ag} Mixed Doubles`,
                value: `${ag}MixedDoubles`
            })
        } else if (tournament.genderGroup === "Female"){
            if (tournament.drawType !== 'doubles') {
                draws.push({
                    label: `${ag} Women's Singles`,
                    value: `${ag}FemaleSingles`
                })
            }
            
            if (tournament.drawType !== 'singles') {
                draws.push({
                    label: `${ag} Women's Doubles`,
                    value: `${ag}FemaleDoubles`
                })
            }
        } else if (tournament.genderGroup === "Male"){
            if (tournament.drawType !== 'doubles') {
                draws.push({
                    label: `${ag} Men's Singles`,
                    value: `${ag}MaleSingles`
                })
            }
            
            if (tournament.drawType !== 'singles') {
                draws.push({
                    label: `${ag} Men's Doubles`,
                    value: `${ag}MaleDoubles`
                })
            }
        }
        
    }) 

    return draws
}

export const getTournamentSubmissionMinDate = () => {
    const currentMonth = new Date ().getMonth()
    const minDate = new Date().setMonth(currentMonth + 2)

    return minDate
}

export const getTournamentOnSiteSignupDeadline = (tournamentStartDate, type) => {
    let date;
    const startDate = new Date(tournamentStartDate).getDate()

    if (tournamentStartDate && type === "min") {
        date = new Date(tournamentStartDate).setDate(startDate - 3)
    } else if (type === "min") {
        const currentDate =  new Date().getDate()
        const currentMonth = new Date ().getMonth()
        const minDateMonth = new Date().setMonth(currentMonth + 2)
        date = new Date(minDateMonth).setDate(currentDate - 3)
    } else {
        date = new Date(tournamentStartDate).setDate(startDate - 1)
    }
    return date

}
