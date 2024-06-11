
import React, { useState, useEffect, useContext } from "react";
import { TodoContext } from '../context/index.js';
import { OptionButton, ActionButtonOrdersExcel, ImportExcelButton, ActionButtonResponsivaExcel } from '../components/OptionButton';
import axios from 'axios';

;

const CUDButtons = ({ handleAdd, handleDelete, handleUpdate, model }) => {
  const {
    totalListlUsers,
    openModalCreate, setOpenModalCreate,
    openModalEdit, setOpenModalEdit,
    openModalDelete, setOpenModalDelete,
    openModalCreateGroup, setOpenModalCreateGroup,
    openModalEditGroup, setOpenModalEditGroup,
    openModalDeleteGroup, setOpenModalDeleteGroup,
    openModalCreateCarrier, setOpenModalCreateCarrier,
    openModalEditCarrier, setOpenModalEditCarrier,
    openModalDeleteCarrier, setOpenModalDeleteCarrier,
    openModalCreateCollectionCenter, setOpenModalCreateCollectionCenter,
    openModalEditCollectionCenter, setOpenModalEditCollectionCenter,
    openModalDeleteCollectionCenter, setOpenModalDeleteCollectionCenter,
    openModalCreateDonor, setOpenModalCreateDonor,
    openModalEditDonor, setOpenModalEditDonor,
    openModalDeleteDonor, setOpenModalDeleteDonor,
    openModalCreateDriver, setOpenModalCreateDriver,
    openModalEditDriver, setOpenModalEditDriver,
    openModalDeleteDriver, setOpenModalDeleteDriver,
    openModalCreateGenerator, setOpenModalCreateGenerator,
    openModalEditGenerator, setOpenModalEditGenerator,
    openModalDeleteGenerator, setOpenModalDeleteGenerator,
    openModalCreateRecyclingCenter, setOpenModalCreateRecyclingCenter,
    openModalEditRecyclingCenter, setOpenModalEditRecyclingCenter,
    openModalDeleteRecyclingCenter, setOpenModalDeleteRecyclingCenter,
    openModalCreateResidue, setOpenModalCreateResidue,
    openModalEditResidue, setOpenModalEditResidue,
    openModalDeleteResidue, setOpenModalDeleteResidue,
    openModalCreateVehicle, setOpenModalCreateVehicle,
    openModalEditVehicle, setOpenModalEditVehicle,
    openModalDeleteVehicle, setOpenModalDeleteVehicle,
    openModalCreateReport, setOpenModalCreateReport,
    openModalCreateCompany, setOpenModalCreateCompany,
    openModalEditCompany, setOpenModalEditCompany,
    openModalDeleteCompany, setOpenModalDeleteCompany,
    openModalText, setOpenModalText, textOpenModalText, setTextOpenModalText,

  } = useContext(TodoContext);


  const handleDataImported = async (data) => {
    console.log("Datos importados:", data);
    console.log(data[0].Tipo);

    let url = "http://127.0.0.1:8000/Rennueva"; // URL base

    if (data[0].Tipo === "Generador") {
      console.log("Es un archivo de usuarios");
      // Suponiendo que tienes una URL para crear usuarios
      url += "/create-generator/";
    } else if (data[0].Tipo === "Centro de Reciclaje") {
      console.log("Es un archivo de reciclaje");
      url += "/creat-recycling-center/";
    } else if (data[0].Tipo === "Centro de Recoleccion") {
      console.log("Es un archivo de recolección");
      url += "/creat-collection-center/";
    } else if (data[0].Tipo === "Responsiva") {
      console.log("Es un archivo de responsiva");
      url += "/import-report/";
    }
    else {
      console.log("Tipo desconocido");
      return; // Salir si el tipo no es reconocido
    }

    // Realizar la consulta
    try {
      console.log("####################################");
      console.log("Enviando datos:", JSON.stringify(data));

      const response = axios
        .post(`${url}`, data)
        .then(response => {
          const data = response.data;
          console.log("Respuesta del servidor:", data);
          if (data.error) {
            setTextOpenModalText("Error al crear Generador(es) con el archivo Excel, se lograron crear: " + data.usuarios_creados + " Generadores error en la creacion por: " + data.error);
            setOpenModalText(true);
          }
          if (data.message === "Responsivas creadas") {
            setTextOpenModalText("Responsivas creadas correctamente con el archivo Excel, se crearon: " + data.responsivas_creadas + " Responsivas");
            setOpenModalText(true);
          }
          if (data.error_responsiva) {
            setTextOpenModalText("Error al crear Responsivas con el archivo Excel, se lograron crear: " + data.responsivas_creadas + " Responsivas error en la creacion por: " + data.error_responsiva);
            setOpenModalText(true);
          }
          if (data.message === "Generador creado") {
            setTextOpenModalText("Generador(es) creado(s) correctamente con el archivo Excel, se crearon: " + data.usuarios_creados + " Generadores");
            setOpenModalText(true);
          }
          if (data.message === "error") {
            setTextOpenModalText("Error al crear Generador(es) con el archivo Excel, se lograron crear: " + data.usuarios_creados + " Generadores error en la creacion por: " + data.error);
            setOpenModalText(true);
          }






        })
        .catch(error => {
          console.error(error);
        })

      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al realizar la consulta:", error);
    }
  };

  const datoss = [
    { title: 'Solicitado' },
    { title: 'Pendiente Recoleccion' },
    { title: 'Cancelada' },

  ];


  return (
    <div style={{ display: "flex" }}>

      <div className="create-button">
        {model === 'User' ? (
          <OptionButton setOpenModal={setOpenModalCreate} text="Crear Usuario" color='success' />
        ) : null}
        {model === 'Group' ? (
          <OptionButton setOpenModal={setOpenModalCreateGroup} text="Crear Grupo" color="success" />
        ) : null}
        {model === 'Carrier' ? (
          <OptionButton setOpenModal={setOpenModalCreateCarrier} text="Crear Transportista" color="success" />
        ) : null}
        {model === 'CollectionCenter' ? (
          <OptionButton setOpenModal={setOpenModalCreateCollectionCenter} text="Crear Centro de Acopio" color="success" />
        ) : null}
        {model === 'Donor' ? (
          <OptionButton setOpenModal={setOpenModalCreateDonor} text="Crear Donador" color="success" />
        ) : null}
        {model === 'Driver' ? (
          <OptionButton setOpenModal={setOpenModalCreateDriver} text="Crear Conductor" color="success" />
        ) : null}
        {model === 'Generator' ? (
          console.log("MODELS"),
          <OptionButton setOpenModal={setOpenModalCreateGenerator} text="Crear Generador" color="success" />
        ) : null}
        {model === 'RecyclingCenter' ? (
          <OptionButton setOpenModal={setOpenModalCreateRecyclingCenter} text="Crear Centro de Reciclaje" color="success" />
        ) : null}
        {model === 'Residue' ? (
          <OptionButton setOpenModal={setOpenModalCreateResidue} text="Crear Residuo" color="success" />
        ) : null}
        {model === 'Vehicle' ? (
          <OptionButton setOpenModal={setOpenModalCreateVehicle} text="Crear Vehículo" color="success" />
        ) : null}
        {model === 'Responsiva' ? (
          <OptionButton setOpenModal={setOpenModalCreateReport} text="Crear responsiva" color="success" />
        ) : null}
        {model === 'Company' ? (
          <OptionButton setOpenModal={setOpenModalCreateCompany} text="Crear Compañia" color="success" />
        ) : null}
        {model === 'ReportHistory' ? (
          <ImportExcelButton text="Importar Generadores Excel" color="success" onImported={handleDataImported} />
        ) : null}

      </div>
      <div className="create-button">
        {model === "User" ? (
          <OptionButton setOpenModal={setOpenModalEdit} text="Editar Usuario" color="info" />
        ) : null}
        {model === "Group" ? (
          <OptionButton setOpenModal={setOpenModalEditGroup} text="Editar Grupo" color="info" />
        ) : null}
        {model === "Carrier" ? (
          <OptionButton setOpenModal={setOpenModalEditCarrier} text="Editar Transportista" color="info" />
        ) : null}
        {model === "CollectionCenter" ? (
          <OptionButton setOpenModal={setOpenModalEditCollectionCenter} text="Editar Centro de Acopio" color="info" />
        ) : null}
        {model === "Donor" ? (
          <OptionButton setOpenModal={setOpenModalEditDonor} text="Editar Donador" color="info" />
        ) : null}
        {model === "Driver" ? (
          <OptionButton setOpenModal={setOpenModalEditDriver} text="Editar Conductor" color="info" />
        ) : null}
        {model === "Generator" ? (
          <OptionButton setOpenModal={setOpenModalEditGenerator} text="Editar Generador" color="info" />
        ) : null}
        {model === "RecyclingCenter" ? (
          <OptionButton setOpenModal={setOpenModalEditRecyclingCenter} text="Editar Centro de Reciclaje" color="info" />
        ) : null}
        {model === "Residue" ? (
          <OptionButton setOpenModal={setOpenModalEditResidue} text="Editar Residuo" color="info" />
        ) : null}
        {model === "Vehicle" ? (
          <OptionButton setOpenModal={setOpenModalEditVehicle} text="Editar Vehículo" color="info" />
        ) : null}
        {model === "Company" ? (
          <OptionButton setOpenModal={setOpenModalEditCompany} text="Editar Compañia" color="info" />
        ) : null}
        {/* {model === 'ReportHistory' ? (
        <ImportExcelButton text="Importar Centros de Recoleccion Excel" color="blue" onImported={handleDataImported} />
      ) : null} */}
        {model === 'ReportHistory' ? (
          <div className="create-button">  <ImportExcelButton text="Importar Responsivas Excel" color="success" onImported={handleDataImported} /> </div>
        ) : null}


      </div>
      <div className="create-button">
        {model === "User" ? (
          <OptionButton setOpenModal={setOpenModalDelete} text="Borrar Usuario" color="error" />
        ) : null}
        {model === "Group" ? (
          <OptionButton setOpenModal={setOpenModalDeleteGroup} text="Borrar Grupo" color="error" />
        ) : null}
        {model === "Carrier" ? (
          <OptionButton setOpenModal={setOpenModalDeleteCarrier} text="Borrar Transportista" color="error" />
        ) : null}
        {model === "CollectionCenter" ? (
          <OptionButton setOpenModal={setOpenModalDeleteCollectionCenter} text="Borrar Centro de Acopio" color="error" />
        ) : null}
        {model === "Driver" ? (
          <OptionButton setOpenModal={setOpenModalDeleteDriver} text="Borrar Conductor" color="error" />
        ) : null}
        {model === "Generator" ? (
          <OptionButton setOpenModal={setOpenModalDeleteGenerator} text="Borrar Generador" color="error" />
        ) : null}
        {model === "RecyclingCenter" ? (
          <OptionButton setOpenModal={setOpenModalDeleteRecyclingCenter} text="Borrar Centro de Reciclaje" color="error" />
        ) : null}
        {model === "Residue" ? (
          <OptionButton setOpenModal={setOpenModalDeleteResidue} text="Borrar Residuo" color="error" />
        ) : null}
        {model === "Vehicle" ? (
          <OptionButton setOpenModal={setOpenModalDeleteVehicle} text="Borrar Vehículo" color="error" />
        ) : null}
        {model === "Company" ? (
          <OptionButton setOpenModal={setOpenModalDeleteCompany} text="Borrar Compañia" color="error" />
        ) : null}

        {model === "ReportHistory" ? (
          <OptionButton setOpenModal={setOpenModalDeleteVehicle} text="Borrar Historial de Reportes" color="error" />
        ) : null}

      </div>

      {model === 'ReportHistory' ? (
        <div className="create-button" >
          <ActionButtonResponsivaExcel
            text="Exportar a Excel"
            color="primary"

          />
        </div>
      ) : null}





    </div>
  );
}

export default CUDButtons;