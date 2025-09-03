import { useRef } from "react";
import { Button } from "../components/UI/button";
import { Input } from "../components/UI/input";
import axios from "axios";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup(){

    const emailRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const navigate = useNavigate();

    async function signup(){
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        await axios.post(`${BASE_URL}/api/v1/signup`, {
            email,
            password
        })
        navigate("/signin")
    }
    return(
        <>
            <div className="h-screen w-screen bg-gray-200 flex flex-col justify-center items-center">
                <div className="flex flex-col bg-white rounded-lg border p-8 gap-4">
                    <div className="flex flex-col gap-4">
                        <Input ref={emailRef} placeholder="Email" />
                        <Input ref={passwordRef} placeholder="Password" />
                    </div>
                    <div className="flex justify-center">
                        <Button onClick={signup} variant="primary" text="Sign Up" size="sm" fullWidth={true} loading={false} />
                    </div>
                </div>
            </div>
        </>
    )
}