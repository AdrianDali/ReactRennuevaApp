import { jsPDF } from "jspdf";
import axios from "axios";

const savePdf = async (pdfBase64, id_report) => {
    console.log("Guardando PDF en la base de datos");

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/finish-report/`,
            {
                reportId: id_report,
                reportBase64: pdfBase64,
            }
        );
        console.log("########### response ###########");
        console.log(response);
        console.log("PDF guardado en la base de datos");
    } catch (error) {
        console.error(error);
        throw error;
    }
};


async function generateDonorTalonPDF(report, data, qrImage) {
    console.log(" ########### Generando PDF de talon de folio ###########");
    try {
        console.log("Generando PDF de talon de folio");
        console.log("########### data ###########");
        console.log(data);
        console.log("########### report ###########");
        console.log(report);
        let key_centro = "";
        let centro = "";
        let titulo_centro = "";

        if (data[0].key_centro_reciclaje != null && data[0].key_centro_reciclaje != undefined) {
            key_centro = data[0].key_centro_reciclaje;
            centro = data[0].centro_reciclaje;
            titulo_centro = "Reciclaje";
        }
        if (data[0].key_centro_recoleccion != null && ata[0].key_centro_recoleccion != undefined) {
            key_centro = data[0].key_centro_recoleccion;
            centro = data[0].centro_recoleccion;
            titulo_centro = "Recolección";
        }

        const doc = new jsPDF();

        doc.setFontSize(8);
        doc.text("Solicite, con su numero de folio, el", 70, 15, { align: "left" });
        doc.text("desglose de los materiales y", 70, 20, { align: "left" });
        doc.text("comprobante al siguiente correo:", 70, 25, { align: "left" });
        doc.text("plasticos@rennueva.com", 70, 30, { align: "left" });

        doc.setTextColor(255, 0, 0);
        doc.text(
            "FOLIO: " +
            data[0].key_grupo_usuario +
            "-" +
            key_centro +
            "-" +
            report.id_report,
            150,
            5,
            { align: "right" }
        );

        doc.setTextColor(0, 0, 0);

        doc.text(
            "Fecha Recepcion: " + data[0].fecha_inicio_reporte,
            200,
            65,
            { align: "right" }
        );


        doc.setFontSize(6);
        doc.text(
            "Tecnologias Rennueva S.A de C.V, Mimosas 49 bis, Colonia Santa Maria insurgentes, C.P. 06430, Cuauhtemoc, Ciudad de Mexico, Mexico ",
            14,
            50
        );
        doc.text(
            "Tel. (55)8437 7300 y (55)8437 7272, info@rennueva.com",
            14,
            55
        );
        doc.text(
            "Todos los datos recabados en este documento seran tratados conforme a la Ley General de Proteccion de Datos Personales",
            14,
            60
        );

        if (qrImage) {
            doc.addImage(qrImage, "PNG", 12, 0, 45, 45);
        }

        const pdfBase64 = doc.output("datauristring");
        console.log("########## talon de folio  en base 64##########");
        console.log(pdfBase64);

        await savePdf(pdfBase64, report.id_report);

        doc.save("Talon_folio_" + report.id_report + ".pdf");
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export default generateDonorTalonPDF;