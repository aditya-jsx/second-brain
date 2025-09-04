import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../config";

export function useContent(){
    const [contents, setContents] = useState([]);

    useEffect(()=>{
        axios.get(`${BASE_URL}/api/v1/content`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
            .then((response=>{
                setContents(response.data.contents)
            }))
    })
    
    return contents;
}
