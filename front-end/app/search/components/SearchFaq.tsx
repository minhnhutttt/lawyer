'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

export default function SearchFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const FaqData = [
    {
        question: 'どうやって弁護士を検索すれば良いですか？',
        answer: '弁護士ドットコムでは地域、駅・路線、相談内容から弁護士をお探しいただけます。さらに初回無料相談、18時以降対応可、土日対応可などいったこだわり条件での検索機能もご利用いただけます。まずは、お住まいの地域や相談したい分野などで検索いただき、ご希望の条件で絞り込んでいただくことをおすすめいたします。',
        href: '/'
    },
    {
        question: 'どうやって弁護士を検索すれば良いですか？',
        answer: '弁護士ドットコムでは地域、駅・路線、相談内容から弁護士をお探しいただけます。さらに初回無料相談、18時以降対応可、土日対応可などいったこだわり条件での検索機能もご利用いただけます。まずは、お住まいの地域や相談したい分野などで検索いただき、ご希望の条件で絞り込んでいただくことをおすすめいたします。',
        href: '/'
    },
    {
        question: 'どうやって弁護士を検索すれば良いですか？',
        answer: '弁護士ドットコムでは地域、駅・路線、相談内容から弁護士をお探しいただけます。さらに初回無料相談、18時以降対応可、土日対応可などいったこだわり条件での検索機能もご利用いただけます。まずは、お住まいの地域や相談したい分野などで検索いただき、ご希望の条件で絞り込んでいただくことをおすすめいたします。',
        href: '/'
    },
  ]

  return (
    <div className="w-full max-w-[720px] mx-auto py-10 md:py-[56px] border-t border-[#e9e5e4]">
      <h2 className="text-[22px] font-bold text-[#262221] leading-[1.4] mb-6">
        よくある質問
      </h2>

      <div className="bg-[#f6f6f6] rounded-sm divide-y divide-[#d9d9d9]">
        {FaqData.map((faq, index) => {
          const isOpen = openIndex === index

          return (
            <div key={index} className="">
              {/* TAB */}
              <button
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
                className={cn(
                  'w-full relative md:text-[18px] text-[16px] font-bold flex items-center p-4 md:p-[18px]',
                  'after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:border-[#262221] after:right-4 after:top-1/2 after:-translate-y-1/2',
                  isOpen
                    ? 'after:rotate-[-45deg]'
                    : 'after:rotate-[135deg]'
                )}
              >
                {faq.question}
              </button>

              {/* ACCORDION CONTENT */}
              <div
                className={cn(
                  'transition-all duration-300 ease-in-out overflow-hidden',
                  isOpen
                    ? 'max-h-[1000px] visible opacity-100'
                    : 'max-h-0 invisible opacity-0'
                )}
              >
                <div className="md:text-[18px] text-[16px] md:p-[18px] p-4">
                  {faq.answer}
                  <br /><br />
                  <Link href="/search/" className="text-[#315dbb]">弁護士を探す</Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
