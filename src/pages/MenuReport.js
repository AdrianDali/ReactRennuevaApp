import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from "../context/index.js";
import { ModalReport } from "./ModalReport";
import GeneratorTable from "../components/GeneratorTable";
import BarsChartVehicle from "../components/BarsChartVehicle";
import {
  ThemeProvider,
  createTheme,
  Box,
  Grid,
  Paper,
  Container,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import Title from "../components/Title";
import CUDButtons from "../containers/CUDButtons";
import ReportTable from "../components/ReportTable.jsx";
import { ModalResidueReport } from "./ModalResidueReport.js";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { ModalFirmar } from "../pages/ModalFirmar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import useAuth from "../hooks/useAuth.js";

const QRCode = require("qrcode");

let qrImage;

const generateQR = async (text) => {
  try {
    console.log(text);
    qrImage = await QRCode.toDataURL(text);
  } catch (err) {
    console.error(err);
  }
};

const ValidateReport = async (id_report) => {
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

const getAllInfoReport = async (id_report) => {
  try {
    // Usamos 'await' para esperar a que la solicitud se complete y para obtener la respuesta
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/get-all-info-per-report/`,
      {
        reportId: id_report,
      }
    );
    console.log("Return de la funcion get all info per report");
    console.log(response.data);

    // Retorna directamente los datos de la respuesta
    return response.data;
  } catch (error) {
    // Maneja cualquier error que ocurra durante la solicitud
    console.error(error);
    // Aquí puedes optar por lanzar el error o devolver algo específico en caso de un error
    throw error; // Esto propaga el error al llamador para que pueda ser manejado más adelante
  }
};

function loadImage(src, callback) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    let reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", src);
  xhr.responseType = "blob";
  xhr.send();
}

const savePdf = async (pdfBase64, id_report) => {
  console.log("PDF BASE 64");
  console.log(pdfBase64);
  console.log("ID REPORT");
  console.log(id_report);
  try {
    // Usamos 'await' para esperar a que la solicitud se complete y para obtener la respuesta
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/finish-report/`,
      {
        reportId: id_report,
        reportBase64: pdfBase64,
      }
    );
    console.log("Return de la funcion get all info per report");
    console.log(response.data);
  } catch (error) {
    // Maneja cualquier error que ocurra durante la solicitud
    console.error(error);
    // Aquí puedes optar por lanzar el error o devolver algo específico en caso de un error
    throw error; // Esto propaga el error al llamador para que pueda ser manejado más adelante
  }
};

const generatePdf = (report, data) => {
  console.log("DATA de la funcion2");
  console.log(data);
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
    titulo_centro = "Recoleccion";
    console.log("###############permiso")
    permiso_centro = data[0].permiso_centro_recoleccion;
  }
  console.log("KEY CENTRO");
  console.log(key_centro);

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
    console.log("###############permiso")
    console.log(permiso_centro[i])
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
        "Compañia:",
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
  for (let i = 0; i < data.length; i++) {
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
    distancia + 32,
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
  doc.line(1, startY + 17, 400, startY + 20); // Línea de nombre para el Generador

  // Agrega la leyenda del generador y/o donador con la legislación aplicable en la materia.
  doc.setFontSize(8);
  doc.text(
    "El generador y/o donador declara bajo protesta de decir verdad que cumple con todas las obligaciones legales inherentes, de conformidad ",
    15,
    startY + 10
  );
  doc.text(
    "con la legislación aplicable en la materia.",
    15,
    startY + 15
  );
  doc.setFontSize(6);
  doc.text(
    "Tecnologias Rennueva S.A de C.V, Mimosas 49 bis, Colonia Santa Maria insurgentes, C.P. 06430, Cuauhtemoc, Ciudad de Mexico, Mexico ",
    14,
    distancia + 75
  );
  doc.text(
    "Tel. (55)8437 7300 , info@rennueva.com",
    14,
    distancia + 80
  );
  doc.text(
    "Todos los datos recabados en este documento seran tratados conforme a la Ley General de Proteccion de Datos Personales",
    14,
    distancia + 85
  );

  if (qrImage) {
    doc.addImage(qrImage, "PNG", 12, distancia + 30, 35, 35);
    // Modifica 'x', 'y', 'width' y 'height' para ubicar y dimensionar el QR como desees.
  }

  const pdfBase64 = doc.output("datauristring");
  savePdf(pdfBase64, report.id_report);

  doc.save("Responsiva_folio_" + report.id_report + ".pdf");
};

const StyledButton = styled(Button)`
  background-color: ${(props) => (props.isGreen ? "green" : "red")};
  color: white;

  &:hover {
    background-color: ${(props) => (props.isGreen ? "darkgreen" : "darkred")};
  }
`;

function MenuReport() {
  const {
    openModalCreate,
    setOpenModalCreate,
    setOpenModalEdit,
    openModalEdit,
    setOpenModalDelete,
    openModalDelete,
    openModalCreateReport,
    openModalEditReport,
    openModalDeleteReport,

    setOpenModalCreateReport,
    setOpenModalEditReport,
    setOpenModalDeleteReport,

    openModalCreateResidueReport,
    setOpenModalCreateResidueReport,
    setOpenModalEditResidueReport,
    openModalEditResidueReport,
    setOpenModalDeleteResidueReport,
    openModalDeleteResidueReport,
    textOpenModalText,
    setTextOpenModalText,
    setOpenModalText,
    openModalText,
    updateReportInfo,
    setUpdateReportInfo,

    openModalCreateFirma,
    setOpenModalCreateFirma,
    openModalEditFirma,
    setOpenModalEditFirma,
    openModalDeleteFirma,
    setOpenModalDeleteFirma,
    openModalCreateFirmaReceptor,
    setOpenModalCreateFirmaReceptor,
    openModalEditFirmaReceptor,
    setOpenModalEditFirmaReceptor,
    openModalDeleteFirmaReceptor,
    setOpenModalDeleteFirmaReceptor,
  } = useContext(TodoContext);

  const [datos, setDatos] = useState([]);

  const defaultTheme = createTheme();

  //##############################################################################################################
  const [clientes, setClientes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModalFirmar, setOpenModalFirmar] = useState(false);
  const [report, setReport] = useState([]);
  const [userSelectModal, setUserSelectModal] = useState("");
  const [reportSelectModal, setReportSelectModal] = useState("");
  const [id_report, setIdReport] = useState("");
  const [reportSelect, setReportSelect] = useState([]);
  const [isButtonGreen, setIsButtonGreen] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // Estado para almacenar el ID del reporte a borrar

  const dataUser = useAuth();

  const handleClickOpen = (id_report) => {
    setDeleteId(id_report); // Guarda el ID del reporte en el estado
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    console.log("Borrado confirmado");
    axios
      .post(`${process.env.REACT_APP_API_URL}/delete-report/`, {
        reportId: deleteId, // Usa el ID almacenado en el estado
      })
      .then((response) => {
        console.log(
          "##############################################info delete report####"
        );
        console.log(response.data);
        setUpdateReportInfo(true);
      });
    handleClose();
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-reports/`)
      .then((response) => {
        setReport(response.data);
        console.log(
          "##############################################info get all reports####"
        );
        console.log(response.data);
        setUpdateReportInfo(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [updateReportInfo]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const Firmar = () => {
    return <ModalFirmar />;
  };

  return (
    <>
     
        <CssBaseline />
      
          <Container maxWidth={false} sx={{ flexGrow: 1, overflow: 'auto', py: 3 }}>
     
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Title>Reportes</Title>
                  <CUDButtons model="Responsiva" />
                  <Title>Historial Reportes</Title>
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 300, minHeight: 300 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor: "primary.main",
                              color: "background.paper",
                            }}
                          >
                            {/* Añade aquí tus encabezados de tabla */}
                            <TableCell>ID Reporte</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>RFC</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Celular</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Ciudad</TableCell>
                            <TableCell>Colonia</TableCell>
                            <TableCell>calle</TableCell>
                            <TableCell>CP</TableCell>
                            <TableCell>Fecha inicio</TableCell>
                            <TableCell>Firma Receptor</TableCell>
                            <TableCell>Residuos</TableCell>
                            <TableCell>Firma Generador</TableCell>
                            <TableCell>Reporte</TableCell>
                            <TableCell>Editar</TableCell>
                            <TableCell>Borrar</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {report
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map(
                              (reporte, index) => (
                                console.log(
                                  "###############" +
                                    reporte.nombre_real_usuario
                                ),
                                (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      backgroundColor:
                                        index % 2 === 0
                                          ? "action.hover"
                                          : "background.paper",
                                    }}
                                  >
                                    {/* Añade aquí tus celdas de datos */}
                                    <TableCell>{reporte.id_report}</TableCell>
                                    <TableCell>
                                      {reporte.nombre_real_usuario +
                                        " " +
                                        reporte.apellido_usuario}
                                    </TableCell>
                                    <TableCell>{reporte.rfc_usuario}</TableCell>
                                    <TableCell>
                                      {reporte.email_usuario}
                                    </TableCell>
                                    <TableCell>
                                      {reporte.telefono_usuario}
                                    </TableCell>
                                    <TableCell>
                                      {reporte.estado_reporte}
                                    </TableCell>
                                    <TableCell>
                                      {reporte.ciudad_reporte}
                                    </TableCell>
                                    <TableCell>
                                      {reporte.colonia_reporte}
                                    </TableCell>
                                    <TableCell>
                                      {reporte.calle_reporte}
                                    </TableCell>
                                    <TableCell>{reporte.cp_reporte}</TableCell>
                                    <TableCell>
                                      {reporte.fecha_inicio_reporte}
                                    </TableCell>

                                    <TableCell>
                                      {/* <StyledButton
                                        onClick={() => {
                                          setIdReport(reporte.id_report);
                                          setOpenModalCreateFirmaReceptor(true);
                                        }}
                                      >
                                        Firmar
                                      </StyledButton> */}
                                      <Button
                                        variant="contained"
                                        color={
                                          reporte.firma_responsiva_receptor
                                            ? "success"
                                            : "error"
                                        }
                                        onClick={() => {
                                          setIdReport(reporte.id_report);
                                          setOpenModalCreateFirmaReceptor(true);
                                          setUpdateReportInfo(true);
                                        }}
                                      >
                                        Firma
                                      </Button>
                                    </TableCell>

                                    <TableCell>
                                      {/* <StyledButton
                                        onClick={() => {
                                          setOpenModalCreateResidueReport(true);
                                          setUserSelectModal(
                                            reporte.nombre_usuario
                                          );
                                          setReportSelectModal(
                                            reporte.id_report
                                          );
                                        }}
                                      >
                                        Residuo
                                      </StyledButton> */}
                                      <Button
                                        variant="contained"
                                        color={
                                          reporte.residuos_agregados
                                            ? "success"
                                            : "error"
                                        }
                                        onClick={() => {
                                          setOpenModalCreateResidueReport(true);
                                          setUserSelectModal(
                                            reporte.nombre_usuario
                                          );
                                          setReportSelectModal(
                                            reporte.id_report
                                          );

                                          setUpdateReportInfo(true);
                                        }}
                                      >
                                        Residuo
                                      </Button>
                                    </TableCell>

                                    <TableCell>
                                      {/* <StyledButton
                                        onClick={() => {
                                          setIdReport(reporte.id_report);
                                          setOpenModalCreateFirma(true);
                                        }}
                                       
                                        
                                        
                                      >
                                        Firmar
                                      </StyledButton> */}
                                      <Button
                                        variant="contained"
                                        color={
                                          reporte.firma_responsiva_generador
                                            ? "success"
                                            : "error"
                                        }
                                        onClick={() => {
                                          setIdReport(reporte.id_report);
                                          setOpenModalCreateFirma(true);
                                        }}
                                      >
                                        Firma
                                      </Button>
                                    </TableCell>

                                    <TableCell>
                                      {/* <StyledButton
                                        onClick={async () => {
                                          const validate = await ValidateReport(
                                            reporte.id_report
                                          );
                                          console.log("VALIDATE");
                                          console.log(validate);
                                          if (validate == true) {
                                            await generateQR(
                                              "http://localhost:3000/report"
                                            );
                                            const data = await getAllInfoReport(
                                              reporte.id_report
                                            );
                                            console.log("DATA de la funcion1");
                                            console.log(reporte);
                                            console.log(
                                              "######SDASDASD el reporte firmado"
                                            );
                                            console.log(data[0]);

                                            generatePdf(reporte, data);
                                          } else {
                                            setOpenModalText(true);
                                            setTextOpenModalText(
                                              "No se puede generar el reporte, aun no se han firmado todos los campos"
                                            );
                                          }
                                        }}
                                      >
                                        Reporte
                                      </StyledButton> */}

                                      <Button
                                        variant="contained"
                                        color={
                                          reporte.firma_responsiva_generador &&
                                          reporte.firma_responsiva_receptor &&
                                          reporte.residuos_agregados
                                            ? "success"
                                            : "error"
                                        }
                                        onClick={async () => {
                                          const validate = await ValidateReport(
                                            reporte.id_report
                                          );
                                          console.log("VALIDATE");
                                          console.log(validate);

                                          if (validate == true) {
                                            const data = await getAllInfoReport(
                                              reporte.id_report
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
                                              reporte.id_report;

                                            await generateQR(
                                              "https://rewards.rennueva.com/tracking-external/" +
                                                folio_busqueda // Aquí deberías poner la URL correcta para el reporte
                                            );

                                            console.log("DATA de la funcion1");
                                            console.log(reporte);
                                            console.log(
                                              "######SDASDASD el reporte firmado"
                                            );
                                            console.log(data[0]);

                                            generatePdf(reporte, data);
                                          } else {
                                            setOpenModalText(true);
                                            setTextOpenModalText(
                                              "No se puede generar el reporte, aun no se han firmado todos los campos"
                                            );
                                          }
                                        }}
                                      >
                                        Reporte
                                      </Button>
                                    </TableCell>
                                    <TableCell>
                                      <IconButton
                                        aria-label="editar"
                                        onClick={() => {
                                          console.log("Editar");
                                          console.log(reporte.id_report);
                                          setIdReport(reporte.id_report);
                                          console.log(reporte);
                                          console.log(report);
                                          setReportSelect(reporte);
                                          setOpenModalEditReport(true);
                                        }}
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell>
                                      <IconButton
                                        aria-label="borrar"
                                        onClick={() =>
                                          handleClickOpen(reporte.id_report)
                                        }
                                      >
                                        {" "}
                                        {/* Suponiendo que el ID del reporte es "1", aquí deberías pasar el ID real según tu lógica */}
                                        <DeleteIcon />
                                      </IconButton>
                                      <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                      >
                                        <DialogTitle id="alert-dialog-title">
                                          {"¿Estás seguro de querer borrar?"}
                                        </DialogTitle>
                                        <DialogContent>
                                          <DialogContentText id="alert-dialog-description">
                                            Esta acción no se puede deshacer.
                                          </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                          <Button onClick={handleClose}>
                                            Cancelar
                                          </Button>
                                          <Button
                                            onClick={handleConfirmDelete}
                                            autoFocus
                                          >
                                            {" "}
                                            {/* Aquí no necesitas pasar el ID ya que se maneja a través del estado */}
                                            Confirmar
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    </TableCell>
                                  </TableRow>
                                )
                              )
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={report.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    

                    {openModalCreateFirma && (
                      <ModalFirmar
                        mode={"CREAR"}
                        id={id_report}
                        type={"Generador"}
                      >
                        La funcionalidad de agregar TODO
                      </ModalFirmar>
                    )}
                    {openModalEdit && (
                      <ModalFirmar mode={"EDITAR"}>
                        La funcionalidad de editar TODO
                      </ModalFirmar>
                    )}
                    {openModalDelete && (
                      <ModalFirmar mode={"BORRAR"}>
                        La funcionalidad de borrar TODO
                      </ModalFirmar>
                    )}

                    {openModalCreateFirmaReceptor && (
                      <ModalFirmar
                        mode={"CREAR"}
                        id={id_report}
                        type={"Receptor"}
                      >
                        La funcionalidad de agregar TODO
                      </ModalFirmar>
                    )}
                    {openModalEditFirmaReceptor && (
                      <ModalFirmar mode={"EDITAR"}>
                        La funcionalidad de editar TODO
                      </ModalFirmar>
                    )}
                    {openModalDeleteFirmaReceptor && (
                      <ModalFirmar mode={"BORRAR"}>
                        La funcionalidad de borrar TODO
                      </ModalFirmar>
                    )}
                  </Paper>
                </Paper>
              </Grid>
            </Grid>
          

          {openModalCreateReport && (
            <ModalReport mode={"CREAR"}>
              La funcionalidad de agregar TODO
            </ModalReport>
          )}
          {openModalEditReport && (
            <ModalReport mode={"EDITAR"} report={reportSelect}>
              La funcionalidad de editar TODO
            </ModalReport>
          )}
          {openModalDeleteReport && (
            <ModalReport mode={"BORRAR"}>
              La funcionalidad de borrar TODO
            </ModalReport>
          )}

          {openModalCreateResidueReport && (
            <ModalResidueReport
              mode={"CREAR"}
              userselect={userSelectModal}
              report={reportSelectModal}
            >
              La funcionalidad de agregar TODO
            </ModalResidueReport>
          )}
          {openModalEditResidueReport && (
            <ModalResidueReport
              mode={"EDITAR"}
              userselect={userSelectModal}
              report={reportSelectModal}
            >
              La funcionalidad de editar TODO
            </ModalResidueReport>
          )}
          {openModalDeleteResidueReport && (
            <ModalResidueReport
              mode={"BORRAR"}
              userselect={userSelectModal}
              report={reportSelectModal}
            >
              La funcionalidad de borrar TODO
            </ModalResidueReport>
          )}
          {openModalText && (
            <Dialog
              open={openModalText}
              onClose={() => setOpenModalText(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {textOpenModalText}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {textOpenModalText}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenModalText(false)}>Aceptar</Button>
              </DialogActions>
            </Dialog>
          )}
        </Container>
    </>
  );
}

export { MenuReport };
