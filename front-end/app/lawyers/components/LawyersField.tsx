import Image from "next/image";
import Link from "next/link";


export default function LawyersField() {
    const fields = [
        {
            link: "#",
            icon: '/icons/field-01.svg',
            title: '離婚・男女問題',
            text: '離婚する際には、財産分与や、子供の親権、養育費など様々な条件を交渉する必要があります。不倫などが原因で離婚する場合には慰謝料の請求も可能です。弁護士に依頼することで、慰謝料の増額や親権の獲得など納得できる条件で離婚できる可能性が高まります。',
            images: [
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
            ],
            count: '300'
        },
        {
            link: "#",
            icon: '/icons/field-02.svg',
            title: '遺産相続',
            text: '相続手続きは相続人同士の遺産分割の交渉、必要書類の用意、手続きなど多くの手間と時間がかかります。弁護士に依頼すれば、遺産分割の交渉や手続きをすべて任せることができ、納得できる相続を実現できる可能性が高まります。生前に遺言作成を弁護士に依頼すれば、そもそも相続争いが起きるリスクを減らすことが可能です。',
            images: [
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
            ],
            count: '300'
        },
        {
            link: "#",
            icon: '/icons/field-03.svg',
            title: '交通事故',
            text: '交通事故の被害に遭った場合、弁護士が交渉すれば保険金を増額できる可能性があります。保険会社の保険金の算定基準は、弁護士や裁判所の算定基準よりも低額であることが一般的だからです。弁護士特約つき保険であれば弁護士費用も保険金でカバーできます。適正な保険金を獲得するために弁護士に相談しましょう。',
            images: [
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
            ],
            count: '300'
        },
        {
            link: "#",
            icon: '/icons/field-04.svg',
            title: '犯罪・刑事事件',
            text: '起訴されると、99％の確率で有罪判決を受けるのが日本の刑事司法の実情です。そのため犯罪の容疑をかけられた場合、不起訴処分を目指すことが重要になります。不起訴処分の獲得には、被害者との示談交渉や捜査当局への対応など、弁護士の迅速なサポートが不可欠です。',
            images: [
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
                '/images/1601175_1.png',
            ],
            count: '200'
        },
    ]
    return (
        <div>
            <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">分野から探す</h3>
            <div className="md:mt-8 mt-6 max-md:px-6 space-y-2.5 mb-4">
                {fields.map((field, index) => (
                    <Link href={field.link} key={index} className="relative flex justify-between rounded-lg items-center gap-2.5 bg-white border border-[#ededed] md:p-[18px] p-4 after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4 md:pr-8 max-md:pr-6">
                        <span className="flex flex-col gap-2.5">
                            <span className="flex items-center gap-1.5 md:text-[18px] text-[16px] font-bold">
                                <Image src={field.icon} alt="" width={18} height={18} className="md:size-[18px] size-4" />
                                {field.title}
                            </span>
                            <span className="md:text-[14px] text-[12px] mt-1.5 text-[#72706e]">{field.text}</span>
                            <span className="flex items-center gap-3">
                                <span className="flex ml-1.5">
                                    {field.images.map((image, i) => (
                                        <Image src={image} alt="" width={6} height={6} className="md:size-6 size-5 rounded-full -ml-1.5" />
                                    ))}
                                </span>
                                <span>
                                    <span className="md:text-[18px] text-[14px] font-bold">{field.count}</span>
                                    <span className="md:text-[14px] text-[12px]">名+</span>
                                </span>
                            </span>
                        </span>
                    </Link>
                ))}
            </div>
            <div className="flex justify-center md:px-8 px-6">
        <Link href="#" className="w-full flex justify-center items-center max-w-[432px] mx-auto p-4 md:p-5 rounded-md md:text-[19px] bg-[linear-gradient(180deg,_#fff,_#fafafa)] border border-[#d9d9d9] text-[clamp(15px,1vw,20px)] font-bold hover:bg-[linear-gradient(180deg,_#faf9f9,_#f5f5f5)] duration-200">
          分野を絞り込む
        </Link>
      </div>
        </div>
    )
} 