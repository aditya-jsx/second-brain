import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../config";

export function useContent(){
    const [contents, setContents] = useState([]);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            axios.get(`${BASE_URL}/api/v1/content`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then((response=>{
                    setContents(response.data.content || [])
                }))
        }
    }, [])
    
    return contents;
}
