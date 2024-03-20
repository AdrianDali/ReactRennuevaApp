// Excel.js
import React, {useState} from "react";
import axios from "axios";
import * as XLSX from 'xlsx';

const generateExcelResponsiva = () => {
  axios
  .get(`${process.env.REACT_APP_API_URL}/get-all-reports/`)
  .then((response) => {
    const data = response.data;
    console.log(data);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");
    XLSX.writeFile(workbook, "Reportes.xlsx");
  }
  )
  .catch((error) => {
    console.error(error);
  }
  );
};


const generateExcel = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/get-all-donors-recollection/`)
      .then((response) => {
        const data = response.data.ordenes;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ordenes");
        XLSX.writeFile(workbook, "Ordenes.xlsx");
      })
      .catch((error) => {
        console.error(error);
      });
};

const importExcel = (file, onImported) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
        const bufferArray = e.target.result;
        const workbook = XLSX.read(bufferArray, { type: 'buffer' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        onImported(data); // Callback con los datos
    };

    reader.onerror = (error) => {
        console.error("Error al leer el archivo Excel:", error);
    };
};





export { generateExcel, importExcel, generateExcelResponsiva};
