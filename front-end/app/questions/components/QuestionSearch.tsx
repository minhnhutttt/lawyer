"use client";
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { useState } from "react";

export const QuestionSearch = () => {
     const [expand, setExpand] = useState(false);
  return (
    <div>
      <p className="md:text-[22px] text-[20px] font-bold mb-6">法律相談を検索する</p>
              <div className="relative flex flex-1 w-full max-md:mt-6">
                <div className="relative w-full md:text-[18px] text-[16px]">
                  <input type="text" className="w-full [box-shadow:inset_1px_1px_2px_rgba(38,_34,_33,_.08)] font-normal border border-[#bbb3af] rounded-lg py-2 pr-10 pl-4" placeholder='例）離婚　養育費' />
                  <div className="absolute w-10 right-0 bottom-0 top-0 flex items-center justify-center border-l border-[#bbb3af] text-[#bbb3af]">
                    <Search size={18} />
                  </div>
                </div>
              </div>
              <div className="border-b border-[#f0ebe9] mb-[56px]">
                <div className="flex justify-center">
                  <button onClick={() => setExpand(true)} className={cn("justify-center items-center gap-2 border-t border-[#e9e5e4] py-6 flex relative after:block after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-[135deg] after:border-[#f7723e] after:right-4 md:text-[18px] text-[16px] font-bold text-[#315dbb] px-6", expand && 'hidden')}>
                    もっと詳しく絞り込む
                  </button>
                </div>
                <div className={cn("mt-6 flex flex-col gap-6", expand ? 'flex' : 'hidden')}>
                  <div>
                    <label className="flex items-center gap-2 py-2 relative md:text-[18px] text-[16px]">
                      <input type="checkbox" className="peer sr-only" />
                      <span className="flex justify-center relative aspect-square border-2 border-[#bbb3af] rounded h-4 w-4 peer-checked:bg-[#f7723e] peer-checked:border-transparent after:border-l-[3px] after:border-b-[3px] after:border-white after:h-1.5 after:w-2.5 after:absolute after:top-0.5 after:-rotate-45"></span>
                      ベストアンサーあり
                    </label>
                  </div>
                  <div>
                    <p className="md:text-[18px] text-[16px] font-bold">質問日</p>
                    <div className="">
                      <select className="border border-[#bbb3af] rounded-lg w-full md:text-[18px] text-[16px] [box-shadow:inset_1px_1px_2px_rgba(38,_34,_33,_.08)] py-3 pr-10 pl-4 leading-snug appearance-none bg-[url(/icons/select.svg)] bg-[position:right_18px_top_50%] bg-no-repeat" aria-label="都道府県を選択">
                        <option value="day">24時間以内</option>
                        <option value="week">1週間以内</option>
                        <option value="month">1ヶ月以内</option>
                        <option value="3months">3ヶ月以内</option>
                        <option value="6months">6ヶ月以内</option>
                        <option value="year">1年以内</option>
                        <option value="before_year">1年以前</option>
                        <option value="none">指定しない</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <p className="md:text-[18px] text-[16px] font-bold">弁護士回答数</p>
                    <div className="flex items-end">
                      <div className="flex-1">
                        <p className="md:text-[12px] text-[10px] text-[#716c6b] py-1">最低回答数</p>
                        <select className="border border-[#bbb3af] rounded-lg w-full md:text-[18px] text-[16px] [box-shadow:inset_1px_1px_2px_rgba(38,_34,_33,_.08)] py-3 pr-10 pl-4 leading-snug appearance-none bg-[url(/icons/select.svg)] bg-[position:right_18px_top_50%] bg-no-repeat" aria-label="都道府県を選択">
                          <option value="1">1件</option>
                          <option value="3">3件</option>
                          <option value="5">5件</option>
                          <option value="10">10件</option>
                          <option value="30">30件</option>
                          <option value="50">50件</option>
                          <option value="100">100件</option>
                        </select>
                      </div>
                      <span className="py-4 w-[72px] flex justify-center">〜</span>
                      <div className="flex-1">
                        <p className="md:text-[12px] text-[10px] text-[#716c6b] py-1">最高回答数</p>
                        <select className="border border-[#bbb3af] rounded-lg w-full md:text-[18px] text-[16px] [box-shadow:inset_1px_1px_2px_rgba(38,_34,_33,_.08)] py-3 pr-10 pl-4 leading-snug appearance-none bg-[url(/icons/select.svg)] bg-[position:right_18px_top_50%] bg-no-repeat" aria-label="都道府県を選択">
                          <option value="1">1件</option>
                          <option value="3">3件</option>
                          <option value="5">5件</option>
                          <option value="10">10件</option>
                          <option value="30">30件</option>
                          <option value="50">50件</option>
                          <option value="100">100件</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="md:text-[18px] text-[16px] font-bold">表示順</p>
                    <div className="">
                      <select className="border border-[#bbb3af] rounded-lg w-full md:text-[18px] text-[16px] [box-shadow:inset_1px_1px_2px_rgba(38,_34,_33,_.08)] py-3 pr-10 pl-4 leading-snug appearance-none bg-[url(/icons/select.svg)] bg-[position:right_18px_top_50%] bg-no-repeat" aria-label="都道府県を選択">
                        <option value="lawyer_answer">弁護士回答の多い順</option>
                        <option value="latest">新着順</option>
                        <option value="none">指定しない</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-[56px]">
                    <div className="flex justify-center md:text-[20px] text-[18px] text-center mb-4">
                      <span className="font-bold">597399</span>件見つかりました
                    </div>
                    <div className="flex justify-center">
                      <button className="max-w-[400px] w-full bg-[#f7723e] rounded-full text-white p-4 font-bold md:text-[18px] text-[14px]">絞り込み検索する</button>
                    </div>
                  </div>
                </div>
              </div>
    </div>
  )
}
