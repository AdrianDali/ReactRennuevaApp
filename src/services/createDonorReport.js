export default async function createDonorReport(data) {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/donor-create-initial-report/`, data);
    return response.data;
}