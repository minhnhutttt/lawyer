import Image from "next/image";
import Link from "next/link";


export default function EmptyLawyer() {
  return (
    <div className="bg-[#fefcf1]">
      <div className="rounded-b-[20%] md:rounded-b-[50%] shadow-[0_1px_2px_#ddd] px-5 pb-4 bg-white text-center relative
            before:content-['']
            before:absolute
            before:border-solid
            before:border-[9px]
            before:border-transparent
            before:border-t-[#ddd]
            before:bottom-[-18px]
            before:left-1/2
            before:ml-[-9px]
            
            after:content-['']
            after:absolute
            after:w-0 after:h-0
            after:border-solid
            after:border-[8px]
            after:border-transparent
            after:border-t-[#fff]
            after:bottom-[-16px]
            after:left-1/2
            after:ml-[-8px]">
        <p className="text-[#fe4311] text-[13px] mt-3">※一定期間が過ぎると消えてしまいます。会員登録すれば保存され、パソコンでも見ることができます。</p>
        <p className="text-[#222] text-[18px] mt-8">会員登録すれば、いつでも<br />お気に入り弁護士が見れる</p>
        <Image src="/images/img_sppc.avif" alt="" width={143} height={40} className="my-2.5 mx-auto" />
      </div>
      <div className="py-5">
        <Link
          href="#"
          className="w-full max-w-[400px] py-2.5 mx-auto text-white font-bold rounded bg-[linear-gradient(180deg,#ffb415_0%,#ff9600_50%,#ff8500_50%,#ffa600_100%)] border border-[#d38947] [text-shadow:0_-1px_1px_#d38947] hover:opacity-90 flex items-center justify-center gap-2 transition"
        >
          新規会員登録（無料）
        </Link>
      </div>
    </div>
  )
}