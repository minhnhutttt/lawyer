import Link from "next/link"
import Image from "next/image"

export default function EstimateFaq() {
    const data = [
        { question: '一括見積りとは、どのようなサービスですか？', link: '#' },
        { question: '一括見積りを利用する際の流れを教えてください。', link: '#' },
        { question: '見積り依頼の公開範囲を教えて下さい。', link: '#' },
        { question: '知人の承諾を得て、知人の代わりに一括見積りを利用することは可能ですか？', link: '#' },
    ]
    return (
        <section className="py-[40px] md:py-[60px]">
            <div className="w-full max-w-[850px] mx-auto px-2.5">
                <h2 className="text-[22px] text-center text-[#333]">よくあるお問い合わせ</h2>
                <div className="mt-[40px] md:mt-[60px] px-5 border border-[#eee]">
                    <ul>
                        {data.map((item, index) => (
                            <li key={index} className="py-5 flex items-center gap-2 border-b border-[#eee] text-[16px]">
                                <span className="flex-shrink-0 w-5 text-[#f90] text-[19px] font-bold">Q.</span>
                                <Link href={item.link} className="flex-1 hover:underline transition text-[#005ebb]">{item.question}</Link>
                            </li>
                        ))}
                    </ul>
                    <div className="text-right">
                        <Link href="/faq" className="text-[#005ebb] text-[16px] font-bold inline-flex items-center gap-1 hover:underline transition py-5">
                            もっと見る
                            <Image src="/icons/icon_arrow_right_middle.png" alt="" width={13} height={13} className="flex-shrink-0" />
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    )
}