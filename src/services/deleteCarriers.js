import axios from 'axios';

export default async function deleteCarriers(users) {
    const promises = []

    users.forEach(user => {
        promises.push(axios.put(`${process.env.REACT_APP_API_URL}/delete-carrier/`, user))
    })


    return Promise.allSettled(promises)
}