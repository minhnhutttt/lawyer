'use client'

import Image from "next/image"
import Link from "next/link"

export default function PickupLawyers() {
    const lawyersData = [
        {
            href: '/lawyers/id',
            image: '/images/1601175_1.png',
            name: '〇〇 〇〇',
            location: '愛知県'
        },
        {
            href: '/lawyers/id',
            image: '/images/1601175_1.png',
            name: '〇〇 〇〇',
            location: '愛知県'
        },
        {
            href: '/lawyers/id',
            image: '/images/1601175_1.png',
            name: '〇〇 〇〇',
            location: '愛知県'
        },
        {
            href: '/lawyers/id',
            image: '/images/1601175_1.png',
            name: '〇〇 〇〇',
            location: '愛知県'
        },
        {
            href: '/lawyers/id',
            image: '/images/1601175_1.png',
            name: '〇〇 〇〇',
            location: '愛知県'
        },
        {
            href: '/lawyers/id',
            image: '/images/1601175_1.png',
            name: '〇〇 〇〇',
            location: '愛知県'
        },
    ]
  return (
    <div className="w-full max-w-[720px] mx-auto py-10 md:py-[56px] border-t border-[#e9e5e4]">
      <h2 className="text-[22px] font-bold text-[#262221] leading-[1.4] mb-6">
        ピックアップ弁護士
      </h2>
        <div className="flex overflow-auto md:flex-wrap">
            {lawyersData.map((lawyer, index) => (
                <Link href={lawyer.href} className="md:flex-[0_0_25%] flex-[0_0_33.3333333%] flex flex-col items-center md:mb-6 max-md:px-2" key={index}>
                    <span className="overflow-hidden mb-3 w-[80px]">
                        <Image src={lawyer.image} alt="" width={150} height={200} className="rounded-lg" />
                    </span>
                    <span className="mb-1 leading-[1.4] text-[#315dbb] flex flex-col items-center font-bold">
                        <span className="md:text-[16px] text-[14px]">{lawyer.name}</span>
                        <span className="md:text-[12px] text-[11px]">弁護士</span>
                    </span>
                    <span className="md:text-[12px] text-[11px] text-[#716c6b]">{lawyer.location}</span>
                </Link>
            ))}
        </div>
    </div>
  )
}
