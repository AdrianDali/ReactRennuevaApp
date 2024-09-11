export default function dateFormater(date) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}