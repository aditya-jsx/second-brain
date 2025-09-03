import { LogoIcon } from "../icons/logoIcon"
import { XIcon } from "../icons/XIcon"
import { YoutubeIcon } from "../icons/youtubeIcon"
import { SideBarItems } from "./sideBarItems"

export const Sidebar = () => {
  return (
    <div className="flex flex-col w-72 h-screen bg-white border-r left-0 px-4 gap-4">

        <div className="flex pt-5">
          <div className="flex items-center text-2xl font-semibold gap-4 cursor-pointer text-[#5046e4]">
            <LogoIcon />
            Brainly
          </div>
        </div>

        <div className="flex flex-col mt-4 gap-4">
          <SideBarItems text="Twitter" icon={<XIcon />} />
          <SideBarItems text="Youtube" icon={<YoutubeIcon />} />
        </div>
    </div>
  )
}
