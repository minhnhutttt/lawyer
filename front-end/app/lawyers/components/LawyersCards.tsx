import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

/* =======================
   TYPES
======================= */
type Area = {
  focusAreas: string
  text: string
  tags: string[]
}

type Lawyer = {
  location: {
    prefecture: string
    autonomy: { text: string; link: string }
    station: string
    foot: string
  }
  profile: {
    link: string
    image: string
    name: string
    title: string
    lawFirm: string
    records: string
  }
  actions: {
    time: string
    contact: { mail: string; tel: string }
  }
  areas: Area[],
  content: string
}

export const AREA_ICON_MAP = {
  '借金・債務整理': '/icons/area-01.svg',
  '交通事故': '/icons/area-02.svg',
} as const

export type FocusAreaKey = keyof typeof AREA_ICON_MAP

export function getAreaIcon(focusArea: string): string {
  return (
    AREA_ICON_MAP[focusArea as FocusAreaKey] ??
    '/icons/area-01.svg'
  )
}

/* =======================
   CARD COMPONENT
======================= */
function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const slidesRef = useRef<HTMLDivElement>(null)

  const scrollToIndex = (index: number) => {
    const el = slidesRef.current
    if (!el) return

    const slideWidth = el.clientWidth

    el.scrollTo({
      left: slideWidth * index,
      behavior: "smooth",
    })

    setActiveIndex(index)
  }

  return (
    <div
      className="
        py-6 flex flex-col gap-4 w-full overflow-hidden
        md:rounded-lg
        md:[box-shadow:0_0_4px_0_rgba(38,_34,_33,_.12)]
        [box-shadow:0_0_8px_0_rgba(38,_34,_33,_.32)]
      "
    >
      {/* LOCATION */}
      <p className="flex gap-3 px-6 md:px-8 items-center md:text-[14px] text-[12px] font-bold">
        <span className="flex">
          <span className="text-[#72706e] flex items-center before:size-[13.5px] before:bg-[url(/icons/location.svg)] before:bg-contain before:bg-center before:bg-no-repeat">
            {lawyer.location.prefecture}
          </span>
          <span className="flex items-center before:size-[13.5px] before:bg-[url(/icons/arrow-right.svg)] before:bg-contain before:bg-center before:bg-no-repeat">
            <Link href={lawyer.location.autonomy.link} className="text-[#315dbb]">
              {lawyer.location.autonomy.text}
            </Link>
          </span>
        </span>
        <span className="flex gap-1.5">
          <span>{lawyer.location.station}</span>
          <span className="text-[#72706e] font-normal">{lawyer.location.foot}</span>
        </span>
      </p>

      {/* PROFILE */}
      <div className="flex px-6 md:px-8 gap-4">
        <Image
          src={lawyer.profile.image}
          alt=""
          width={150}
          height={200}
          className="w-[75px] md:w-[104px] rounded-lg"
        />
        <div>
          <Link
            href={lawyer.profile.link}
            className="md:text-[22px] text-[20px] font-bold space-x-2"
          >
            <span>{lawyer.profile.name}</span>
            <span className="md:text-[16px] text-[14px]">
              {lawyer.profile.title}
            </span>
          </Link>
          <p className="text-[#72706e] md:text-[14px] text-[12px] mt-1 mb-3">
            {lawyer.profile.lawFirm}
          </p>
          <p className="text-[#72706e] md:text-[14px] text-[12px] flex items-center gap-1 font-bold before:size-[13.5px] before:bg-[url(/icons/records.svg)] before:bg-contain before:bg-center before:bg-no-repeat">解決事例 {lawyer.profile.records}</p>
        </div>
      </div>

      <div className="px-6 md:px-8"> <div className="p-4 bg-[#ecf7f7] flex flex-col items-center gap-3">
        <div className="flex items-center justify-center md:text-[14px] text-[12px] gap-2">
          <p className="flex items-center text-[#0c6969] font-bold gap-1.5 before:size-[14px] before:bg-[url(/icons/active.svg)] before:bg-contain before:bg-center before:bg-no-repeat">現在営業中</p> <p className="text-[#72706e]">{lawyer.actions.time}</p>
        </div> <div className="flex flex-col gap-3 w-full max-w-[432px] mx-auto">
          <Link href={`tel:${lawyer.actions.contact.tel}`} className="md:hidden flex items-center justify-center bg-[linear-gradient(180deg,_#ff8139,_#fa5e06)] rounded-[6px] text-[#fff] text-[clamp(14px,1vw,18px)] p-4 md:p-[20px] font-bold border border-[#d24e10]">
            <span className="flex items-center before:size-[17px] gap-2 before:bg-[url(/icons/tel.svg)] before:bg-contain before:bg-center before:bg-no-repeat text-[12px]">電話で問い合わせ</span>
          </Link>
          <Link href={lawyer.actions.contact.mail} className="flex items-center justify-center bg-[linear-gradient(180deg,_#fff,_#fafafa)] rounded-[6px] text-[clamp(14px,1vw,18px)] p-4 md:p-[20px] font-bold border border-[#d9d9d9]">
            <span className="flex items-center before:size-[17px] gap-2 before:bg-[url(/icons/mail.svg)] before:bg-contain before:bg-center before:bg-no-repeat text-[14px] md:text-[16px]">Webで問い合わせ</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex-1 h-px bg-[hsla(0,1%,74%,.5)]"></span>
            <span className="text-[#72706e] font-bold text-[10px]">または</span>
            <span className="flex-1 h-px bg-[hsla(0,1%,74%,.5)]"></span>
          </div>
          <Link href={`tel:${lawyer.actions.contact.tel}`} className="flex gap-3 items-center justify-center max-md:hidden">
            <p className="flex items-start gap-2 md:text-[12px] text-[10px] before:size-[18px] before:bg-[url(/icons/tel2.svg)] before:bg-contain before:bg-center before:bg-no-repeat"> 電話で問い合わせ</p>
            <p className="font-bold md:text-[22px] text-[20px]">{lawyer.actions.contact.tel}</p>
          </Link>
        </div>
      </div>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-[auto_1fr] items-center gap-2 px-6 md:px-8 overflow-hidden">
        <span className="text-[#72706e] text-[10px] md:text-[12px]">
          注力分野
        </span>

        <div className="flex overflow-x-auto gap-1.5">
          {lawyer.areas.map((area, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={cn(
                "border px-2.5 py-1 leading-none rounded-full text-[12px] md:text-[14px] font-bold whitespace-nowrap duration-150 flex items-center gap-1",
                activeIndex === i
                  ? "border-[#72706e] text-[#262221] bg-white"
                  : "border-[#d9d9d9] text-[#72706e] bg-[#fafafa]"
              )}
            >
              <Image
                src={getAreaIcon(area.focusAreas)}
                alt=""
                width={14}
                height={14}
                className={cn(
                  "shrink-0 transition-opacity",
                  activeIndex === i ? "opacity-100" : "opacity-60"
                )}
              />
              {area.focusAreas}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT + SWIPE */}
      <div className="bg-[#fafafa] py-4 px-6 md:px-8 flex flex-col gap-3">
        <div
          ref={slidesRef}
          onScroll={(e) => {
            const el = e.currentTarget
            const index = Math.round(el.scrollLeft / el.clientWidth)
            if (index !== activeIndex) {
              setActiveIndex(index)
            }
          }}
          className="
            max-md:flex overflow-x-auto md:overflow-visible
            snap-x snap-mandatory scroll-smooth
            gap-6 [scrollbar-width:none]
          "
        >
          {lawyer.areas.map((area, i) => (
            <div
              key={i}
              className={cn(
                "min-w-full md:min-w-0 snap-center flex flex-col gap-3 duration-150",
                "md:[&:not(.is-selected)]:hidden",
                activeIndex === i && "is-selected"
              )}
            >
              <p className="md:text-[16px] text-[14px] font-bold break-all">
                {area.text}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {area.tags.map((tag, t) => (
                  <span
                    key={t}
                    className="text-[12px] px-2 py-1 rounded bg-white border border-[#d9d9d9]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* DOT (SP only) */}
        <ul className="flex justify-center gap-2 md:hidden">
          {lawyer.areas.map((_, i) => (
            <li
              key={i}
              className={cn(
                "size-1.5 rounded-full duration-150",
                activeIndex === i ? "bg-[#72706e]" : "bg-[#d9d9d9]"
              )}
            />
          ))}
        </ul>
      </div>
      <p className="md:text-[14px] text-[12px] md:px-8 px-6">{lawyer.content}</p>
      <div className="flex justify-center md:px-8 px-6">
        <Link href={lawyer.profile.link} className="w-full flex justify-center items-center max-w-[432px] mx-auto p-4 md:p-5 rounded-md md:text-[19px] bg-[linear-gradient(180deg,_#fff,_#fafafa)] border border-[#d9d9d9] text-[clamp(15px,1vw,20px)] font-bold hover:bg-[linear-gradient(180deg,_#faf9f9,_#f5f5f5)] duration-200">
          {lawyer.profile.name} 弁護士の詳細情報を見る
        </Link>
      </div>
    </div>
  )
}

export default function LawyersCards() {

  const lawyersData: Lawyer[] = [
    {
      location: {
        prefecture: '埼玉県',
        autonomy: { text: 'さいたま市浦和区', link: '#' },
        station: '浦和駅',
        foot: '徒歩9分',
      },
      profile: {
        link: '/lawyers/id',
        image: '/images/lawyers/120842_1.png',
        name: '大倉 浩',
        title: '弁護士',
        lawFirm: '大倉浩法律事務所',
        records: '3',
      },
      actions: {
        time: '00:00 - 24:00',
        contact: { mail: '#', tel: '0XX-XXX-XXX' },
      },
      areas: [
        {
          focusAreas: '借金・債務整理',
          text: '経験を生かしたスピーディな対応と納得の料金体系で安心してご依頼いただけるよう努めております。まずはお気軽にご相談ください。',
          tags: ['初回無料相談', '分割払い可'],
        },
        {
          focusAreas: '交通事故',
          text: '不貞/慰謝料請求/財産分与/婚姻費用・養育費/親権など離婚のあらゆる問題について、スムーズで有利な解決を目指し尽力します。お気軽にご相談ください。',
          tags: ['着手金0円', '完全成功報酬'],
        },
      ],
      content: '【初回相談無料】【土日夜間も対応可】【川越市役所近く】おひとりで抱え込まず，まずはご相談ください。'
    },
    {
      location: {
        prefecture: '埼玉県',
        autonomy: { text: 'さいたま市浦和区', link: '#' },
        station: '浦和駅',
        foot: '徒歩9分',
      },
      profile: {
        link: '/lawyers/id',
        image: '/images/lawyers/120842_1.png',
        name: '大倉 浩',
        title: '弁護士',
        lawFirm: '大倉浩法律事務所',
        records: '3',
      },
      actions: {
        time: '00:00 - 24:00',
        contact: { mail: '#', tel: '0XX-XXX-XXX' },
      },
      areas: [
        {
          focusAreas: '借金・債務整理',
          text: '経験を生かしたスピーディな対応と納得の料金体系で安心してご依頼いただけるよう努めております。まずはお気軽にご相談ください。',
          tags: ['初回無料相談', '分割払い可'],
        },
        {
          focusAreas: '交通事故',
          text: '【初回相談30分無料】【社会福祉士・保育士資格者】「福祉・介護・保育」業界の豊富な知識があります。お気軽にご相談ください。定期的に弁護士が御社にご訪問致します。',
          tags: ['完全成功報酬', '着手金0円'],
        },
      ],
      content: '【初回相談無料】【土日夜間も対応可】【川越市役所近く】おひとりで抱え込まず，まずはご相談ください。'
    },
  ]

  return (
    <div>
      {lawyersData.map((lawyer, i) => (
        <LawyerCard key={i} lawyer={lawyer} />
      ))}
    </div>
  )
} 