import Image from 'next/image'

export default function EstimateMainvisual() {
  return (
    <div className="
        relative w-full
        h-[380px] md:h-[394px]
        pt-[40px] md:pt-[60px]
        pb-[30px] md:pb-[75px]
        bg-[url('/images/estimate_bg.png')] bg-cover bg-center
        
        after:content-[''] 
        after:absolute  
        after:left-0
        after:top-0
        after:h-[100%]
        after:aspect-[267/394]
        after:bg-[url('/images/estimate_bg_left.png')] 
        after:bg-cover 
        after:bg-center
        after:z-0
        
        before:content-[''] 
        before:absolute  
        before:right-0
        before:top-0
        before:h-[100%]
        before:aspect-[267/394]
        before:bg-[url('/images/estimate_bg_right.png')] 
        before:bg-cover 
        before:bg-center
        before:z-0
        ">
      <div className="w-full max-w-[980px] mx-auto px-2.5 text-center relative z-10">
        <p className="text-[20px] md:text-[24px] text-[#74542b]">
          <span>「対処方針」</span>と<span>「費用」</span>から、<br className='md:hidden'/><strong className="text-[#f90]">自分にあった弁護士</strong>を選べる
        </p>
        <h2>
          <Image src="/images/estimate_header.png" alt="弁護士費用の一括見積り（無料）" width={449} height={145} className="mx-auto my-10 max-w-[92%]" />
        </h2>
      </div>
    </div>
  )
}