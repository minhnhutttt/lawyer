'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

export default function Footer() {

  const list = [
    {
      href: '/fqa',
      text: 'よくあるお問い合わせ・ヘルプ',
    },
    {
      href: '/contact',
      text: 'お問い合わせ窓口',
    },
    {
      href: '/rules',
      text: '利用規約・プライバシーの考え方',
    },
    {
      href: '/behavioral',
      text: '外部送信規律事項の公表等について',
    },
    {
      href: '/tokutei',
      text: '特定商取引法に関する表記',
    },
    {
      href: '/corporate',
      text: '運営会社',
    },
    {
      href: '/optout',
      text: 'オプトアウトに関する情報',
    },
  ]

  return (
    <footer className="bg-[hsla(17,19%,93%,.25)] text-[#716c6b]">
      <Link href="#" className="flex py-4 justify-center relative text-[14px]">
        <span className="text-[16px] relative before:border-t before:border-[#716c6b] before:content-[''] before:inline-block before:h-0 before:left-0 before:absolute before:top-[2px] before:w-[20px] pl-8  after:border-r after:border-t after:border-[#716c6b] after:content-[''] after:inline-block after:h-[13px] after:left-[3px] after:absolute after:top-[8px] after:-rotate-45 after:w-[13px]">このページの先頭へ</span>
      </Link>
      <div className="px-5">
      <div className="max-w-[960px] w-full mx-auto py-[40px]">
        <ul className="flex flex-wrap -mx-4">
          {list.map((item, index) => (
            <li key={index}>
              <Link href={item.href}  className="text-[#716c6b] text-[12px] flex px-4 py-2">{item.text}</Link>
            </li>
          ))}

        </ul>
        {/* copyright */}
        <div className="pt-6 mt-12 text-sm ">
          © Bengo4.com, Inc. 2005 - 2026
        </div>
        </div>
      </div>
    </footer>
  )
}
