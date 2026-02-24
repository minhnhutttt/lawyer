'use client';

import Tags from "@/components/common/Tag";
import Link from "next/dist/client/link";
import Image from "next/image";
import { QuestionsArticleType } from "../components/QuestionsArticles";
import { t } from "i18next";
import { QuestionSearch } from "../components/QuestionSearch";
import { QuestionAbout } from "../components/QuestionAbout";
import PickupLawyers from "@/components/search/PickupLawyers";
import SearchPrefecture from "@/components/search/SearchPrefecture";

const QuestionPost = ({ images, link, title, desc, count, avatar, time }: QuestionsArticleType) => {
  return (
    <div className="border-t border-[#e9e5e4] py-6">
      <Link href={link} className="flex gap-4">
        <span className="w-9">
          {avatar && <Image src={avatar} alt="" width={36} height={36} className="rounded-full size-[36px] object-cover" />}
        </span>
        <span className="flex-1 flex flex-col gap-2">
          <h4 className="text-[#315dbb] md:text-[18px] text-[16px] font-bold">{title}</h4>
          <span className="md:text-[16px] text-[14px] text-[#716c6b]">{desc}</span>
          <span className="flex justify-between py-2">
            <span className="flex items-center gap-3">
              <span className="flex ml-1.5">
                {images.map((image, i) => (
                  <Image src={image} alt="" width={18} height={18} className="md:size-[18px] size-5 rounded-full -ml-1.5" />
                ))}
              </span>
              <span className="space-x-1">
                <span className="md:text-[13px] text-[11px]">弁護士回答</span>
                <span className="md:text-[16px] text-[14px] font-bold">{count}</span>
              </span>
            </span>
            <span className="md:text-[12px] text-[11px] text-[#716c6b]">{time}</span>
          </span>
        </span>
      </Link>
    </div>
  )
}

