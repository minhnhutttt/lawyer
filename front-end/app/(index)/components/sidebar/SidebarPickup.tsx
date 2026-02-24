import ButtonLink from "@/components/common/ButtonLink";
import TitleBar from "@/components/common/TitleBar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const PickupItem = ({ image, name, href, position, address }: { image: string; name: string, href: string, position: string, address: string }) => {
    return (
        <div className="mb-6 w-[100px] px-1">
            <Link href={href} className="text-center flex flex-col items-center">
                <figure>
                    <Image
                        src={image}
                        alt=""
                        width={150}
                        height={200}
                        className="w-[60px]"
                    />
                </figure>
                <span className="text-[14px] font-bold text-[#005ebb] block mt-2">
                        {name}
                </span>
                <span className="text-[11px] text-[#bbb] block">{position}</span>
                <span className="flex justify-center w-full">
                    <p className="py-0.5 w-full px-[5px] border border-[#ddd] text-[11px]">{address}</p>
                </span>
            </Link>
        </div>
    )
}

export default function SidebarPickup() {
    const pickup = [
        {
            image: '/images/1601175_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            href: '/'
        },
        {
            image: '/images/1601175_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            href: '/'
        },
        {
            image: '/images/1601175_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            href: '/'
        },
        {
            image: '/images/1601175_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            href: '/'
        },
         {
            image: '/images/1601175_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            href: '/'
        },
         {
            image: '/images/1601175_1.png',
            name: '吉田 英樹',
            position: '弁護士',
            address: '大阪府',
            href: '/'
        },
    ]
    return (
        <div className="my-[30px]">
            <TitleBar icon="/images/icn-push_1x.webp">
                ピックアップ弁護士
            </TitleBar>
            <div className=" mt-[5px] mb-[15px] py-1.5 flex flex-wrap max-md:max-w-[400px] max-md:mx-auto max-md:justify-center">
                {pickup.map((item, index) => (
                    <PickupItem href={item.href} image={item.image}  name={item.name} position={item.position} address={item.address} key={index} />
                ))}
            </div>
        </div>
    )
} 