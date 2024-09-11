import axios from 'axios';

export default async function deleteReports(reports) {
    const promises = []
    reports.forEach(report => {
        promises.push(axios.post(`${process.env.REACT_APP_API_URL}/delete-report/`, report))
    })
    return Promise.allSettled(promises)
}