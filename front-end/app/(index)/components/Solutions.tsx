import TitleBar from "@/components/common/TitleBar"
import Image from "next/image"
import Link from "next/link"


export default function Solutions() {
  const solutions = [
    {
      link: '/c_3',
      icon: '/images/icn-c3.png',
      title: '離婚・男女問題',
      text: ['離婚慰謝料', '財産分与', '年金分割', '養育費', '親権', '離婚届']
    },
    {
      link: '/c_1',
      icon: '/images/icn-c1.png',
      title: '借金',
      text: ['契約・借用書', '時効', '肩代わり', '取り立て', '債務整理', '過払い金', '住宅ローン']
    },
    {
      link: '/c_4',
      icon: '/images/icn-c4.png',
      title: '相続',
      text: ['贈与', '相続手続き', '遺言書', '相続放棄', '相続人', '相続分', '遺産分割']
    },
    {
      link: '/c_2',
      icon: '/images/icn-c2.webp',
      title: '交通事故',
      text: ['示談交渉', '後遺障害', '過失割合', '交通事故慰謝料・損害賠償', '交通事故裁判']
    },
    {
      link: '/c_23',
      icon: '/images/icn-c23.png',
      title: 'インターネット',
      text: ['削除要求', '誹謗中傷', '名誉毀損', 'アダルトサイト', 'わいせつ', '同人サイト', 'ポルノ',]
    },
    {
      link: '/c_8',
      icon: '/images/icn-c8.webp',
      title: '消費者被害',
      text: ['契約の解除・取消', '悪徳商法', '金融', '美容・健康', '暮らし・趣味', '冠婚葬祭サービス', '探偵・興信所',]
    },
    {
      link: '/c_1009',
      icon: '/images/icn-c1009.webp',
      title: '犯罪・刑事事件',
      text: ['逮捕・刑事弁護', '犯罪被害', '少年事件', '脅迫・強要', '器物損壊', '公務執行妨害', '児童ポルノ・わいせつ物頒布等',]
    },
    {
      link: '/c_5',
      icon: '/images/icn-c5.png',
      title: '労働',
      text: ['ハラスメント', '給料', '労働時間', '残業', '休日・休暇', '規則・条件', '人事異動',]
    },
    {
      link: '/c_6',
      icon: '/images/icn-c6.webp',
      title: '債権回収',
      text: ['契約', '担保権', '回収方法', '強制執行', '手続き', '倒産']
    },
    {
      link: '/c_1012',
      icon: '/images/icn-c1012.webp',
      title: '不動産・建築',
      text: ['不動産契約', '不動産賃貸', '立ち退き・明け渡し', '建築', '不動産登記', '抵当権', '近隣トラブル',]
    },
    {
      link: '/c_16',
      icon: '/images/icn-c16.webp',
      title: '国際・外国人問題',
      text: ['ビザ', '留学', '奨学金', '旅行会社', ' 海外の法律']
    },
    {
      link: '/c_7',
      icon: '/images/icn-c7.webp',
      title: '医療',
      text: ['医療過誤', '医療事故', 'B型肝炎']
    },
    {
      link: '/c_1015',
      icon: '/images/icn-c1015.webp',
      title: '企業法務',
      text: ['組織・機関', '再編・倒産', '他社との取引や契約', '知的財産', '不祥事・クレーム対応', '人事・労務', '資金調達',]
    },
    {
      link: '/c_15',
      icon: '/images/icn-c15.webp',
      title: '税務訴訟',
      text: ['税金', '脱税', '税務調査']
    },
    {
      link: '/c_1017',
      icon: '/images/icn-c1017.webp',
      title: '行政事件',
      text: ['行政訴訟', '行政救済']
    },
    {
      link: '/c_1018',
      icon: '/images/icn-c1018.webp',
      title: '民事紛争の解決手続き',
      text: ['書面', '民事事件', '家事事件', '上訴・再審', '民事保全・民事執行', '公証制度・即決和解', '費用の援助']
    },
    {
      link: '/c_18',
      icon: '/images/icn-c18.webp',
      title: '民事・その他',
      text: ['保険', '年金', '成年後見', 'いじめ', '法律全般', '生活保護']
    },
  ]
  return (
    <div className="my-[30px]">
      <TitleBar icon="/images/icn-category_2x.png">
        お悩みから解決方法を探す
      </TitleBar>
      <ul className="grid max-md:grid-cols-2 md:flex flex-wrap -mt-[15px]">
        {solutions.map((solution, index) => (
          <li className="md:w-[192px] border-b border-[#eee] md:ml-8 md:[&:nth-of-type(3n+1)]:ml-0 hover:bg-[#ffd] duration-150" key={index}>
            <Link href={solution.link} className="flex flex-col items-center pt-2 md:pt-6 px-5 pb-4 md:pb-[30px]">
              <Image
                src={solution.icon}
                alt=""
                width={36}
                height={36}
                className="md:w-9 w-7"
              />
              <h3 className="block text-[14px] font-bold leading-none mt-[8px] mb-1 md:mb-[5px] text-center text-[#005ebb]">{solution.title}</h3>
              <p className="w-full max-md:leading-[1.1]">
                {solution.text.map((text, i) => (
                  <span className="text-[10px] text-[#777] md:mr-2.5 mr-1.5 md:pr-2.5 pr-1.5" key={i}>{text}</span>
                ))}
              </p>

            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
} 