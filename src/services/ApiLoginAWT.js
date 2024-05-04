import axios from "axios";

export default async function loginDonor(credentials) {
    
    //Validacion de las credenciales
    if (!credentials.username || !credentials.password) {
        console.error("Username and password are required");
        return { data: null, success: false, message: "Error al ingresar" };
    }

    const request = {
        username: credentials.username,
        password: credentials.password
    };

    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 10000  // 10 segundos de timeout
    };

    try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/token/`, request, config);
        console.log("response")
        console.log(response)
    
        return { data: response.data, success: true };

    } catch (error) {   
        console.error("Error al intentar ingresar:", error.response ? error.response.data : error.message);
        return {
            data: null,
            success: false,
            message: error.response ? error.response.data : 'Network error'
        };
    }

}
// Compare this snippet from dali/src/services/getDonorData.js:
