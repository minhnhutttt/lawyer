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
            <p className="md:text-[12px] text-[10px] max-md:mx-6 text-[#a89a96] mb-4">羽賀研二氏（YouTubeチャンネルより）</p>
            <h2 className="md:text-[27px] text-[20px] font-bold md:mb-8 mb-6">羽賀研二氏が不同意わいせつ容疑で逮捕　起訴されたら、実刑になる可能性は？　過去2度の有罪判決</h2>
            <p className="md:text-[12px] text-[10px] max-md:mx-6 text-[#a89a96] mb-4">2026年02月10日 12時27分</p>
            <div className="flex flex-wrap gap-2">
              <Link href="#" className="bg-white border border-[#e1dbd6] rounded-full py-2 px-3 md:text-[14px] text-[12px]">#羽賀研二</Link>
              <Link href="#" className="bg-white border border-[#e1dbd6] rounded-full py-2 px-3 md:text-[14px] text-[12px]">#羽賀研二</Link>
            </div>
            <div className="mt-6 md:text-[18px] text-[16px] flex flex-col gap-8">
              <p>
                タレントの羽賀研二氏が2月9日、沖縄県内の飲食店で女性2人にわいせつな行為をしたとして、不同意わいせつの疑いで沖縄県警に逮捕されたと報じられています。<br />
                <br />
                RBC琉球放送の報道によると、事件は昨年3月に発生。30代と50代の女性が被害を相談したことで発覚したといいます。<br />
                <br />
                羽賀氏は過去、未公開株詐欺事件と、その賠償を免れようとした資産隠匿事件の2度、実刑判決を受けています。なお2024年9月、強制執行妨害目的財産損壊等の疑いなどで逮捕されていますが、この件は不起訴となりました。<br />
                <br />
                今回の不同意わいせつとはどのような罪なのか。また過去に刑事事件で有罪判決を受けたことは、今回の事件で起訴されて有罪となった場合、量刑にどのような影響があるのでしょうか。
              </p>
              <div>
                <p className="font-bold border-b border-[#a89a96] py-3">●不同意わいせつ罪って、どんな罪？ 刑はどのくらい？</p>
                <p className="py-3">
                  まず、くれぐれも注意すべきなのは、今回の報道は、あくまでまだ「逮捕」という段階にすぎず、本当にそんなことをしたのかどうかは、今後の捜査や、仮に起訴された場合にはこれからの裁判で明らかになるということです。<br />
                  <br />
                  ここでは「仮にもし起訴されて有罪になったら、その後どうなるか」を、できるだけかみ砕いて解説します。<br />
                  <br />
                  不同意わいせつ罪は、暴行や脅迫だけでなく、心身の障害やお酒・薬の影響、眠っているときなど、嫌だと言うことができないような状態に乗じてわいせつな行為をしたときに成立します（刑法176条）。暴行・脅迫を使う場合に限られません。<br />
                  <br />
                  刑は、6カ月以上10年以下の拘禁刑です（刑法176条）。幅が広いので、実際にどのくらいの刑になるかは、どんなやり方だったか、被害者が何人か、前科があるかなど、いろいろな事情を踏まえて決まります。
                </p>
              </div>
              <div>
                <p className="font-bold border-b border-[#a89a96] py-3">●実刑になる可能性は？</p>
                <p className="py-3">
                  まず結論ですが、有罪になった場合、実刑（刑務所にそのまま行く刑で、執行猶予がつかない）になってしまいます。<br />
                  <br />
                  刑法では、拘禁刑を受けた人が、その刑の執行が終わってから（または執行免除から）5年以内に、また罪を犯して有期拘禁刑を言い渡される場合を「再犯」として、刑を重くするルールがあります（56条・57条）。<br />
                  <br />
                  報道によると、今回の容疑は2025年3月27日の犯行とのことです。これは強制執行妨害の刑（懲役1年2カ月）の「執行終了から5年以内」に入るため、再犯加重がつき、その罪の「長期の2倍」まで刑が重くなり得ます（刑法57条）。<br />
                  <br />
                  そして、再犯にあたる場合、執行猶予をつけられません（刑法25条1項2号）。
                </p>
              </div>
              <div>
                <p className="font-bold border-b border-[#a89a96] py-3">●実刑を免れるには？</p>
                <p className="py-3">
                  実刑回避のために考えられるのは、被害者との示談です。示談で被害者の気持ちが和らげば、起訴されない可能性があります。<br />
                  <br />
                  ただし、不同意わいせつ罪は親告罪（「しんこくざい」。告訴がないと起訴できない罪）ではありません。親告罪なら、告訴を取り下げれば起訴されなくなる場合もありますが、不同意わいせつにはそうした規定はないのです。<br />
                  <br />
                  したがって、示談をしても起訴されないとは限らず、起訴されて有罪判決となる場合には執行猶予がつけられません。<br />
                  <br />
                  もちろん、示談があること自体は、実刑となるにしても刑を軽くする事情にはなります。
                </p>
              </div>
              <div>
                <p className="font-bold border-b border-[#a89a96] py-3">●まとめ</p>
                <p className="py-3">
                  最初にも書きましたが、あくまでも現段階では逮捕されたということであり、本当にそのような行為があったと確定したわけではありません。<br />
                  <br />
                  詳しいことは、これからの捜査と裁判で明らかになります。<br />
                  <br />
                  もし起訴されて有罪になった場合には、実刑になってしまうと考えられます。示談は不起訴も含めて実刑を避けるうえで一つの要素にはなりますが、親告罪ではないため示談をしても起訴される可能性はあります。<br />
                  <br />
                  監修：小倉匡洋（弁護士ドットコムニュース編集部記者・弁護士）<br />
                  <br />
                  ※2月10日12時40分修正<br />
                  <br />
                  当初執行猶予の可能性を検討していましたが、再犯の場合制度上執行猶予がつけられないため、表現を修正しました。<br />
                  <br />
                  ※2月10日13時05分修正<br />
                  <br />
                  一部表現をより分かりやすく修正しました。
                </p>
              </div>
              <p className="md:p-6 p-4 md:text-[14px] text-[12px] text-center bg-[#fbf9f8] text-[#716c6b] rounded-md">この記事は、公開日時点の情報や法律に基づいています。</p>
              <div className="flex flex-wrap gap-2">
                <Link href="#" className="bg-white border border-[#e1dbd6] rounded-full py-2 px-3 md:text-[14px] text-[12px]">#羽賀研二</Link>
                <Link href="#" className="bg-white border border-[#e1dbd6] rounded-full py-2 px-3 md:text-[14px] text-[12px]">#羽賀研二</Link>
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
                <Link href="#" className="border-t border-[#e9e5e4] py-6 flex relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4 md:text-[18px] text-[16px] font-bold text-[#315dbb] px-6">
                  協力ライター募集詳細
                </Link>
                <Link href="#" className="border-t border-[#e9e5e4] py-6 flex relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4 md:text-[18px] text-[16px] font-bold text-[#315dbb] px-6">
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
                <Link href="#" className="max-w-[300px] w-full [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] flex items-center justify-center md:text-[14px] text-[12px] border border-[#bbb3af] bg-white py-4 px-3 rounded-full relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4">Googleニュースをフォロー</Link>
              </div>
            </div>
          </div>
          <ArticlesRanks />
        </div>
      </div>
    </div>
  )
}