export default function QuestionDetailPage() {

  return (
    <div className="w-full max-md:px-6">
      <div className="w-full max-w-[1104px] mx-auto">
        <div className="flex flex-start flex-wrap max-md:flex-col">
          <div className="md:mt-10 md:[flex-basis:66.6666666667%] md:max-w-[66.6666666667%] flex-col flex mb-[56px] md:px-6">
            <div className="border-b border-[#f0ebe9] pb-[56px] mb-[56px]">
              <div className="mb-6">
                <ul className="flex md:text-[13px] text-[11px] text-[#315dbb]">
                  <li className="">
                    <Link href="/questions">法律相談トップ</Link>
                  </li>
                  <li className="before:inline-block before:h-[8px] before:ml-[4px] before:mr-[10px] before:-translate-y-[20%] before:rotate-45 before:w-[8px] before:border-t before:border-r before:border-[#bbb3af]">
                    <Link href="#">離婚・男女問題</Link>
                  </li>
                </ul>
              </div>
              <div className="">
                <h1 className="md:text-[27px] text-[20px] font-bold mb-6">出会い喫茶で知り合った男性と会って泊まりたいと言われ不快、彼の素性を知りたい</h1>
                <div className="flex mb-6 flex items-center md:text-[13px] text-[11px] text-[#bbb3af] gap-3">
                  <span>公開日： 2025年07月23日</span>
                  <span>相談日：2025年07月08日</span>
                </div>
                <div className="flex mb-6">
                  <span className="flex items-center gap-4">
                    <Image src="/images/1601175_1.png" alt="" width={18} height={18} className="rounded-full size-[18px] object-cover" />
                    <span className="flex">
                      <span className="md:text-[13px] text-[11px]">
                        <span className="md:text-[16px] text-[14px] font-bold">1</span>
                        弁護士
                      </span>
                      <span className="md:text-[13px] text-[11px] before:content-['/'] before:text-[#bbb3af] before:px-1.5">
                        <span className="md:text-[16px] text-[14px] font-bold">55</span>
                        回答
                      </span>
                    </span>
                  </span>
                </div>
                <div>
                  <p className="md:text-[18px] text-[16px] leading-[1.8] mb-6">
                    【相談の背景】<br />
                    私は出会い喫茶で男性とお茶カラオケ食事に付き合い3000円をいただいています。ある日知り合った男性がお金を払うならパスと言うからお金なしでお茶で出ようと言って出ました。彼は「あそこにいる女の子はギャルばっかりで、君は違うよと言うのです。お金払うなんて変じゃん。」と言っていました。いろいろとおしゃべりをして連絡先を交換しました。彼はともで登録しといてと言ってきました。私は彼のことがとても気に入ったので、本名や職場などを知りたいのですが、彼の様子を見ていると言いたくなさそうです。やはり出会い喫茶に来るような女には、素性を明かしたくないのでしょうか。私は遠方から来ていてホテルを取っていたのですが、お茶の後晩御飯を食べた後で一緒に泊まりたいと言われたのでお断りしました。彼はお金を払うのは変態だと言いますが、ただの体目当てだったのでしょうか？<br />
                    <br />
                    【質問1】<br />
                    私が彼に名前など素性をしつこく聞いたら法的な問題になるでしょうか？
                  </p>
                  <div className="flex justify-end gap-3">
                    <span className="md:text-[12px] text-[11px]">
                      1448546さんの相談
                    </span>
                    <Image src="/images/1601175_1.png" alt="" width={18} height={18} className="rounded-full size-[18px] object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-12">
              <p className="md:text-[18px] text-[16px] font-bold mb-6">回答タイムライン</p>
              <div className="border border-[#e9e5e4] rounded-lg">
                <div className="md:p-12 p-6 ">
                  <div className="flex gap-1.5 text-[#716c6b] mb-6">
                    <span>弁護士ランキング</span>
                    <span className="font-bold">埼玉県1位</span>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <figure>
                      <Image src="/images/1601175_1.png" alt="" width={150} height={200} className="w-[70px] rounded-lg" />
                    </figure>
                    <div className="text-[#315dbb]">
                      <Link href="#" className="md:text-[20px] text-[18px] font-bold">岡村 茂樹 <span className="md:text-[16px] taext-[14px] ml-2">弁護士</span></Link>
                      <ul className="flex items-center flex-wrap md:text-[12px] text-[11px] before:size-[14px] before:bg-[url(/icons/location-line.svg)] before:bg-contain before:mr-1 before:bg-contain before:bg-no-repeat">
                        <li><Link href="#">埼玉</Link></li>
                        <li className="before:inline-block before:h-[8px] before:ml-[4px] before:mr-[10px] before:-translate-y-[20%] before:rotate-45 before:w-[8px] before:border-t before:border-r before:border-[#bbb3af]"><Link href="#">さいたま市</Link></li>
                        <li className="before:inline-block before:h-[8px] before:ml-[4px] before:mr-[10px] before:-translate-y-[20%] before:rotate-45 before:w-[8px] before:border-t before:border-r before:border-[#bbb3af]"><Link href="#">浦和区</Link></li>
                        <li className="before:inline-block before:h-[8px] before:ml-[4px] before:mr-[10px] before:-translate-y-[20%] before:rotate-45 before:w-[8px] before:border-t before:border-r before:border-[#bbb3af]"><Link href="#">離婚・男女問題</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="">
                    <div className="relative mb-6">
                      <p className="md:text-[18px] text-[16px] line-clamp-6 [filter:blur(3px)_opacity(60%)]">
                        みんなの法律相談には、100万件以上の様々な分野の相談と、現役の弁護士の回答が投稿されています。ご自身だけでは対処することがむずかしい法律分野のトラブルについて、具体的な対応方法や知識などを知ることができます。悩んでいるのはあなただけではありません。専門家の回答でいますぐ問題解決へ。
                      </p>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Link href="/" className="relative flex items-center justify-center border border-[#f36623] font-bold [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] rounded-full w-full text-white max-w-[400px] mx-auto py-4 md:py-4 px-5 md:px-8 bg-[#f36623] md:text-[18px] text-[16px] after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-white after:top-1/2 after:right-4">閲覧履歴をもっと見る
                        </Link>
                      </div>
                    </div>
                    <div className="text-right text-[#bbb3af] md:text-[12px] text-[11px]">
                      2025年07月08日 08時10分
                    </div>
                  </div>
                </div>
                <div className="flex justify-center border-t border-[#e9e5e4]">
                  <Link href="#" className="flex justify-center items-center gap-2 relative w-full md:text-[16px] text-[14px] font-bold text-[#315dbb] px-6 after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:border-[#f7723e] py-6">岡村 茂樹 弁護士のプロフィールを見る</Link>
                </div>
              </div>
              <div className="border border-[#ededed] bg-[#fbf9f8] md:p-5 p-4 rounded-md md:text-[14px] text-[12px] text-[#716c6b]">
                この投稿は、2025年07月時点の情報です。<br />
                ご自身の責任のもと適法性・有用性を考慮してご利用いただくようお願いいたします。
              </div>
            </div>
            <div className="">
              <p className="md:text-[18px] text-[16px] font-bold mb-6">回答タイムライン</p>
              <div className="border-b border-[#e9e5e4]">
                <QuestionPost avatar="/images/1601175_1.png" images={['/images/1601175_1.png', '/images/1601175_1.png']} link="#" title="恋愛感情がある素性がわかっている男性から受け取る行為" desc="【相談の背景】私は友達に誘われて、友達と一緒に出会い喫茶に何回か行っています。私は今までお茶やカラオケに男性と一緒に行って、交通費として3000円を受け取ったこともありますが、食事代を相手に払ってもらうだけでお金をもらっていないこともありました。以前知り合った男性と3回食事で会いました。この男性は体の関係を持つときは女性に２万渡していると言うのです" count="2" time=" 2024年07月02日" />
                <QuestionPost avatar="/images/1601175_1.png" images={['/images/1601175_1.png', '/images/1601175_1.png']} link="#" title="恋愛感情がある素性がわかっている男性から受け取る行為" desc="【相談の背景】私は友達に誘われて、友達と一緒に出会い喫茶に何回か行っています。私は今までお茶やカラオケに男性と一緒に行って、交通費として3000円を受け取ったこともありますが、食事代を相手に払ってもらうだけでお金をもらっていないこともありました。以前知り合った男性と3回食事で会いました。この男性は体の関係を持つときは女性に２万渡していると言うのです" count="2" time=" 2024年07月02日" />
                <QuestionPost avatar="/images/1601175_1.png" images={['/images/1601175_1.png', '/images/1601175_1.png']} link="#" title="恋愛感情がある素性がわかっている男性から受け取る行為" desc="【相談の背景】私は友達に誘われて、友達と一緒に出会い喫茶に何回か行っています。私は今までお茶やカラオケに男性と一緒に行って、交通費として3000円を受け取ったこともありますが、食事代を相手に払ってもらうだけでお金をもらっていないこともありました。以前知り合った男性と3回食事で会いました。この男性は体の関係を持つときは女性に２万渡していると言うのです" count="2" time=" 2024年07月02日" />
              </div>
            </div>
            <div className="flex justify-center my-[56px]">
              <Link href="/" className="relative flex items-center justify-center gap-2 border border-[#bbb3af] font-bold [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] rounded-full w-full max-w-[400px] mx-auto py-4 md:py-4 px-5 md:px-8 bg-white md:text-[18px] text-[16px]">
                新しく相談をする <span className="text-[#f7723e] md:text-[14px] text-[12px]">無料</span>
              </Link>
            </div>
            <div className="flex justify-between gap-5">
              <Link href="#" className="flex justify-start relative w-full md:text-[18px] text-[16px] font-bold text-[#315dbb] py-2.5 px-6 before:absolute before:border-t-[2px] before:border-r-[2px] before:h-2 before:w-2 before:-rotate-[135deg] before:-translate-y-1/2 before:border-[#f7723e] before:top-1/2 before:left-3">子どもの車内置き去りについて</Link>
              <Link href="#" className="flex justify-end relative w-full md:text-[18px] text-[16px] font-bold text-[#315dbb] py-2.5 px-6 after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-3">水虫の薬をあげた件の告訴リスク</Link>
            </div>
            <div className="flex justify-center my-[56px]">
              <Link href="/" className="relative flex items-center justify-center gap-2 border border-[#bbb3af] font-bold [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] rounded-full w-full max-w-[400px] mx-auto py-4 md:py-4 px-5 md:px-8 bg-white md:text-[18px] text-[16px] before:absolute before:border-t-[2px] before:border-r-[2px] before:h-2 before:w-2 before:-rotate-[135deg] before:-translate-y-1/2 before:border-[#f7723e] before:top-1/2 before:left-5">
                法律相談トップへ
              </Link>
            </div>
            <div className="my-[56px]">
              <Tags title="もっとお悩みに近い相談を探す" tags={[
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
              <QuestionSearch />
              <QuestionAbout />
              <PickupLawyers />
              <SearchPrefecture />
          </div>
          <div className="md:[flex-basis:33.3333333333%] md:mt-10 md:max-w-[33.3333333333%] px-3 md:px-6 space-y-6 max-md:hidden">
            <Tags title="もっとお悩みに近い相談を探す" tags={[
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
      <div className="mx-auto max-w-7xl px-6 py-12 flex justify-center">

      </div>
    </div>
  );
}