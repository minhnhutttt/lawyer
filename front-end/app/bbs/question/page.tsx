import Container from "@/components/layout/Container";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function BssQuestion() {
  return (
    <main className="">
      <Breadcrumb items={[{ label: 'みんなの法律相談', href: "#" }, {label: '相談内容入力'}]} />
      <div className="py-6 px-4 flex justify-center border-b border-[#e9e5e4] -mt-[30px]">
        <div className="relative max-w-[200px] md:text-[13px] text-[12px] text-center flex-1">
          <p className="md:text-[20px] text-[18px]">1</p>
          <p className="font-bold">相談内容入力</p>
        </div>
        <div className="relative max-w-[200px] md:text-[13px] text-[12px] text-center flex-1 before:bg-[#e9e5e4] before:h-px before:-left-2/4 before:ml-4 before:absolute before:top-[16px] before:w-[calc(100%-2rem)]">
          <p className="md:text-[20px] text-[18px]">2</p>
          <p className="font-bold">相談内容入力</p>
        </div>
        <div className="relative max-w-[200px] md:text-[13px] text-[12px] text-center flex-1 before:bg-[#e9e5e4] before:h-px before:-left-2/4 before:ml-4 before:absolute before:top-[16px] before:w-[calc(100%-2rem)]">
          <p className="md:text-[20px] text-[18px]">3</p>
          <p className="font-bold">相談内容入力</p>
        </div>
      </div>
      <div className="w-full max-w-[720px] mx-auto px-6 mb-16 mt-10">
        <p className="md:text-[22px] text-[20px] font-bold mb-4">相談内容を入力する</p>
        <p className="md:text-[14px] text-[12px] mb-4">相談内容はどなたでもご覧になれますので、<span className="font-bold">個人を特定されることのないよう</span>入力内容は十分ご注意ください。また、<span className="font-bold underline decoration-[#f7723e] underline-offset-4">投稿後の修正・削除はできません</span>のでご注意ください。</p>
        <div className="mt-[56px] space-y-9">
          <div>
            <div className="flex justify-between mb-2">
              <p className="space-x-2 md:text-[14px] text-[12px]">
                <span className="md:text-[16px] text-[14px] font-bold">相談の背景</span>
                <span className="text-[#ce2d14]">必須</span>
                <span className="text-[#716c6b]">（20文字以上）</span>
              </p>
              <p className="text-[#716c6b]">0/600</p>
            </div>
            <div>
              <textarea name="" id="" className="md:text-[16px] text-[14px] h-[190px] border border-[#bbb3af] [box-shadow:inset_1px_1px_2px_rgba(38,_34,_33,_.08)] block rounded-lg px-4 py-3 w-full"></textarea>
            </div>
            <div className="md:text-[14px] text-[12px] bg-[#f5f1ee] p-5 rounded-lg mt-4">
              <p className="font-bold">相談の内容・背景には「いつ、どこで、だれと、何のトラブルがあったか」を書く</p>
              <p className="">
                例：1週間前、夫が職場の同僚と不倫していることを知りました。離婚するつもりはありませんが、不倫相手に慰謝料を支払ってほしいです。
              </p>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <p className="space-x-2 md:text-[14px] text-[12px]">
                <span className="md:text-[16px] text-[14px] font-bold">質問1</span>
                <span className="text-[#ce2d14]">必須</span>
                <span className="text-[#716c6b]">（10文字以上）</span>
              </p>
              <p className="text-[#716c6b]">0/100</p>
            </div>
            <div>
              <textarea name="" id="" className="md:text-[16px] text-[14px] h-[100px] border border-[#bbb3af] [box-shadow:inset_1px_1px_2px_rgba(38,_34,_33,_.08)] block rounded-lg px-4 py-3 w-full"></textarea>
            </div>
            <div className="flex justify-between gap-2 mt-4">
              <button className="w-full gap-1 flex items-center justify-center max-w-[400px] border border-[#bbb3af] [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] rounded-full h-[58px] before:size-5 before:bg-cover before:bg-[url(/icons/ic-minus.svg)] opacity-45">質問を削除
              </button>
              <button className="w-full gap-1 flex items-center justify-center max-w-[400px] border border-[#bbb3af] [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] rounded-full h-[58px] before:size-5 before:bg-cover before:bg-[url(/icons/ic-plus.svg)]">質問を追加
              </button>
            </div>
            <p className="text-center text-[#716c6b] md:text-[14px] text-[12px] mt-2">質問は最大4つまで</p>
            <div className="md:text-[14px] text-[12px] bg-[#f5f1ee] p-5 rounded-lg mt-4">
              <p className="font-bold">質問には、あなたの「聞きたいこと」や「希望」を書く</p>
              <p className="">
                例：慰謝料はいくら支払ってもらえますか。
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-y border-[#e9e5e4]">
        <div className="w-full max-w-[720px] mx-auto px-6 py-10">
          <div>
              <div className="flex justify-between mb-2">
                <p className="space-x-2 md:text-[14px] text-[12px]">
                  <span className="md:text-[16px] text-[14px] font-bold">相談タイトル</span>
                  <span className="text-[#ce2d14]">必須</span>
                  <span className="text-[#716c6b]">（10文字以上）</span>
                </p>
                <p className="text-[#716c6b]">0/50</p>
              </div>
              <div>
                <input name="" id="" className="md:text-[16px] text-[14px] h-[47px] border border-[#bbb3af] [box-shadow:inset_1px_1px_2px_rgba(38,_34,_33,_.08)] block rounded-lg px-4 py-3 w-full"></input>
              </div>
              <div className="flex justify-center mt-4">
                <button className="w-full gap-1 flex items-center justify-center max-w-[400px] border border-[#bbb3af] [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] rounded-full h-[58px] before:size-5 before:bg-cover before:bg-[url(/icons/auto-fill.svg)]">
                  AIで自動入力
              </button>
              </div>
              <p className="text-left text-[#716c6b] md:text-[14px] text-[12px] mt-3">相談内容がシステムで禁止された表現を含む場合、エラーとなる可能性があります。その際はご自身で入力ください。</p>
            </div>
        </div>
      </div>
      <div className="w-full max-w-[720px] mx-auto px-6 py-10">
        <div className="flex justify-between">
          <p className="font-bold md:text-[16px] text-[14px]">弁護士回答がついたらメールで知らせる</p>
          <div className="">
            <input type="checkbox" className="duration-300 relative border-[#f0ebe9] bg-[#f0ebe9] border w-[78px] h-[32px] md:text-[14px] text-[12px] appearance-none rounded-full before:border before:border-[#e9e5e4] before:[box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] before:rounded-full before:px-1 before:leading-none before:f;ex before:items-center before:justify-center before:font-bold before:py-1.5 before:w-1/2 before:absolute before:top-0 before:bg-white before:h-full before:content-['OFF'] before:text-center checked:before:content-['ON'] checked:bg-[#f7723e] checked:border-[#f7723e] checked:before:left-1/2 before:duration-300 before:left-0 before:transition-all" />
          </div>
        </div>
          <p className="text-left text-[#716c6b] md:text-[14px] text-[12px] mt-3">通知のメールは会員登録時のメールアドレスに送信されます</p>
        <p className="text-left text-[#716c6b] md:text-[14px] text-[12px] mt-6">利用規約・プライバシーの考え方・ みんなの法律相談ガイドラインをお読みのうえ、「同意して確認画面へ進む」ボタンを押してください。</p>
        <div className="flex justify-center mt-6">
          <button className="w-full gap-1 flex items-center justify-center max-w-[400px] border border-[#bbb3af] [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] rounded-full h-[58px] bg-[#f7723e] text-white font-bold">
                  同意して確認画面へ進む
              </button>
        </div>
      </div>
    </main>
  )
}
