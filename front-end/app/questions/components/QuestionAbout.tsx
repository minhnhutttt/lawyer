import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

const QuestionAboutItem = ({title, link, image, desc} : {title: string, link: string, image: string, desc: ReactNode}) => (
    <Link href={link} className="flex py-6 gap-4 border-b border-[#e6e2e0]">
        <span className=" flex-1">
            <h5 className="md:text-[18px] text-[16px] font-bold text-[#315dbb]">{title}</h5>
            <span className="md:text-[18px] text-[16px] block mt-1 text-[#716c6b]"><span className="line-clamp-3">{desc}</span></span>
        </span>
        <span className="">
            <Image src={image} alt="" width={100} height={100} className="size-25 rounded-lg" />
        </span>
    </Link>
)

export const QuestionAbout = () => {
  return (
    <div>
        <p className="md:text-[22px] text-[20px] font-bold">依頼前に知っておきたい弁護士知識</p>
        <div className="grid md:grid-cols-2 gap-x-12">
        <QuestionAboutItem link="#" image="/images/questions/list_img1.jpg" title="弁護士とは？仕事内容と依頼するメリット" desc="弁護士とは国家資格を持った法律の専門家のことです。仕事内容は裁判時の代理人業務だけではなく、交渉や法律相談など、一般の人にとってより身近な業務も行っています。初回であれば無料で法律相談できる場合もあり、利用価値は高いです。ここでは弁護士の仕事内容と依頼するメリットについて確認しましょう。" />
        <QuestionAboutItem link="#" image="/images/questions/list_img1.jpg" title="弁護士とは？仕事内容と依頼するメリット" desc="弁護士とは国家資格を持った法律の専門家のことです。仕事内容は裁判時の代理人業務だけではなく、交渉や法律相談など、一般の人にとってより身近な業務も行っています。初回であれば無料で法律相談できる場合もあり、利用価値は高いです。ここでは弁護士の仕事内容と依頼するメリットについて確認しましょう。" />
        <QuestionAboutItem link="#" image="/images/questions/list_img1.jpg" title="弁護士とは？仕事内容と依頼するメリット" desc="弁護士とは国家資格を持った法律の専門家のことです。仕事内容は裁判時の代理人業務だけではなく、交渉や法律相談など、一般の人にとってより身近な業務も行っています。初回であれば無料で法律相談できる場合もあり、利用価値は高いです。ここでは弁護士の仕事内容と依頼するメリットについて確認しましょう。" />
        </div>
    </div>
  )
}
