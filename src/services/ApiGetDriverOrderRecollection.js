import axios from "axios";
import GetRefreshToken from "./ApiRefreshToken";


export default async function GetDriverOrderRecollection() {

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }

    const refreshToken = getCookie('refresh');
    const username = getCookie('user');
    const accessToken = getCookie('access');
    console.log("refreshToken", refreshToken);
    console.log("accessToken", accessToken);
    console.log("username", username);

    const request = {
        user : username, 
        status : "pendienteRecoleccion"
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000  // 10 segundos de timeout
    };

    const logout = () => {
        document.cookie = "access=; SameSite=Lax; Secure";
        document.cookie = "refresh=; SameSite=Lax; Secure";
        window.location.href = "/login";
    }

    try {
        const response = await axios.post( `${process.env.REACT_APP_SERVER_URL}/Rennueva/get-all-pickup-orders-assigned-to-driver/`, request, config);
        console.log("response")
        console.log(response.data)

        return { dataUser: response.data, successUser: true };
    } catch (error) {

        console.error("Error fetching user data:", error);
        return { dataUser: null, successUser: false, messageUser: error.response ? error.response.data : 'Network error' };
    }
}