import axios from "axios";
export default async function getReportInfo(id_report){
    try {
      // Usamos 'await' para esperar a que la solicitud se complete y para obtener la respuesta
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-all-info-per-report/`,
        {
          reportId: id_report,
        }
      );
      //console.log("Return de la funcion get all info per report");
      //console.log(response.data);
  
      // Retorna directamente los datos de la respuesta
      return response.data;
    } catch (error) {
      // Maneja cualquier error que ocurra durante la solicitud
      //console.error(error);
      // Aquí puedes optar por lanzar el error o devolver algo específico en caso de un error
      throw error; // Esto propaga el error al llamador para que pueda ser manejado más adelante
    }
  };