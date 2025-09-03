import { useRef, useState } from "react"
import { CrossIcon } from "../icons/crossIcon"
import { Button } from "./button"
import { Input } from "./input"
import axios from "axios"
import { BASE_URL } from "../../config"

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}

export const CreateContentModal = ({open, onClose}:{open:boolean, onClose:() => void}) => {

    const titleRef = useRef<HTMLInputElement>();
    const linkRef = useRef<HTMLInputElement>();
    const [type, setType] = useState(ContentType.Youtube);

    async function addContent(){
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;

        await axios.post(`${BASE_URL}/api/v1/content`, {
            title,
            link,
            type
        }, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        });
    }

    return(
        <div>
            {open && <div onClick={onClose} className="w-screen h-screen bg-zinc-950/90 fixed top-0 left-0 flex justify-center">
                <div className="flex flex-col justify-center">
                    <span onClick={(e)=>{e.stopPropagation()}} className="bg-white rounded-lg p-4 flex flex-col justify-between gap-6">

                        {/* top */}
                        <div className="flex justify-between item-center gap-4">
                            <h1>
                                Add Content
                            </h1>
                            <div onClick={onClose}>
                                <CrossIcon size="sm" />
                            </div>
                        </div>

                        {/* bottom */}
                        <div className="flex flex-col gap-2">
                            <Input ref={titleRef} placeholder={"Title"} />
                            <Input ref={linkRef} placeholder={"Link"} />
                        </div>
                        <div className="flex flex-col p-2 w-full justify-center">
                            <h1>Type</h1>
                            <div className="flex p-2 w-full justify-center">
                                <Button text="Youtube" size="sm" variant={type === ContentType.Youtube? "primary":"secondary"} onClick={()=>{
                                    setType(ContentType.Youtube)
                                }} />
                                <Button text="Twitter" size="sm" variant={type === ContentType.Twitter? "primary":"secondary"} onClick={()=>{
                                    setType(ContentType.Twitter)
                                }} />
                            </div>
                        </div>
                        <Button onClick={addContent} variant="primary" text="Submit" size="sm" />
                    </span>
                </div>
            </div>}
        </div>
    )
}