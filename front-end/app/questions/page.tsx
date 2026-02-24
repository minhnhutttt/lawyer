"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { QuestionsArticles, QuestionsArticleType } from "./components/QuestionsArticles";
import Tags from "@/components/common/Tag";
import { QuestionsAnswer } from "./components/QuestionsAnswer";
import { QuestionSearch } from "./components/QuestionSearch";

export default function QuestionsPage() {
 

  const categories = [
    {
      text: '離婚・男女問題',
      href: '/',
      icon: '/images/questions/ic-01.svg'
    },
    {
      text: '借金',
      href: '/',
      icon: '/images/questions/ic-02.svg'
    },
    {
      text: '相続',
      href: '/',
      icon: '/images/questions/ic-03.svg'
    },
    {
      text: '交通事故',
      href: '/',
      icon: '/images/questions/ic-04.svg'
    },
    {
      text: 'インターネット',
      href: '/',
      icon: '/images/questions/ic-05.svg'
    },
    {
      text: '消費者被害',
      href: '/',
      icon: '/images/questions/ic-06.svg'
    },
    {
      text: '犯罪・刑事事件',
      href: '/',
      icon: '/images/questions/ic-07.svg'
    },
    {
      text: '労働',
      href: '/',
      icon: '/images/questions/ic-08.svg'
    },
    {
      text: '債権回収',
      href: '/',
      icon: '/images/questions/ic-09.svg'
    },
    {
      text: '不動産・建築',
      href: '/',
      icon: '/images/questions/ic-10.svg'
    },
    {
      text: '国際・外国人問題',
      href: '/',
      icon: '/images/questions/ic-11.svg'
    },
    {
      text: '医療',
      href: '/',
      icon: '/images/questions/ic-12.svg'
    },
    {
      text: '企業法務',
      href: '/',
      icon: '/images/questions/ic-13.svg'
    },
    {
      text: '税務訴訟',
      href: '/',
      icon: '/images/questions/ic-14.svg'
    },
    {
      text: '行政事件',
      href: '/',
      icon: '/images/questions/ic-15.svg'
    },
    {
      text: '民事紛争の解決手続き',
      href: '/',
      icon: '/images/questions/ic-16.svg'
    },
    {
      text: '民事・その他',
      href: '/',
      icon: '/images/questions/ic-17.svg'
    },
  ]

  const articlesData: QuestionsArticleType[] = [
    {
      images: ['/images/1601175_1.png', '/images/1601175_1.png'],
      title: '反訴状に共同親権を記載する',
      desc: '【相談の背景】離婚裁判中です。私は被告側です。反訴状を提出するのですが、',
      count: '2',
      link: '#'
    },
    {
      images: ['/images/1601175_1.png', '/images/1601175_1.png'],
      title: '反訴状に共同親権を記載する',
      desc: '【相談の背景】離婚裁判中です。私は被告側です。反訴状を提出するのですが、',
      count: '2',
      link: '#'
    },
    {
      images: ['/images/1601175_1.png', '/images/1601175_1.png'],
      title: '反訴状に共同親権を記載する',
      desc: '【相談の背景】離婚裁判中です。私は被告側です。反訴状を提出するのですが、',
      count: '2',
      link: '#'
    },
  ]

  return (
    <div className="w-full">
      <div className="w-full max-w-[1104px] mx-auto">
        <div className="flex flex-start flex-wrap max-md:flex-col">
          <div className="md:mt-10 md:[flex-basis:66.6666666667%] md:max-w-[66.6666666667%] flex-col flex mb-[56px] md:px-6">
            <div className="h-[342px] mb-12 bg-[#f5f1ee] md:text-[16px] text-[14px]">
              <div className="py-6 md:py-12 md:mx-12 mx-6 flex justify-end flex-col h-full bg-[center_15%] [background-size:90%_auto] md:bg-[position:top_20%_right_0] md:[background-size:60%_auto] bg-[url(/images/questions/cover.svg)] bg-no-repeat">
                <p className="md:text-[27px] text-[20px] font-bold mb-4">みんなの法律相談</p>
                <p className="md:text-[16px] text-[14px]">みんなの法律相談には、147万件以上の様々な分野の相談と、現役の弁護士の回答が投稿されています。 ご自身だけでは対処することがむずかしい法律分野のトラブルについて、具体的な対応方法や知識などを知ることができます。</p>
              </div>
            </div>
            <div className="max-xl:px-6">
              <QuestionSearch />
              <div className="mb-[56px] md:hidden">
                <p className="md:text-[18px] text-[16px] font-bold mb-6">カテゴリから相談を探す</p>
                <div className="grid grid-cols-3">
                  {categories.map((category, i) => (
                    <Link href={category.href} className="flex items-center flex-col relative gap-4 text-[12px] font-bold text-[#315dbb] mb-2 px-3 text-center">
                      <Image
                        src={category.icon}
                        alt=""
                        width={24}
                        height={24}
                      />
                      <span className="h-9">
                        {category.text}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mb-[56px]">
                <div className="flex justify-between items-center md:text-[18px] text-[16px] font-bold mb-4">
                  <p>離婚・男女問題の新着相談</p>
                  <Link href="#" className="flex relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4 md:text-[16px] text-[14px] font-bold text-[#315dbb] px-6">
                    一覧へ
                  </Link>
                </div>
                <QuestionsArticles articles={articlesData} />
                <div className="mt-6">
                  <Tags title="弁護士の多い地域で探す" tags={[
                    { text: "千代田区", href: "#" },
                    { text: "中央区", href: "#" },
                    { text: "港区", href: "#" }
                  ]} />
                </div>
              </div>
              <div className="mb-[56px]">
                <div className="flex justify-between items-center md:text-[18px] text-[16px] font-bold mb-4">
                  <p>離婚・男女問題の新着相談</p>
                  <Link href="#" className="flex relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4 md:text-[16px] text-[14px] font-bold text-[#315dbb] px-6">
                    一覧へ
                  </Link>
                </div>
                <QuestionsArticles articles={articlesData} />
                <div className="mt-6">
                  <Tags title="弁護士の多い地域で探す" tags={[
                    { text: "千代田区", href: "#" },
                    { text: "中央区", href: "#" },
                    { text: "港区", href: "#" }
                  ]} />
                </div>
              </div>
              <div className="mb-[56px]">
                <QuestionsAnswer question="みんなの法律相談とは？" answer={<>
                  当サイトの登録弁護士が、一般利用者のお悩みを解決する公開型Q&Aサービスです。<br />
                  法的トラブルに見舞われて困っているご利用者さまが相談を投稿することで、弁護士による回答を参考にトラブルを解決できるサービスを目指しています。<br />
                  <br />
                  投稿された多くの相談は、法的トラブルの解決データとして、同様のお悩みを抱える皆さまにお役立ていただくため公開型になっています。投稿された相談内容は弁護士に限らず一般の皆様にも公開されますので、法律相談ではないご相談や、個人や組織が特定されうる内容の記載はご注意ください。<br />
                  <br />
                  相談をご投稿いただく際は、上記サービスの目的や「みんなの法律相談　投稿ガイドライン」をよくお読みのうえでの投稿をお願いします。
                </>} />
              </div>
              <div className="flex justify-center">
                <Link href="/" className="relative flex items-center justify-center gap-2 border border-[#bbb3af] font-bold [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] rounded-full w-full max-w-[400px] mx-auto py-4 md:py-4 px-5 md:px-8 bg-white md:text-[18px] text-[16px]">
                  新しく相談をする <span className="text-[#f7723e] md:text-[14px] text-[12px]">無料</span>
                </Link>
              </div>
              <div className="mt-6">
                  <Tags title="トレンドキーワードから探す" tags={[
                    { text: "盗撮 自主", href: "#" },
                    { text: "婚活 既婚者", href: "#" },
                    { text: "口外禁止条項", href: "#" },
                    { text: "元カレ 返してくれない", href: "#" },
                    { text: "兄 性的虐待", href: "#" },
                    { text: "盗撮ハンター", href: "#" },
                    { text: "公園 禁止", href: "#" },
                    { text: "救急車 サイレン", href: "#" },
                    { text: "不倫 暴露投稿", href: "#" },
                    { text: "レビュー 星1", href: "#" },
                  ]} />
                </div>
            </div>
          </div>
          <div className="md:[flex-basis:33.3333333333%] md:mt-10 md:max-w-[33.3333333333%] px-3 md:px-6 space-y-6 max-md:hidden">
            <p className="md:text-[18px] text-[16px] font-bold mb-6">カテゴリから相談を探す</p>
            <div className="">
              {categories.map((category, i) => (
                <Link href={category.href} className="flex items-center relative gap-4 md:text-[18px] text-[16px] font-bold text-[#315dbb] after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4 border-b border-[#e9e5e4] py-4 pr-4">
                  <Image
                    src={category.icon}
                    alt=""
                    width={16}
                    height={16}
                  />
                  {category.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-12 flex justify-center">
        
      </div>
    </div>
  );
}