import React, { useState, useContext } from 'react';
import { TodoProvider } from '../context/index';
import { MenuGroups } from '../pages/Users/MenuGroups';
import { MenuVehicle } from '../pages/MenuVehicle';
import { MenuUser } from '../pages/Users/MenuUser';
import Layout from '../containers/LayoutHeader';
import { MenuResidue } from '../pages/MenuResidue';
import { MenuRecyclingCenter } from '../pages/MenuRecyclingCenter.js';
import { MenuGenerator } from '../pages/MenuGenerator';
import { MenuDriver } from '../pages/MenuDriver';
import { SignUp } from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import { MenuDonor } from '../pages/MenuDonor';
import { MenuCarrier } from '../pages/MenuCarrier';
import { MenuCollectionCenter } from '../pages/MenuCollectionCenter';
import { MenuReport } from '../pages/MenuReport';
import { MenuTracking } from '../pages/MenuTracking.jsx';
import { MenuDonorRecolection } from '../pages/MenuDonorRecolection.js';
import { MenuCompany } from '../pages/Menus/MenuCompany.js';
import { MenuReportHistory } from '../pages/Menus/MenuReportHistory.js';
import { MenuMainGenerator } from '../pages/Menus/MenuMainGenerator.js';
import LayoutGenerator from '../containers/LayoutGenerator.jsx';
import { MenuMyResponsivasGenerator } from '../pages/Menus/MenuMyResponsivasGenerator.js';
import CentroLayout from '../containers/CentroLayout.jsx';
import Login from '../pages/Login';
import AdminList from '../containers/ListSideBar/AdminList2.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { TodoContext } from '../context/index';
import ComunicacionList from '../containers/ListSideBarComunicacion/ComunicacionList.jsx';
import LogisticList from '../containers/ListSideBarLogistica/LogisticaList.jsx';
import QualityList from '../containers/ListSideBarCalidad/CalidadList.jsx';
import MenuRequestRestorePass from '../pages/Menus/MenuRequestRestorePass.js';
import MenuResetPass from '../pages/Menus/MenuResetPass.js';
import ProduccionList from '../containers/ListSideBarProduccion/ProduccionList.jsx';
import RegisterList from '../containers/ListSideBarRegister/RegisterList.jsx';
import ExportsMenu from '../pages/Menus/ExportsMenu.jsx';
import DriverList from '../containers/ListSideBarDriver/DriverList.jsx';
import { MenuAssignedOrders } from '../pages/Menus/MenuAssignedOrders.js';
import { MenuOrderAssignment } from '../pages/Menus/MenuOrderAssignmentMenu.js';

