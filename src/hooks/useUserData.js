import { useState } from "react";
import { useSearchParams } from 'react-router-dom';
import getDonorData from "../services/getDonorData";
import getCookieValue from "../logic/getCookieValue";


export default function useUserData(){
    const id = getCookieValue('user')
    const [userData, setUserData] = useState(null);
    const authToken = getCookieValue('token')

    const getUser = async ()=>{
            const userData = await getDonorData(id, authToken)
            console.log('###########userData##############')
            console.log(userData)
            setUserData(userData)
    }

    return{user: userData, getUser} 
}