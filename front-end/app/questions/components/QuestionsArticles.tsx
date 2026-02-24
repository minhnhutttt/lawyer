import Image from "next/image"
import Link from "next/link"

export type QuestionsArticleType = {
  avatar?: string,
  images: string[],
  link: string,
  title: string,
  desc: string,
  count: string,
  time?: string
}

export const QuestionsArticle = ({images, link, title, desc, count}: QuestionsArticleType) => (
  <Link href={link} className="lg:w-[1/3] lg:flex-[0_0_33.333333334%] md:w-[41.6666666667%] md:flex-[0_0_41.6666666667%] w-[58.3333333333%] flex-[0_0_58.3333333333%] px-2 hover:-translate-y-1 duration-150">
    <span className="my-2 h-[calc(100%-16px)] [box-shadow:0_0_0_1px_rgba(54,_50,_49,_.08),_0_2px_2px_1px_rgba(54,_50,_49,_.06)] md:text-[14px] text-[12px] flex flex-col rounded-[8px]">
        <span className="p-4 md:text-[16px] text-[14px] flex flex-col">
            <span className="font-bold text-[#315dbb] line-clamp-2">{title}</span>
            <span className="my-2 line-clamp-3">{desc}</span>
            <span className="flex items-center gap-3">
                <span className="flex ml-1.5">
                    {images.map((image, i) => (
                        <Image src={image} alt="" width={24} height={24} className="md:size-6 size-5 rounded-full -ml-1.5" />
                    ))}
                </span>
                <span className="space-x-1">
                  <span className="md:text-[13px] text-[11px]">弁護士回答</span>
                  <span className="md:text-[16px] text-[14px] font-bold">{count}</span>
                </span>
            </span>
        </span>
    </span>
  </Link>
)

export const QuestionsArticles = ({articles}: {articles: QuestionsArticleType[]}) => {
  return (
    <div className="flex overflow-auto">
      {articles.map((article, i) => (
        <QuestionsArticle key={i} {...article} />
      ))}
    </div>
  )
}
