import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export default function LawyersSidebar() {
    const [locationOpen, setLocationOpen] = useState(false);
  const [fieldOpen, setFieldOpen] = useState(false);
  const locations = [
    {
      text: 'さいたま市',
      link: '#'
    },
    {
      text: '川越',
      link: '#'
    },
    {
      text: '越谷',
      link: '#'
    },
    {
      text: '熊谷',
      link: '#'
    },
    {
      text: '所沢',
      link: '#'
    },
    {
      text: '川口',
      link: '#'
    },
    {
      text: '春日部',
      link: '#'
    },
    {
      text: '草加',
      link: '#'
    },
    {
      text: '東松山',
      link: '#'
    },
    {
      text: '上尾',
      link: '#'
    },
    {
      text: '朝霞',
      link: '#'
    },
    {
      text: '本庄',
      link: '#'
    },
    {
      text: '新座',
      link: '#'
    },
    {
      text: '志木',
      link: '#'
    },
    {
      text: '和光',
      link: '#'
    },
    {
      text: '鶴ヶ島',
      link: '#'
    },
    {
      text: '飯能',
      link: '#'
    },
    {
      text: '三郷',
      link: '#'
    },
    {
      text: '坂戸',
      link: '#'
    },
    {
      text: 'ふじみ野',
      link: '#'
    },
    {
      text: '三芳',
      link: '#'
    },
    {
      text: '狭山',
      link: '#'
    },
    {
      text: '深谷',
      link: '#'
    },
    {
      text: '戸田',
      link: '#'
    },
    {
      text: '入間',
      link: '#'
    },
    {
      text: '久喜',
      link: '#'
    },
    {
      text: '富士見',
      link: '#'
    },
    {
      text: '秩父',
      link: '#'
    },
    {
      text: '加須',
      link: '#'
    },
    {
      text: '鴻巣',
      link: '#'
    },
    {
      text: '蕨',
      link: '#'
    },
    {
      text: '桶川',
      link: '#'
    },
    {
      text: '蓮田',
      link: '#'
    },
    {
      text: '吉川',
      link: '#'
    },
    {
      text: '鳩山',
      link: '#'
    },
    {
      text: '寄居',
      link: '#'
    },
  ]

  const fields = [
    {
      text: '離婚・男女問題',
      link: '#'
    },
    {
      text: '交通事故',
      link: '#'
    },
    {
      text: '遺産相続',
      link: '#'
    },
    {
      text: '借金・債務整理',
      link: '#'
    },
    {
      text: '労働問題',
      link: '#'
    },
    {
      text: '犯罪・刑事事件',
      link: '#'
    },
    {
      text: '不動産・建築',
      link: '#'
    },
    {
      text: 'インターネット問題',
      link: '#'
    },
    {
      text: '企業法務・顧問弁護士',
      link: '#'
    },
    {
      text: '債権回収',
      link: '#'
    },
    {
      text: '医療問題',
      link: '#'
    },
    {
      text: '詐欺被害・消費者被害',
      link: '#'
    },
    {
      text: '税務訴訟・行政事件',
      link: '#'
    },
    {
      text: '国際・外国人問題',
      link: '#'
    },
  ]
  return (
    <div className="relative max-md:px-3">
            <aside className="bg-[#f6f6f6] rounded-[8px] sticky top-[16px] z-auto flex gap-4 flex-col">
              <div className="px-4 flex flex-col rounded divide-y divide-[#d9d9d9]">
                <div className="flex flex-col pt-4">
                  <h3 className="flex items-center md:text-[14px] text-[12px] font-bold gap-1.5 md:mb-3.5 mb-3 before:size-[16.875px] before:bg-[url(/icons/location.svg)] before:bg-contain before:bg-center before:bg-no-repeat">地域から探す</h3>
                  <ul className={cn('flex flex-wrap gap-1.5', !locationOpen && 'md:max-h-[220px] max-h-[165px] overflow-hidden')}>
                    {locations.map((location, index) => (
                      <li className="" key={index}>
                        <Link href={location.link} className="border block hover:bg-[#f2f2f2] duration-200 border-[#d9d9d9] bg-white [box-shadow:0_1px_3px_0_rgba(0,_0,_0,_.1)] rounded-md text-[12px] md:text-[14px] font-bold py-2 px-3">{location.text}</Link>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-center my-1">
                    <button onClick={() => setLocationOpen(!locationOpen)} className={cn('size-10 flex items-center justify-center', locationOpen && 'rotate-180')}>
                      <Image src="/icons/arrow-down.svg" alt="" width={16} height={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col pt-4">
                  <h3 className="flex items-center md:text-[14px] text-[12px] font-bold gap-1.5 md:mb-3.5 mb-3 before:size-[16.875px] before:bg-[url(/icons/field.svg)] before:bg-contain before:bg-center before:bg-no-repeat">分野から探す</h3>
                  <ul className={cn('flex flex-wrap gap-1.5', !fieldOpen && 'md:max-h-[130px] max-h-[120px] overflow-hidden')}>
                    {fields.map((location, index) => (
                      <li className="" key={index}>
                        <Link href={location.link} className="border block hover:bg-[#f2f2f2] duration-200 border-[#d9d9d9] bg-white [box-shadow:0_1px_3px_0_rgba(0,_0,_0,_.1)] rounded-md text-[12px] md:text-[14px] font-bold py-2 px-3">{location.text}</Link>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-center my-1">
                    <button onClick={() => setFieldOpen(!fieldOpen)} className={cn('size-10 flex items-center justify-center', fieldOpen && 'rotate-180')}>
                      <Image src="/icons/arrow-down.svg" alt="" width={16} height={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-4">
                  <h3 className="flex items-center md:text-[14px] text-[12px] font-bold gap-1.5 before:size-[16.875px] before:bg-[url(/icons/tag.svg)] before:bg-contain before:bg-center before:bg-no-repeat">よく見られる条件</h3>
                  <Link href="#" className="border block hover:bg-[#f2f2f2] duration-200 border-[#d9d9d9] bg-white [box-shadow:0_1px_3px_0_rgba(0,_0,_0,_.1)] rounded-md text-[12px] md:text-[14px] font-bold py-2 px-3">初回無料相談</Link>
                </div>
              </div>
            </aside>
          </div>
  )
} 