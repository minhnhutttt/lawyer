"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import PageTitle from "@/components/common/PageTitle"
import Image from "next/image"

export default function Question() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <main>
      <div className="w-full max-w-[980px] mx-auto px-2.5 mt-5 md:mt-8 mb-16 text-[#222]">
        <PageTitle>閲覧履歴</PageTitle>

        {/* Tab Navigation */}
        <ul className="flex border-b-[1px] border-[#ccc] px-[10px] font-bold text-[14px]">
          <li className="flex-1 text-[#999] p-[7px] md:p-[10px] text-center border border-[#ccc] mb-[-1px] border-b-white rounded-t-[3px] bg-white">
            みんなの法律相談
          </li>
          <li className="flex-1 p-[10px] pr-0 pt-0 mb-[-1px]">
            <Link
              href="/sp/private/view/lawyer/"
              className="text-center border border-[#ccc] block p-[6px] hover:bg-gray-50 transition-colors rounded-[3px]"
            >
              弁護士
            </Link>
          </li>
        </ul>

        {/* Count Display */}
        <div className="text-center py-4 text-[#222] text-[14px]">
          <span className="text-[#ff9900] text-[17px]">0</span>件 / 50件
        </div>

        {/* Search Section */}
        <div className="text-[14px] text-[#222]">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#eaeaea] font-bold mb-6">
            <Image src="/icons/icon_find.png" alt="相談を絞り込む" width={40} height={40} className="flex-shrink-0" />
            <span>相談を絞り込む</span>
          </div>

          {/* Search Input */}
          <div className="max-w-[700px] w-full mx-auto">
            <div className="flex">
              <input
                type="text"
                placeholder="みんなの法律相談を検索する"
                className="flex-1 px-4 py-2.5 border border-[#bbb] rounded-l focus:outline-none focus:border-[#ff9900]"
              />
              <button
                className="px-6 py-2.5 flex-shrink-0 text-white rounded-r transition-colors bg-[linear-gradient(180deg,#ffb415_0%,#ff9600_50%,#ff8500_50%,#ffa600_100%)] border border-[#d38947] [text-shadow:0_-1px_1px_#d38947] hover:opacity-90"
              >
                検索
              </button>
            </div>

            {/* Advanced Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full mt-4 flex items-center justify-between px-4 py-2.5 border border-[#bbb] hover:bg-gray-50 rounded font-bold"
            >
              <span className="flex-1 text-center">もっと詳しく絞り込む</span>
              <span className={`w-5 h-5 bg-[#ff9900] rounded-full flex items-center justify-center transition-transform ${isFilterOpen ? "rotate-180" : ""}`}>
                <ChevronDown className="w-5 h-5 text-white" />
              </span>
            </button>

            {/* Advanced Filter Content */}
            {isFilterOpen && (
              <div className="mt-4">
                {/* Best Answer Checkbox */}
                <label htmlFor="is_best" className="flex items-center justify-between py-2.5 border border-[#bbb] rounded px-4 cursor-pointer group">
                  <span className="font-bold text-[#222]">ベストアンサーあり</span>
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      id="is_best"
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 bg-[#ddd] rounded peer-checked:bg-[#ff9900] flex items-center justify-center [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  </div>
                </label>

                <div className="font-bold px-2">
                  {/* Question Date */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span>質問日</span>
                    <div className="relative w-[65%] flex-shrink-0">
                      <select defaultValue="" className="appearance-none bg-white border border-[#bbb] rounded px-4 py-2 pr-8 w-full text-center cursor-pointer focus:outline-none">
                        <option value="">指定しない</option>
                        <option value="day">24時間以内</option>
                        <option value="week">1週間以内</option>
                        <option value="month">1ヶ月以内</option>
                        <option value="3months">3ヶ月以内</option>
                        <option value="6months">6ヶ月以内</option>
                        <option value="year">1年以内</option>
                        <option value="before_year">1年以前</option>
                      </select>

                      <div className="w-5 h-5 bg-[#ff9900] rounded-full flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Lawyer Answer Count */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span>弁護士回答数</span>
                    <div className="flex items-center gap-2 w-[65%] flex-shrink-0">
                      <div className="relative w-[calc(50%-5px)]">
                        <select defaultValue="1" className="appearance-none bg-white border border-[#bbb] rounded px-4 py-2 pr-8 w-full text-center cursor-pointer focus:outline-none">
                          <option value="1">1件</option>
                          <option value="3">3件</option>
                          <option value="5">5件</option>
                          <option value="10">10件</option>
                          <option value="30">30件</option>
                          <option value="50">50件</option>
                          <option value="100">100件</option>
                        </select>

                        <div className="w-5 h-5 bg-[#ff9900] rounded-full flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <span className="w-[10px] text-center">-</span>
                      <div className="relative w-[calc(50%-5px)]">
                        <select defaultValue="100" className="appearance-none bg-white border border-[#bbb] rounded px-4 py-2 pr-8 w-full text-center cursor-pointer focus:outline-none">
                          <option value="1">1件</option>
                          <option value="3">3件</option>
                          <option value="5">5件</option>
                          <option value="10">10件</option>
                          <option value="30">30件</option>
                          <option value="50">50件</option>
                          <option value="100">100件</option>
                        </select>

                        <div className="w-5 h-5 bg-[#ff9900] rounded-full flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sort Order */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span>表示順</span>
                    <div className="relative w-[65%] flex-shrink-0">
                      <select defaultValue="latest" className="appearance-none bg-white border border-[#bbb] rounded px-4 py-2 pr-8 w-full text-center cursor-pointer focus:outline-none">
                        <option value="lawyer_answer">弁護士回答の多い順</option>
                        <option value="latest">新着順</option>
                        <option value="none">指定しない</option>
                      </select>

                      <div className="w-5 h-5 bg-[#ff9900] rounded-full flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Result Count */}
                  <div className="text-center py-4 text-[#9b7900]">
                    <span>＼ </span>
                    <span className="text-[#d63003] text-lg font-bold">1246104</span>
                    <span className="font-bold">件見つかりました</span>
                    <span> ／</span>
                  </div>

                  {/* Filter Search Button */}
                  <button
                    className="w-full max-w-[400px] py-2.5 mx-auto text-white font-bold rounded bg-[linear-gradient(0deg,#c41c00,#9b1a00_49%,#b61b0b_50%,#e23a00)] border border-[#d38947] [text-shadow:0_-1px_1px_#d38947] hover:opacity-90 flex items-center justify-center gap-2 transition"
                  >
                    <span><Image src="/icons/icon_premium.png" alt="icon premium" width={15} height={22} /></span>
                    絞り込み検索する
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
