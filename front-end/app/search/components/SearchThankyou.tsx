import Image from "next/image";
import Link from "next/link";

export default function SearchThankyou() {

  return (
    <div className="w-full max-w-[720px] mx-auto py-10 md:py-[56px] border-t-[8px] border-[#f0ebe9]">
        <h2 className="text-[22px] font-bold text-[#262221] leading-[1.4] mb-6">弁護士に感謝の声をおくる</h2>
        <div className="bg-[#f5f1ee] pt-8 px-6 pb-6 md:p-12 rounded-[18px] relative max-md:flex max-md:flex-col max-md:items-center">
            <p className="md:text-[18px] text-[16px] font-bold mb-6 md:mb-4 max-md:text-center">
                <span className="max-md:text-[12px]">お世話になった弁護士へ</span><br />
                「感謝の声」をおくりませんか？
            </p>
            <div className="md:w-1/2 flex items-center justify-center max-md:mb-6 md:absolute right-0 top-0 h-full">
                <Image src="/images/search/voice-banner.svg" alt="" width={180} height={95} />
            </div>
            <div className="md:w-1/2 w-full">
                <Link href="/" className="relative flex items-center justify-center border border-[#bbb3af] font-bold [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] rounded-full w-full max-w-[400px] mx-auto py-4 md:py-4 px-5 md:px-8 bg-white md:text-[18px] text-[16px] after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4">
                「感謝の声」とは
                </Link>
            </div>
            <p className="mt-4 text-[#716c6b] md:text-[12px] text-[11px]">
                <span className="font-bold">Amazonギフト券最大500円分</span>プレゼント！
            </p>
        </div>
    </div>
  )
} 