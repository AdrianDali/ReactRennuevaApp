import { toDataURL } from "qrcode";

export default async function generateQR (text){
  try {
    console.log("Generando imagen QR");
    console.log(text);
    const qrImage = await toDataURL(text);
    return qrImage;
  } catch (err) {
    console.error(err);
  }
};