function App() {

  
  const router = createBrowserRouter([ 
    { path: '/users', element: <CentroLayout List={<AdminList/>}><MenuUser/></CentroLayout> },
    { path: '/groups', element: <CentroLayout List={<AdminList/>}><MenuGroups/></CentroLayout> },
    { path: '/vehicle', element: <CentroLayout List={<AdminList/>}><MenuVehicle/></CentroLayout> },
    { path: '/residue', element: <CentroLayout List={<AdminList/>}><MenuResidue/></CentroLayout> },
    { path: '/recycling-center', element: <CentroLayout List={<AdminList/>}><MenuRecyclingCenter/></CentroLayout> },
    { path: '/generator', element: <CentroLayout List={<AdminList/>}><ExportsMenu/> </CentroLayout> },
    { path: '/driver', element: <CentroLayout List={<AdminList/>}><MenuDriver/></CentroLayout> },
    { path: '/register', element: <SignUp /> },
    { path: '/dash', element: <CentroLayout List={<AdminList/>}><Dashboard/></CentroLayout> },
    { path: '/donor', element: <CentroLayout List={<AdminList/>}><MenuDonor/></CentroLayout> },
    { path: '/carrier', element: <CentroLayout List={<AdminList/>}><MenuCarrier/></CentroLayout> },
    { path: '/collection-center', element: <CentroLayout List={<AdminList/>}><MenuCollectionCenter/></CentroLayout> },
    { path: '/report', element: <CentroLayout List={<AdminList/>}><MenuReport/></CentroLayout> },
    { path: '/tracking', element: <Layout><MenuTracking mode = "tracking"/></Layout> },
    { path: '/tracking-external/:trackingNumber', element: <MenuTracking mode = "tracking external"/> },
    { path: '/donor-recolection', element: <CentroLayout List={<AdminList/>}><MenuDonorRecolection/></CentroLayout> },
    { path: '/company', element: <CentroLayout List={<AdminList/>}><MenuCompany/></CentroLayout> },
    { path: '/report-history', element: <CentroLayout List={<AdminList/>}><MenuReportHistory/></CentroLayout> },
    
    { path: '/main-generator', element: <LayoutGenerator><MenuMainGenerator/></LayoutGenerator> },
    { path: '/responsivas-generator', element: <LayoutGenerator><MenuMyResponsivasGenerator/></LayoutGenerator> },
    { path: '*', element: <h1>Not Found 404</h1> },
    { path: '/', element: <Login/> },
    { path: '/login', element: <Login/> },

    // menus para grupo comunicacion
    { path: '/donor-comunication', element: <CentroLayout List={<ComunicacionList/>}><MenuDonor/></CentroLayout> },
    { path: '/donor-recollection-comunication', element: <CentroLayout List={<ComunicacionList/>}><MenuDonorRecolection/></CentroLayout> },

    // menus para grupo logistica y transporte
    { path: '/donor-recollection-logistic', element: <CentroLayout List={<LogisticList/>}><MenuDonorRecolection/></CentroLayout> },
    { path: '/logistic/donor', element: <CentroLayout List={<LogisticList/>}><MenuDonor/></CentroLayout> },
    { path: '/logistic/order-recollection-assignment', element: <CentroLayout List={<LogisticList/>}><MenuOrderAssignment/></CentroLayout> },
    
    
    // menu para grupo de calidad 
    { path: '/quality/donor-recollection', element: <CentroLayout List={<QualityList/>}><MenuDonorRecolection/></CentroLayout> },
    { path: '/quality/generator', element: <CentroLayout List={<QualityList/>}><ExportsMenu/></CentroLayout> },
    { path: '/quality/donor', element: <CentroLayout List={<QualityList/>}><MenuDonor/></CentroLayout> },
    { path: '/quality/carrier', element: <CentroLayout List={<QualityList/>}><MenuCarrier/></CentroLayout> },
    { path: '/quality/driver', element: <CentroLayout List={<QualityList/>}><MenuDriver/></CentroLayout> },
    { path: '/quality/report', element: <CentroLayout List={<QualityList/>}><MenuReport/></CentroLayout> },
    { path: '/quality/tracking', element: <CentroLayout List={<QualityList/>} ><MenuTracking mode = "tracking"/></CentroLayout> },
    { path: '/quality/report-history', element: <CentroLayout List={<QualityList/>}><MenuReportHistory/></CentroLayout> },
    { path: '/quality/recycling-center', element: <CentroLayout List={<QualityList/>}><MenuRecyclingCenter/></CentroLayout> },
    { path: '/quality/collection-center', element: <CentroLayout List={<QualityList/>}><MenuCollectionCenter/></CentroLayout> },
    { path: '/quality/vehicle', element: <CentroLayout List={<QualityList/>}><MenuVehicle/> </CentroLayout> },
  
    //menus para grupo produccion
    { path: '/production/donor-recollection', element: <CentroLayout List={<ProduccionList/>}><MenuDonorRecolection/></CentroLayout> },
    { path: '/production/donor', element: <CentroLayout List={<ProduccionList/>}><MenuDonor/></CentroLayout> },
    { path: '/production/report', element: <CentroLayout List={<ProduccionList/>}><MenuReport/></CentroLayout> },
    { path: '/production/tracking', element: <CentroLayout List={<ProduccionList/>} ><MenuTracking mode = "tracking"/></CentroLayout> },
    { path: '/production/report-history', element: <CentroLayout List={<ProduccionList/>}><MenuReportHistory/></CentroLayout> },

    //menus para grupo registros 
    { path: '/register/donor-recollection', element: <CentroLayout List={<RegisterList/>}><MenuDonorRecolection/></CentroLayout> },
    { path: '/register/generator', element: <CentroLayout List={<RegisterList/>}><ExportsMenu/></CentroLayout> },
    { path: '/register/donor', element: <CentroLayout List={<RegisterList/>}><MenuDonor/></CentroLayout> },
    { path: '/register/carrier', element: <CentroLayout List={<RegisterList/>}><MenuCarrier/></CentroLayout> },
    { path: '/register/driver', element: <CentroLayout List={<RegisterList/>}><MenuDriver/></CentroLayout> },
    { path: '/register/report', element: <CentroLayout List={<RegisterList/>}><MenuReport/></CentroLayout> },
    { path: '/register/tracking', element: <CentroLayout List={<RegisterList/>} ><MenuTracking mode = "tracking"/></CentroLayout> },
    { path: '/register/report-history', element: <CentroLayout List={<RegisterList/>}><MenuReportHistory/></CentroLayout> },
    { path: '/register/recycling-center', element: <CentroLayout List={<RegisterList/>}><MenuRecyclingCenter/></CentroLayout> },
    { path: '/register/collection-center', element: <CentroLayout List={<RegisterList/>}><MenuCollectionCenter/></CentroLayout> },
    { path: '/register/vehicle', element: <CentroLayout List={<RegisterList/>}><MenuVehicle/> </CentroLayout> },
  
    //menus para grupo de conductores 
    { path: '/driver/assigned-orders', element: <CentroLayout List={<DriverList/>}><MenuAssignedOrders/></CentroLayout> },
    

    // menus para resetear contraseña
    { path: '/reset-password-request/', element: <MenuRequestRestorePass/>},
    {path : '/reset-password/:uidb64/:token/', element: <MenuResetPass/>},

    {path : '/exports', element: <CentroLayout List={<RegisterList/>}><ExportsMenu/> </CentroLayout>}
  ]);

  return (
    <TodoProvider>
      <RouterProvider router={router} />
    </TodoProvider>
  );
}

export default App;
