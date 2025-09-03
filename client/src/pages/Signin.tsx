import { Button } from "../components/UI/button";
import { Input } from "../components/UI/input";

export function Signin(){
    return(
        <>
            <div className="h-screen w-screen bg-gray-200 flex flex-col justify-center items-center">
                <div className="flex flex-col bg-white rounded-lg border p-8 gap-4">
                    <div className="flex flex-col gap-4">
                        <Input placeholder="Username" />
                        <Input placeholder="Password" />
                    </div>
                    <div className="flex justify-center">
                        <Button variant="primary" text="Sign In" size="sm" fullWidth={true} loading={false} />
                    </div>
                </div>
            </div>
        </>
    )
}