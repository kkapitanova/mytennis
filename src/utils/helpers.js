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

export const handleLogout = () => {
    sessionStorage.removeItem('Auth Token');
    localStorage.removeItem('userData');
    toast.success("You have been logged out successfully.")
}

export const objectToArrayConverter = (obj) => {

    const arr = []
 
    for (const key in obj) {
        arr.push(obj[key])
    }

    return arr
}
