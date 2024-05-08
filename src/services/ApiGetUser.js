import axios from "axios";
import GetRefreshToken from "./ApiRefreshToken";


export default async function GetUser(username, accessToken,refreshToken) {

    const request = {
        user: username,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${accessToken}`,
        },
        timeout: 10000  // 10 segundos de timeout
    };

    const logout = () => {
        document.cookie = "access=; SameSite=Lax; Secure";
        document.cookie = "refresh=; SameSite=Lax; Secure";
        window.location.href = "/login";
    }

    try {
        const response = await axios.post( `${process.env.REACT_APP_SERVER_URL}/Rennueva/read-django-user/`, request, config);

        return { dataUser: response.data, successUser: true };
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error("Access token expired, attempting to refresh:", error.response.data);

            const { dataToken, successToken, messageToken } = await GetRefreshToken(refreshToken);
            console.log("dataToken")
            console.log(dataToken)
            console.log("successToken")
            console.log(successToken)
            console.log("messageToken")
            console.log(messageToken)
            
            if (!successToken){
                console.error("Error refreshing token:", messageToken);
                logout();
                return { dataUser: null, successUser: false, messageUser: messageToken };
            }
            const newAccessToken = dataToken.access;
            const newRefreshToken = dataToken.refresh;

            if (dataToken) {
                // Actualizar las cookies con los nuevos tokens
                document.cookie = `access=${newAccessToken}; SameSite=Lax; Secure`;
                document.cookie = `refresh=${newRefreshToken}; SameSite=Lax; Secure`;
                console.log("New tokens:", dataToken);
                console.log("Reintentando solicitud original con el nuevo accessToken")

                
                // Re-intentar la solicitud original con el nuevo accessToken
                const config2 = {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${newAccessToken}`,
                    },
                    timeout: 10000  // 10 segundos de timeout
                };
                try {
                    const retryResponse = await axios.post(`${process.env.REACT_APP_SERVER_URL}/Rennueva/read-django-user/`, request, config2);
                    console.log("retryResponse")
                    console.log(retryResponse)

                    return { dataUser: retryResponse.data, successUser: true, newAccessToken: newAccessToken, newRefreshToken: newRefreshToken};
                } catch (retryError) {
                    
                    console.error("Failed on retry:", retryError);
                    logout();
                    return { dataUser: null, successUser: false, messageUser: retryError.response ? retryError.response.data : 'Network error' };
                }
            }
        }

        console.error("Error fetching user data:", error);
        return { dataUser: null, successUser: false, messageUser: error.response ? error.response.data : 'Network error' };
    }
}