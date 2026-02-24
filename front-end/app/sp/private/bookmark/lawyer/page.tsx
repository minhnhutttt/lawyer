"use client"

import Link from "next/link"
import { useState } from "react"
import { useEffect } from "react"
import PageTitle from "@/components/common/PageTitle"
import Lawyers from "../../components/Lawyers"
import { LawyerItem } from "../../components/Lawyers"
import EmptyLawyer from "../../components/EmptyLawyer"
import FindLawyer from "../../components/FindLawyer"

export default function Lawyer() {
  const [totalWishList, setTotalWishList] = useState(0);

  const wishList = [
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
      isWishlisted: false, // Change to true to simulate wishlisted
    },
  ] satisfies LawyerItem[];

  function fetchWishListCount() {
    const wishListCount = wishList.filter(lawyer => lawyer.isWishlisted).length;
    setTotalWishList(wishListCount);
  }

  useEffect(() => {
    fetchWishListCount();
  }, [wishList, totalWishList]);

  return (
    <main>
      <div className="w-full max-w-[980px] mx-auto px-2.5 mt-5 md:mt-8 mb-16 text-[#222]">
        <PageTitle>閲覧履歴</PageTitle>

        {/* Tab Navigation */}
        <ul className="flex border-b-[1px] border-[#ccc] px-[10px] font-bold text-[14px]">

          <li className="flex-1 p-[10px] pl-0 pt-0 mb-[-1px]">
            <Link
              href="/sp/private/bookmark/question/"
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
          <span className="text-[#ff9900] text-[17px]">{totalWishList}</span>件 / 10件
        </div>

        {/* Lawyer Section */}
        {totalWishList > 0 ?
          <Lawyers lawyerItems={wishList} />
          : <EmptyLawyer />
        }

        {/* FindLawyer  */}
        <FindLawyer />

      </div>
    </main>
  )
}
