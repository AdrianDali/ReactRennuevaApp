import axios from 'axios';

export default async function deleteDonorReports(reports) {
    const promises = []
    reports.forEach(report => {
        promises.push(axios.post(`${process.env.REACT_APP_API_URL}/delete-donor-report/`, report))
    })
    return Promise.allSettled(promises)
}