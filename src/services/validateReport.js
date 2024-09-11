import axios from "axios";
export default async function validateReport(id_report) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/evaluate-report/`,
        {
          ReportFolio: id_report,
        }
      );
      console.log("Return de la funcion validate report");
      console.log(response.data["Reporte"]);
      if (response.data["Reporte"] == "Todo listo para generar reporte") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      // Maneja cualquier error que ocurra durante la solicitud
      console.error(error);
      // Aquí puedes optar por lanzar el error o devolver algo específico en caso de un error
      throw error; // Esto propaga el error al llamador para que pueda ser manejado más adelante
    }
  };