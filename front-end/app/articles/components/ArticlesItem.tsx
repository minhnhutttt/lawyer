import Image from "next/image"
import Link from "next/link"

type Item = {
  rank?: number,
  image: string,
  link: string,
  title: string,
  desc?: string,
  time: string,
}

export const ArticleItem = ({image, link, title, desc, time}: Item) => (
  <Link href={link} className="flex flex-col gap-4 md:[flex-basis:50%] md:max-w-[50%] p-4">
    <span className="h-[220px] mb-4 rounded-md">
        <Image
            src={image}
            alt=""
            width={1200}
            height={600}
            className="object-cover w-full h-full rounded-lg"
          />
      </span>
    <span className="flex-1">
      <h3 className="md:text-[20px] text-[18px] font-bold mb-2">
        {title}
      </h3>
      <span className="text-[#716c6b] md:text-[16px] text-[14px] line-clamp-2 mb-4">{desc}</span>
      <span className="md:text-[14px] text-[12px] text-[#716c6b]">
          {time}
        </span>
    </span>
  </Link>
)

export const ArticleItemSide = ({image, link, title, desc, time}: Item) => (
  <Link href={link} className="flex gap-4 max-md:flex-col-reverse">
    <span className="flex-1">
      <h3 className="md:text-[20px] text-[18px] font-bold mb-2">
        {title}
      </h3>
      <span className="text-[#716c6b] md:text-[16px] text-[14px] line-clamp-2 mb-4">{desc}</span>
      <span className="md:text-[14px] text-[12px] text-[#716c6b]">
          {time}
        </span>
    </span>
    <span className="md:w-[200px] h-[220px] md:h-[200px] mb-4 rounded-md">
        <Image
            src={image}
            alt=""
            width={1200}
            height={600}
            className="object-cover w-full h-full rounded-lg"
          />
      </span>
  </Link>
)

export const ArticleRank = ({rank, image, link, title, time}: Item) => (
  <Link href={link} className="py-6 flex">
    <span className="flex flex-col items-center gap-2">
      {rank === 1 && 
        <Image
          src="/icons/article-rank-01.svg"
          alt=""
          width={20}
          height={20}
        />
      }
      {rank === 2 && 
        <Image
          src="/icons/article-rank-02.svg"
          alt=""
          width={20}
          height={20}
        />
      }
      {rank === 3 && 
        <Image
          src="/icons/article-rank-03.svg"
          alt=""
          width={20}
          height={20}
        />
      }
      <span className="md:text-[18px] text-[16px]">{rank}</span>
    </span>
    <span className="flex items-start flex-1 ml-4">
      <span className="flex flex-col">
        <span className="md:text-[18px] text-[16px] font-bold">{title}</span>
        <span className="md:text-[14px] text-[12px] text-[#a89a96]">{time}</span>
      </span>
      <span className="flex-[0_0_100px] ml-4">
        <Image
            src={image}
            alt=""
            width={1200}
            height={600}
            className="object-cover size-[100px] rounded-lg"
          />
      </span>
    </span>
  </Link>
)