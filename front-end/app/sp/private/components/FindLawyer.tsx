import Image from "next/image"
import Button from "./Button"
import { FindButton } from "./Button"

export default function FindLawyer() {
    const findBtns = [
        { type: "find", iconUrl: "/icons/icon_area_2x.png", text: "地域", url: "#" },
        { type: "find", iconUrl: "/icons/icon_line_2x.png", text: "駅・路線", url: "#" },
        { type: "find", iconUrl: "/icons/icon_category_2x.png", text: "相談内容", url: "#" },
    ] satisfies FindButton[];
    
    return (
        <div>
            <h2 className="flex items-center gap-2 px-4 py-2 bg-[#eaeaea] font-bold mb-6">
                <Image src="/icons/icon_find_lawyer.png" alt="弁護士を探す" width={40} height={40} className="flex-shrink-0" />
                <span>弁護士を探す</span>
            </h2>
            <ul className="flex flex-col md:flex-row items-center gap-5 md:gap-10 justify-center mt-5 md:mt-10 mb-16 px-0 md:px-10">
                {findBtns.map((btn, index) => (
                    <li key={index} className="w-full max-w-[315px]">
                        <Button btn={btn} />
                    </li>
                ))}
            </ul>
        </div>
    )
}