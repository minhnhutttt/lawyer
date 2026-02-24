import Image from "next/image";
import Link from "next/link";

export default function LawyersBanner() {

    return (
        <div className="text-[clamp(24px,7vw,40px)] bg-[#e8e8e8]">
            <div className="pt-[min(1.0833333333em,56px)] pb-[calc(38px+.6em)] gap-[min(.3333333333em,12px)] flex flex-col items-center justify-center bg-[url(/images/lawyers/lawyer-head.svg)] bg-bottom bg-repeat-x bg-[#e5f0f2]">
                <div className="flex flex-col items-center justify-center gap-[.1666666667em] font-bold leading-[1.2] text-center">
                    <p className="text-[clamp(.5833333333em,2.5vw,.6em)]">
                        弁護士をあなたの味方に
                    </p>
                    <p className="font-bold">「埼玉」の弁護士を探す</p>
                </div>
                <div className="flex md:gap-[.55em] gap-[.5em]">
                    <Image src="/images/lawyers/cover-image-emblem-market-recognition.svg" alt="" width={81} height={40} className="w-[3em]" />
                    <Image src="/images/lawyers/cover-image-emblem-reviews.svg" alt="" width={81} height={40} className="w-[3em]" />
                    <Image src="/images/lawyers/cover-image-emblem-registered-lawyers.svg" alt="" width={81} height={40} className="w-[3em]" />
                </div>
            </div>
            <div className="w-full max-w-[1104px] mx-auto flex justify-end ">
                <Link href="/" className="before:content-['※'] md:text-[12px] text-[10px] text-[#72706e] p-[1em]">2023年12月 法律関連サービス一般認知度調査（調査会社調べ）</Link>
            </div>
        </div>
    )
} 