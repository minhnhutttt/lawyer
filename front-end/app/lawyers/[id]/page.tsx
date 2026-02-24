'use client'

import ExpandableSection from "@/components/common/ExpandableSection"
import Tags from "@/components/common/Tag"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { ReactNode, useRef, useState } from "react"

/* =========================
   AreasPracticeTab
========================= */
const AreasPracticeTab = ({
  text,
  icon,
  solved,
  children,
  onOpenTab,
}: {
  text: string
  icon: string
  solved?: boolean
  children: ReactNode
  onOpenTab?: () => void
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-[#e5e5e5] md:text-[18px] text-[16px]">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="md:py-[18px] py-4 flex items-center justify-between w-full"
      >
        <span className="font-bold flex items-center gap-2">
          <span className="bg-[#e28d81] size-6 md:size-8 flex items-center justify-center rounded-full">
            <Image src={icon} alt="" width={20} height={20} className="size-4 md:size-5" />
          </span>
          <span>{text}</span>
        </span>

        <span className="flex gap-2 items-center">
          {solved && (
            <span className="px-1.5 py-0.5 border border-[#d9d9d9] text-[10px] rounded font-bold">
              解決事例あり
            </span>
          )}
          <Image
            src="/icons/arrow-down.svg"
            alt=""
            width={13}
            height={13}
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="pb-4">
          {children}
        </div>
      </div>
    </div>
  )
}

const FaqITem = ({ question, children }: { question: string, children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="">
      <button
        onClick={() =>
          setIsOpen(!isOpen)
        }
        className={cn(
          'w-full relative md:text-[18px] text-[16px] font-bold flex items-center p-4 md:p-[18px]',
          'after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:border-[#262221] after:right-4 after:top-1/2 after:-translate-y-1/2',
          isOpen
            ? 'after:rotate-[-45deg]'
            : 'after:rotate-[135deg]'
        )}
      >
        {question}
      </button>
      <div
        className={cn(
          'transition-all duration-300 ease-in-out overflow-hidden',
          isOpen
            ? 'max-h-[1000px] visible opacity-100'
            : 'max-h-0 invisible opacity-0'
        )}
      >
        <div className="md:text-[16px] text-[14px] md:p-[18px] p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

/* =========================
   Page
========================= */
export default function LawyersDetailPage() {
  const [tab, setTab] = useState(0)

  const tabHeaderRef = useRef<HTMLDivElement | null>(null)

  const openTabAndScroll = (tabIndex: number) => {
    setTab(tabIndex)

    requestAnimationFrame(() => {
      tabHeaderRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  return (
    <main className="md:px-5 pb-10">
      <div className="w-full max-w-[1104px] mx-auto">
        <div className="md:py-12">
          <div className="flex max-md:flex-col items-center md:gap-8 relative">
            <div className="flex flex-col order-2 max-md:pb-4 max-md:px-6">
              <div className="relative max-md:order-2 max-md:mt-3">
                <p className="text-[clamp(11px,2vw,14px)]">こうづき ゆうき</p>
                <p className="text-[clamp(18px,4vw,27px)] font-bold">上月 裕紀<span className="text-[clamp(12px,2vw,16px)] ml-3">弁護士</span></p>
                <div className="text-[#72706e] text-[clamp(12px,2vw,16px)]">
                  <p>うららか法律事務所</p>
                  <p>埼玉県さいたま市大宮区高鼻町1-56 ks'氷川の杜401</p>
                </div>
              </div>
              <div className="mt-3 border relative border-[#ededed] md:text-[14px] text-[12px] rounded-md p-3  before:border-l before:border-t before:border-[#ededed] before:h-[8px] before:absolute before:w-[8px] before:bg-white md:before:-left-[4px] before:top-[-5px] md:before:top-1/2 md:before:-rotate-45 before:rotate-45 md:before:-translate-y-1/2 max-md:order-1">
                平日午後６時以降・土日・祝日は「Webで面談予約」からお問い合わせください。
              </div>
            </div>
            <div className="order-1 relative max-md:pb-8">
              <div className="max-md:absolute max-md:bottom-1.5 max-md:pl-6">
                <Image src="/images/lawyers/741830_1.png" alt="" width={150} height={200} className="rounded-lg block max-w-[158px] min-w-[106px] w-[20vw]" />
              </div>
              <div className="md:hidden">
                <Image src="/images/lawyers/default_image2.jpg" alt="" width={1920} height={1440} className="[aspect-ratio:3_/_1] block h-auto min-h-[126px] object-cover w-full" />
              </div>
            </div>
            <button className="absolute px-4 md:px-6 py-2 md:py-3 font-bold top-3 md:top-0 right-3 md:right-0 md:text-[16px] text-[12px] bg-white border-[#d9d9d9] border min-w-[144px] md:min-w-[190px] rounded-full flex justify-center items-center z-10">お気に入りに追加</button>
          </div>
        </div>
        <div className="flex gap-12 max-md:flex-col mb-8">
          <div className="flex-grow">
            <div className="w-full">
              <div ref={tabHeaderRef} className="flex bg-white border-y border-[#d9d9d9] overflow-visible sticky top-0 z-10 max-md:divide-x">
                <button onClick={() => setTab(0)} className={cn("flex-1 font-bold flex flex-col items-center gap-1 md:gap-2.5 text-[10px] md:text-[clamp(12px,2vw,16px)] leading-none relative py-3 md:py-4 after:absolute after:h-1 after:bg-[#f7723e] after:bottom-0 after:inset-x-0 after:w-full", tab === 0 ? 'after:opacity-100 text-[#f7723e]' : 'after:opacity-0')}>
                  <Image src="/images/lawyers/lawyer-ic-01.svg" alt="" width={28} height={28} className="max-md:size-5" />
                  <p>人物紹介</p>
                </button>
                <button onClick={() => setTab(1)} className={cn("flex-1 font-bold flex flex-col items-center gap-1 md:gap-2.5 text-[10px] md:text-[clamp(12px,2vw,16px)] leading-none relative py-3 md:py-4 after:absolute after:h-1 after:bg-[#f7723e] after:bottom-0 after:inset-x-0 after:w-full", tab === 1 ? 'after:opacity-100 text-[#f7723e]' : 'after:opacity-0')}>
                  <Image src="/images/lawyers/lawyer-ic-02.svg" alt="" width={28} height={28} className="max-md:size-5" />
                  <p>注力分野</p>
                </button>
                <button onClick={() => setTab(2)} className={cn("flex-1 font-bold flex flex-col items-center gap-1 md:gap-2.5 text-[10px] md:text-[clamp(12px,2vw,16px)] leading-none relative py-3 md:py-4 after:absolute after:h-1 after:bg-[#f7723e] after:bottom-0 after:inset-x-0 after:w-full", tab === 2 ? 'after:opacity-100 text-[#f7723e]' : 'after:opacity-0')}>
                  <Image src="/images/lawyers/lawyer-ic-03.svg" alt="" width={28} height={28} className="max-md:size-5" />
                  <p>解決事例</p>
                </button>
                <button onClick={() => setTab(3)} className={cn("flex-1 font-bold flex flex-col items-center gap-1 md:gap-2.5 text-[10px] md:text-[clamp(12px,2vw,16px)] leading-none relative py-3 md:py-4 after:absolute after:h-1 after:bg-[#f7723e] after:bottom-0 after:inset-x-0 after:w-full", tab === 3 ? 'after:opacity-100 text-[#f7723e]' : 'after:opacity-0')}>
                  <Image src="/images/lawyers/lawyer-ic-04.svg" alt="" width={28} height={28} className="max-md:size-5" />
                  <p>料金表</p>
                </button>
                <button onClick={() => setTab(4)} className={cn("flex-1 font-bold flex flex-col items-center gap-1 md:gap-2.5 text-[10px] md:text-[clamp(12px,2vw,16px)] leading-none relative py-3 md:py-4 after:absolute after:h-1 after:bg-[#f7723e] after:bottom-0 after:inset-x-0 after:w-full", tab === 4 ? 'after:opacity-100 text-[#f7723e]' : 'after:opacity-0')}>
                  <Image src="/images/lawyers/lawyer-ic-05.svg" alt="" width={28} height={28} className="max-md:size-5" />
                  <p>感謝の声</p>
                </button>
                <button onClick={() => setTab(5)} className={cn("flex-1 font-bold flex flex-col items-center gap-1 md:gap-2.5 text-[10px] md:text-[clamp(12px,2vw,16px)] leading-none relative py-3 md:py-4 after:absolute after:h-1 after:bg-[#f7723e] after:bottom-0 after:inset-x-0 after:w-full", tab === 5 ? 'after:opacity-100 text-[#f7723e]' : 'after:opacity-0')}>
                  <Image src="/images/lawyers/lawyer-ic-06.svg" alt="" width={28} height={28} className="max-md:size-5" />
                  <p>アクセス</p>
                </button>
              </div>

              {/* TAB CONTENT */}
              {tab === 0 && (
                <div className="mt-6 max-xl:px-6">
                  <div>
                    <h2 className="mt-4 md:mt-[18px] text-[18px] md:text-[23px] font-bold">「Webで面談予約」「LINEで面談予約」からのお問い合わせに、迅速に受付をし、面談・電話・Zoomの方法で法律相談に対応します。過去の対応実績は「解決事例」「感謝の声」のページをご覧ください。</h2>
                    <div className="my-6">
                      <Image src="/images/lawyers/741830_5.png" alt="" width={640} height={396} className="" />
                    </div>
                    <div className="md:text-[18px] text-[16px]">
                      <p className="md:text-[20px] text-[18px] font-bold md:mb-[18px] mb-[16px] pl-4 border-l-[6px] border-[#bebdbd]">お問い合わせ方法</p>
                      <p className="md:mb-[18px] mb-[16px]">
                        平日の営業時間内（１０時～１８時）<br />
                        →「電話」「Web」「LINE」で面談予約から。
                      </p>
                      <p className="md:mb-[18px] mb-[16px]">
                        平日の営業時間外（１８時以降）、土日・祝日 <br />
                        →「Web」「LINE」で面談予約から。
                      </p>
                      <ExpandableSection collapsedHeight={80}>
                        <p className="md:text-[20px] text-[18px] font-bold md:mb-[18px] mb-[16px] pl-4 border-l-[6px] border-[#bebdbd] mt-4">弁護士費用</p>
                        <p className="md:mb-[18px] mb-[16px]">
                          初回のご相談は、１時間までは、無料です。 <br />
                          （平日の営業時間内の対応の場合となります。 <br />
                          営業時間外、土日・祝日にご相談を承る場合、 <br />
                          初回のご相談から相談料をお預かりします。） <br />
                          <br />
                          なお、所属事務所では、法テラスを利用した <br />
                          無料相談、委任契約の対応はしておりません。
                        </p>
                        <p className="md:text-[20px] text-[18px] font-bold md:mb-[18px] mb-[16px] pl-4 border-l-[6px] border-[#bebdbd] mt-8">アクセス</p>
                        <p className="md:mb-[18px] mb-[16px]">
                          大宮駅東口から、徒歩５〜６分の事務所です。
                        </p>
                        <p className="md:text-[20px] text-[18px] font-bold md:mb-[18px] mb-[16px] pl-4 border-l-[6px] border-[#bebdbd] mt-8">対応分野</p>
                        <p className="md:mb-[18px] mb-[16px]">
                          ①離婚・男女問題<br />
                          ②労働問題<br />
                          ③刑事事件<br />
                          に特に注力をしておりますが、<br />
                          ④交通事故<br />
                          ⑤遺産分割事件<br />
                          ⑥企業法務<br />
                          のご依頼も多数ございます。
                        </p>
                      </ExpandableSection>
                    </div>
                    <div className="mt-6">
                      <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">上月 裕紀 弁護士の取り扱う分野</h3>
                      <div className="">
                        <AreasPracticeTab icon="/icons/resolve-01.svg" text="離婚・男女問題" solved>
                          <p className="mb-4">
                            「Webで面談予約」「LINEで面談予約」からのお問い合わせに、迅速に受付し、面談・電話・Zoomの方法で法律相談に対応します。特に『女性からの離婚相談』『不貞慰謝料の請求・被請求事件』に専門的な対応をしています。過去の対応実績は、「解決事例」「感謝の声」をご覧ください。
                          </p>
                          <div className="p-4 bg-[#f6f6f6] rounded-md">
                            <p className="flex font-bold">●相談料</p>
                            <p className="">
                              初回１時間までのご相談は、『平日』の『営業時間内（午前１０時～午後６時）』での対応の場合に限り、相談料はお預かりしていません。<br />
                              ①再相談・継続相談に対応する場合、②平日の営業時間外（午後６時以降）に対応をする場合、③土日・祝日に対応をする場合は，３０分ごとに，５５００円（税込）を相談料としてお預かりをしています。<br />
                              詳細な相談料規定は、お問い合わせいただいたときに、メールに添付をしてご案内を差し上げています。
                            </p>
                          </div>
                          <div className="flex justify-center py-4">
                            <button onClick={() => openTabAndScroll(1)} className="flex items-center gap-1 md:text-[16px] text-[14px] font-bold text-[#315dbb]  after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:border-[#f7723e]">続きを見る</button>
                          </div>
                        </AreasPracticeTab>
                        <AreasPracticeTab icon="/icons/resolve-02.svg" text="労働問題" solved>
                          <p className="mb-4">
                            「Webで面談予約」「LINEで面談予約」からのお問い合わせに、迅速に受付し、面談・電話・Zoomの方法で法律相談に対応します。特に『解雇事件』に専門的な対応をしており、労働者、使用者、いずれの対応も可能です。過去の対応実績は、「解決事例」「感謝の声」のページをご覧ください。
                          </p>
                          <div className="p-4 bg-[#f6f6f6] rounded-md">
                            <p className="flex font-bold">●相談料</p>
                            <p className="">
                              初回１時間までのご相談は、『平日』の『営業時間内（午前１０時～午後６時）』での対応の場合に限り、相談料はお預かりしていません。<br />
                              ①再相談・継続相談に対応する場合、②平日の営業時間外（午後６時以降）に対応をする場合、③土日・祝日に対応をする場合は，３０分ごとに，５５００円（税込）を相談料としてお預かりをしています。<br />
                              詳細な相談料規定は、お問い合わせいただいたときに、メールに添付をしてご案内を差し上げています。
                            </p>
                          </div>
                          <div className="flex justify-center py-4">
                            <button onClick={() => openTabAndScroll(2)} className="flex items-center gap-1 md:text-[16px] text-[14px] font-bold text-[#315dbb]  after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:border-[#f7723e]">続きを見る</button>
                          </div>
                        </AreasPracticeTab>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">人物紹介</h3>
                      <div className="md:text-[18px] text-16px mt-6">
                        <div>
                          <p className="mb-3 font-bold">資格</p>
                          <div className="border border-[#ededed] md:text-[16px] text-[14px] divide-y">
                            <p className="flex items-center gap-2 p-4">
                              <span>行政書士</span>
                            </p>
                            <p className="flex items-center gap-2 p-4">
                              <span>国家公務員総合職試験に合格</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="md:text-[18px] text-16px mt-6">
                        <div>
                          <p className="mb-3 font-bold">所属団体・役職</p>
                          <div className="border border-[#ededed] md:text-[16px] text-[14px] divide-y">
                            <p className="flex items-center gap-2 p-4">
                              <span>埼玉弁護士会</span>
                              <span>労働問題対策委員会</span>
                            </p>
                            <p className="flex items-center gap-2 p-4">
                              <span>埼玉弁護士会</span>
                              <span>犯罪被害者支援委員会</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">活動履歴</h3>
                      <div className="md:text-[18px] text-16px mt-6">
                        <div>
                          <p className="mb-3 font-bold">講演・セミナー</p>
                          <ExpandableSection collapsedHeight={80}>
                            <div className="border border-[#ededed] rounded divide-y">
                              <div className="md:text-[16px] text-[14px] p-4 space-y-2">
                                <p className="flex items-center gap-2 font-bold">
                                  看護実習とハラスメント
                                </p>
                                <p className="md:text-[14px] text-[12px]">
                                  目白大学看護学部から依頼を受けて、看護実習におけるハラスメントに関する講義を実施しました。
                                </p>
                                <p className="md:text-[14px] text-[12px] text-[#72706e]">
                                  <span>2024年 3月</span>
                                </p>
                              </div>
                              <div className="md:text-[16px] text-[14px] p-4 space-y-2">
                                <p className="flex items-center gap-2 font-bold">
                                  就活前に知っておきたいワークルール
                                </p>
                                <p className="md:text-[14px] text-[12px]">
                                  尚美学園大学から依頼を受けて、就職をひかえた学生に向けて、労働者の権利について講義を実施しました。
                                </p>
                                <p className="md:text-[14px] text-[12px] text-[#72706e]">
                                  <span>2024年 5月</span>
                                </p>
                              </div>
                            </div>
                          </ExpandableSection>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">上月 裕紀 弁護士の法律相談一覧</h3>
                      <div className="mt-6 flex flex-col gap-4">
                        <Link href="/" className="border border-[#ededed] rounded-lg p-4">
                          <span className="mb-3 block">
                            <span className="flex items-start gap-3">
                              <figure>
                                <Image
                                  src="/images/lawyers/q-male.svg"
                                  alt=""
                                  width={28}
                                  height={28}
                                />
                              </figure>
                              <span className="flex flex-col flex-1">
                                <span className="md:text-[14px] text-[12px] font-bold mb-1"> 養育費の遅延損害金を強制執行で請求できるか教えていただけますか？ </span>
                                <span className="text-[#72706e] md:text-[14px] text-[12px] line-clamp-3">
                                  【相談の背景】<br />
                                  養育費の遅延損害金についての質問です。。<br />
                                  <br />
                                  【質問1】<br />
                                  調停で月払いの養育費を取り決めました。調停では、養育費の支払いが遅れた際の遅延損害金等は取り決めていません。<br />
                                  強制執行を行う場合、遅延損害金は請求できますか？
                                </span>
                              </span>
                            </span>
                          </span>
                          <span className="mb-3 block">
                            <span className="flex items-start gap-3">
                              <figure>
                                <Image
                                  src="/images/lawyers/741830_1.png"
                                  alt=""
                                  width={28}
                                  height={28}
                                  className="overflow-hidden rounded-full size-7 object-cover"
                                />
                              </figure>
                              <span className="flex flex-col flex-1 bg-[#f6f6f6] p-4 rounded-lg relative before:h-[10px] before:-left-[5px] before:absolute before:top-[10px] before:rotate-45 before:w-[10px] before:border-t before:border-l before:border-[#f6f6f6] before:bg-[#f6f6f6]">
                                <span className="text-[#72706e] md:text-[14px] text-[12px] line-clamp-3">
                                  【質問１】について<br />
                                  養育費の支払いは、金銭債務の一種ですので、未払が発生した場合、遅延損害金の請求が可能です。<br />
                                  遅延損害金に関する合意がない場合、法定利率（現在は年３%）に従った遅延損害金が発生します。
                                </span>
                              </span>
                            </span>
                          </span>
                        </Link>
                      </div>
                      <Link href="#" className="flex justify-end relative w-full md:text-[16px] text-[14px] font-bold text-[#315dbb] py-2.5 px-6 after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-3">回答をもっと見る</Link>
                    </div>
                    <div className="mt-6">
                      <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">上月 裕紀 弁護士の解決事例一覧</h3>
                      <div className="mt-6 flex flex-col gap-4">
                        <Link href="/" className="border border-[#ededed] rounded-lg p-6">
                          <span className="flex flex-col gap-2">
                            <span className="flex items-start gap-2">
                              <span className="bg-[#e28d81] size-5 flex items-center justify-center rounded-full">
                                <Image src="/icons/resolve-01.svg" alt="" width={16} height={16} className="size-3" />
                              </span>
                              <span className="md:text-[14px] text-[12px]"> 労働問題 </span>
                            </span>
                            <span className="md:text-[16px] text-[14px] font-bold">会社からの整理解雇に対して、①解雇の撤回、②解雇後の給与支払、③解雇に伴う慰謝料の支払を求めて交渉し、解決金として１５０万円の支払を受けた事例</span>
                          </span>
                        </Link>
                      </div>
                      <Link href="#" className="flex justify-end relative w-full md:text-[16px] text-[14px] font-bold text-[#315dbb] py-2.5 px-6 after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-3">解決事例をもっと見る</Link>
                    </div>
                  </div>
                </div>
              )}

              {tab === 1 && <div className="mt-6 max-xl:px-6">Tab 1 内容</div>}
              {tab === 2 && <div className="mt-6 max-xl:px-6">Tab 2 内容</div>}
              <div className="mt-6">
                <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">上月 裕紀 弁護士へ面談予約</h3>
                <div className="mt-6">
                  <div className="rounded-md bg-[#ecf7f7] py-4 px-6 flex flex-col items-center">
                    <div className="flex justify-center items-center gap-3 mb-1.5">
                      <p className="flex items-center gap-1 md:text-[16px] text-[14px] font-bold before:size-[18px] before:bg-[url(/icons/active.svg)] before:bg-contain before:bg-center before:bg-no-repeat">お急ぎの方はこちらから</p>
                      <p className="md:text-[14px] text-[12px] font-bold text-[#0c6969]">受付時間 10:00 22:00</p>
                    </div>
                    <div className="max-md:hidden flex items-center justify-center gap-2 md:text-[27px] font-bold before:mt-1 before:size-[24px] before:bg-[url(/icons/tel2.svg)] before:bg-contain before:bg-center before:bg-no-repeat">
                      050-5223-3819
                    </div>
                    <Link href={`tel:050-5223-3819`} className="md:hidden flex items-center justify-center bg-[linear-gradient(180deg,_#ff8139,_#fa5e06)] rounded-[6px] text-[#fff] text-[clamp(14px,1vw,18px)] p-4 md:p-[20px] font-bold border border-[#d24e10]">
                      <span className="flex items-center before:size-[17px] gap-2 before:bg-[url(/icons/tel.svg)] before:bg-contain before:bg-center before:bg-no-repeat text-[12px]">電話で問い合わせ</span>
                    </Link>
                  </div>
                </div>
                <div className="mt-6 flex flex-col items-center justify-center gap-5">
                  <p className="md:text-[16px] text-[14px] text-center font-bold">LINEまたはWebフォームなら24時間受付中</p>
                  <div className="">
                    <Link href="#" className="flex items-center justify-center bg-[linear-gradient(180deg,_#1bd667,_#0bb24f)] border border-[#0cb451] rounded-[6px] w-[226px] h-[52px] text-white font-bold text-[12px] hover:bg-[linear-gradient(180deg,_#32ba60,_#14903d)]">
                      LINEで面談予約
                    </Link>
                    <p className="text-[#72706e] md:text-[14px] text-[12px] text-center mt-2">友だち追加でいつでも連絡</p>
                  </div>
                  <div className="flex items-center w-full max-w-[430px] mx-auto gap-3">
                    <span className="h-px flex-1 bg-[#d9d9d9]"></span>
                    <span className="md:text-[16px] text-[14px] font-bold text-[#72706e]">または</span>
                    <span className="h-px flex-1 bg-[#d9d9d9]"></span>
                  </div>
                </div>
                <div className="mt-8 max-xl:px-6">
                  <p className="text-center md:text-[16px] text-[14px] font-bold">Web面談予約</p>
                  <form action="">
                    <div className="mt-4 md:mt-[18px] mb-8 md:mb-9 flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-[#ee6c58] text-white rounded leading-none p-1">必須</span>
                          <span className="md:text-[16px] text-[14px] font-bold">お名前</span>
                        </div>
                        <div>
                          <input type="text" className="px-4 py-3 rounded-md w-full md:text-[18px] text-[16px] border border-[#d9d9d9] bg-[#fafafa] [box-shadow:inset_3px_3px_4px_rgba(0,_0,_0,_.05)]" placeholder="例）見本太郎" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-[#ee6c58] text-white rounded leading-none p-1">必須</span>
                          <span className="md:text-[16px] text-[14px] font-bold">ふりがな（ひらがな）</span>
                        </div>
                        <div>
                          <input type="text" className="px-4 py-3 rounded-md w-full md:text-[18px] text-[16px] border border-[#d9d9d9] bg-[#fafafa] [box-shadow:inset_3px_3px_4px_rgba(0,_0,_0,_.05)]" placeholder="例）みほんたろう" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-[#ee6c58] text-white rounded leading-none p-1">必須</span>
                          <span className="md:text-[16px] text-[14px] font-bold">メールアドレス 折り返し先</span>
                        </div>
                        <div>
                          <input type="text" className="px-4 py-3 rounded-md w-full md:text-[18px] text-[16px] border border-[#d9d9d9] bg-[#fafafa] [box-shadow:inset_3px_3px_4px_rgba(0,_0,_0,_.05)]" placeholder="例）info@bengo4.com" />
                          <p className="text-[#72706e] md:text-[14px] text-[12px] mt-1.5">※ドメイン指定をされている方は解除してください。</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-[#ee6c58] text-white rounded leading-none p-1">必須</span>
                          <span className="md:text-[16px] text-[14px] font-bold">電話番号 折り返し先</span>
                        </div>
                        <div>
                          <input type="text" className="px-4 py-3 rounded-md w-full md:text-[18px] text-[16px] border border-[#d9d9d9] bg-[#fafafa] [box-shadow:inset_3px_3px_4px_rgba(0,_0,_0,_.05)]" placeholder="例）000-0000-0000" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] bg-[#ee6c58] text-white rounded leading-none p-1">必須</span>
                          <span className="md:text-[16px] text-[14px] font-bold">相談内容 (10文字以上)</span>
                        </div>
                        <div>
                          <textarea className="px-4 py-3 rounded-md w-full md:text-[18px] h-25 text-[16px] border border-[#d9d9d9] bg-[#fafafa] [box-shadow:inset_3px_3px_4px_rgba(0,_0,_0,_.05)]"></textarea>
                          <p className="text-[#72706e] md:text-[14px] text-[12px] mt-1.5">※希望する相談内容をご記入ください。その他に面談日、ご連絡可能な時間帯をご記入いただくと、スムーズに連絡が取れます。</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <button className="bg-[linear-gradient(180deg,_#ff8139,_#fa5e06)] flex items-center justify-center md:text-[20px] text-[18px] font-bold rounded-lg border border-[#d24e10] text-white w-full max-w-[384px] min-h-[52px] p-5">
                        入力した内容を確認する
                      </button>
                    </div>
                    <ul className="text-[#72706e] md:text-[16px] text-[14px] md:mt-9 mt-8">
                      <li className="before:content-['・']"> 弁護士への営業・勧誘などのお問い合わせは固くお断りさせて頂いております。</li>
                      <li className="before:content-['・']"> <span className="font-bold">お問い合わせ内容は弁護士にのみ提供されます。</span>サイト上に公開されたり、第三者に提供されることはありません。</li>
                    </ul>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="max-md:fixed max-md:bottom-0 max-md:left-0 max-md:w-full md:flex-[0_0_calc(33.33333%-16px)] z-20 max-lg:hidden max-md:block">
            <div className="md:bg-[#f6f6f6] bg-white md:rounded-[12px] p-3 md:p-8 md:sticky top-[24px] max-md:[box-shadow:4px_-4px_8px_rgba(0,_0,_0,_.2)]">
              <div className="md:hidden flex justify-center absolute -top-3 inset-x-0">
                <div className="bg-[#e0feff] rounded-md px-3 py-1">
                  <div className="flex items-center gap-2">
                    <p className="flex items-center gap-1 md:text-[14px] text-[12px] font-bold before:mt-0.5 before:size-[14px] before:bg-[url(/icons/active.svg)] before:bg-contain before:bg-center before:bg-no-repeat text-[#0c6969]">現在営業中</p>
                    <p className="md:text-[14px] text-[12px] text-[#72706e]">10:00 22:00</p>
                  </div>
                </div>
              </div>
              <p className="md:text-[16px] text-[14px] font-bold mb-4 max-md:hidden">上月 裕紀 弁護士へ面談予約</p>
              <div className="flex items-center  max-md:hidden">
                <div className="relative mr-4 before:size-[20px] before:bg-[#f7723e] before:absolute before:-bottom-1 before:-right-1 before:rounded-full before:bg-[url(/icons/tel.svg)] before:bg-[size:60%] before:bg-center before:bg-no-repeat">
                  <Image src="/images/lawyers/741830_1.png" alt="" width={150} height={200} className="rounded-lg block w-[60px]" />
                </div>
                <div className="">
                  <div className="flex items-center gap-2">
                    <p className="flex items-center gap-1 md:text-[14px] text-[12px] font-bold before:mt-0.5 before:size-[14px] before:bg-[url(/icons/active.svg)] before:bg-contain before:bg-center before:bg-no-repeat text-[#0c6969]">現在営業中</p>
                    <p className="md:text-[14px] text-[12px] text-[#72706e]">10:00 22:00</p>
                  </div>
                  <p className="md:text-[27px] text-[24px] font-bold">050-5223-3819</p>
                </div>
              </div>
              <div className="flex items-center w-full max-w-[244px] mx-auto gap-3 mt-4 max-md:hidden">
                <span className="h-px flex-1 bg-[#d9d9d9]"></span>
                <span className="md:text-[14px] text-[12px] font-bold text-[#72706e]">24時間受付中</span>
                <span className="h-px flex-1 bg-[#d9d9d9]"></span>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-3 gap-3 mt-3 md:mt-6 text-center">
                <Link href="#" className="flex items-center justify-center bg-[linear-gradient(180deg,_#fff,_#fafafa)] rounded-[6px] text-[clamp(14px,1vw,18px)] px-2 py-3 font-bold border border-[#d9d9d9] flex-1 h-[60px] md:min-h-[52px]">
                  <span className="flex items-center max-md:before:hidden before:size-[17px] gap-2 before:bg-[url(/icons/mail.svg)] before:bg-contain before:bg-center before:bg-no-repeat text-[10px] md:text-[12px]"><span><span className="max-md:text-[15px]">Web</span><br className="md:hidden" />で面談予約</span></span>
                </Link>
                <Link href="#" className="flex items-center justify-center bg-[linear-gradient(180deg,_#1bd667,_#0bb24f)] border border-[#0cb451] rounded-[6px] text-white font-bold text-[10px] md:text-[12px] hover:bg-[linear-gradient(180deg,_#32ba60,_#14903d)] flex-1 h-[60px] md:min-h-[52px]">
                  <span><span><span className="max-md:text-[15px]">LINE</span><br className="md:hidden" />で面談予約</span></span>
                </Link>
                <Link href="#" className="flex items-center justify-center max-md:flex-col max-md:gap-1 bg-[#f7723e] rounded-[6px] text-white font-bold text-[10px] md:text-[12px] hover:bg-[linear-gradient(180deg,_#32ba60,_#14903d)] flex-1 before:size-[17px] gap-2 before:bg-[url(/icons/tel.svg)] before:bg-contain before:bg-center before:bg-no-repeat md:hidden h-[60px] md:min-h-[52px]">
                  面談予約
                </Link>
              </div>
              <div className="pt-4 pb-6 max-md:hidden">
                <form action="">
                  <div className="flex justify-center">
                    <button className="flex items-center justify-center gap-1 md:text-[14px] text-[12px] text-[#315dbb] font-bold after:size-[14px] after:bg-[url(/icons/link.svg)] after:bg-contain after:bg-center after:bg-no-repeat">スムーズなお問い合わせのポイント</button>
                  </div>
                </form>
              </div>
              <div className="max-md:hidden">
              <div className="py-6 border-t border-[#d9d9d9]">
                <p className="md:text-[16px] text-[14px] font-bold mb-2">お問い合わせ前にご確認ください</p>
                <p className="md:text-[16px] text-[14px]">
                  ※平日の事務所営業時間外（１８時～２２時）・土日・祝日にお問い合わせいただく場合には、お電話ではなくて、「Webで面談予約」「LINEで面談予約」からお問い合わせください。事務所営業時間外のお電話による問い合わせには折り返しのご連絡を差し上げておりませんのでご承知おきください。
                </p>
              </div>
              <div className="py-6 border-t border-[#d9d9d9] flex">
                <p className="md:text-[16px] text-[14px] font-bold flex-[0_0_96px]">受付時間</p>
                <p className="md:text-[16px] text-[14px]">
                  平日 10:00 - 22:00 <br />
                  土日祝 10:00 - 22:00
                </p>
              </div>
              <div className="py-6 border-t border-[#d9d9d9] flex">
                <p className="md:text-[16px] text-[14px] font-bold flex-[0_0_96px]">定休日</p>
                <p className="md:text-[16px] text-[14px]">
                  なし
                </p>
              </div>
              <div className="py-6 border-t border-[#d9d9d9] flex">
                <p className="md:text-[16px] text-[14px] font-bold flex-[0_0_96px]">交通アクセス</p>
                <p className="md:text-[16px] text-[14px]">
                  駐車場近く
                </p>
              </div>
              <div className="py-6 border-t border-[#d9d9d9] flex">
                <p className="md:text-[16px] text-[14px] font-bold flex-[0_0_96px]">設備</p>
                <p className="md:text-[16px] text-[14px]">
                  完全個室で相談
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center py-8 border-t border-[#ededed] text-center gap-3 max-xl:px-6">
          <Image
            src="/images/logo.png"
            alt=""
            width={360}
            height={60}
            className="md:w-[240px] w-[192px]"
            priority
          />
          <p className="md:text-[18px] text-[16px]">
            弁護士と<span className="font-bold">オンライン相談</span>を予定されている方は <br />
            こちらからご入室ください。
          </p>
          <Link href="#" className="w-full flex justify-center items-center max-w-[384px] mx-auto p-4 md:p-5 rounded-md md:text-[19px] bg-[linear-gradient(180deg,_#fff,_#fafafa)] border border-[#d9d9d9] text-[clamp(15px,1vw,20px)] font-bold hover:bg-[linear-gradient(180deg,_#faf9f9,_#f5f5f5)] duration-200">
            「入室コード」を入力する
          </Link>
          <p className="text-[#72706e] md:text-[14px] text-[12px]">
            相談をご希望の方は、まず電話・メールで <br />
            弁護士にお申し込みください。
          </p>
        </div>
        <div className="flex flex-col items-center py-8 border-t border-[#ededed] text-center gap-3 max-xl:px-6">
          <p className="md:text-[18px] text-[16px]">
            お気に入りに保存すれば一覧からいつでもプロフィールを見直せます。
          </p>
          <Link href="#" className="w-full flex justify-center items-center max-w-[384px] mx-auto p-4 md:p-5 rounded-md md:text-[19px] bg-[linear-gradient(180deg,_#fff,_#fafafa)] border border-[#d9d9d9] text-[clamp(15px,1vw,20px)] font-bold hover:bg-[linear-gradient(180deg,_#faf9f9,_#f5f5f5)] duration-200">
            お気に入りに追加
          </Link>
          <p className="md:text-[18px] text-[16px] font-bold pt-6">
            <span className="md:text-[14px] text-[12px]">上月 裕紀 弁護士にお世話になった方</span> <br />
            <span className="">「感謝の声」をおくりませんか？</span>
          </p>
          <Link href="#" className="w-full flex justify-center items-center max-w-[384px] mx-auto p-4 md:p-5 rounded-md md:text-[19px] bg-[linear-gradient(180deg,_#fff,_#fafafa)] border border-[#d9d9d9] text-[clamp(15px,1vw,20px)] font-bold hover:bg-[linear-gradient(180deg,_#faf9f9,_#f5f5f5)] duration-200">
            「感謝の声」をおくる
          </Link>
          <p className="text-[#72706e] md:text-[14px] text-[12px]">
            Amazon ギフト券最大500円分プレゼント!
          </p>
        </div>
        <div className="mb-6">
          <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec] mb-6">よくある質問</h3>
          <div className="bg-[#f6f6f6] rounded-[6px] divide-y">
            <FaqITem question="上月 裕紀 弁護士の受付時間・定休日は？">
              <div className="">
                上月 裕紀 弁護士の受付時間・定休日は、<br />
                【受付時間】<br />
                平日<br />
                10:00 - 22:00<br />
                土日祝<br />
                10:00 - 22:00<br />
                <br />
                【定休日】<br />
                なし<br />
                <br />
                【備考】<br />
                ※平日の事務所営業時間外（１８時～２２時）・土日・祝日にお問い合わせいただく場合には、お電話ではなくて、「Webで面談予約」「LINEで面談予約」からお問い合わせください。事務所営業時間外のお電話による問い合わせには折り返しのご連絡を差し上げておりませんのでご承知おきください。<br /><br />
                <Link href="/" className="text-[#315dbb]">上月 裕紀 弁護士の情報を見る</Link>
              </div>
            </FaqITem>
            <FaqITem question="上月 裕紀 弁護士の受付時間・定休日は？">
              <div className="">
                上月 裕紀 弁護士の受付時間・定休日は、<br />
                【受付時間】<br />
                平日<br />
                10:00 - 22:00<br />
                土日祝<br />
                10:00 - 22:00<br />
                <br />
                【定休日】<br />
                なし<br />
                <br />
                【備考】<br />
                ※平日の事務所営業時間外（１８時～２２時）・土日・祝日にお問い合わせいただく場合には、お電話ではなくて、「Webで面談予約」「LINEで面談予約」からお問い合わせください。事務所営業時間外のお電話による問い合わせには折り返しのご連絡を差し上げておりませんのでご承知おきください。<br /><br />
                <Link href="/" className="text-[#315dbb]">上月 裕紀 弁護士の情報を見る</Link>
              </div>
            </FaqITem>
            <FaqITem question="上月 裕紀 弁護士の受付時間・定休日は？">
              <div className="">
                上月 裕紀 弁護士の受付時間・定休日は、<br />
                【受付時間】<br />
                平日<br />
                10:00 - 22:00<br />
                土日祝<br />
                10:00 - 22:00<br />
                <br />
                【定休日】<br />
                なし<br />
                <br />
                【備考】<br />
                ※平日の事務所営業時間外（１８時～２２時）・土日・祝日にお問い合わせいただく場合には、お電話ではなくて、「Webで面談予約」「LINEで面談予約」からお問い合わせください。事務所営業時間外のお電話による問い合わせには折り返しのご連絡を差し上げておりませんのでご承知おきください。<br /><br />
                <Link href="/" className="text-[#315dbb]">上月 裕紀 弁護士の情報を見る</Link>
              </div>
            </FaqITem>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec] mb-6">弁護士を探す</h3>
          <div className="flex flex-col gap-6 max-xl:px-6">
            <div>
              <Tags title="弁護士の多い地域で探す" tags={[
                { text: "千代田区", href: "#" },
                { text: "中央区", href: "#" },
                { text: "港区", href: "#" }
              ]} />
            </div>
            <div>
              <Tags title="同じ条件で近隣の弁護士を探す" tags={[
                { text: "大宮", href: "#" },
                { text: "北大宮", href: "#" },
                { text: "大宮区", href: "#" },
                { text: "さいたま市", href: "#" },
                { text: "埼玉県", href: "#" },
              ]} />
            </div>
            <div>
              <Tags title="同じ地域で分野を変えて探す" tags={[
                { text: "借金・債務整理", href: "#" },
                { text: "交通事故", href: "#" },
                { text: "離婚・男女問題", href: "#" },
                { text: "遺産相続", href: "#" },
                { text: "労働問題", href: "#" },
                { text: "債権回収", href: "#" },
              ]} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
