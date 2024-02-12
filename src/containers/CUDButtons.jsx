
import React, { useState, useEffect, useContext } from "react";
import { TodoContext } from '../context/index.js';
import { OptionButton, ActionButtonOrdersExcel, ImportExcelButton } from '../components/OptionButton';
import axios from 'axios';

const CUDButtons = ({ handleAdd, handleDelete, handleUpdate, model }) => {
    const {
      totalListlUsers,
      openModalCreate, setOpenModalCreate,
      openModalEdit, setOpenModalEdit,
      openModalDelete, setOpenModalDelete, theme, setTheme, themeStyle,
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
      } else {
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

        })
        .catch(error => {
            console.error(error);
        })

        console.log("Respuesta del servidor:", response.data);
      } catch (error) {
        console.error("Error al realizar la consulta:", error);
      }
    };
    
    
    return (
        <div style={{display :"flex"}}>
        <div className="create-button">
        {model === 'User' ? (
        <OptionButton setOpenModal={setOpenModalCreate} text="Crear Usuario" color="#28a745"  />
      ): null } 
      {model === 'Group' ? (
        <OptionButton setOpenModal={setOpenModalCreateGroup} text="Crear Grupo" color="#28a745" />
      ): null }
      {model === 'Carrier' ? (
        <OptionButton setOpenModal={setOpenModalCreateCarrier} text="Crear Transportista" color="#28a745" />
      ):null}
      {model === 'CollectionCenter' ? (
        <OptionButton setOpenModal={setOpenModalCreateCollectionCenter} text="Crear Centro de Acopio" color="#28a745" />
      ) : null}
      {model === 'Donor' ? (
        <OptionButton setOpenModal={setOpenModalCreateDonor} text="Crear Donador" color="#28a745" />
      ): null}
      {model === 'Driver' ? (
        <OptionButton setOpenModal={setOpenModalCreateDriver} text="Crear Conductor" color="#28a745" />
      ) : null}
      {model === 'Generator' ? (
        console.log("MODELS"),
        <OptionButton setOpenModal={setOpenModalCreateGenerator} text="Crear Generador" color="#28a745" />
      ): null}
      {model === 'RecyclingCenter' ? (
        <OptionButton setOpenModal={setOpenModalCreateRecyclingCenter} text="Crear Centro de Reciclaje" color="#28a745" />
      ) :null}
      {model === 'Residue' ? (
        <OptionButton setOpenModal={setOpenModalCreateResidue} text="Crear Residuo" color="#28a745" />
      ) : null}
      {model === 'Vehicle' ? (
        <OptionButton setOpenModal={setOpenModalCreateVehicle} text="Crear Vehicle" color="#28a745" />
      ) : null}
      {model === 'Responsiva' ? (
        <OptionButton setOpenModal={setOpenModalCreateReport} text="Crear responsiva" color="#28a745" />
      ) : null}
      {model === 'Company' ? (
        <OptionButton setOpenModal={setOpenModalCreateCompany} text="Crear Compañia" color="#28a745" />
      ) : null}
      {model === 'DonorRecolection' ? (
        <ActionButtonOrdersExcel 
        text="Exportar a Excel"
        color="#28a745"
        
      />
      ) : null}
      {model === 'ReportHistory' ? (
        <ImportExcelButton text="Importar Generadores Excel" color="blue" onImported={handleDataImported} />
      ) : null}



      </div>
        <div className="create-button">
        {model === "User"  ? (
          <OptionButton setOpenModal={setOpenModalEdit} text="Editar Usuario" color="#007bff" />
        ) : null}
        {model === "Group"  ? (
          <OptionButton setOpenModal={setOpenModalEditGroup} text="Editar Grupo" color="##007bff" />
        ) : null}
        {model === "Carrier"  ? (
          <OptionButton setOpenModal={setOpenModalEditCarrier} text="Editar Transportista" color="##007bff" />
        ) : null }
        {model === "CollectionCenter"  ? (
          <OptionButton setOpenModal={setOpenModalEditCollectionCenter} text="Editar Centro de Acopio" color="#007bff" />
        ) : null}
        {model === "Donor"  ? (
          <OptionButton setOpenModal={setOpenModalEditDonor} text="Editar Donador" color="#007bff" />
        ) : null}
        {model === "Driver"  ? (
          <OptionButton setOpenModal={setOpenModalEditDriver} text="Editar Conductor" color="#007bff" />
        ) : null}
        {model === "Generator"  ? (
          <OptionButton setOpenModal={setOpenModalEditGenerator} text="Editar Generador" color="#007bff" />
        ): null }
        {model === "RecyclingCenter"  ? (
          <OptionButton setOpenModal={setOpenModalEditRecyclingCenter} text="Editar Centro de Reciclaje" color="#007bff" />
        ) : null}
        {model === "Residue"  ? (
          <OptionButton setOpenModal={setOpenModalEditResidue} text="Editar Residuo" color="#007bff" />
        ) : null}
        {model === "Vehicle"  ? (
          <OptionButton setOpenModal={setOpenModalEditVehicle} text="Editar Vehicle" color="#007bff" />
        ) : null}
        {model === "Responsiva"  ? (
          <OptionButton setOpenModal={setOpenModalEditVehicle} text="Editar Responsiva" color="#007bff" />
        ) : null}
        {model === "Company"  ? (
          <OptionButton setOpenModal={setOpenModalEditCompany} text="Editar Compañia" color="#007bff" />
        ) : null}
        {model === 'ReportHistory' ? (
        <ImportExcelButton text="Importar Centros de Recoleccion Excel" color="blue" onImported={handleDataImported} />
      ) : null}
      {model === 'ReportHistory' ? (
        <div className="create-button">  <ImportExcelButton text="Importar Centros de Reciclaje Excel" color="blue" onImported={handleDataImported} /> </div>
      ) : null}

      </div>
        <div className="create-button">
        {model === "User" ? (
          <OptionButton setOpenModal={setOpenModalDelete} text="Borrar Usuario" color="#dc3545" />
        ): null}
        {model === "Group" ? (
          <OptionButton setOpenModal={setOpenModalDeleteGroup} text="Borrar Grupo" color="#dc3545" />
        ): null}
        {model === "Carrier" ? (
          <OptionButton setOpenModal={setOpenModalDeleteCarrier} text="Borrar Transportista" color="#dc3545" />
        ): null}
        {model === "CollectionCenter" ? (
          <OptionButton setOpenModal={setOpenModalDeleteCollectionCenter} text="Borrar Centro de Acopio" color="#dc3545" />
        ): null}
        {model === "Donor" ? (
          <OptionButton setOpenModal={setOpenModalDeleteDonor} text="Borrar Donador" color="#dc3545" />
        ): null}
        {model === "Driver" ? (
          <OptionButton setOpenModal={setOpenModalDeleteDriver} text="Borrar Conductor" color="#dc3545" />
        ): null}
        {model === "Generator" ? (
          <OptionButton setOpenModal={setOpenModalDeleteGenerator} text="Borrar Generador" color="#dc3545" />
        ): null}
        {model === "RecyclingCenter" ? (
          <OptionButton setOpenModal={setOpenModalDeleteRecyclingCenter} text="Borrar Centro de Reciclaje" color="#dc3545" />
        ): null}
        {model === "Residue" ? (
          <OptionButton setOpenModal={setOpenModalDeleteResidue} text="Borrar Residuo" color="#dc3545" />
        ): null}
        {model === "Vehicle" ? (
          <OptionButton setOpenModal={setOpenModalDeleteVehicle} text="Borrar Vehicle" color="#dc3545" />
        ): null}
        {model === "Responsiva" ? (
          <OptionButton setOpenModal={setOpenModalDeleteVehicle} text="Borrar Responsiva" color="#dc3545" />
        ): null}
        {model === "Company" ? (
          <OptionButton setOpenModal={setOpenModalDeleteCompany} text="Borrar Compañia" color="#dc3545" />
        ): null}
        {model === "DonorRecolection" ? (
          <OptionButton setOpenModal={setOpenModalDeleteVehicle} text="Borrar Orden Recoleccioni" color="#dc3545" />
        ): null}
        {model === "ReportHistory" ? (
          <OptionButton setOpenModal={setOpenModalDeleteVehicle} text="Borrar Historial de Reportes" color="#dc3545" />
        ): null}

      </div>
        </div>
    );
    }
    
    export default CUDButtons;