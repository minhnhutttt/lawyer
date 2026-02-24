import Image from "next/image"

export default function EstimateStep() {
  const steps = [
    {
      header: "あなたの状況を入力し、見積り依頼を送信",
      description: (
        <>
          依頼内容は弁護士ドットコムに登録している弁護士だけが見ることができます。<br />
          一般には公開されませんのでご安心ください。
        </>
      ),
      imgUrl: "/images/estimate_step_img_01.png"
    },
    {
      header: "届いた見積りを比べて検討",
      description: (
        <>
          あなたの依頼を引き受けたい弁護士から、見積りの提案が届きます。<br />
          「対処方針」や「費用」で提案内容を比べましょう。
        </>
      ),
      note: (
        <>
          見積りが届くことを、必ずお約束するものではありません。<br />
          依頼内容によっては見積りが届かないこともありますので、予めご了承ください。
        </>
      ),
      imgUrl: "/images/estimate_step_img_02.png"
    },
    {
      header: "自分にあった弁護士に面会依頼を送信",
      description: (
        <>
          気に入った弁護士には、面会依頼を送ることができます。<br />
          面会依頼を送ると弁護士から連絡が届くので、直接会って相談をしましょう。
        </>
      ),
      imgUrl: "/images/estimate_step_img_03.png"
    }
  ]

  return (
    <div className="border border-t-[1px] border-b-[1px] border-[#eee] py-[40px] md:py-[60px]">
      <div className="w-full max-w-[850px] mx-auto px-2.5">
        <h2 className="text-center text-[#333] text-[20px] md:text-[22px] mb-[40px] md:mb-[60px]">
          一括見積りの使い方
          <span className="text-[16px] text-[#999] mx-2">-</span>
          <span className="text-[#f90] text-[16px]">簡単3ステップ</span>
          <span className="text-[16px] text-[#999] mx-2">-</span>
        </h2>
        <ol className="relative mt-5">
          {steps.map((step, idx) => (
            <li key={idx} className="
                flex flex-wrap
                relative
                pb-10
                last:pb-0
                last:after:hidden
                after:content-[''] 
                after:w-[2px] 
                after:bg-[#f7d5a5] 
                after:absolute 
                after:left-[19px] 
                after:top-0 
                after:bottom-0
                after:z-[-1]">
              <div className="text-[#f90] text-[20px] font-bold w-10 h-10 flex items-center justify-center border-[2px] border-[#f7d5a5] rounded-full bg-white flex-shrink-0 mt-[-5px]">{idx + 1}</div>
              <div className="flex-1 px-4 pr-1 md:pr-4">
                <h3 className="text-[#f90] text-[20px] md:text-[24px] leading-[1]">
                  {step.header}
                </h3>
                <p className="text-[14px] md:text-[16px] mt-4">{step.description}</p>
                {step.note && (
                  <p className="text-[12px] text-[#999] mt-2.5 pl-4 relative
                  after:content-['※']
                  after:absolute 
                  after:text-[12px]
                  after:text-[#999]
                  after:top-0 
                  after:left-0
                  ">{step.note}</p>
                )}
              </div>
              <div className="w-[90px] md:w-[146px] text-center flex-shrink-0">
                <Image
                  src={step.imgUrl}
                  alt=""
                  width={146}
                  height={146}
                  className="h-auto"
                />
              </div>

            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}