import ButtonLink from "@/components/common/ButtonLink";
import TitleBar from "@/components/common/TitleBar";
import Link from "next/link";
import { useState } from "react";

export default function QA() {
    const qa = [
    {
      link: '/',
      title: '相続時の違法建築に関する税務署への通報の可能性は？',
      desc: '【相談の背景】 相続の相談時に税理士に違法建築の家のことを話してしまいました。 建ぺい率違反 【質問1】 固定資産税や税を納めていないなどに関連する恐れがあるのか分かり',
      answer: 1,
      lawyerAnswer: 1
    },
    {
      link: '/',
      title: '相続時の違法建築に関する税務署への通報の可能性は？',
      desc: '【相談の背景】 相続の相談時に税理士に違法建築の家のことを話してしまいました。 建ぺい率違反 【質問1】 固定資産税や税を納めていないなどに関連する恐れがあるのか分かり',
      answer: 1,
      lawyerAnswer: 1
    },
    {
      link: '/',
      title: '相続時の違法建築に関する税務署への通報の可能性は？',
      desc: '【相談の背景】 相続の相談時に税理士に違法建築の家のことを話してしまいました。 建ぺい率違反 【質問1】 固定資産税や税を納めていないなどに関連する恐れがあるのか分かり',
      answer: 1,
      lawyerAnswer: 1
    },
  ]
  return (
    <div className="my-[30px]">
              <TitleBar icon="/images/icn-interview_2x.webp" right="無料で弁護士に法律相談ができるQ&Aサービス">
                みんなの法律相談
              </TitleBar>
              <ul className="">
                {qa.map((item, index) => (
                  <li className="border-y border-[#eee] -mt-px py-[20px]" key={index}>
                    <Link href={item.link} className="text-[#005ebb] flex bg-[url(/images/icn-question_g_1x.webp)] items-center bg-no-repeat bg-left mb-[5px]">
                      <p className="text-[16px] font-bold pl-[20px] relative line-clamp-1 leading-none">
                        {item.title}
                      </p>
                    </Link>
                    <p className="line-clamp-2 text-[#777] mt-[3px] text-[13px] mb-[5px] pl-[20px]">
                      {item.desc}
                    </p>
                    <ul className="pl-5 mt-[3px] flex">
                      <li className="pr-2.5 pl-5 bg-[url(/images/icn-answer_g_1x.webp)] items-center bg-no-repeat bg-left ">
                        <span className="pr-[3px] font-bold text-[14px]">{item.answer}</span>
                        <span className="text-[10px] text-[#999]">回答 /</span>
                      </li>
                      <li className="pr-2.5 pl-5 bg-[url(/images/icn-lawyer_g_1x.webp)] items-center bg-no-repeat bg-left ">
                        <span className="pr-[3px] font-bold text-[14px]">{item.lawyerAnswer}</span>
                        <span className="text-[10px] text-[#999]">弁護士回答</span>
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end py-2.5">
                <ButtonLink link="/bbs">もっと見る</ButtonLink>
              </div>
            </div>
  )
} 