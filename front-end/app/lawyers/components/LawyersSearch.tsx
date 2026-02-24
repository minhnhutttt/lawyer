import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type TagItem = {
    text: string,
    link: string,
    active: boolean
}

const TagItem = (item: TagItem) => (
    <Link href={item.link} className={cn('md:text-[14px] text-[12px] px-4 py-2 font-bold border rounded-full hover:bg-[#f2f2f2] duration-150', item.active ? 'border-[#d9d9d9] ' : 'text-[#bebdbd] border-[#ededed]' )}>
        {item.text}
    </Link>
)

export default function LawyersSearch() {

    const centralPrefecture: TagItem[] = [
        {
            text: 'さいたま市',
            link: '#',
            active: true
        },
        {
            text: '川口',
            link: '#',
            active: true
        },
        {
            text: '鴻巣',
            link: '#',
            active: true
        },
        {
            text: '上尾',
            link: '#',
            active: true
        },
        {
            text: '蕨',
            link: '#',
            active: true
        },
        {
            text: '戸田',
            link: '#',
            active: true
        },
        {
            text: '桶川',
            link: '#',
            active: true
        },
        {
            text: '北本',
            link: '#',
            active: false
        },
        {
            text: '伊奈',
            link: '#',
            active: false
        },
    ]
    const westPrefecture: TagItem[] = [
        {
            text: '川越',
            link: '#',
            active: true
        },
        {
            text: '所沢',
            link: '#',
            active: true
        },
        {
            text: '飯能',
            link: '#',
            active: true
        },
        {
            text: '狭山',
            link: '#',
            active: true
        },
        {
            text: '入間',
            link: '#',
            active: true
        },
        {
            text: '坂戸',
            link: '#',
            active: true
        },
        {
            text: '鶴ヶ島',
            link: '#',
            active: true
        },
        {
            text: '日高',
            link: '#',
            active: false
        },
        {
            text: '毛呂山',
            link: '#',
            active: false
        },
        {
            text: '越生',
            link: '#',
            active: false
        },
    ]
    const eastPrefecture: TagItem[] = [
        {
            text: '加須',
            link: '#',
            active: true
        },
        {
            text: '春日部',
            link: '#',
            active: true
        },
        {
            text: '草加',
            link: '#',
            active: true
        },
        {
            text: '越谷',
            link: '#',
            active: true
        },
        {
            text: '久喜',
            link: '#',
            active: true
        },
        {
            text: '三郷',
            link: '#',
            active: true
        },
        {
            text: '蓮田',
            link: '#',
            active: true
        },
        {
            text: '吉川',
            link: '#',
            active: true
        },
        {
            text: '行田',
            link: '#',
            active: false
        },
        {
            text: '羽生',
            link: '#',
            active: false
        },
        {
            text: '八潮',
            link: '#',
            active: false
        },
        {
            text: '幸手',
            link: '#',
            active: false
        },
        {
            text: '白岡',
            link: '#',
            active: false
        },
        {
            text: '宮代',
            link: '#',
            active: false
        },
        {
            text: '杉戸',
            link: '#',
            active: false
        },
        {
            text: '松伏',
            link: '#',
            active: false
        },
    ]
    const northPrefecture: TagItem[] = [
        {
            text: '熊谷',
            link: '#',
            active: true
        },
        {
            text: '本庄',
            link: '#',
            active: true
        },
        {
            text: '深谷',
            link: '#',
            active: true
        },
        {
            text: '寄居',
            link: '#',
            active: true
        },
        {
            text: '美里',
            link: '#',
            active: false
        },
        {
            text: '神川',
            link: '#',
            active: false
        },
        {
            text: '上里',
            link: '#',
            active: false
        },
    ]
    const southwestPrefecture: TagItem[] = [
        {
            text: '朝霞',
            link: '#',
            active: true
        },
        {
            text: '志木',
            link: '#',
            active: true
        },
        {
            text: '和光',
            link: '#',
            active: true
        },
        {
            text: '新座',
            link: '#',
            active: true
        },
        {
            text: '富士見',
            link: '#',
            active: true
        },
        {
            text: 'ふじみ野',
            link: '#',
            active: true
        },
        {
            text: '三芳',
            link: '#',
            active: true
        },
    ]
    const hikiPrefecture: TagItem[] = [
        {
            text: '東松山',
            link: '#',
            active: true
        },
        {
            text: '鳩山',
            link: '#',
            active: true
        },
        {
            text: '滑川',
            link: '#',
            active: true
        },
        {
            text: '嵐山',
            link: '#',
            active: true
        },
        {
            text: '小川',
            link: '#',
            active: true
        },
        {
            text: '川島',
            link: '#',
            active: true
        },
        {
            text: '吉見',
            link: '#',
            active: true
        },
        {
            text: 'ときがわ',
            link: '#',
            active: true
        },
        {
            text: '東秩父',
            link: '#',
            active: true
        },
    ]
    const chichibuPrefecture: TagItem[] = [
        {
            text: '秩父',
            link: '#',
            active: true
        },
        {
            text: '横瀬',
            link: '#',
            active: true
        },
        {
            text: '皆野',
            link: '#',
            active: true
        },
        {
            text: '長瀞',
            link: '#',
            active: true
        },
        {
            text: '小鹿野',
            link: '#',
            active: true
        },
    ]
    const neighboringPrefecture: TagItem[] = [
        {
            text: '東京都',
            link: '#',
            active: true
        },
        {
            text: '神奈川県',
            link: '#',
            active: true
        },
        {
            text: '千葉県',
            link: '#',
            active: true
        },
        {
            text: '茨城県',
            link: '#',
            active: true
        },
        {
            text: '栃木県',
            link: '#',
            active: true
        },
        {
            text: '群馬県',
            link: '#',
            active: true
        },
    ]
    const fields: TagItem[] = [
        {
            text: '借金・債務整理',
            link: '#',
            active: true
        },
        {
            text: '交通事故',
            link: '#',
            active: true
        },
        {
            text: '離婚・男女問題',
            link: '#',
            active: true
        },
        {
            text: '遺産相続',
            link: '#',
            active: true
        },
        {
            text: '労働問題',
            link: '#',
            active: true
        },
        {
            text: '債権回収',
            link: '#',
            active: true
        },
        {
            text: '医療問題',
            link: '#',
            active: true
        },
        {
            text: '詐欺被害・消費者被害',
            link: '#',
            active: true
        },
        {
            text: '国際・外国人問題',
            link: '#',
            active: true
        },
        {
            text: 'インターネット問題',
            link: '#',
            active: true
        },
        {
            text: '犯罪・刑事事件',
            link: '#',
            active: true
        },
        {
            text: '不動産・建築',
            link: '#',
            active: true
        },
        {
            text: '企業法務・顧問弁護士',
            link: '#',
            active: true
        },
        {
            text: '税務訴訟・行政事件',
            link: '#',
            active: true
        },
    ]
    const conditions: TagItem[] = [
        {
            text: '初回無料相談',
            link: '#',
            active: true
        },
        {
            text: '法テラス利用可能',
            link: '#',
            active: true
        },
        {
            text: '電話相談できる',
            link: '#',
            active: true
        },
    ]
    return (
        <div>
            <div>
                <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">埼玉の市区町村から探す</h3>
                <div className="my-6 md:my-8 max-md:px-6 flex flex-col gap-4 md:gap-[18px]">
                    <div className="flex flex-col gap-2">
                        <p className="md:text-[16px] text-[14px] font-bold">県央</p>
                        <div className="flex flex-wrap gap-1.5">
                            {centralPrefecture.map((item, index) => (
                                <TagItem key={index} text={item.text} link={item.link} active={item.active} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="md:text-[16px] text-[14px] font-bold">西部</p>
                        <div className="flex flex-wrap gap-1.5">
                            {westPrefecture.map((item, index) => (
                                <TagItem key={index} text={item.text} link={item.link} active={item.active} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="md:text-[16px] text-[14px] font-bold">東部</p>
                        <div className="flex flex-wrap gap-1.5">
                            {eastPrefecture.map((item, index) => (
                                <TagItem key={index} text={item.text} link={item.link} active={item.active} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="md:text-[16px] text-[14px] font-bold">北部</p>
                        <div className="flex flex-wrap gap-1.5">
                            {northPrefecture.map((item, index) => (
                                <TagItem key={index} text={item.text} link={item.link} active={item.active} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="md:text-[16px] text-[14px] font-bold">南西部</p>
                        <div className="flex flex-wrap gap-1.5">
                            {southwestPrefecture.map((item, index) => (
                                <TagItem key={index} text={item.text} link={item.link} active={item.active} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="md:text-[16px] text-[14px] font-bold">比企</p>
                        <div className="flex flex-wrap gap-1.5">
                            {hikiPrefecture.map((item, index) => (
                                <TagItem key={index} text={item.text} link={item.link} active={item.active} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="md:text-[16px] text-[14px] font-bold">秩父</p>
                        <div className="flex flex-wrap gap-1.5">
                            {chichibuPrefecture.map((item, index) => (
                                <TagItem key={index} text={item.text} link={item.link} active={item.active} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">近隣の都道府県から探す</h3>
                <div className="my-6 md:my-8 max-md:px-6 flex flex-col gap-4 md:gap-[18px]">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1.5">
                            {neighboringPrefecture.map((item, index) => (
                                <TagItem key={index} text={item.text} link={item.link} active={item.active} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">分野一覧から探す</h3>
                <div className="my-6 md:my-8 max-md:px-6 flex flex-col gap-4 md:gap-[18px]">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1.5">
                            {fields.map((item, index) => (
                                <TagItem key={index} text={item.text} link={item.link} active={item.active} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="md:text-[20px] text-[18px] md:py-[14px] font-bold py-3 px-6 bg-[#ececec]">こだわり条件から探す</h3>
                <div className="my-6 md:my-8 max-md:px-6 flex flex-col gap-4 md:gap-[18px]">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1.5">
                            {conditions.map((item, index) => (
                                <TagItem key={index} text={item.text} link={item.link} active={item.active} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 