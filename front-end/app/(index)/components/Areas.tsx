
import ButtonLink from "@/components/common/ButtonLink";
import TitleBar from "@/components/common/TitleBar";
import { cn } from "@/lib/utils";
import Link from "next/link";
type areaType = {
  area: string,
  href: string
}
const AreaMap = ({ className, title, items }: { className: string, title: string, items: areaType[] }) => {
  return (
    <div
      className={cn(
        'bg-[hsla(0,_0%,_100%,_.6)] border border-[rgba(116,84,43,.19)] [box-shadow:inset_0_0_0_1px_#fff] flex flex-wrap gap-1 md:gap-[8px] tracking-[-1.2px] md:absolute w-full md:box-content p-2 md:p-1.5',
        className
      )}
    >
      <p className=" text-[#375165] block text-[15px] md:text-[10px] md:text-center w-full">{title}</p>
      <div className="flex flex-wrap gap-x-2">
        {items.map((item, index) => (
          <p className="inline-block leading-[1.2]" key={index}>
            <Link href={item.href} className="text-[13px] md:text-[12px] inline-block text-[#005ebb]">
              {item.area}
            </Link>
          </p>
        ))}
      </div>
    </div>
  )
}

export default function Areas() {
    const areasMap = [
    {
      title: '関東',
      areas: [
        {
          area: '東京',
          href: '/lawyers/'
        },
        {
          area: '神奈川',
          href: '/lawyers/'
        },
        {
          area: '埼玉',
          href: '/lawyers/'
        },
        {
          area: '千葉',
          href: '/lawyers/'
        },
        {
          area: '茨城',
          href: '/lawyers/'
        },
        {
          area: '栃木',
          href: '/lawyers/'
        },
        {
          area: '群馬',
          href: '/lawyers/'
        },
      ],
      class: 'bottom-[44px] md:max-w-[88px] right-0'
    },
    {
      title: '関西',
      areas: [
        {
          area: '大阪',
          href: '/lawyers/'
        },
        {
          area: '兵庫',
          href: '/lawyers/'
        },
        {
          area: '京都',
          href: '/lawyers/'
        },
        {
          area: '滋賀',
          href: '/lawyers/'
        },
        {
          area: '奈良',
          href: '/lawyers/'
        },
        {
          area: '和歌山',
          href: '/lawyers/'
        },
      ],
      class: 'left-[82px] top-[16px] md:w-[36px] md:justify-center'
    },
    {
      title: '東海',
      areas: [
        {
          area: '愛知',
          href: '/lawyers/'
        },
        {
          area: '静岡',
          href: '/lawyers/'
        },
        {
          area: '岐阜',
          href: '/lawyers/'
        },
        {
          area: '三重',
          href: '/lawyers/'
        },
      ],
      class: 'bottom-[45px] right-[124px] md:w-[62px]'
    },
    {
      title: '九州・沖縄',
      areas: [
        {
          area: '福岡',
          href: '/lawyers/'
        },
        {
          area: '佐賀',
          href: '/lawyers/'
        },
        {
          area: '長崎',
          href: '/lawyers/'
        },
        {
          area: '熊本',
          href: '/lawyers/'
        },
        {
          area: '大分',
          href: '/lawyers/'
        },
        {
          area: '宮崎',
          href: '/lawyers/'
        },
        {
          area: '鹿児島',
          href: '/lawyers/'
        },
        {
          area: '沖縄',
          href: '/lawyers/'
        },
      ],
      class: 'bottom-0 left-0 md:w-[90px]'
    },
    {
      title: '北海道・東北',
      areas: [
        {
          area: '北海道',
          href: '/lawyers/'
        },
        {
          area: '青森',
          href: '/lawyers/'
        },
        {
          area: '秋田',
          href: '/lawyers/'
        },
        {
          area: '山形',
          href: '/lawyers/'
        },
        {
          area: '岩手',
          href: '/lawyers/'
        },
        {
          area: '宮城',
          href: '/lawyers/'
        },
        {
          area: '福島',
          href: '/lawyers/'
        },
      ],
      class: 'top-[62px] right-2 md:w-[60px]'
    },
    {
      title: '中国',
      areas: [
        {
          area: '広島',
          href: '/lawyers/'
        },
        {
          area: '岡山',
          href: '/lawyers/'
        },
        {
          area: '山口',
          href: '/lawyers/'
        },
        {
          area: '島根',
          href: '/lawyers/'
        },
        {
          area: '鳥取',
          href: '/lawyers/'
        },
      ],
      class: 'top-[62px] left-3 md:w-[36px] md:justify-center'
    },
    {
      title: '北陸・甲信越',
      areas: [
        {
          area: '長野',
          href: '/lawyers/'
        },
        {
          area: '山梨',
          href: '/lawyers/'
        },
        {
          area: '新潟',
          href: '/lawyers/'
        },
        {
          area: '富山',
          href: '/lawyers/'
        },
        {
          area: '石川',
          href: '/lawyers/'
        },
        {
          area: '福井',
          href: '/lawyers/'
        },
      ],
      class: 'top-[40px] left-[152px] md:w-[60px]'
    },
    {
      title: '四国',
      areas: [
        {
          area: '香川',
          href: '/lawyers/'
        },
        {
          area: '愛媛',
          href: '/lawyers/'
        },
        {
          area: '徳島',
          href: '/lawyers/'
        },
        {
          area: '高知',
          href: '/lawyers/'
        },
      ],
      class: 'bottom-[24px] left-[126px] md:w-[56px]'
    }
  ]

  const field = [
    {
      text: '借金・債務整理',
      href: '/f_1'
    },
    {
      text: '交通事故',
      href: '/f_2'
    },
    {
      text: '離婚・男女問題',
      href: '/f_3'
    },
    {
      text: '遺産相続',
      href: '/f_4'
    },
    {
      text: '労働問題',
      href: '/f_5'
    },
    {
      text: '債権回収',
      href: '/f_6'
    },
    {
      text: '医療問題',
      href: '/f_6'
    },
    {
      text: '債権回収',
      href: '/f_7'
    },
    {
      text: '詐欺被害・消費者被害',
      href: '/f_8'
    },
    {
      text: '国際・外国人問題',
      href: '/f_9'
    },
    {
      text: 'インターネット問題',
      href: '/f_10'
    },
    {
      text: '犯罪・刑事事件',
      href: '/f_11'
    },
    {
      text: '不動産・建築',
      href: '/f_12'
    },
    {
      text: '企業法務・顧問弁護士',
      href: '/f_13'
    },
    {
      text: '税務訴訟・行政事件',
      href: '/f_14'
    },
  ]
  return (
    
            <div>
              <TitleBar icon="/images/icn-lawyer_2x.webp">
                弁護士を探す
              </TitleBar>
              <div className="p-4 flex max-md:flex-col bg-[#fffbf6]">
                <div className="md:pr-4 md:border-r border-[#e0e0e0]">
                  <p className="text-[14px] font-bold max-md:mb-3">
                    都道府県から探す
                  </p>
                  <div className="md:bg-[url(/images/bg_area.webp)] bg-no-repeat bg-[size:323px_289px] bg-top md:h-[339px] relative md:w-[423px] max-md:space-y-2">
                    {areasMap.map((map, index) => (
                      <AreaMap className={map.class} title={map.title} items={map.areas} key={index} />
                    ))}

                  </div>
                </div>
                <div className="md:pl-4 max-md:mt-5">
                  <p className="text-[14px] font-bold mb-2">
                    分野から探す
                  </p>
                  <ul className="grid flex-col gap-1 max-md:grid-cols-2 md:flex">
                    {field.map((item, i) => (
                      <li className="text-[12px] bg-[url(/images/icon_arrowS.png)] bg-[position:left_0.3em] bg-no-repeat pl-2.5 text-[#005ebb]" key={i}>
                        <Link href={item.href}>{item.text}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex justify-end py-2.5">
                <ButtonLink link="/search">詳細検索で探す</ButtonLink>
              </div>
            </div>
  )
} 