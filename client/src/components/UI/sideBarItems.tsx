import type { ReactElement } from "react";

export const SideBarItems = ({text, icon}:{
    text: string;
    icon: ReactElement;
}) => {
  return (
    <div className="flex gap-4 items-center rounded-md p-2 hover:bg-gray-200 hover:cursor-pointer transition duration-200 ease-in text-lg">
        {icon}
        {text}
    </div>
  )
}
