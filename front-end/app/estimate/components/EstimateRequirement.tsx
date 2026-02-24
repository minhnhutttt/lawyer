import Image from "next/image";
import Link from "next/link";

export default function EstimateRequirement() {
  const data = [
    {
      title: '個人',
      list: [
        { iconUrl: '/icons/icn-estimate1_1x.png', text: '離婚' },
        { iconUrl: '/icons/icn-estimate2_1x.png', text: '借金' },
        { iconUrl: '/icons/icn-estimate3_1x.png', text: '消費者被害' },
        { iconUrl: '/icons/icn-estimate4_1x.png', text: '遺産相続' },
        { iconUrl: '/icons/icn-estimate5_1x.png', text: '交通事故(死亡)' },
        { iconUrl: '/icons/icn-estimate6_1x.png', text: '交通事故(負傷)' },
        { iconUrl: '/icons/icn-estimate7_1x.png', text: '労働問題' },
        { iconUrl: '/icons/icn-estimate8_1x.png', text: '医療過誤' },
        { iconUrl: '/icons/icn-estimate9_1x.png', text: '刑事弁護' },
        { iconUrl: '/icons/icn-estimate10_1x.png', text: '少年事件' },
        { iconUrl: '/icons/icn-estimate11_1x.png', text: 'その他' }
      ]
    }
    ,
    {
      title: '法人',
      list: [
        { iconUrl: '/icons/icn-estimate12_1x.png', text: '顧問弁護士探し' },
        { iconUrl: '/icons/icn-estimate13_1x.png', text: '債権回収' },
        { iconUrl: '/icons/icn-estimate14_1x.png', text: '内容証明書作成' },
        { iconUrl: '/icons/icn-estimate15_1x.png', text: '契約書作成' },
        { iconUrl: '/icons/icn-estimate16_1x.png', text: '契約書チェック' },
        { iconUrl: '/icons/icn-estimate17_1x.png', text: 'その他' }
      ]
    }
  ]

  return (
    <div className="p-[20px] md:p-[30px] border border-[#eee] bg-white">
      <div className="flex flex-col md:flex-row gap-5">
        {data.map((category, index) => (
          <div key={index} className="flex-1 border border-[#eee] p-[30px]">
            <h3 className="text-center text-[#74542b] mb-[30px] text-[14px]"><b className="text-[18px]">{category.title}</b>でのご依頼をご検討の方</h3>
            <ul className="text-[12px] flex gap-x-4 gap-y-3 flex-wrap">
              {category.list.map((item, idx) => (
                <li key={idx} className="flex items-center w-[calc(50%_-_10px)]">
                  <Image src={item.iconUrl} alt={item.text} width={15} height={15} className="mr-2 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-[#74542b] text-[16px] md:text-[18px] text-center mt-[30px]">
        一括見積りのご利用には、<br className="md:hidden"/><b className="text-[#f90]">無料</b>会員登録が必要です。
      </p>
      <div className="flex flex-col items-center gap-4 mt-4">
        <Link className="min-w-[260px] bg-[linear-gradient(#ffa113,#ff8e08)] rounded text-[#fff] text-center text-[16px] font-bold inline-block p-[11px] hover:opacity-90 transition"
          style={{
            boxShadow: "inset 1px 1px #f69400, inset 2px 2px #ffa51e, inset -1px -1px #dc7e09"
          }}
          href="/register">
          会員登録をする
          <span className="bg-white rounded-[3px] text-[#fe5600] text-[10px] ml-1 px-1 py-[3px] relative -top-[2px]">無料</span>
        </Link>
        <Link className="min-w-[260px] bg-[linear-gradient(#fdfdfd,#f8f8f8)] rounded text-[#333] text-center text-[16px] font-bold inline-block p-[11px] hover:opacity-80 transition"
          style={{
            boxShadow: "inset -1px -1px #d8d8d8, inset 0 0 0 1px #e9e9e9, inset 2px 2px #fff"
          }}
          href="/estimate/login">
          ログインをする
        </Link>
      </div>

    </div>
  )

}