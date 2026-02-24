import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LawyersIntroduction() {
const [sumOpen, setSumOpen] = useState(false);
    return (
        <div className="flex flex-col gap-2.5 pb-3 max-md:px-3">
              <h1 className="md:text-[22px] text-[20px] font-bold">埼玉の弁護士</h1>
              <div className="flex">
                <p className="md:text-[14px] text-[12px] flex-1">
                <span className={cn(!sumOpen && 'line-clamp-2 ')}>
                  弁護士ドットコムで埼玉の弁護士が463名見つかりました。埼玉には埼玉弁護士会(さいたま市浦和区高砂４丁目)があります。依頼者は「また私が相手方(旦那さん)に対し、この件に関する弁護士費用や慰謝料請求は可能でしょうか?」「民事調停は弁護士が立ち会うのでしょうか?」といった質問をもっております。弁護士ドットコムでは埼玉で初回相談を無料で受付してくれる弁護士や弁護士費用を後払いで受け付けしてくれる弁護士など、さまざまな希望の条件で探すことができます。例として「口コミの評価が高い弁護士の選び方は詳しくリサーチしたけれど、埼玉周辺の弁護士と法律事務所を実績で比較したい」などの依頼にも対応することができます。弁護士の中には「依頼者の人生観やその方が今後何を望むかを最大限尊重し、依頼者の立場に立って、今後の人生にとって最善の解決方法を一緒に考えていきたいと思います。」「そのため、お客様からのヒアリングに時間をかけ、時に、お客様ご自身の作業をお願いすることもありますが、引き受けた案件にはしっかりと取り組みます。」とおっしゃる方もいます。成功報酬金額や経歴などの希望を踏まえて、自分に合った弁護士に相談をしてみることもご検討ください。        
                </span>
                </p>
                  <button onClick={() => setSumOpen(!sumOpen)} className={cn('size-10 flex items-center justify-center', sumOpen && 'rotate-180')}>
                  <Image src="/icons/arrow-down.svg" alt="" width={10} height={10} />
                </button>
              </div>
              <div className="flex justify-between">
                <p className="md:text-[14px] text-[12px]">
                  検索結果：
                  <span className="md:text-[18px] text-[16px] font-bold">
                    463名
                  </span>
                </p>
                <Link href="/" className="md:text-[14px] text-[12px] text-[#72706e] gap-1 flex items-center"><Image src="/icons/ic-question.svg" alt="" width={16} height={16} />会員優先表示</Link>
              </div>
            </div>
    )
} 