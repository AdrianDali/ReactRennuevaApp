import axios from "axios";

export default async function GetRefreshToken(refreshToken) {

    const request = {
        refresh: refreshToken,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000  // 10 segundos de timeout
    };
    console.log("request")
    console.log(request)

    try {
        const response = await axios.post( `${process.env.REACT_APP_SERVER_URL}/api/token/refresh/`, request, config);
        console.log("response")
        console.log(response)
    
        return { dataToken: response.data, successToken: true };
    } catch (error) {

        if (error.response && error.response.status === 401) {
            console.error("Error al intentar obtener los datos:", error.response ? error.response.data : error.message);
            return {
                dataToken: null,
                successToken: false,
                messageUser: "Unauthorized"
            };
        }

        console.error("Error al intentar obtener los datos:", error.response ? error.response.data : error.message);
        return {
            dataToken: null,
            successToken: false,
            messageToken: error.response ? error.response.data : 'Network error'
        };
    }
}