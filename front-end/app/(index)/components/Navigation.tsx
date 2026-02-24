import Image from "next/image";
import Link from "next/link";

const HeadLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <li className="">
      <Link href={href} className="font-bold items-center text-sm text-[#333] flex gap-1 after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45  after:border-[#f7723e] h-[42px] whitespace-nowrap">
        {text}
      </Link>
    </li>
  )
}

export default function Navigation() {
  return (
    <div className="py-6 px-5 bg-[#f2f2f2]">
            <div className="w-full max-w-[980px] mx-auto flex max-md:gap-6 max-md:flex-col">
              <div className="flex gap-x-6 md:border-r border-[#e2e2e2] md:pr-6 max-md:flex-col">
                <div className="flex flex-col items-center">
                  <ul className="flex gap-3 max-lg:flex-wrap">
                    <HeadLink href="/search" text="弁護士を探す" />
                    <HeadLink href="/estimate/" text="一括見積りする" />
                  </ul>
                </div>
                <div className="flex flex-col items-center">
                  <ul className="flex gap-3 max-lg:flex-wrap">
                    <HeadLink href="/bbs/" text="法律相談を見る" />
                    <HeadLink href="/bbs/question/" text="法律相談を投稿する" />
                  </ul>
                </div>
                <div className="flex flex-col items-center">
                  <ul className="flex gap-3 max-lg:flex-wrap">
                    <li className="h-[42px] w-[132px]">
                      <Link href="/about" className="w-full h-full flex items-center justify-center bg-white rounded-full text-[10px] font-bold gap-2">
                        <Image
                          src="/icons/shield.svg"
                          alt=""
                          width={11}
                          height={15}
                          priority
                        />
                        はじめての方へ
                      </Link>
                    </li>
                    <li className="h-[42px] w-[132px]">
                      <Link href="/login" className="w-full h-full flex items-center justify-center bg-white rounded-full text-[10px] font-bold gap-2">
                        <Image
                          src="/icons/shield.svg"
                          alt=""
                          width={11}
                          height={15}
                          priority
                        />
                        ログイン/会員登録
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col items-center md:pl-6">
                <ul className="flex gap-3">
                  <li className="h-[42px] w-[132px]">
                    <Link href="/login" className="w-full h-full flex items-center justify-center bg-[#e2e2e2] rounded-full text-[10px] font-bold gap-2">
                      ログイン/会員登録
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
  )
} 