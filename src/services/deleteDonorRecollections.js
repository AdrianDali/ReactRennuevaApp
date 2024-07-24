import axios from 'axios';

export default async function deleteDonorRecollections(recollections) {
    const promises = []

    recollections.forEach(recollection => {
        promises.push(axios.post(`${process.env.REACT_APP_API_URL}/delete-donor-recollection/`, recollection))
    })


    return Promise.allSettled(promises)
}