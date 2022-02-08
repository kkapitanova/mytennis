// import { faDumbbell, faUserCheck, faLaughBeam, faUsers, faWeight, faClock, faToiletPaper, faTrophy, faAward, faChartLine, faHandHoldingHeart, faSeedling, faRunning, faBrain, faTasks, faEdit, faInbox, faUserCircle, faHandshake } from '@fortawesome/free-solid-svg-icons'

// const iconsList = [faDumbbell, faUserCheck, faLaughBeam, faUsers, faWeight, faClock, faToiletPaper, faTrophy, faTasks, faEdit, faInbox, faUserCheck, faUserCircle, faAward, faChartLine, faHandHoldingHeart, faSeedling, faRunning, faBrain, faHandshake]

// export const iconGetter = iconName => {
//     let displayedIcon = faDumbbell

//     iconsList.forEach((icon) => {
//         if (icon.iconName === iconName.replace("_", "-")) {
//             displayedIcon = icon
//         } 
//     })

//     return displayedIcon
// }

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
    const UTCString = new Date(dateMillis).toUTCString();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const date = new Date(UTCString);
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

    return formattedDate
}
