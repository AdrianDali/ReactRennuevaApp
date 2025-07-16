import axios from "axios";

/**
 * Llama al endpoint POST /get-single-report/ enviando el id_report.
 * @param {number} id_report - El ID del reporte a consultar.
 * @returns {Promise<object|null>} El reporte encontrado o null si hay error.
 */
export default async function getSingleReport(id_report) {
    try {
        const data = { id_report };
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/get-single-report/`,
            data
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
