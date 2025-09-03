import { CrossIcon } from "../icons/crossIcon"
import { Button } from "./button"
import { Input } from "./input"


export const CreateContentModal = ({open, onClose}:{open:boolean, onClose:() => void}) => {
    return(
        <div>
            {open && <div onClick={onClose} className="w-screen h-screen bg-zinc-950/90 fixed top-0 left-0 flex justify-center">
                <div className="flex flex-col justify-center">
                    <span onClick={(e)=>{e.stopPropagation()}} className="bg-white rounded-lg p-4 flex flex-col justify-between gap-8">

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
                            <Input placeholder={"Title"} />
                            <Input placeholder={"Link"} />
                        </div>
                        <Button variant="primary" text="Submit" size="sm" />
                    </span>
                </div>
            </div>}
        </div>
    )
}