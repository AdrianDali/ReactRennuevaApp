import axios from "axios";

export default async function getDonorReports() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-donor-reports/`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}