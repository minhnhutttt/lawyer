import Image from "next/image";
import Link from "next/link";
import EstimateRequirement from "./EstimateRequirement";

type QuoteType = 1 | 2;

interface QuotationProps {
  type?: QuoteType;
  className?: string;
}

export default function EstimateQuotation({ type = 1, className }: QuotationProps) {

  const selectDatas = [
    {
      iconUrl: '/icons/icn-area2_g_1x.png',
      title: '地域',
      options:
        [
          { value: "hokkaido", label: "北海道" },
          { value: "aomori", label: "青森県" },
          { value: "iwate", label: "岩手県" },
          { value: "miyagi", label: "宮城県" },
          { value: "akita", label: "秋田県" },
          { value: "yamagata", label: "山形県" },
          { value: "fukushima", label: "福島県" },
          { value: "ibaraki", label: "茨城県" },
          { value: "tochigi", label: "栃木県" },
          { value: "gunma", label: "群馬県" },
          { value: "saitama", label: "埼玉県" },
          { value: "chiba", label: "千葉県" },
          { value: "tokyo", label: "東京都" },
          { value: "kanagawa", label: "神奈川県" },
          { value: "yamanashi", label: "山梨県" },
          { value: "nagano", label: "長野県" },
          { value: "nigata", label: "新潟県" },
          { value: "toyama", label: "富山県" },
          { value: "ishikawa", label: "石川県" },
          { value: "fukui", label: "福井県" },
          { value: "gifu", label: "岐阜県" },
          { value: "shizuoka", label: "静岡県" },
          { value: "aichi", label: "愛知県" },
          { value: "mie", label: "三重県" },
          { value: "shiga", label: "滋賀県" },
          { value: "kyoto", label: "京都府" },
          { value: "osaka", label: "大阪府" },
          { value: "hyogo", label: "兵庫県" },
          { value: "nara", label: "奈良県" },
          { value: "wakayama", label: "和歌山県" },
          { value: "tottori", label: "鳥取県" },
          { value: "shimane", label: "島根県" },
          { value: "okayama", label: "岡山県" },
          { value: "hiroshima", label: "広島県" },
          { value: "yamaguchi", label: "山口県" },
          { value: "tokushima", label: "徳島県" },
          { value: "kagawa", label: "香川県" },
          { value: "ehime", label: "愛媛県" },
          { value: "kochi", label: "高知県" },
          { value: "fukuoka", label: "福岡県" },
          { value: "saga", label: "佐賀県" },
          { value: "nagasaki", label: "長崎県" },
          { value: "kumamoto", label: "熊本県" },
          { value: "oita", label: "大分県" },
          { value: "miyazaki", label: "宮崎県" },
          { value: "kagoshima", label: "鹿児島県" },
          { value: "okinawa", label: "沖縄県" }
        ]
    },
    {
      iconUrl: '/icons/icn-category_g_1x.png',
      title: '分野',
      options:
        [
          { value: "1", label: "借金・債務整理" },
          { value: "2", label: "交通事故" },
          { value: "3", label: "離婚・男女問題" },
          { value: "4", label: "遺産相続" },
          { value: "5", label: "労働問題" },
          { value: "6", label: "債権回収" },
          { value: "7", label: "医療問題" },
          { value: "8", label: "詐欺被害・消費者被害" },
          { value: "9", label: "国際・外国人問題" },
          { value: "10", label: "インターネット問題" },
          { value: "11", label: "犯罪・刑事事件" },
          { value: "12", label: "不動産・建築" },
          { value: "13", label: "企業法務・顧問弁護士" },
          { value: "14", label: "税務訴訟・行政事件" }
        ]
    }
  ]

  return (
    <section className={`bg-[#fafafa] pb-[40px] md:pb-[60px] ${className}`}>
      <div className="w-full max-w-[850px] mx-auto px-2.5">
        {type === 1 && (
          <div className="mt-[-60px] md:mt-[-76px] block relative z-10">
            <Image src="/images/estimate_step.png" alt="step" width={519} height={153} className="mx-auto" />
          </div>
        )}
        <div className="text-center pt-10 md:pt-16">
          <h2 className="
              text-[#74542b] inline-block mx-auto text-center text-[18px]
              relative
              px-5
              mb-5

              before:content-[''] 
              before:block 
              before:absolute 
              before:top-[-4px] 
              before:left-0
              before:w-[1px] 
              before:h-[33px] 
              before:bg-[#ccc]
              before:rotate-[145deg]

              after:content-[''] 
              after:block 
              after:absolute 
              after:top-[-4px] 
              after:right-0
              after:w-[1px] 
              after:h-[33px] 
              after:bg-[#ccc]
              after:-rotate-[145deg]
            ">
            <b>お悩みに合わせた</b><br className="md:hidden" />見積り依頼が可能です
          </h2>
        </div>
        <EstimateRequirement />
      </div>

      {type === 1 && (
        <div className="w-full max-w-[660px] mx-auto px-2.5 bg-white p-[30px] mt-10 text-center">
          <h2 className="text-[#74542b] text-center text-[16px] md:text-[18px]">
            <strong className="text-[#f90]">依頼するほどでもないかも</strong>とお悩みの方には、<br />
            <strong>みんなの法律相談がお勧めです</strong>
          </h2>
          <Image src="/images/estimate_recommend_bbs.png" alt="みんなの法律相談" width={345} height={76} className="mx-auto my-5" />
          <Link className="min-w-[260px] bg-[linear-gradient(#fdfdfd,#f8f8f8)] rounded text-[#333] text-center text-[16px] font-bold inline-block p-[11px] hover:opacity-80 transition"
            style={{
              boxShadow: "inset -1px -1px #d8d8d8, inset 0 0 0 1px #e9e9e9, inset 2px 2px #fff"
            }}
            href="/bbs/">
            <Image src="/icons/icn-bbs_1x.png" alt="" width={15} height={15} className="mr-1 inline-block" />
            みんなの法律相談を見る
          </Link>
        </div>
      )}

      {type === 2 && (
        <div className="w-full max-w-[660px] mx-auto bg-white p-[30px] mt-10 text-center">
          <h2 className="text-[#74542b] text-[18px]">
            <strong className="text-[#f90]">今すぐ相談にのって欲しい</strong>場合には <br />
            <strong >直接弁護士に問い合わせるのがお勧め</strong>です
          </h2>
          <p className="text-[#777] text-[14px] mt-2">
            「<b>現在営業中の弁護士</b>」や「<b>電話相談を受け付けている</b>」などの条件検索もできます
          </p>
          <div className="flex flex-col md:flex-row gap-2.5 justify-center items-center mt-6 flex-wrap">
            <div className="flex flex-col md:flex-row flex-1 gap-5">
              {selectDatas.map((selectData, index) => (
                <div key={index} className="flex-1 flex border-[2px] border-[#ddd]
                    relative
                    before:content-['']
                    before:absolute
                    before:left-[50%]
                    md:before:left-[calc(100%_+_6px)]
                    before:top-[calc(100%_+_6px)]
                    md:before:top-1/2
                    before:-translate-x-1/2
                    md:before:-translate-y-1/2
                    md:before:-translate-x-0
                    before:w-[12px]
                    before:h-[12px]
                    before:bg-[url('/icons/icn-mix.png')]
                    before:bg-no-repeat
                    before:bg-center
                    before:bg-contain
                    last:before:hidden
                  ">
                  <div className="flex items-center justify-center w-[65px] flex-shrink-0 p-1 border-r border-[#ddd]">
                    <Image src={selectData.iconUrl} alt={selectData.title} width={15} height={15} className="mr-1 flex-shrink-0" />
                    <span className="text-[#74542b] text-[13px] font-bold">{selectData.title}</span>
                  </div>
                  <div className="flex-1 text-[13px] font-bold
                    after:content-['']
                    after:absolute
                    after:right-2
                    after:top-1/2
                    after:-translate-y-1/2
                    after:w-2
                    after:h-2
                    after:bg-[url('/icons/icon_arrow_downS.png')]
                    after:bg-no-repeat
                    after:bg-center
                    after:bg-contain
                    relative
                  ">
                    <select className="outline-none p-[10px] w-full appearance-none text-center transition cursor-pointer" name={selectData.title}>
                      <option value="">{selectData.title === '地域' ? '全国' : '指定しない'}</option>
                      {selectData.options.map((option, idx) => (
                        <option className="text-left" key={idx} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-[66px] flex-shrink-0 bg-[linear-gradient(#ffa113,#ff8e08)] text-[#fff] text-[17px] font-bold px-2 py-2 rounded hover:opacity-90 transition">
              検索
            </button>

          </div>
        </div>
      )}
    </section>
  )
}