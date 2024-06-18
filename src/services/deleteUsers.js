import axios from 'axios';

export default async function deleteUsers(users) {
    const promises = []

    users.forEach(user => {
        promises.push(axios.put(`${process.env.REACT_APP_API_URL}/delete-django-user/`, user))
    })


    return Promise.allSettled(promises)
}