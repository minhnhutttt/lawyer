import ButtonLink from "@/components/common/ButtonLink";
import TitleBar from "@/components/common/TitleBar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { news, NewsItem, RankItem, ranks } from "../News";


export default function SlidebarNews() {
    const [newsTab, setNewsTab] = useState(0)

  return (
    <div className="my-[30px]">
              <TitleBar>
                弁護士ドットコムニュース
              </TitleBar>
              <div className=" mt-[5px] mb-[15px] p-1.5">
                <div className="flex items-start gap-3">
                  <button onClick={() => setNewsTab(0)}
                    className={cn(
                      'rounded-[5px] text-[11px] w-[145px] [box-shadow:inset_-1px_-1px_#d8d8d8,_inset_0_0_0_1px_#e9e9e9,_inset_2px_2px_#fff] flex items-center justify-center gap-1 top-px relative',
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
                      'rounded-[5px] text-[11px] bg-white w-[145px] [box-shadow:inset_-1px_-1px_#d8d8d8,_inset_0_0_0_1px_#e9e9e9,_inset_2px_2px_#fff] flex items-center justify-center gap-1 top-px relative',
                      newsTab === 1 ? 'bg-white border-b-none rounded-tl-[5px] rounded-br-none rounded-tr-[5px] rounded-bl-none [box-shadow:0_0_0_#fff,_inset_1px_0_0_#ddd,_inset_0_1px_0_#ddd,_inset_-1px_0_0_#ddd] text-[#74542b] py-3' : 'py-2  bg-[linear-gradient(#fdfdfd,_#f8f8f8)]'
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
                              <NewsItem href={item.href} text={item.text} isNew={item.new} sm />
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