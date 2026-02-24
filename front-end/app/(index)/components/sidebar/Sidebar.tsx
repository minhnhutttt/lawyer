import Image from "next/image";
import SlidebarNews from "./SlidebarNews";
import SidebarRank from "./SidebarRank";
import SidebarPickup from "./SidebarPickup";

export default function Sidebar() {
    return (
        <>
        <div className="mb-5 rounded-[3px] border border-[#eee] flex divide-x">
              <div className="flex items-center p-[5px] gap-0.5">
                <Image
                  src="/images/icn-lawyerbadge_g_1x.webp"
                  alt=""
                  width={15}
                  height={15}
                />
                <span className="text-[11px] text-[#74542b]">会員弁護士数</span>
                <span className="text-[14px] font-bold">23,256</span>
                <span className="text-[10px] text-[#999]">人</span>
              </div>
              <div className="flex items-center p-[5px] gap-1">
                <Image
                  src="/images/icn-question_g_1x.webp"
                  alt=""
                  width={15}
                  height={15}
                />
                <span className="text-[11px] text-[#74542b]">相談数</span>
                <span className="text-[14px] font-bold">1,478,852</span>
                <span className="text-[10px] text-[#999]">件</span>
              </div>
            </div>
            <div className="">
              <SlidebarNews />
              <SidebarRank />
              <SidebarPickup />
            </div>
        </>
    )
} 