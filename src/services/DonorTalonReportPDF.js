import { jsPDF } from "jspdf";
import axios from "axios";

const savePdf = async (pdfBase64, id_report) => {
    console.log("Guardando PDF en la base de datos");

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/save-talon-base64/`,
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
    try {
        let key_centro = "";
        let centro = "";
        let titulo_centro = "";

        if (data[0].key_centro_reciclaje != null && data[0].key_centro_reciclaje != undefined) {
            key_centro = data[0].key_centro_reciclaje;
            centro = data[0].centro_reciclaje;
            titulo_centro = "Reciclaje";
        }
        if (data[0].key_centro_recoleccion != null && data[0].key_centro_recoleccion != undefined) {
            key_centro = data[0].key_centro_recoleccion;
            centro = data[0].centro_recoleccion;
            titulo_centro = "Recolección";
        }

        // Establecer tamaño de página personalizado de 40mm de ancho
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [55, 85] // Ancho: 40mm, Altura: 100mm (ajustar según sea necesario)
        });

        // Ajustar tamaños y posiciones en función del nuevo tamaño de página
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        const pageWidth = doc.internal.pageSize.getWidth();
        const folio = data[0].key_grupo_usuario + "-" + key_centro + "-" + report.id_report;
        const folioWidth = doc.getTextWidth(folio);
        const folioCoordinate = (pageWidth - folioWidth) / 2;
        doc.text(
            folio,
            folioCoordinate,
            5, // Adjusted y-coordinate to ensure it is within the visible area
            { maxWidth: 40 }
        );

        if (qrImage) {
            // Hacer que el código QR quede justo bajo el texto del folio
            doc.addImage(qrImage, "PNG", (pageWidth - 40) / 2, doc.getTextDimensions(folio).h + 5, 40, 40);
        }

        const qrText = "Escanea el código QR para consultar su reporte.";
        const qrTextCoordinate = pageWidth / 2;
        doc.text(qrText, qrTextCoordinate, doc.getTextDimensions(folio).h + 48, { maxWidth: 40, align: "center" });

        /* doc.text(
            data[0].key_grupo_usuario +
            "-" +
            key_centro +
            "-" +
            report.id_report,
            5,
            0,
            { maxWidth: 30 }
        ); */

        const date = new Date(data[0].fecha_inicio_reporte);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

        doc.text(
            "Fecha de recepción: " + formattedDate,
            4,
            60,
            { maxWidth: 40 }
        );

        doc.text(
            "Tienes dudas o comentarios, contáctanos:",
            4,
            69,
            { maxWidth: 35 }
        );
        doc.text(
            "(55)8437 7300",
            4,
            77,
            { maxWidth: 40 }
        );

        doc.text(
            "info@rennueva.com",
            4,
            80,
            { maxWidth: 48 }
        );



        const pdfBase64 = doc.output("datauristring");

        await savePdf(pdfBase64, report.id_report);

        doc.save("Talon_folio_" + report.id_report + ".pdf");
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default generateDonorTalonPDF;