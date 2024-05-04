import axios from "axios";

export default async function GetUser(credentials) {

    const request = {
        user: credentials.username,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 10000  // 10 segundos de timeout
    };
    console.log("request")
    console.log(request)

    try {
        const response = await axios.post( `${process.env.REACT_APP_SERVER_URL}/Rennueva/read-django-user/`, request, config);
        console.log("response")
        console.log(response)
    
        return { dataUser: response.data, successUser: true };
    } catch (error) {
        console.error("Error al intentar obtener los datos:", error.response ? error.response.data : error.message);
        return {
            dataUser: null,
            successUser: false,
            messageUser: error.response ? error.response.data : 'Network error'
        };
    }
}