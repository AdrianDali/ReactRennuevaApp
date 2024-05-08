
import { TodoProvider } from '../context/index';
import { MenuUser } from '../pages/Users/MenuUser';
import Layout from '../containers/LayoutHeader';
import React from 'react';
import { MenuGroups } from '../pages/Users/MenuGroups';
import { MenuVehicle } from '../pages/MenuVehicle';
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




function App() {
  const router = createBrowserRouter([ 
    { path: '/users', element: <CentroLayout List={<AdminList/>}><MenuUser/></CentroLayout> },
    { path: '/groups', element: <Layout><MenuGroups/></Layout> },
    { path: '/vehicle', element: <Layout><MenuVehicle /></Layout> },
    { path: '/residue', element: <Layout><MenuResidue /></Layout> },
    { path: '/recycling-center', element: <Layout><MenuRecyclingCenter /></Layout> },
    { path: '/generator', element: <Layout><MenuGenerator /></Layout> },
    { path: '/driver', element: <Layout><MenuDriver /></Layout> },
    { path: '/register', element: <SignUp /> },
    { path: '/dash', element: <Layout List={<AdminList/>}><Dashboard/></Layout> },
    { path: '/donor', element: <Layout><MenuDonor /></Layout> },
    { path: '/carrier', element: <Layout><MenuCarrier /></Layout> },
    { path: '/collection-center', element: <Layout><MenuCollectionCenter /></Layout> },
    { path: '/report', element: <Layout><MenuReport /></Layout> },
    { path: '/tracking', element: <Layout><MenuTracking mode = "tracking"/></Layout> },
    { path: '/tracking-external/:trackingNumber', element: <MenuTracking mode = "tracking external"/> },
    { path: '/donor-recolection', element: <Layout><MenuDonorRecolection /></Layout> },
    { path: '/company', element: <Layout><MenuCompany /></Layout> },
    { path: '/report-history', element: <Layout><MenuReportHistory/></Layout> },
    { path: '/main-generator', element: <LayoutGenerator><MenuMainGenerator/></LayoutGenerator> },
    { path: '/responsivas-generator', element: <LayoutGenerator><MenuMyResponsivasGenerator/></LayoutGenerator> },
    { path: '/centro', element: <Layout List={<AdminList/>}><MenuUser/></Layout> },
    { path: '*', element: <h1>Not Found 404</h1> },
    { path: '/', element: <Login/> },
    { path: '/login', element: <Login/> },
  ]);

  return (
    <TodoProvider>
      <RouterProvider router={router} />
    </TodoProvider>
  );
}

export default App;
