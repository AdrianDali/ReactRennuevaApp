import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './routes/AppRouter';
import reportWebVitals from './App/reportWebVitals';
import { pdfjs } from 'react-pdf';
import 'pdfjs-dist/build/pdf.worker.entry';
import { Toaster } from 'react-hot-toast';


const root = ReactDOM.createRoot(document.getElementById('root'));
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

root.render(
    <>
    <App />
    <Toaster position='bottom-right'/>
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
