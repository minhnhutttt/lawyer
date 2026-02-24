import Image from "next/image";
import Link from "next/link";

interface SearchHistoryLocalItem {
  image: string;
  name: string;
  location: string;
  walk: string;
  time: string;
  introduction: string
}
const HistoryLocalItem = ({ image, name, location, walk, time, introduction }: SearchHistoryLocalItem) => (
  <Link href="/" className="lg:flex-[0_0_33.33333333%] md:flex-[0_0_41.66666667%] flex-[0_0_75%] px-2">
    <span className="my-2 h-[calc(100%-16px)] bg-white rounded-lg [box-shadow:0_0_0_1px_rgba(54,_50,_49,_.08),_0_2px_2px_1px_rgba(54,_50,_49,_.06)] flex flex-col items-center">
      <span className="p-4 flex flex-col items-center">
        <figure className="w-[80px] mb-3">
          <Image src={image} alt="" width={150} height={200} className="rounded-lg" />
        </figure>

        <span className="flex justify-center">
          <span
            className="block md:text-center md:text-[20px] text-[18px] font-bold"
          >
            {name}
            <span className="text-[11px] md:text-[13px]">弁護士</span>
          </span>
        </span>
        <span className="text-center">
          <span className="md:text-[14px] text-[12px]">{location}</span>
          <span className="text-[#716c6b] text-[12px] md:text-[14px]">（徒歩{walk}分）</span>
        </span>
        <span className="text-center ">
          <span className="md:text-[14px] text-[12px]">現在営業中</span>
          <span className="text-[12px] md:text-[14px] ml-2 font-bold">{time}</span>
        </span>
      </span>
      <span className="text-[12px] md:text-[14px] text-[#716c6b] p-4 border-t border-[#e9e5e4]">
        <span className="line-clamp-3 ">{introduction}</span>
      </span>
      <span className="flex justify-end relative w-full md:text-[14px] text-[12px] text-[#315dbb] py-2.5 px-6 after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-3">続きを見る
      </span>
    </span>
  </Link>
);

export default function SearchLocal() {

  return (
    <div className="w-full max-w-[720px] mx-auto pb-10 md:pb-[56px]">
          <h2 className="text-[22px] font-bold text-[#262221] leading-[1.4] mb-6">よく検索される地域の弁護士</h2>
          <div className="flex overflow-auto mb-[22px]">
            <HistoryLocalItem image="/images/124266_1.png" name="日下部 眞史" location="秋葉原駅" walk="4" time="00:00 - 24:00" introduction="【宅建士・マンション管理士・FP資格有り｜初回相談無料】【秋葉原駅徒歩５分】不動産の..." />
            <HistoryLocalItem image="/images/124266_1.png" name="日下部 眞史" location="秋葉原駅" walk="4" time="00:00 - 24:00" introduction="【宅建士・マンション管理士・FP資格有り｜初回相談無料】【秋葉原駅徒歩５分】不動産の..." />
            <HistoryLocalItem image="/images/124266_1.png" name="日下部 眞史" location="秋葉原駅" walk="4" time="00:00 - 24:00" introduction="【宅建士・マンション管理士・FP資格有り｜初回相談無料】【秋葉原駅徒歩５分】不動産の..." />
          </div>
          <Link href="/" className="relative flex items-center justify-center border border-[#bbb3af] font-bold [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] rounded-full w-full max-w-[400px] mx-auto py-4 md:py-4 px-5 md:px-8 bg-white md:text-[18px] text-[16px] after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4">もっと見る
          </Link>
        </div>
  )
} 