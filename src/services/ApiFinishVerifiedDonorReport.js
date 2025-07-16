import axios from "axios";

/**
 * Finaliza la verificación del reporte y su orden de recolección.
 * @param {number} id_report - El ID del reporte a finalizar.
 * @returns {Promise<object>} Respuesta del backend con los ids y mensaje o error.
 */
export default async function finishVerifiedDonorReport(id_report) {
  try {
    const body = { id_report };
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/finish-verified-donor-report/`,
      body
    );
    return response.data;
  } catch (error) {
    // Puedes adaptar el manejo de error según tu app
    if (error.response) {
      // Error de backend con status
      return { error: true, detail: error.response.data, status: error.response.status };
    }
    // Error de red u otro
    return { error: true, detail: error.message, status: null };
  }
}
