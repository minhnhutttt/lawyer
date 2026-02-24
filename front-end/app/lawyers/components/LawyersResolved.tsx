import Image from "next/image";
import Link from "next/link";
export const RESOLVED_ICON_MAP = {
  1: {
    icon: '/icons/resolve-01.svg',
    color: '#d87a55',
    text: '離婚・男女問題',
  },
  2: {
    icon: '/icons/resolve-02.svg',
    color: '#53a292',
    text: '遺産相続',
  },
  3: {
    icon: '/icons/resolve-03.svg',
    color: '#86989c',
    text: '犯罪・刑事事件',
  },
} as const

export type ResolvedKey = keyof typeof RESOLVED_ICON_MAP

export type ResolvedIcon =
  (typeof RESOLVED_ICON_MAP)[ResolvedKey]

const DEFAULT_ICON: ResolvedIcon = {
  icon: '/icons/resolve-01.svg',
  color: '#d87a55',
  text: '離婚・男女問題',
}

export function getResolvedIcon(item: number): ResolvedIcon {
  return RESOLVED_ICON_MAP[item as ResolvedKey] ?? DEFAULT_ICON
}


export default function LawyersResolved() {
    const resolvedData = [
        {
            href: '/',
            type: 1,
            title: '相手に子供を確保された状態から親権を獲得した事例',
            image: '/images/1601175_1.png',
            name: '辻 正裕 弁護士',
            text: '相談の結果、相手方に監護実績を作らせないために、1日でも早く家庭裁判所に監護者指定の審判手続き等の申立を行うことにしました。これまでの相談者の監護実績や今後の監護方法、相手方の監護養育について関わり合い方が希薄であること等、母子手帳・写真などの様々な証拠から主張立証した結果、裁判官が相手方に対し、子供を引き渡すことを積極的に働きかけてくれました。その結果、相手方から早期に子供の引き渡しを受けることができました。さらにその後、引き続き離婚協議についてもご依頼をいただき、親権を相談者側で確保しつつ円満に離婚を成立させることができました。 '
        },
        {
            href: '/',
            type: 2,
            title: '相手に子供を確保された状態から親権を獲得した事例',
            image: '/images/1601175_1.png',
            name: '辻 正裕 弁護士',
            text: '相談の結果、相手方に監護実績を作らせないために、1日でも早く家庭裁判所に監護者指定の審判手続き等の申立を行うことにしました。これまでの相談者の監護実績や今後の監護方法、相手方の監護養育について関わり合い方が希薄であること等、母子手帳・写真などの様々な証拠から主張立証した結果、裁判官が相手方に対し、子供を引き渡すことを積極的に働きかけてくれました。その結果、相手方から早期に子供の引き渡しを受けることができました。さらにその後、引き続き離婚協議についてもご依頼をいただき、親権を相談者側で確保しつつ円満に離婚を成立させることができました。 '
        },
        {
            href: '/',
            type: 3,
            title: '相手に子供を確保された状態から親権を獲得した事例',
            image: '/images/1601175_1.png',
            name: '辻 正裕 弁護士',
            text: '相談の結果、相手方に監護実績を作らせないために、1日でも早く家庭裁判所に監護者指定の審判手続き等の申立を行うことにしました。これまでの相談者の監護実績や今後の監護方法、相手方の監護養育について関わり合い方が希薄であること等、母子手帳・写真などの様々な証拠から主張立証した結果、裁判官が相手方に対し、子供を引き渡すことを積極的に働きかけてくれました。その結果、相手方から早期に子供の引き渡しを受けることができました。さらにその後、引き続き離婚協議についてもご依頼をいただき、親権を相談者側で確保しつつ円満に離婚を成立させることができました。 '
        },
    ]
    return (
        <div className="">
            <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">埼玉の弁護士の解決事例</h3>
            <div className="flex flex-col gap-2 py-6 md:py-8">
                {resolvedData.map((resolved, index) => (
                    <Link href={resolved.href} className="md:p-6 p-4 bg-white border border-[#ededed]" key={index}>
                        <span className="flex flex-col gap-3 pb-3">
                            <span className="flex">
                                <span className="flex items-center font-bold rounded text-[12px] px-2 py-1 gap-1.5 text-white" style={{backgroundColor: getResolvedIcon(resolved.type).color}}>
                                    <Image src={getResolvedIcon(resolved.type).icon} alt="" width={14} height={14} />
                                    {getResolvedIcon(resolved.type).text}
                                </span>
                            </span>
                            <span className="md:text-[18px] text-[16px] font-bold">{resolved.title}</span>
                        </span>
                        <span className="border-t border-[#d9d9d9] pt-3 flex flex-col gap-3">
                            <span className="flex items-center gap-2">
                                <Image src={resolved.image} alt="" width={32} height={32} className="rounded-full size-8 object-cover" />
                                <span className="md:text-[14px] text-[12px]">{resolved.name}</span>
                            </span>
                            <span className="md:text-[14px] text-[12px] line-clamp-2">{resolved.text}</span>
                            <span className="flex justify-end relative w-full md:text-[14px] text-[12px] text-[#315dbb] px-6 after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#949494] after:top-1/2 after:right-3 font-bold">続きを読む</span>
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
} 