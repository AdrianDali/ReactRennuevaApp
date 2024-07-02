import axios from "axios";

export default async function getDonorReports(creator) {
    try {
        const data = {
            creator_user: creator
        }
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/get-all-donor-reports-user-container/`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}