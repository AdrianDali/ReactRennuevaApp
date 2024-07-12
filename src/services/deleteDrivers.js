import axios from 'axios';

export default async function deleteDrivers(users) {
    const promises = []

    users.forEach(user => {
        promises.push(axios.post(`${process.env.REACT_APP_API_URL}/delete-driver/`, user))
    })


    return Promise.allSettled(promises)
}