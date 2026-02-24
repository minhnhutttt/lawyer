'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"

export default function SearchPrefecture() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const refectures = [
    {
      area: '関東',
      refecture: [
        {
          text: '東京都',
          href: '/'
        },
        {
          text: '神奈川県',
          href: '/'
        },
        {
          text: '埼玉県',
          href: '/'
        },
        {
          text: '千葉県',
          href: '/'
        },
        {
          text: '茨城県',
          href: '/'
        },
        {
          text: '栃木県',
          href: '/'
        },
        {
          text: '群馬県',
          href: '/'
        },
      ]
    },
    {
      area: '関西',
      refecture: [
        {
          text: '大阪府',
          href: '/'
        },
        {
          text: '兵庫県',
          href: '/'
        },
        {
          text: '京都府',
          href: '/'
        },
        {
          text: '滋賀県',
          href: '/'
        },
        {
          text: '奈良県',
          href: '/'
        },
        {
          text: '和歌山県',
          href: '/'
        },
      ]
    },
    {
      area: '東海',
      refecture: [
        {
          text: '愛知県',
          href: '/'
        },
        {
          text: '静岡県',
          href: '/'
        },
        {
          text: '岐阜県',
          href: '/'
        },
        {
          text: '三重県',
          href: '/'
        },
      ]
    },
    {
      area: '九州・沖縄',
      refecture: [
        {
          text: '福岡県',
          href: '/'
        },
        {
          text: '佐賀県',
          href: '/'
        },
        {
          text: '長崎県',
          href: '/'
        },
        {
          text: '熊本県',
          href: '/'
        },
        {
          text: '大分県',
          href: '/'
        },
        {
          text: '宮崎県',
          href: '/'
        },
        {
          text: '鹿児島県',
          href: '/'
        },
        {
          text: '沖縄県',
          href: '/'
        },
      ]
    },
    {
      area: '北海道・東北',
      refecture: [
        {
          text: '北海道',
          href: '/'
        },
        {
          text: '青森県',
          href: '/'
        },
        {
          text: '秋田県',
          href: '/'
        },
        {
          text: '山形県',
          href: '/'
        },
        {
          text: '岩手県',
          href: '/'
        },
        {
          text: '宮城県',
          href: '/'
        },
        {
          text: '福島県',
          href: '/'
        },
      ]
    },
    {
      area: '中国',
      refecture: [
        {
          text: '広島県',
          href: '/'
        },
        {
          text: '岡山県',
          href: '/'
        },
        {
          text: '山口県',
          href: '/'
        },
        {
          text: '島根県',
          href: '/'
        },
        {
          text: '鳥取県',
          href: '/'
        },
      ]
    },
    {
      area: '北陸・甲信越',
      refecture: [
        {
          text: '長野県',
          href: '/'
        },
        {
          text: '山梨県',
          href: '/'
        },
        {
          text: '新潟県',
          href: '/'
        },
        {
          text: '富山県',
          href: '/'
        },
        {
          text: '石川県',
          href: '/'
        },
        {
          text: '福井県',
          href: '/'
        },
      ]
    },
    {
      area: '四国',
      refecture: [
        {
          text: '香川県',
          href: '/'
        },
        {
          text: '愛媛県',
          href: '/'
        },
        {
          text: '徳島県',
          href: '/'
        },
        {
          text: '高知県',
          href: '/'
        },
      ]
    }
  ]

  return (
    <div className="w-full max-w-[720px] mx-auto py-10 md:py-[56px] border-t border-[#e9e5e4]">
      <h2 className="text-[22px] font-bold text-[#262221] leading-[1.4] mb-6">
        都道府県から弁護士を探す
      </h2>

      <div className="border-b border-[#e9e5e4]">
        {refectures.map((item, index) => {
          const isOpen = openIndex === index

          return (
            <div key={index} className="border-t border-[#e9e5e4]">
              {/* TAB */}
              <button
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
                className={cn(
                  'w-full relative text-[#315dbb] md:text-[18px] text-[16px] font-bold flex items-center p-4 md:p-[18px]',
                  'after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:border-[#f7723e] after:right-4 after:top-1/2 after:-translate-y-1/2',
                  isOpen
                    ? 'after:rotate-[-45deg]'
                    : 'after:rotate-[135deg]'
                )}
              >
                {item.area}
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
                <div className="px-4">
                  <ul className="grid md:grid-cols-3 grid-cols-2 gap-3 md:gap-x-12">
                    {item.refecture.map((refecture, i) => (
                      <li key={i}>
                        <Link
                          href={refecture.href}
                          className="flex items-center text-[#315dbb] md:text-[18px] text-[16px]
                          before:content-['└'] before:text-[#262221] before:mr-2 before:mt-1
                          py-3 md:py-4 border-t border-[#e9e5e4] -mt-px"
                        >
                          {refecture.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
