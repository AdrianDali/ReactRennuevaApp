import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getCookieValue from '../services/GetCookie.js';
import GetUser from '../services/ApiGetUser.js';


function useAuth() {
 console.log("useAuth");
 
  const [dataUser, setDataUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData(user, access, refresh) {
      const { dataUser, successUser, messageUser } = await GetUser(user, access, refresh);
      //console.log("data", dataUser);
      //console.log("success", successUser);
      //console.log("message", messageUser);
      if (successUser) {
        setDataUser(dataUser);
      } else {
        console.error("Authentication failed");
        navigate("/login");
      }
    }

    const user = getCookieValue("user");
    const refreshToken = getCookieValue("refresh");
    const accessToken = getCookieValue("access");

    if (!refreshToken || !accessToken) {
      //console.error("No token found");
      navigate("/login");
    } else {
      fetchData(user, accessToken, refreshToken);
    }
  }, [navigate]);

  return dataUser;
}

export default useAuth;
