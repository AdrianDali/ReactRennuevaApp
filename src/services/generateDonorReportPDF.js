import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";  
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

export default function generateDonorReportPDF(report, data, qrImage) {
    let key_centro = "";
    let direccion_centro = "";
    let centro = "";
    let titulo_centro = "";
    let permiso_centro = [];
    if (data[0].key_centro_reciclaje != null) {
      key_centro = data[0].key_centro_reciclaje;
      direccion_centro = data[0].ubicacion_centro_reciclaje;
      centro = data[0].centro_reciclaje;
      titulo_centro = "Reciclaje";
      permiso_centro = data[0].permiso_centro_reciclaje;
    }
    if (data[0].key_centro_recoleccion != null) {
      key_centro = data[0].key_centro_recoleccion;
      direccion_centro = data[0].ubicacion_centro_recoleccion;
      centro = data[0].centro_recoleccion;
      titulo_centro = "Recolección";
      permiso_centro = data[0].permiso_centro_recoleccion;
    }

    const doc = new jsPDF();

    doc.setFillColor(153, 255, 153);
    doc.rect(7, 0, 3, doc.internal.pageSize.height, "F");

    doc.setFontSize(8);
    doc.text("Responsiva de Recepion de Residuos", 150, 10, { align: "left" });
    for (let i = 0; i < permiso_centro.length; i++) {
      doc.text(permiso_centro[i], 150, 15 + i * 5, { align: "left" });
    }

    doc.setFontSize(16);
    doc.text("Datos del Donador", 14, 30);
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0);
    doc.text(
      "FOLIO: " +
        data[0].key_grupo_usuario +
        "-" +
        key_centro +
        "-" +
        report.id_report,
      90,
      30,
      { align: "left" }
    );
    doc.setTextColor(0, 0, 0);

    const tableStyles = {
      cellPadding: 2,
      fontSize: 10,
      lineColor: [0, 0, 0],
      lineWidth: 0.5,
    };

    doc.autoTable({
      startY: 35,
      tableWidth: 190,
      body: [["RFC:", report.rfc_usuario, "Razón Social:", data[0].razon_social]],
      theme: "plain",
      styles: tableStyles,
    });
    doc.setFontSize(12);
    doc.text("Domicilio del Donador", 15, 50, { align: "left" });
    doc.autoTable({
      startY: 55,
      tableWidth: 190,
      body: [
        [
          "Calle:",
          report.calle_usuario,
          "Número:",
          "S/N",
          "Colonia:",
          report.colonia_usuario,
        ],
        [
          "C.P.:",
          report.cp_usuario,
          "Estado:",
          report.estado_usuario,
          "Municipio:",
          report.ciudad_usuario,
        ],
        [
          "Contacto:",
          report.nombre_real_usuario + " " + report.apellido_usuario,
          "Teléfono:",
          report.telefono_usuario,
        ],
      ],
      theme: "plain",
      styles: tableStyles,
    });

    doc.setFontSize(16);
    doc.text("Datos del Centro de " + titulo_centro, 14, 90);

    doc.autoTable({
      startY: 95,
      tableWidth: 190,
      body: [["Centro:", centro, "Ubicación:", direccion_centro]],
      theme: "plain",
      styles: tableStyles,
    });

    doc.setFontSize(16);
    doc.text("Datos del Residuo", 14, 115);

    var bodyData = [];

    bodyData.push([
      "Tipo de Residuos",
      "Cantidad (KG)",
      "Cantidad (M3)",
      "Procedencia de Residuos",
    ]);

    if (data.length === 0) {
      bodyData.push([
        "No hay residuos",
        "0 kg",
        "0 m³",
        "N/A",
      ]);
    } else {
      for (let i = 0; i < data.length; i++) {
        bodyData.push([
          data[i].nombre_residuo,
          data[i].peso + " kg",
          data[i].volumen + " m³",
          data[i].tipo_residuo,
        ]);
      }
    }

    doc.autoTable({
      startY: 120,
      tableWidth: 190,
      body: bodyData,
      theme: "plain",
      styles: tableStyles,
    });

    doc.setFontSize(8);
    doc.text("Solicite, con su numero de folio, el", 70, 225, { align: "left" });
    doc.text("desglose de los materiales y", 70, 230, { align: "left" });
    doc.text("comprobante al siguiente correo:", 70, 235, { align: "left" });
    doc.text("plasticos@rennueva.com", 70, 240, { align: "left" });

    doc.setTextColor(255, 0, 0);
    doc.text(
      "FOLIO: " +
        data[0].key_grupo_usuario +
        "-" +
        key_centro +
        "-" +
        report.id_report,
      150,
      220,
      { align: "right" }
    );

    doc.setTextColor(0, 0, 0);
    doc.text(
      "Fecha Recepcion: " + report.fecha_inicio_reporte,
      200,
      210,
      { align: "right" }
    );

    doc.text(
      "Fecha Recepcion: " + report.fecha_inicio_reporte,
      200,
      290,
      { align: "right" }
    );

    const startY = 200;
    const signatureWidth = 80;
    const spaceBetweenSignatures = 20;

    doc.addImage(
      data[0].firma_responsiva_generador,
      "JPEG",
      155,
      startY - 15,
      25,
      15
    );

    doc.addImage(
      data[0].firma_responsiva_receptor,
      "JPEG",
      45,
      startY - 15,
      25,
      15
    );

    doc.text("Nombre y Firma del Receptor:", 15, startY);
    doc.line(15, startY + 5, 10 + signatureWidth, startY + 5);

    doc.text(
      "Nombre y Firma del Generador:",
      10 + signatureWidth + spaceBetweenSignatures,
      startY
    );
    doc.line(
      10 + signatureWidth + spaceBetweenSignatures,
      startY + 5,
      10 + 2 * signatureWidth + spaceBetweenSignatures,
      startY + 5
    );
    doc.line(1, startY + 13, 400, startY + 13);
    doc.setFontSize(6);
    doc.text(
      "Tecnologias Rennueva S.A de C.V, Mimosas 49 bis, Colonia Santa Maria insurgentes, C.P. 06430, Cuauhtemoc, Ciudad de Mexico, Mexico ",
      14,
      280
    );
    doc.text(
      "Tel. (55)8437 7300 y (55)8437 7272, info@rennueva.com",
      14,
      285
    );
    doc.text(
      "Todos los datos recabados en este documento seran tratados conforme a la Ley General de Proteccion de Datos Personales",
      14,
      290
    );

    if (qrImage) {
      doc.addImage(qrImage, "PNG", 12, 220, 45, 45);
    }

    const pdfBase64 = doc.output("datauristring");
    savePdf(pdfBase64, report.id_report);

    doc.save("Responsiva_folio_" + report.id_report + ".pdf");
  }
