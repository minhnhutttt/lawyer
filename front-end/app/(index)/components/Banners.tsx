import Image from "next/image";
import Link from "next/link";


export default function Banners() {
  return (
    <div className="">
                  <Link href="/" className="md:p-6 p-4 grid md:grid-cols-2 max-md:gap-2 items-center justify-center border border-[#ddd]">
                    <span className="space-y-2.5 flex flex-col items-center">
                      <Image
                        src="/images/logo.png"
                        alt=""
                        width={360}
                        height={60}
                        className="w-[200px]"
                        priority
                      />
                      <span className="block text-[13px] md:text-[14px] text-[#72706e]">※離婚・男女問題にのみ対応です</span>
                    </span>
                    <span className="block">
                      <Link href="/" className="bg-[linear-gradient(180deg,_#ffb415_0,_#ff9600_50%,_#ff8500_0,_#ffa600)] border-[1px] border-[solid] border-[#d38947] text-[#fff] [text-shadow:0_-1px_1px_#d38947] text-[14px] font-bold flex items-center justify-center py-2 px-[25px]">
                        チャットで相談する
                      </Link>
                    </span>
                  </Link>
                  <Link href="/" className="block mt-5">
                    <Image
                      src="/images/bnr.png"
                      alt=""
                      width={640}
                      height={84}
                      className="w-[640px]"
                      priority
                    />
                  </Link>
                  <Link href="/" className="block mt-5">
                    <Image
                      src="/images/bnr_zeiri4_640_90.gif"
                      alt=""
                      width={640}
                      height={90}
                      className="w-[640px]"
                      priority
                    />
                  </Link>
                  <Link href="/" className="block mt-5">
                    <Image
                      src="/images/img_link.png"
                      alt=""
                      width={640}
                      height={110}
                      className="w-[640px]"
                      priority
                    />
                  </Link>
                </div>
  )
} 