import React from 'react';
import AdminList from '../containers/ListSideBar/AdminList2.jsx';


const getListComponentForGroup = (group) => {
    console.log("group", group);
    switch(group) {
        case 'Administrador':
            return <AdminList />;
        default:
            return null;
    }
};

export default getListComponentForGroup;
