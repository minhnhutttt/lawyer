import TitleBar from "@/components/common/TitleBar";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Lawyers() {
    const lawyers = [
    {
      link: '/',
      image: '/images/283023_1.webp',
      intro: '行動力と粘り強さを武器に解決策を見出す。過去を責めず、不安な心に優しく寄り添うことがモットー',
      name: '原田 龍明',
      office: '安佐合同法律事務所',
      address: '広島県広島市安佐南区緑井5丁目17-5 グランデュア緑井403'
    },
    {
      link: '/',
      image: '/images/283023_1.webp',
      intro: '行動力と粘り強さを武器に解決策を見出す。過去を責めず、不安な心に優しく寄り添うことがモットー',
      name: '原田 龍明',
      office: '安佐合同法律事務所',
      address: '広島県広島市安佐南区緑井5丁目17-5 グランデュア緑井403'
    },
    {
      link: '/',
      image: '/images/283023_1.webp',
      intro: '行動力と粘り強さを武器に解決策を見出す。過去を責めず、不安な心に優しく寄り添うことがモットー',
      name: '原田 龍明',
      office: '安佐合同法律事務所',
      address: '広島県広島市安佐南区緑井5丁目17-5 グランデュア緑井403'
    },
  ]
  return (
    <div className="my-[30px]">
              <TitleBar icon="/images/icn-interview_2x.webp">
                インタビューが掲載された弁護士を見る
              </TitleBar>
              <div className="text-[10px] text-[#777] mb-2.5">
                <span>最新更新日：</span>
                <time dateTime="2026-01-22">
                  2026年01月22日          </time>
              </div>
              <ul className="">
                {lawyers.map((lawyer, index) => (
                  <li className="border-t border-[#eee]" key={index}>
                    <Link href={lawyer.link} className="flex md:items-center py-5 pr-8 md:pr-[60px] bg-[url(/images/icon_arrow_right_middle.png)] bg-no-repeat bg-right hover:bg-[#f8f8f8]">
                      <figure className="mr-5">
                        <Image
                          src={lawyer.image}
                          alt=""
                          width={150}
                          height={200}
                          className="w-16"
                          priority
                        />
                      </figure>
                      <span className="flex-1 text-[14px] block">
                        <span className="block font-bold mb-[5px] text-[#005ebb]">{lawyer.intro}</span>
                        <span className="block ">
                          <span className="space-x-2.5 font-bold">
                            <span>{lawyer.name}</span><span className="text-[10px]">弁護士</span>
                          </span>
                          <span className="block mt-0.5 text-[#777] text-[10px]">{lawyer.address}</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
  )
} 