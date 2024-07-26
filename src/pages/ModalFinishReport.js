import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import '../styles/user/CreateUser.css';
import axios from 'axios';
import { Modal, Button, Box, Typography } from '@mui/material';
import Title from '../components/Title';
import { TodoContext } from '../context/index.js';

function ModalFinishReport({ report }) {
  const { setUpdateResidueInfo, openModalCreateResidue, setOpenModalText, setTextOpenModalText, setOpenModalCreateResidue, openModalEditResidue, setOpenModalEditResidue, openModalDeleteResidue, setOpenModalDeleteResidue,openModalFinishReport, setOpenModalFinishReport } = useContext(TodoContext);
  
  console.log("ModalFinishReport");
  console.log(report);

  const closeModal = () => {
    if (openModalFinishReport) {
        setOpenModalFinishReport(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URL}/edit-report-to-finish/`, {
        reportId: report.id_report, // Asegúrate de que `reportId` sea el id correcto del reporte
      })
      .then(response => {
        const data = response.data;
        console.log(data);
        setOpenModalText(true);
        setTextOpenModalText("Reporte finalizado con éxito");
        setUpdateResidueInfo(true);
        closeModal();
      })
      .catch(error => {
        console.error("############################");
        setOpenModalText(true);
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.errorMessage || "Algo salió mal. Intenta de nuevo";
          setTextOpenModalText(`Algo salió mal. Intenta de nuevo \n ${errorMessage}`);
        } else {
          setTextOpenModalText("Algo salió mal. Intenta de nuevo");
        }
        console.error(error.response);
      });
  };

  return ReactDOM.createPortal(
    <Modal open={true} onClose={closeModal}>
      <Box
        className="ModalContent"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Title>Finalizar reporte</Title>
        <form onSubmit={handleSubmit}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Seguro que quieres Finalizar el Reporte? Una vez finalizado ya no podrás editarlo.
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 1 }}
          >
            Sí
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={closeModal}
          >
            No
          </Button>
        </form>
      </Box>
    </Modal>,
    document.getElementById('modal')
  );
}

export { ModalFinishReport };
