import React from 'react';
const VehicleContext = React.createContext();

function VehicleProvider({ children }) {

  const [infoVehicle, setInfoVehicle] = React.useState("");

  return (
    <VehicleContext.Provider value={{
        infoVehicle,
        setInfoVehicle,

    }} >
      {children}
    </VehicleContext.Provider>
  );
}

export { VehicleContext, VehicleProvider };