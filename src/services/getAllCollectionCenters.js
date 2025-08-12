import axios from "axios";

export default async function getAllCollectionCenters() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/get-all-collection-center/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching collection centers:", error);
    return [];
  }
}
