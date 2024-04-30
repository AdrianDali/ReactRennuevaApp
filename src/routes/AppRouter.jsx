
import { TodoProvider } from '../context/index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MenuUser } from '../pages/Users/MenuUser';
import Layout from '../containers/LayoutHeader';
import Login from '../pages/Login';
import styled from "styled-components";
import React from 'react';
import { MenuGroups } from '../pages/Users/MenuGroups';
import { MenuVehicle } from '../pages/MenuVehicle';
import { MenuResidue } from '../pages/MenuResidue';
import { MenuRecyclingCenter } from '../pages/MenuRecyclingCenter.js';
import { MenuGenerator } from '../pages/MenuGenerator';
import { MenuDriver } from '../pages/MenuDriver';
import { Sidebar } from '../containers/LayoutSideBar';
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
import ResponsiveAppBar from '../containers/LayoutAppBar.jsx';
import LayoutGenerator from '../containers/LayoutGenerator.jsx';
import { MenuMyResponsivasGenerator } from '../pages/Menus/MenuMyResponsivasGenerator.js';
import CentroLayout from '../containers/CentroLayout.jsx';
import AdminList from '../containers/ListSideBar/AdminList2.jsx';



function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);


  return (
    <TodoProvider>
      <BrowserRouter>
          <Routes>
          <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/users" element={<CentroLayout List={<AdminList/>}><MenuUser/></CentroLayout>} />
            <Route path="/groups" element={<Layout><MenuGroups/></Layout>} />
            <Route path="/vehicle" element={<Layout><MenuVehicle /></Layout>} />
            <Route path="/residue" element={<Layout><MenuResidue /></Layout>} />
            <Route path="/recycling-center" element={<Layout><MenuRecyclingCenter /></Layout>} />
            <Route path="/generator" element={<CentroLayout List={<AdminList/>}><MenuGenerator/></CentroLayout>} />
            <Route path="/driver" element={<Layout><MenuDriver /></Layout>} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/dash" element={<CentroLayout List={<AdminList/>}><Dashboard/></CentroLayout>} />
            <Route path="/donor" element={<Layout><MenuDonor /></Layout>} />
            <Route path="/carrier" element={<Layout><MenuCarrier /></Layout>} />
            <Route path="/collection-center" element={<Layout><MenuCollectionCenter /></Layout>} />
            <Route path="/report" element={<Layout><MenuReport /></Layout>} />
            <Route path="/tracking" element={<Layout><MenuTracking mode = "tracking"/></Layout>} />
            <Route path="/tracking-external/:trackingNumber" element={<MenuTracking mode = "tracking external"/>} />
            <Route path="/donor-recolection" element={<Layout><MenuDonorRecolection /></Layout>} />
            <Route path="/company" element={<Layout><MenuCompany /></Layout>} />
            <Route path="/report-history" element={<Layout><MenuReportHistory/></Layout>} />
            <Route path="/main-generator" element={<LayoutGenerator><MenuMainGenerator/></LayoutGenerator> } />
            <Route path='/responsivas-generator' element ={<LayoutGenerator><MenuMyResponsivasGenerator/></LayoutGenerator>} />
            <Route path='/centro' element ={<CentroLayout List={<AdminList/>}><MenuGenerator/></CentroLayout>} />
           
            
            


            <Route path="*" element={<h1>Not Found 404</h1>} />
          </Routes>



      </BrowserRouter>

    </TodoProvider>

  );
}

const Container = styled.div`
  
  
`;


export default App;
