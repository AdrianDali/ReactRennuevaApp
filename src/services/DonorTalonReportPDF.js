import { jsPDF } from "jspdf";
import axios from "axios";

const savePdf = async (pdfBase64, id_report) => {
    try {
        await axios.post(
            `${process.env.REACT_APP_API_URL}/finish-report/`,
            {
                reportId: id_report,
                reportBase64: pdfBase64,
            }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default function generateDonorTalonPDF(report, data, qrImage) {
    let key_centro = "";
    let centro = "";
    let titulo_centro = "";

    if (data[0].key_centro_reciclaje != null) {
        key_centro = data[0].key_centro_reciclaje;
        centro = data[0].centro_reciclaje;
        titulo_centro = "Reciclaje";
    }
    if (data[0].key_centro_recoleccion != null) {
        key_centro = data[0].key_centro_recoleccion;
        centro = data[0].centro_recoleccion;
        titulo_centro = "Recoleccion";
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
        "Fecha Recepcion: " + report.fecha_inicio_reporte,
        200,
        65,
        { align: "right" }
    );

    const startY = 200;
    const signatureWidth = 80;
    const spaceBetweenSignatures = 20;

   
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
    savePdf(pdfBase64, report.id_report);

    doc.save("Talon_folio_" + report.id_report + ".pdf");
}
