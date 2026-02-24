'use client'

import Image from "next/image"
import Link from "next/link"
import { ArticlesRanks } from "../components/ArticlesRanks"

export default function ArticlePageDetail() {

  return (
    <div className="w-full">
      {/* Articles Content Section */}
      <div className="w-full max-w-[1152px] mx-auto px-6">
        <div className="flex flex-start flex-wrap max-md:flex-col">
          <div className="mt-10 md:[flex-basis:66.6666666667%] md:max-w-[66.6666666667%] flex-col flex mb-[56px]">
            <div className="mb-2">
              <Image
                src="/images/articles/22686_2_1.jpg"
                alt=""
                width={1200}
                height={600}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <h2 className="md:text-[27px] text-[20px] font-bold md:mb-8 mb-6">「整形してるんですか？」職場で何度も聞かれうんざりする女性 ”悪気ない一言”がハラスメントになることも</h2>
            <p className="md:text-[12px] text-[10px] max-md:mx-6 text-[#a89a96] mb-4">2026年02月10日 12時27分</p>
            <div className="flex flex-wrap gap-2">
              <Link href="#" className="bg-white border border-[#e1dbd6] rounded-full py-2 px-3 md:text-[14px] text-[12px]">#ハラスメント</Link>
            </div>
            <div className="mt-6 md:text-[18px] text-[16px] flex flex-col gap-8">
              <p>
                職場で同僚や上司から「目がぱっちりした？整形したの？」と執拗に尋ねられ、精神的な苦痛を感じるトラブルが増えています。<br />
                <br />
                質問する側は「単なる世間話」「きれいになったと褒めるつもりだった」と悪気がないケースも多いですが、弁護士は「受け手が不快や苦痛を感じれば、ハラスメントに該当する可能性が高い」と指摘します。
              </p>
              <div>
                <p className="font-bold border-b border-[#a89a96] py-3">●どのくらいの罪になるの？</p>
                <p className="py-3">
                  容姿や身体的特徴への過度な言及は、性的な関心に基づく言動として「セクシャルハラスメント」に当たるほか、私生活の干渉として「個の侵害（モラルハラスメント）」と認定されることもあります。<br />
                  <br />
                  特に「整形」は極めてプライベートな事柄であり、本人が否定しているにもかかわらず執拗に聞いたり、周囲に噂を広めたりする行為は、名誉毀損やプライバシー権の侵害として違法性が問われるケースもあります。<br />
                  <br />
                  企業側もこうしたデリカシーのない言動を放置すれば、職場環境配慮義務違反に問われるリスクがあるため、適切な指導が求められます。
                </p>
              </div>
              <p className="md:p-6 p-4 md:text-[14px] text-[12px] text-center bg-[#fbf9f8] text-[#716c6b] rounded-md">この記事は、公開日時点の情報や法律に基づいています。</p>
              <div className="flex flex-wrap gap-2">
                <Link href="#" className="bg-white border border-[#e1dbd6] rounded-full py-2 px-3 md:text-[14px] text-[12px]">#ハラスメント</Link>
              </div>
            </div>
            <div className="mt-12">
              <p className="md:text-[18px] text-[16px] font-bold mb-4">オススメ記事</p>
              <div className="flex flex-col gap-4">
                <Link href="#" className="md:text-[18px] text-[16px] text-[#315dbb]">■「ハプニングバー」店内で客同士の行為も…どうして営業できるの？</Link>
                <Link href="#" className="md:text-[18px] text-[16px] text-[#315dbb]">■そば屋で「つゆ使い回し」入れてもないワサビの味が…店主は開き直り「忙しいとたまにあるんですよ！」</Link>
                <Link href="#" className="md:text-[18px] text-[16px] text-[#315dbb]">■年金なし、貯金なし、後悔なし！　71歳ギャンブラーのがけっぷち人生</Link>
              </div>
            </div>
            <div className="mt-12">
              <p className="md:text-[18px] text-[16px] font-bold mb-4">編集部からのお知らせ</p>
              <p className="md:text-[18px] text-[16px] mb-4">現在、編集部では協力ライターと情報提供を募集しています。詳しくは下記リンクをご確認ください。</p>
              <div className="">
                <Link href="#" className="border-t border-[#e9e5e4] py-6 flex relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#0276AE] after:top-1/2 after:right-4 md:text-[18px] text-[16px] font-bold text-[#315dbb] px-6">
                  協力ライター募集詳細
                </Link>
                <Link href="#" className="border-t border-[#e9e5e4] py-6 flex relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#0276AE] after:top-1/2 after:right-4 md:text-[18px] text-[16px] font-bold text-[#315dbb] px-6">
                  情報提供はこちら
                </Link>
              </div>
            </div>

            <div className="mt-12 pb-10 border-b-[8px] border-[#f0ebe9]">
              <p className="text-center text-[#716c6b] md:text-[16px] text-[14px] mb-4">この記事をシェアする</p>
              <div className="flex justify-center gap-6 mb-[30px]">
                <Link href="#" className="bg-[#00b900] rounded-full flex items-center justify-center size-10">
                  <Image
                    src="/icons/topics-share-line.svg"
                    alt=""
                    width={40}
                    height={40}
                    className=""
                  />
                </Link>
                <Link href="#" className="bg-[#14171a] rounded-full flex items-center justify-center size-10">
                  <Image
                    src="/icons/topics-share-x.svg"
                    alt=""
                    width={15}
                    height={15}
                    className=""
                  />
                </Link>
                <Link href="#" className="bg-[#1877f2] rounded-full flex items-center justify-center size-10">
                  <Image
                    src="/icons/topics-share-facebook.svg"
                    alt=""
                    width={40}
                    height={40}
                    className=""
                  />
                </Link>
                <Link href="#" className="bg-[#00a4de] rounded-full flex items-center justify-center size-10">
                  <Image
                    src="/icons/topics-share-hatena.svg"
                    alt=""
                    width={40}
                    height={40}
                    className=""
                  />
                </Link>
                <Link href="#" className="bg-white border border-[#e9e5e4] rounded-full flex items-center justify-center size-10">
                  <Image
                    src="/icons/topics-share-clip.svg"
                    alt=""
                    width={12}
                    height={12}
                    className=""
                  />
                </Link>
              </div>
              <div className="flex justify-center">
                <Link href="#" className="max-w-[300px] w-full [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] flex items-center justify-center md:text-[14px] text-[12px] border border-[#bbb3af] bg-white py-4 px-3 rounded-full relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#0276AE] after:top-1/2 after:right-4">Googleニュースをフォロー</Link>
              </div>
            </div>
          </div>
          <ArticlesRanks />
        </div>
      </div>
    </div>
  )
}
