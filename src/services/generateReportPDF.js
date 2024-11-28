import  jsPDF  from "jspdf";
import autotable from "jspdf-autotable";
import axios from "axios";

const savePdf = async (pdfBase64, id_report) => {
    /* console.log("PDF BASE 64");
    console.log(pdfBase64);
    console.log("ID REPORT");
    console.log(id_report); */
    try {
      // Usamos 'await' para esperar a que la solicitud se complete y para obtener la respuesta
      await axios.post(
        `${process.env.REACT_APP_API_URL}/finish-report/`,
        {
          reportId: id_report,
          reportBase64: pdfBase64,
        }
      );
      /* console.log("Return de la funcion get all info per report");
      console.log(response.data); */
    } catch (error) {
      // Maneja cualquier error que ocurra durante la solicitud
      console.error(error);
      // Aquí puedes optar por lanzar el error o devolver algo específico en caso de un error
      throw error; // Esto propaga el error al llamador para que pueda ser manejado más adelante
    }
  };


export default function generateReportPDF(report, data, qrImage){
    /* console.log("DATA de la funcion2");
    console.log(data); */
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
      console.log("###############permiso")
      console.log(data[0].permiso_centro_reciclaje)
      console.log(data[0].permiso_centro_reciclaje[0])
      permiso_centro = data[0].permiso_centro_reciclaje;
    }
    if (data[0].key_centro_recoleccion != null) {
      key_centro = data[0].key_centro_recoleccion;
      direccion_centro = data[0].ubicacion_centro_recoleccion;
      centro = data[0].centro_recoleccion;
      titulo_centro = "Recolección";
      //console.log("###############permiso")
      permiso_centro = data[0].permiso_centro_recoleccion;
    }
    /* console.log("KEY CENTRO");
    console.log(key_centro); */
  
    const doc = new jsPDF();
  
    // Use this if you have a logo to add
    //doc.addImage('src/assets/Rennueva.jpg', 'JPEG', 10, 10, 100, 100);
  
    doc.setFillColor(153, 255, 153);
  
    // Dibuja un rectángulo delgado en la coordenada y=0 (arriba) a lo largo del eje y.
    // El rectángulo tiene 3 de ancho (el '3' en el método rect) y la altura podría ser la longitud de la página.
    // rect(x, y, width, height)
    doc.rect(7, 0, 3, doc.internal.pageSize.height, "F"); // 'F' indica que el rectángulo debe estar relleno
  
    // Text on the top right side
    doc.setFontSize(8);
    doc.text("Responsiva de Recepion de Residuos", 150, 10, { align: "left" });
    for (let i = 0; i < permiso_centro.length; i++) {
      /* console.log("###############permiso")
      console.log(permiso_centro[i]) */
      doc.text(
        permiso_centro[i],
        150,
        15 + i * 5,
        { align: "left" }
      );  
  
    
    }
    // doc.text("RA-TRE-01-06-01/2020", 150, 15, { align: "left" });
    // doc.text("PM-TRE-01-06-01/2021", 150, 20, { align: "left" });
    // doc.text("NOM-161-SEMARNAT-2011", 150, 25, { align: "left" });
  
    // Title before the table
    doc.setFontSize(16);
    doc.text("Datos del Generador", 14, 30);
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
  
    // Table 1: Datos del Generador
    doc.autoTable({
      startY: 35,
      tableWidth: 190,
      body: [["RFC:", report.rfc_usuario, "Razón Social:", data[0].razon_social]],
      theme: "plain",
      styles: tableStyles,
    });
    doc.setFontSize(12);
    doc.text("Domicilio del Generador", 15, 50, { align: "left" });
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
  
    // Table 2: Recolection
    doc.autoTable({
      startY: 95,
      tableWidth: 190,
      body: [["Centro:", centro, "Ubicación:", direccion_centro]],
      theme: "plain",
      styles: tableStyles,
    });
    doc.text("Datos del Transportista ", 14, 115);
    if(data[0].transportista_nombre == null){
      doc.setFontSize(12);
      doc.text("El generador trajo sus reciduos con vehiculo propio", 14, 125);
      doc.setFontSize(16);
  
  
    }
    else {
    doc.autoTable({
      startY: 120,
      tableWidth: 190,
      body: [
        [
          "Compañía:",
          data[0].transportista,
          "Transportista:",
          data[0].transportista_nombre,
        ],
      ],
      theme: "plain",
      styles: tableStyles,
    });
    }
    doc.setFontSize(16);
    doc.text("Datos del Residuo", 14, 135);
  
    var bodyData = [];
  
    bodyData.push([
      "Tipo de Residuos",
      "Cantidad (KG)",
      "Cantidad (M3)",
      "Procedencia de Residuos",
    ]);
    var distancia = 185;
    for (let i = 1; i < data.length; i++) {
      bodyData.push([
        data[i].nombre_residuo,
        data[i].peso + " kg",
        data[i].volumen + " m³",
        data[i].tipo_residuo,
      ]);
  
      distancia = distancia + 3;
    }
  
    //bodyData.push(["Fecha Recepcion", report.fecha_inicio_reporte, "Fecha Elaboracion", ""])
  
    // Table 3: Residuos
    doc.autoTable({
      startY: 140,
      tableWidth: 190,
      body: bodyData,
      theme: "plain",
      styles: tableStyles,
    });
  
    // doc.setFontSize(10);
    // doc.text("Certificacion del generador:", 90, distancia, { align: 'left' });
    doc.setFontSize(8);
    doc.text("Solicite, con su numero de folio, el", 70, distancia + 35, {
      align: "left",
    });
    doc.text("desglose de los materiales y", 70, distancia + 40, {
      align: "left",
    });
    doc.text("comprobante al siguiente correo:", 70, distancia + 45, {
      align: "left",
    });
    doc.text("plasticos@rennueva.com", 70, distancia + 50, { align: "left" });
  
    // Antes de añadir el texto para el "FOLIO", cambia el color del texto a rojo.
    doc.setTextColor(255, 0, 0); // Esto representa el color rojo en valores RGB
  
    // Luego, agrega el texto para el "FOLIO".
    // El color rojo que estableciste anteriormente se aplicará aquí.
    doc.text(
      "FOLIO: " +
        data[0].key_grupo_usuario +
        "-" +
        key_centro +
        "-" +
        report.id_report,
      150,
      distancia + 30,
      { align: "right" }
    );
  
    // ... (resto de tu código para generar el PDF)
  
    // Si vas a seguir añadiendo más texto de diferentes colores, recuerda volver a establecer el color del texto.
    // Por ejemplo, para volver al negro usarías:
    doc.setTextColor(0, 0, 0);
    doc.text(
      "Fecha Recepcion: " + report.fecha_inicio_reporte,
      200,
      distancia + 35,
      { align: "right" }
    );
    const startY = distancia + 10;
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
  
    // Añade el texto y las líneas para el Receptor
    doc.text("Nombre y Firma del Receptor:", 15, startY);
    doc.line(15, startY + 5, 10 + signatureWidth, startY + 5); // Línea de firma para el Receptor
  
    // Añade el texto y las líneas para el Generador
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
    ); // Línea de firma para el Generador
    doc.line(1, startY + 13, 400, startY + 13); // Línea de nombre para el Generador
    doc.setFontSize(6);
    doc.text(
      "Tecnologías Rennueva S.A de C.V, Mimosas 49 bis, Colonia Santa Maria insurgentes, C.P. 06430, Cuauhtémoc, Ciudad de México, México ",
      14,
      distancia + 75
    );
    doc.text(
      "Tel. (55)8437 7300 y (55)8437 7272, info@rennueva.com",
      14,
      distancia + 80
    );
    doc.text(
      "Todos los datos recabados en este documento serán tratados conforme a la Ley General de Protección de Datos Personales",
      14,
      distancia + 85
    );
  
    if (qrImage) {
      doc.addImage(qrImage, "PNG", 12, distancia + 25, 55, 55);
      // Modifica 'x', 'y', 'width' y 'height' para ubicar y dimensionar el QR como desees.
    }
  
    const pdfBase64 = doc.output("datauristring");
    savePdf(pdfBase64, report.id_report);
  
    doc.save("Responsiva_folio_" + report.id_report + ".pdf");
  };