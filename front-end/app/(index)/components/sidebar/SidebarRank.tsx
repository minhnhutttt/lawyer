import ButtonLink from "@/components/common/ButtonLink";
import TitleBar from "@/components/common/TitleBar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const CriminalCaseItem = ({ image, name, href, rank, change, position, address }: { image: string; name: string, href: string, rank: number, change: string, position: string, address: string }) => {
    return (
        <div className={cn('w-1/2 md:w-[140px] border-t border-[#eee] py-[10px] flex gap-2', rank === 1 && 'w-full md:w-[282px]')}>
            <div>
                <Image
                    src={image}
                    alt=""
                    width={150}
                    height={200}
                    className={cn('w-[35px]', rank === 1 && 'w-[60px]', (rank === 2 || rank === 3) && 'w-[54px]')}
                />
            </div>
            <div className="">
                <div className="w-[45px] relative flex items-center gap-0.5">
                    { rank <= 3 &&
                    <div className="size-4 flex-[0_0_16px]">
                        {rank === 1 &&
                            <Image
                                src="/images/icn-rank1.webp"
                                alt=""
                                width={16}
                                height={15}
                                className="w-4"
                            />
                        }
                        {rank === 2 &&
                            <Image
                                src="/images/icn-rank2.webp"
                                alt=""
                                width={16}
                                height={15}
                                className="w-4"
                            />
                        }
                        {rank === 3 &&
                            <Image
                                src="/images/icn-rank3.webp"
                                alt=""
                                width={16}
                                height={15}
                                className="w-4"
                            />
                        }
                    </div>
                    }
                    <span className="text-[14px] font-bold">{rank}</span>
                    <span className="text-[10px] text-[#999]">位</span>
                    <div className="w-[15px] flex-[0_0_15px] flex items-center justify-center">
                        {change === 'up' &&
                            <Image
                                src="/images/icn-change_up.png"
                                alt=""
                                width={12}
                                height={12}
                                className="w-3"
                            />
                        }
                        {change === 'down' &&
                            <Image
                                src="/images/icn-change_down.png"
                                alt=""
                                width={12}
                                height={12}
                                className="w-3"
                            />
                        }
                        {change === 'steady' &&
                            <Image
                                src="/images/icn-change_stay.webp"
                                alt=""
                                width={12}
                                height={12}
                                className="w-3"
                            />
                        }

                    </div>
                </div>
                <Link href={href} className="text-[14px] font-bold text-[#005ebb]">
                        {name}
                </Link>
                <p className="text-[11px] text-[#bbb]">{position}</p>
                <div className="flex">
                    <p className="py-0.5 px-[5px] border border-[#ddd] text-[11px]">{address}</p>
                </div>
            </div>
        </div>
    )
}

export default function SidebarRank() {
    const criminalCase = [
        {
            rank: 1,
            image: '/images/111382_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            change: 'steady',
            href: '/'
        },
        {
            rank: 2,
            image: '/images/111382_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            change: 'steady',
            href: '/'
        },
        {
            rank: 3,
            image: '/images/111382_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            change: 'steady',
            href: '/'
        },
        {
            rank: 4,
            image: '/images/111382_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            change: 'steady',
            href: '/'
        },
        {
            rank: 5,
            image: '/images/111382_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            change: 'up',
            href: '/'
        },
        {
            rank: 6,
            image: '/images/111382_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            change: 'down',
            href: '/'
        },
        {
            rank: 7,
            image: '/images/111382_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            change: 'down',
            href: '/'
        },
    ]
    return (
        <div className="my-[30px]">
            <TitleBar icon="/images/icn-ranking_2x.webp">
                活躍中の弁護士ランキング
            </TitleBar>
            <p className="border-b border-[#eee] text-[14px] font-bold -mt-[5px] pb-[9px] text-center flex justify-center items-center gap-1">
                <Image
                    src="/images/icn-f11_1x.webp"
                    alt=""
                    width={15}
                    height={15}
                />犯罪・刑事事件  </p>
            <div className=" mt-[5px] mb-[15px] p-1.5 flex flex-wrap max-md:max-w-[400px] max-md:mx-auto">
                {criminalCase.map((item, index) => (
                    <CriminalCaseItem href={item.href} image={item.image} rank={item.rank} name={item.name} position={item.position} address={item.address} change={item.change} key={index} />
                ))}
            </div>
            <div className="flex justify-end py-2.5">
                <ButtonLink link="/ranking">弁護士ランキングをもっと見る</ButtonLink>
            </div>
        </div>
    )
} 