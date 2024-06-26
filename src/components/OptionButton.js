import React from 'react';
import Button from '@mui/material/Button';
import { generateExcel, generateExcelResponsiva} from '../services/Excel.js';
import * as XLSX from 'xlsx';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';


function OptionButton({ setOpenModal, text, color }) {
  return (
    <Button
      variant="contained"
      onClick={() => {
        setOpenModal(state => !state);
      }}
      color={color}
    >
      {text}
    </Button>
  );
}

function ActionButtonOrdersExcel({text, color }) {
  return (
    <Tooltip title="Descargar Excel">
      <IconButton
        onClick={() => {
          generateExcel(); // Llamar a la función para generar Excel
        }}
        style={{ backgroundColor: color , color: 'black'}}
      >
        <DownloadIcon />
      </IconButton>
    </Tooltip>
  );
}

function ActionButtonResponsivaExcel({text, color }) {
  return (
    <Button
      variant="contained"
      onClick={() => {
        generateExcelResponsiva(); // Llamar a la función para generar Excel
      }
      }
      color={color}
    >
      {text}
    </Button>
  );
}


function importExcel(file, callback) {
  // Read the file using FileReader
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const data = e.target.result;
    // Parse the file data and convert it to JSON
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);
    callback(json);
  };

  reader.onerror = (error) => {
    console.log(error);
    callback(null);
  };
  
  reader.readAsBinaryString(file);
}

function ImportExcelButton({ text, color, onImported }) {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    importExcel(file, onImported);
  };

  return (
    <>
      <Button
        variant="contained"
        component="label"
        color={color}
      >
        {text}
        <input
          type="file"
          hidden
          onChange={handleFileSelect}
        />
      </Button>
    </>
  );
}

export { OptionButton, ActionButtonOrdersExcel , ImportExcelButton, ActionButtonResponsivaExcel};
