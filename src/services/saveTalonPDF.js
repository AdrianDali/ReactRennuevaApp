import generateDonorTalonPDF from "./DonorTalonReportPDF";
import generateQR from "./generateQR";
import getReportInfo from "./getReportInfo";

const saveTalonPDF = async (report, noValidTalonFunction) => {
    console.log("Generando talón de donación");
    console.log(report);
    const validate = true;
    if (validate == true) {
        const data = await getReportInfo(
            report.id_report
        );

        let key_centro = "";
        if (
            data[0].key_centro_reciclaje !=
            null
        ) {
            key_centro =
                data[0].key_centro_reciclaje;
        }
        if (
            data[0].key_centro_recoleccion !=
            null
        ) {
            key_centro =
                data[0].key_centro_recoleccion;
        }

        const folio_busqueda =
            data[0].key_grupo_usuario +
            "-" +
            key_centro +
            "-" +
            report.id_report;

        const qrImage = await generateQR(
            "https://rewards.rennueva.com/tracking-external/" +
            folio_busqueda // Aquí deberías poner la URL correcta para el reporte
        );
        generateDonorTalonPDF(report, data, qrImage);
    } else {
        noValidTalonFunction();
    }
}

export default saveTalonPDF;