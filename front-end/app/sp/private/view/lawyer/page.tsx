"use client"

import Link from "next/link"
import PageTitle from "@/components/common/PageTitle"
import Image from "next/image"
import Lawyers from "../../components/Lawyers"
import { LawyerItem } from "../../components/Lawyers"
import FindLawyer from "../../components/FindLawyer"

export default function Lawyer() {

  const allLawyers = [
    {
      imgUrl: "/images/131297_1.avif",
      name: "松村 謙",
      title: "はるか法律事務所",
      address: "埼玉県さいたま市大宮区吉敷町1-62 マレーS・Tビル403",
      focusAreas: [
        { iconUrl: "/icons/f2_color.png", text: "交通事故" },
        { iconUrl: "/icons/f3_color.png", text: "離婚・男女問題" },
        { iconUrl: "/icons/f4_color.png", text: "遺産相続" },
        { iconUrl: "/icons/f5_color.png", text: "労働問題" },
        { iconUrl: "/icons/f6_color.png", text: "債権回収" },
        { iconUrl: "/icons/f12_color.png", text: "不動産・建築" },
        { iconUrl: "/icons/f13_color.png", text: "企業法務・顧問弁護士" },
      ],
      isWishlisted: true,
    },
    {
      imgUrl: "/images/741830_1.avif",
      name: "上月 裕紀",
      title: "うららか法律事務所",
      address: "埼玉県さいたま市大宮区高鼻町1-56 ks'氷川の杜401",
      focusAreas: [
        { iconUrl: "/icons/f3_color.png", text: "離婚・男女問題" },
        { iconUrl: "/icons/f5_color.png", text: "労働問題" },
        { iconUrl: "/icons/f13_color.png", text: "犯罪・刑事事件" },
      ],
      btnList: [
        { type: "booking", phone: "050-5223-3819" },
        { type: "contact", url: "#" }
      ]
    },
    {
      imgUrl: "/images/119028_1.avif",
      name: "西本 昌弘",
      title: "埼玉所沢法律事務所",
      address: "埼玉県 所沢市くすのき台3-1-13 烏山ビル2階",
      focusAreas: [
        { iconUrl: "/icons/f1_color.png", text: "借金・債務整理" },
      ],
      btnList: [
        { type: "call", phone: "04-2946-9980" },
      ]
    }
  ] satisfies LawyerItem[];

  return (
    <main>
      <div className="w-full max-w-[980px] mx-auto px-2.5 mt-5 md:mt-8 mb-16 text-[#222]">
        <PageTitle>閲覧履歴</PageTitle>

        {/* Tab Navigation */}
        <ul className="flex border-b-[1px] border-[#ccc] px-[10px] font-bold text-[14px]">

          <li className="flex-1 p-[10px] pl-0 pt-0 mb-[-1px]">
            <Link
              href="/sp/private/view/question/"
              className="text-center border border-[#ccc] block p-[6px] hover:bg-gray-50 transition-colors rounded-[3px]"
            >
              みんなの法律相談
            </Link>
          </li>
          <li className="flex-1 text-[#999] p-[7px] md:p-[10px] text-center border border-[#ccc] mb-[-1px] border-b-white rounded-t-[3px] bg-white">
            弁護士
          </li>
        </ul>

        {/* Count Display */}
        <div className="text-center py-4 text-[#222] text-[14px]">
          <span className="text-[#ff9900] text-[17px]">3</span>件 / 50件
        </div>

        {/* Lawyer Section */}
        <Lawyers lawyerItems={allLawyers} />
        
        {/* FindLawyer  */}
        <FindLawyer />
        
      </div>
    </main>
  )
}
