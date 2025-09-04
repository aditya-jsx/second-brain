import { PlusIcon } from "../icons/plus";
import { ShareIcon } from "../icons/shareIcon";

interface CardProps {
    title: string;
    heading: string;
    startIcon: React.ReactNode;
    endIcon: React.ReactNode;
    type: "twitter" | "youtube";
    link: string;
}

export const Card = ({title, heading, startIcon, endIcon, type, link}: CardProps) => {
  return (
    <>
        <div className="bg-gray-200 h-full max-w-76 p-4 rounded-lg flex flex-col justify-between hover:scale-101 transition duration-300 cursor-pointer gap-6">
            {/* upper part */}
            <div className="flex justify-between">

                <div className="flex gap-2 items-center">
                    {startIcon}
                    {title}
                </div>

                <div className="flex gap-2 items-center">
                    <PlusIcon size="sm" />
                    {endIcon}
                </div>

            </div>

            {/* lower part */}
            <div className="flex flex-col gap-4">

                {/* Heading which will be optional */}
                <div className="text-2xl font-bold">
                    {heading}
                </div>

                {/* Either Text or link(x or yt) */}
                <div className="">
                    {
                        type === "twitter" && 
                            <blockquote className="twitter-tweet" data-theme="dark">
                                <a href={link.replace("x.com", "twitter.com")}></a>
                            </blockquote> 
                    }
                    {
                        type === "youtube" && 
                            <iframe className="w-full rounded-xl" src={link.replace("watch", "embed").replace("?v=","/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    }
                </div>

                {/* tags */}
                
                <div className=""></div>

                {/* date added */}
                <div className=""></div>
            </div>
        </div>
    </>
  )
}