import React, { useContext, useEffect , useState} from "react";
import "../../styles/user/MenuUser.css";
import { TodoContext } from "../../context/index.js";
import { ModalUser } from "./ModalUser.js";
import UserTable from "../../components/Table";
import CUDButtons from "../../containers/CUDButtons";
import BarsChart from "../../components/BarsChart";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Title from "../../components/Title";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth.js";
import axios from "axios";
import UserInfoTable from "../../components/boards/UsersInfoTable.jsx";

function MenuUser() {

  const {
    textOpenModalText,
    openModalCreate,
    openModalEdit,
    openModalDelete,
    openModalText,
    setOpenModalText,
  } = useContext(TodoContext);
  
  const dataUser = useAuth();
  console.log("dataUser", dataUser)
  const [donorRequests, setDonorRequests] = useState([]);


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-users-with-group/`)
      .then(response => {
        console.log(response.data.users);
        setDonorRequests(response.data.users);
      })
      .catch(error => {
        //console.error(error);
      });
  }, []);

  return (
    <>
      {dataUser && (dataUser.groups[0] === "Administrador" || dataUser.groups[0] === "Comunicacion" || dataUser.groups[0] === "Logistica" || dataUser.groups[0] === "Calidad" || dataUser.groups[0] === "Produccion" || dataUser.groups[0] === "Registro") ? (
        <Container
          maxWidth={false}
          sx={{
            flexGrow: 1,
            overflow: "auto",
            py: 3,
            height: "100%",
          }}
        >
          <UserInfoTable data={donorRequests} />
        </Container>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Title>No tienes permisos para ver esta página</Title>
        </Box>
      )}
    </>
  );
}

export { MenuUser };

    


//   return (
//     <>
//       <CssBaseline />
//       {dataUser && dataUser.groups[0] === "Administrador" ? (
      
//       <Container maxWidth={false} sx={{ flexGrow: 1, overflow: 'auto', py: 3 }}>
//       <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <Paper
//                 sx={{
//                   p: 3,
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Title>Usuarios</Title>
//                 <CUDButtons model="User" />
//                 <Title>Usuarios Creados</Title>
//                 <UserTable />
//               </Paper>
//             </Grid>
//             <Grid item xs={12}>
//               <Paper
//                 sx={{
//                   p: 4,
//                   display: "flex",
//                   flexDirection: "column",
//                   height: 580,
//                 }}
//               >
//                 <BarsChart />
//               </Paper>
//             </Grid>
//           </Grid>
        

//         {openModalCreate && (
//           <ModalUser mode={"CREAR"} creatorUser={dataUser.user}>
//             La funcionalidad de agregar TODO
//           </ModalUser>
//         )}
//         {openModalEdit && (
//           <ModalUser mode={"EDITAR"}  creatorUser={dataUser.user} >
//             La funcionalidad de editar TODO
//           </ModalUser>
//         )}
//         {openModalDelete && (
//           <ModalUser mode={"BORRAR"}  creatorUser={dataUser.user} >
//             La funcionalidad de borrar TODO
//           </ModalUser>
//         )}

//         {openModalText && (
//           <Dialog
//             open={openModalText}
//             onClose={() => setOpenModalText(false)}
//             aria-labelledby="alert-dialog-title"
//             aria-describedby="alert-dialog-description"
//           >
//             <DialogTitle id="alert-dialog-title">
//               {textOpenModalText}
//             </DialogTitle>
//             <DialogContent>
//               <DialogContentText id="alert-dialog-description">
//                 {textOpenModalText}
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenModalText(false)}>Aceptar</Button>
//             </DialogActions>
//           </Dialog>
//         )}
//       </Container>
//       ) : (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100vh",
//             margin: "auto",
            
//           }}
//         >
//           <Typography variant="h5">No Access</Typography>
//         </Box>
//       )}
//     </>
//   );
// }

// export { MenuUser };
