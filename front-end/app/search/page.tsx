"use client";
import SearchPrefecture from "@/components/search/SearchPrefecture";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SearchHistory from "./components/SearchHistory";
import SearchLocal from "./components/SearchLocal";
import SearchLocation from "./components/SearchLocation";
import SearchThankyou from "./components/SearchThankyou";
import SearchFaq from "./components/SearchFaq";
import PickupLawyers from "@/components/search/PickupLawyers";




export default function Search() {
  

  return (
    <main>
      <div className="bg-[#f5f1ee] md:pb-6 pt-6 px-6 pb-8 md:pt-8 md:mb-[56px]">
        <div className="w-full max-w-[1104px] mx-auto">
          <div className="md:max-w-[66.6666666667%] w-full pt-[128px] px-2 pb-6 md:bg-[position:100%_100%] bg-[position:top_0_right_40px] md:[background-size:360px_274px] [background-size:243px_152px] [flex-basis:100%] min-h-[274px] bg-[url(/images/search/lawyer-search-hero.svg)] bg-no-repeat mx-auto">
            <h1 className="text-[24px] md:text-[27px] mb-4 font-bold">
              弁護士検索
            </h1>
            <p className="text-[12px] md:text-[14px]">
              あなたの近くでお悩みの分野を取り扱う弁護士を、実績や費用などから探せます。
              <br className="max-md:hidden" />
              初回無料相談、電話・メールで相談可、現在営業中、など細かな検索が可能です。
              <br className="max-md:hidden" />
              料金表や解決事例など充実した情報をもとに、安心できる弁護士を見つけてください。
            </p>
          </div>
        </div>
      </div>
      <div className="px-5">
        <SearchHistory />
        <SearchLocal />
        <SearchLocation  />
        <SearchPrefecture />
        <SearchThankyou />
        <SearchFaq />
        <PickupLawyers />
      </div>
    </main>
  );
}
