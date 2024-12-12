import { toDataURL } from "qrcode";

export default async function generateQR(text) {
  try {
    const qrImage = await toDataURL(text, { margin: 0 });
    return qrImage;
  } catch (err) {
    console.error(err);
  }
};