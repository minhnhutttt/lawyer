import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";


export default function SearchLocation() {

  return (
    <div className="w-full max-w-[720px] mx-auto py-10 md:py-[56px] border-t border-[#e9e5e4]">
              <h2 className="text-[22px] font-bold text-[#262221] leading-[1.4] mb-6">よく検索される市区町村</h2>
              <ul className="flex flex-wrap gap-x-1 gap-y-2">
                <li>
                  <Link href="/" className="flex px-3 py-1.5 hover:bg-[hsla(20,8%,71%,.17)] bg-white border border-[#e1dbd6] rounded-[27px] md:text-[14px] text-[12px]">港区</Link>
                </li>
                <li>
                  <Link href="/" className="flex px-3 py-1.5 hover:bg-[hsla(20,8%,71%,.17)] bg-white border border-[#e1dbd6] rounded-[27px] md:text-[14px] text-[12px]">千代田区</Link>
                </li>
                <li>
                  <Link href="/" className="flex px-3 py-1.5 hover:bg-[hsla(20,8%,71%,.17)] bg-white border border-[#e1dbd6] rounded-[27px] md:text-[14px] text-[12px]">横浜</Link>
                </li>
                <li>
                  <Link href="/" className="flex px-3 py-1.5 hover:bg-[hsla(20,8%,71%,.17)] bg-white border border-[#e1dbd6] rounded-[27px] md:text-[14px] text-[12px]">大阪市</Link>
                </li>
                <li>
                  <Link href="/" className="flex px-3 py-1.5 hover:bg-[hsla(20,8%,71%,.17)] bg-white border border-[#e1dbd6] rounded-[27px] md:text-[14px] text-[12px]">名古屋</Link>
                </li>
              </ul>
        </div>
  )
} 