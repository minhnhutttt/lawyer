import ButtonLink from "@/components/common/ButtonLink";
import TitleBar from "@/components/common/TitleBar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

  export const news = [
    {
      href: '/',
      text: '「児童ポルノはコピーできる金、使わない馬鹿いる？」小児性愛者が語る異様な執念、自作の”仲間判別テスト”の正体',
      new: true
    },
    {
      href: '/',
      text: '「整形してるんですか？」職場で何度も聞かれうんざりする女性　”悪気ない一言”がハラスメントになることも',
      new: true
    },
    {
      href: '/',
      text: '高市首相ポスターにスプレー被害か、大阪市議が「絶対にやめて」…落書きはどんな罪に？',
      new: true
    },
    {
      href: '/',
      text: '「犯罪は僕の宿命です」「成人とのセックスは拷問」小児性愛者の独白　記者に明かした“恐るべき”言葉とは',
      new: false
    },
  ]

  export const ranks = [
    {
      top: 1,
      href: '/',
      change: 'up',
      text: 'ミスドで「トレーに載せたドーナツをまた戻す」 SNS投稿に賛否、衛生面で許せない？ 運営会社が回答'
    },
    {
      top: 2,
      href: '/',
      change: 'down',
      text: '「とんでもヘアメにされて震えた」美容室でイメージと違う髪型に…泣き寝入りするしかないのか'
    },
    {
      top: 3,
      href: '/',
      change: 'up',
      text: '高市首相ポスターにスプレー被害か、大阪市議が「絶対にやめて」…落書きはどんな罪に？'
    },
    {
      top: 4,
      href: '/',
      change: 'up',
      text: '「犯罪は僕の宿命です」「成人とのセックスは拷問」小児性愛者の独白　記者に明かした“恐るべき”言葉とは'
    },
    {
      top: 5,
      href: '/',
      change: 'up',
      text: '選挙期間中の「さなえちゃんクッキー」販売で波紋、販売店の対応分かれる　公選法違反の可能性は？'
    },
    {
      top: 6,
      href: '/',
      change: 'up',
      text: 'ミスドで「トレーに載せたドーナツをまた戻す」 SNS投稿に賛否、衛生面で許せない？ 運営会社が回答'
    },
  ]

export const NewsItem = ({ text, href, isNew, sm }: { text: string; href: string, isNew: boolean,  sm?: boolean }) => {
  return (
    <Link href={href} className={cn('block py-[5px] text-[#005ebb] bg-[url(/images/icon_arrowS.png)] bg-[position:left_0.3em] bg-no-repeat pl-2.5 text-[13px]', sm && 'flex items-center')}>
     <span className={cn(sm && 'inline-block truncate line-clamp-1')}> {text}</span>
      {isNew && <span className="bg-[#f90] rounded-[3px] text-[#fff] font-bold ml-[10px] px-[3px] py-px align-middle text-[9px]">NEW</span>}
    </Link>
  )
}

export const RankItem = ({ text, href, rank, change }: { text: string; href: string, rank: number, change: string }) => {
  return (
    <div className="border-b border-[#eee] py-[5px] flex items-center">
      <div className="w-[45px] relative flex items-center gap-0.5">
        <div className="size-4 flex-[0_0_16px]">
          {rank === 1 &&
            <Image
              src="/images/icn-rank1.webp"
              alt=""
              width={16}
              height={15}
              className="w-4"
            />
          }
          {rank === 2 &&
            <Image
              src="/images/icn-rank2.webp"
              alt=""
              width={16}
              height={15}
              className="w-4"
            />
          }
          {rank === 3 &&
            <Image
              src="/images/icn-rank3.webp"
              alt=""
              width={16}
              height={15}
              className="w-4"
            />
          }
        </div>
        <span className="text-[14px] font-bold">{rank}</span>
        <span className="text-[10px] text-[#999]">位</span>
      </div>
      <div className="w-[15px] flex-[0_0_15px] flex items-center justify-center">
        {change === 'up' ?
          <Image
            src="/images/icn-change_up.png"
            alt=""
            width={12}
            height={12}
            className="w-3"
          />
          :
          <Image
            src="/images/icn-change_down.png"
            alt=""
            width={12}
            height={12}
            className="w-3"
          />
        }
      </div>
      <Link href={href} className="block text-[#005ebb] text-[13px] font-bold pl-4 flex-1">
        <span className="line-clamp-1">{text}</span>
      </Link>
    </div>
  )
}

export default function News() {
    const [newsTab, setNewsTab] = useState(0)

  return (
    <div className="my-[30px]">
              <TitleBar icon="/images/icn-interview_2x.webp" right="今話題の出来事を法律観点で解説するニュースコンテンツ">
                弁護士ドットコムニュース
              </TitleBar>
              <div className=" mt-[5px] mb-[15px] p-1.5">
                <div className="flex items-start gap-3">
                  <button onClick={() => setNewsTab(0)}
                    className={cn(
                      'rounded-[5px] text-[15px] w-[206px] [box-shadow:inset_-1px_-1px_#d8d8d8,_inset_0_0_0_1px_#e9e9e9,_inset_2px_2px_#fff] flex items-center justify-center gap-1 top-px relative',
                      newsTab === 0 ? 'bg-white border-b-none rounded-tl-[5px] rounded-br-none rounded-tr-[5px] rounded-bl-none [box-shadow:0_0_0_#fff,_inset_1px_0_0_#ddd,_inset_0_1px_0_#ddd,_inset_-1px_0_0_#ddd] text-[#74542b] py-3' : 'py-2 bg-[linear-gradient(#fdfdfd,_#f8f8f8)]'
                    )}>
                    <Image
                      src="/images/icn-newitem_1x.webp"
                      alt=""
                      width={15}
                      height={15}
                    />
                    <strong>新着記事</strong>
                  </button>
                  <button onClick={() => setNewsTab(1)}
                    className={cn(
                      'rounded-[5px] text-[15px] w-[206px] [box-shadow:inset_-1px_-1px_#d8d8d8,_inset_0_0_0_1px_#e9e9e9,_inset_2px_2px_#fff] flex items-center justify-center gap-1 top-px relative',
                      newsTab === 1 ? 'bg-white border-b-none rounded-tl-[5px] rounded-br-none rounded-tr-[5px] rounded-bl-none [box-shadow:0_0_0_#fff,_inset_1px_0_0_#ddd,_inset_0_1px_0_#ddd,_inset_-1px_0_0_#ddd] text-[#74542b] py-3' : 'py-2 bg-[linear-gradient(#fdfdfd,_#f8f8f8)]'
                    )}>
                    <Image
                      src="/images/icn-ranking_1x.webp"
                      alt=""
                      width={15}
                      height={15}
                    />
                    <strong>ランキング</strong>
                  </button>
                </div>
                <div className="bg-white border-t border-[#e4d8cb]">
                  {
                    newsTab == 0 ?
                      <div className="">
                        <ul className="">
                          {news.map((item, index) => (
                            <li className="" key={index}>
                              <NewsItem href={item.href} text={item.text} isNew={item.new} />
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-end py-2.5">
                          <ButtonLink link="/topic">もっと見る</ButtonLink>
                        </div>
                      </div>
                      :
                      <div className="">
                        <ul className="">
                          {ranks.map((item, index) => (
                            <li className="" key={index}>
                              <RankItem href={item.href} text={item.text} rank={item.top} change={item.change} />
                            </li>
                          ))}
                        </ul>
                      </div>
                  }
                </div>
              </div>
            </div>
  )
} 