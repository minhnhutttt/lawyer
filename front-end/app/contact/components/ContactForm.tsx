"use client";

import Image from "next/image";
import Title from './ContactTitle';
import Link from 'next/link';

type FormProps = {
  className?: string;
};

export default function ContactForm({ className = "" }: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <section className={`mt-8 ${className}`}>
      <Title>お問い合わせフォーム</Title>

      <div className="mt-4 border border-[#f0a35a] rounded-[4px] px-[15px] py-[15px] bg-white">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-[30px] h-[30px] flex items-center justify-center">
            <Image src="/icons/icon_check.png" alt="check" width={30} height={30} />
          </span>
          <div>
            <p className="text-[#ff9900] font-bold text-[1rem]">
              こちらのお問い合わせでは法律相談をお受けしておりません。
            </p>
            <p className="text-[#ff9900] text-[13px] mt-1">
              法律相談は「<Link href="/bbs/" className="text-[#005ebb] hover:underline">みんなの法律相談</Link>」にてご相談ください。
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-[#ffebd0] text-[#333] font-bold text-[13px] px-4 py-2 text-center">
        お問い合わせフォーム
      </div>

      {/* Form  */}
      <form className="mt-4 text-[#333]" onSubmit={handleSubmit}>
        {/* お名前 */}
        <div className="flex border-b border-[#ddd] py-4 focus-within:bg-[#fffdea] flex-col md:flex-row gap-2 md:gap-0">
          <label className="w-full md:w-[200px] text-[13px] font-bold text-[#333] pt-1 flex-shrink-0">お名前</label>
          <input
            type="text"
            name="name"
            className="h-[30px] w-full md:w-[260px] border border-[#999] rounded-[2px] px-2 text-[16px] md:text-[13px]"
          />
        </div>

        {/* お問い合わせ内容 */}
        <div className="flex border-b border-[#ddd] py-4 focus-within:bg-[#fffdea] flex-col md:flex-row gap-2 md:gap-0">
          <label className="w-full md:w-[200px] text-[13px] font-bold text-[#333] pt-1 flex-shrink-0">
            お問い合わせ内容
            <span className="ml-1 text-[10px] bg-[#f90] text-white px-[6px] py-[2px] rounded-[2px]">必須</span>
          </label>
          <div>
            <select
              name="category"
              className="h-[30px] w-full md:w-[320px] border border-[#999] rounded-[2px] px-2 text-[16px] md:text-[13px] bg-white"
              defaultValue=""
            >
              <option value="">[お問い合わせ内容を選択してください]</option>
              <option value="4">弁護士検索サービスのご利用に関して</option>
              <option value="5">みんなの法律相談のご利用に関して</option>
              <option value="14">弁護士ドットコムニュースについて</option>
              <option value="22">ログインでお困りの方</option>
              <option value="23">「感謝の声」について</option>
              <option value="24">弁護士ドットコムタイムズについて</option>
              <option value="10">広告掲載について</option>
              <option value="8">サイトご利用上のご意見/ご要望</option>
              <option value="7">エラーやシステムトラブルのご連絡</option>
              <option value="13">弁護士への取材協力のご依頼・ご相談</option>
              <option value="11">その他お問い合わせ</option>
            </select>
            <div className="mt-2">
              <Link href="#" className="text-[#005ebb] text-[13px] hover:underline">
                ユーザID再通知をご希望の方はこちら
              </Link>
            </div>
          </div>
        </div>

        {/* メールアドレス */}
        <div className="flex border-b border-[#ddd] py-4 focus-within:bg-[#fffdea] flex-col md:flex-row gap-2 md:gap-0">
          <label className="w-full md:w-[200px] text-[13px] font-bold text-[#333] pt-1 flex-shrink-0">
            メールアドレス
            <span className="ml-1 text-[10px] bg-[#f90] text-white px-[6px] py-[2px] rounded-[2px]">必須</span>
          </label>
          <div>
            <div className="flex items-center gap-2 bg-[#fff3f3] border border-[#fae7e7] text-[13px] text-[#fb4d4d] p-3 rounded-[2px] max-w-[420px]">
              <span className="text-[#fb4d4d] text-[22px] mt-[2px] flex-shrink-0">⚠</span>
              <p>
                ※既にやり取りがある場合は、前回お問い合わせいただいた際と同じメールアドレスをご入力ください。異なるメールアドレスよりご連絡いただくと、お問い合わせ履歴の確認が難しくなっております。
              </p>
            </div>
            <input
              type="email"
              name="email"
              className="mt-3 h-[30px] w-full md:w-[320px] border border-[#999] rounded-[2px] px-2 text-[16px] md:text-[13px]"
            />
          </div>
        </div>

        {/* ご意見・ご質問 */}
        <div className="flex border-b border-[#ddd] py-4 focus-within:bg-[#fffdea] flex-col md:flex-row gap-2 md:gap-0">
          <label className="w-full md:w-[200px] text-[13px] font-bold text-[#333] pt-1 flex-shrink-0">
            ご意見・ご質問
            <span className="ml-1 text-[10px] bg-[#f90] text-white px-[6px] py-[2px] rounded-[2px]">必須</span>
          </label>
          <div>
            <textarea
              name="body"
              className="max-w-[100%] w-full md:w-[420px] h-[120px] border border-[#999] rounded-[2px] px-2 py-2 text-[16px] md:text-[13px]"
              placeholder="お問い合わせ内容"
              maxLength={1200}
            />
            <p className="mt-1 text-[13px] text-[#333]">入力できる文字数：残り1200字</p>
          </div>
        </div>

        {/* プライバシー & 送信 */}
        <div className="py-6">
          <p className="text-[13px] text-[#333]">
            お問い合わせにあたっては、「<Link href="#" className="text-[#005ebb] hover:underline">プライバシーの考え方</Link>」をご確認いただいた上で、送信してください。
          </p>
          <div className="mt-3 border border-[#eee] bg-[#f8f8f8] px-4 py-3 flex justify-center">
            <label className="text-[13px] text-[#333] flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="privacy" />
              プライバシーの考え方を確認しました。
            </label>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-b from-[#ffa113] to-[#ff8e08] text-white font-bold text-[14px] px-10 py-3 rounded-[4px] hover:opacity-90 transition shadow-[inset_1px_1px_#f69400,inset_2px_2px_#ffa51e,inset_-1px_-1px_#dc7e09]"
            >
              送信する
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}