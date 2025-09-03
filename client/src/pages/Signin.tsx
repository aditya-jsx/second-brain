import { useRef } from "react";
import { Button } from "../components/UI/button";
import { Input } from "../components/UI/input";
import { BASE_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin(){

    const emailRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const navigate = useNavigate();

    async function signin(){
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        const response = await axios.post(`${BASE_URL}/api/v1/signin`, {
            email,
            password
        })
        const token = response.data.token;
        localStorage.setItem("token", token);

        // redirect the user to the dashboard
        navigate("/dashboard")
    }

    return(
        <>
            <div className="h-screen w-screen bg-gray-200 flex flex-col justify-center items-center">
                <div className="flex flex-col bg-white rounded-lg border p-8 gap-4">
                    <div className="flex flex-col gap-4">
                        <Input ref={emailRef} placeholder="Username" />
                        <Input ref={passwordRef} placeholder="Password" />
                    </div>
                    <div className="flex justify-center">
                        <Button onClick={signin} variant="primary" text="Sign In" size="sm" fullWidth={true} loading={false} />
                    </div>
                </div>
            </div>
        </>
    )
}