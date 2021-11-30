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

export const sortData = (data, sortingParameter) => {

    let sortedData = []

    if (data) {
        sortedData = data.sort((a, b) => {
            return b[sortingParameter] - a[sortingParameter];
        });
    }

    return sortedData
}