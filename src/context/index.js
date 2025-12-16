import React from 'react';
import { Light, Dark } from "../styles/Themes.jsx";
const TodoContext = React.createContext();



function TodoProvider({ children }) {

  const [theme, setTheme] = React.useState("light");
  const themeStyle = theme === "light" ? Light : Dark;
  const [openModalCreate, setOpenModalCreate] = React.useState(false);
  const [openModalEdit, setOpenModalEdit] = React.useState(false);
  const [openModalDelete, setOpenModalDelete] = React.useState(false);
  const [openModalCreateGroup, setOpenModalCreateGroup] = React.useState(false);
  const [openModalEditGroup, setOpenModalEditGroup] = React.useState(false);
  const [openModalDeleteGroup, setOpenModalDeleteGroup] = React.useState(false);
  const [openModalCreateCarrier, setOpenModalCreateCarrier] = React.useState(false);
  const [openModalEditCarrier, setOpenModalEditCarrier] = React.useState(false);
  const [openModalDeleteCarrier, setOpenModalDeleteCarrier] = React.useState(false);
  const [openModalCreateCollectionCenter, setOpenModalCreateCollectionCenter] = React.useState(false);
  const [openModalEditCollectionCenter, setOpenModalEditCollectionCenter] = React.useState(false);
  const [openModalDeleteCollectionCenter, setOpenModalDeleteCollectionCenter] = React.useState(false);
  const [openModalCreateDonor, setOpenModalCreateDonor] = React.useState(false);
  const [openModalEditDonor, setOpenModalEditDonor] = React.useState(false);
  const [openModalDeleteDonor, setOpenModalDeleteDonor] = React.useState(false);
  const [openModalCreateDriver, setOpenModalCreateDriver] = React.useState(false);
  const [openModalEditDriver, setOpenModalEditDriver] = React.useState(false);
  const [openModalDeleteDriver, setOpenModalDeleteDriver] = React.useState(false);
  const [openModalCreateGenerator, setOpenModalCreateGenerator] = React.useState(false);
  const [openModalEditGenerator, setOpenModalEditGenerator] = React.useState(false);
  const [openModalDeleteGenerator, setOpenModalDeleteGenerator] = React.useState(false);
  const [openModalCreateRecyclingCenter, setOpenModalCreateRecyclingCenter] = React.useState(false);
  const [openModalEditRecyclingCenter, setOpenModalEditRecyclingCenter] = React.useState(false);
  const [openModalDeleteRecyclingCenter, setOpenModalDeleteRecyclingCenter] = React.useState(false);
  const [openModalCreateResidue, setOpenModalCreateResidue] = React.useState(false);
  const [openModalEditResidue, setOpenModalEditResidue] = React.useState(false);
  const [openModalDeleteResidue, setOpenModalDeleteResidue] = React.useState(false);
  const [openModalCreateVehicle, setOpenModalCreateVehicle] = React.useState(false);
  const [openModalEditVehicle, setOpenModalEditVehicle] = React.useState(false);
  const [openModalDeleteVehicle, setOpenModalDeleteVehicle] = React.useState(false);
  const [openSideBar , setOpenSideBar] = React.useState(true);
  const [openModalText, setOpenModalText] = React.useState(false);
  const [openModalCreateReport, setOpenModalCreateReport] = React.useState(false);
  const [openModalEditReport, setOpenModalEditReport] = React.useState(false);
  const [openModalDeleteReport, setOpenModalDeleteReport] = React.useState(false);
  const [openModalCreateResidueReport, setOpenModalCreateResidueReport] = React.useState(false);
  const [openModalEditResidueReport, setOpenModalEditResidueReport] = React.useState(false);
  const [openModalDeleteResidueReport, setOpenModalDeleteResidueReport] = React.useState(false);
  const [textOpenModalText, setTextOpenModalText] = React.useState("");
  const [updateGroupInfo, setUpdateGroupInfo] = React.useState(false);
  const [updateCarrierInfo, setUpdateCarrierInfo] = React.useState(false);
  const [updateCollectionCenterInfo, setUpdateCollectionCenterInfo] = React.useState(false);
  const [updateDonorInfo, setUpdateDonorInfo] = React.useState(false);
  const [updateDriverInfo, setUpdateDriverInfo] = React.useState(false);
  const [updateGeneratorInfo, setUpdateGeneratorInfo] = React.useState(false);
  const [updateRecyclingCenterInfo, setUpdateRecyclingCenterInfo] = React.useState(false);
  const [updateResidueInfo, setUpdateResidueInfo] = React.useState(false);
  const [updateVehicleInfo, setUpdateVehicleInfo] = React.useState(false);
  const [updateReportInfo, setUpdateReportInfo] = React.useState(false);
  const [updateResidueReportInfo, setUpdateResidueReportInfo] = React.useState(false);
  const [updateUserInfo, setUpdateUserInfo] = React.useState(false);
  const [openModalCreateFirma, setOpenModalCreateFirma] = React.useState(false);
  const [openModalEditFirma, setOpenModalEditFirma] = React.useState(false);
  const [openModalDeleteFirma, setOpenModalDeleteFirma] = React.useState(false);
  const [openModalCreateFirmaReceptor, setOpenModalCreateFirmaReceptor] = React.useState(false);
  const [openModalEditFirmaReceptor, setOpenModalEditFirmaReceptor] = React.useState(false);
  const [openModalDeleteFirmaReceptor, setOpenModalDeleteFirmaReceptor] = React.useState(false);
  const [openModalCreateCompany, setOpenModalCreateCompany] = React.useState(false);
  const [openModalEditCompany, setOpenModalEditCompany] = React.useState(false);
  const [openModalDeleteCompany, setOpenModalDeleteCompany] = React.useState(false);
  const [updateCompanyInfo, setUpdateCompanyInfo] = React.useState(false);
  const [openModalDeleteOrderRecollection , setOpenModalDeleteOrderRecollection] = React.useState(false);
  const [updateDonorReports, setUpdateDonorReports] = React.useState(false);
  const [openModalFinishReport , setOpenModalFinishReport] = React.useState(false);
  const [userGroups, setUserGroups] = React.useState(null);
  const [openModalCheckRecyclingOrder, setOpenModalCheckRecyclingOrder] = React.useState(false);
  const [openModalWeightVolumeReport, setOpenModalWeightVolumeReport] = React.useState(false);
  const [updStatusResiduesGeneric, setUpdStatusResiduesGeneric] = React.useState(false);
  const [userReportsAssignedRecycling, setUserReportsAssignedRecycling] = React.useState(false);
  const [openFinishVerificationModal, setOpenFinishVerificationModal] = React.useState(false);
  const [infoVehicle, setInfoVehicle] = React.useState("");
  

  return (
    <TodoContext.Provider value={{
      openModalCreate, setOpenModalCreate, openModalEdit,
      setOpenModalEdit, openModalDelete,
      setOpenModalDelete, theme, setTheme, themeStyle,
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
      openSideBar , setOpenSideBar,
      openModalText, setOpenModalText,
      openModalCreateReport, setOpenModalCreateReport,
      openModalEditReport, setOpenModalEditReport,
      openModalDeleteReport, setOpenModalDeleteReport,
      openModalCreateResidueReport, setOpenModalCreateResidueReport,
      openModalEditResidueReport, setOpenModalEditResidueReport,
      openModalDeleteResidueReport, setOpenModalDeleteResidueReport,
      textOpenModalText, setTextOpenModalText,
      updateGroupInfo, setUpdateGroupInfo,
      updateCarrierInfo, setUpdateCarrierInfo,
      updateCollectionCenterInfo, setUpdateCollectionCenterInfo,
      updateDonorInfo, setUpdateDonorInfo,
      updateDriverInfo, setUpdateDriverInfo,
      updateGeneratorInfo, setUpdateGeneratorInfo,
      updateRecyclingCenterInfo, setUpdateRecyclingCenterInfo,
      updateResidueInfo, setUpdateResidueInfo,
      updateVehicleInfo, setUpdateVehicleInfo,
      updateReportInfo, setUpdateReportInfo,
      updateResidueReportInfo, setUpdateResidueReportInfo,
      updateUserInfo, setUpdateUserInfo,
      openModalCreateFirma, setOpenModalCreateFirma,
      openModalEditFirma, setOpenModalEditFirma,
      openModalDeleteFirma, setOpenModalDeleteFirma,
      openModalCreateFirmaReceptor, setOpenModalCreateFirmaReceptor,
      openModalEditFirmaReceptor, setOpenModalEditFirmaReceptor,
      openModalDeleteFirmaReceptor, setOpenModalDeleteFirmaReceptor,
      openModalCreateCompany, setOpenModalCreateCompany,
      openModalEditCompany, setOpenModalEditCompany,
      openModalDeleteCompany, setOpenModalDeleteCompany,
      openModalDeleteOrderRecollection , setOpenModalDeleteOrderRecollection,
      updateCompanyInfo, setUpdateCompanyInfo,
      userGroups, setUserGroups,
      updateDonorReports, setUpdateDonorReports, 
      openModalFinishReport , setOpenModalFinishReport,
      //openModalCreateCarrier, setOpenModalCreateCarrier,
      openModalCheckRecyclingOrder, setOpenModalCheckRecyclingOrder,
      openModalWeightVolumeReport, setOpenModalWeightVolumeReport,
      updStatusResiduesGeneric, setUpdStatusResiduesGeneric,
      userReportsAssignedRecycling, setUserReportsAssignedRecycling, 
      openFinishVerificationModal, setOpenFinishVerificationModal,
      infoVehicle, setInfoVehicle
      

    }} >
      {children}
    </TodoContext.Provider>
  );
}

export { TodoContext, TodoProvider };