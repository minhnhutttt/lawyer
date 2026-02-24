import Title from './ContactTitle'

type OfficeHoursProps = {
  className?: string
}

export default function ContactOfficeHours({ className = '' }: OfficeHoursProps) {
  return (
    <div className={`mt-8 ${className}`}>
      <Title>
        お問い合わせ窓口営業時間
      </Title>

      <div className="mt-4 border border-[#ccc] text-center py-4 px-3 bg-[#f3f3f3]">
        <p className="text-[15px] text-[#333]">平日10:00〜17:00（弊社休業日を除く）</p>
      </div>

      <div className="mt-4 text-[13px] text-[#333]">
        <p>
          こちらのお問い合わせ窓口では、
          <strong>個別の法律相談や、弁護士紹介のご依頼はお受けしておりません</strong>
          ので、ご注意ください。
        </p>

        <p>
          ※ドメイン指定受信設定を行っている場合は「@bengo4.com」からのメールを受け取れるよう受信設定を変更してください。
        </p>

        <p>
          お問い合わせを送信した時点で弊社より「お問い合わせの受付確認」メールを送信しております。該当メールが受信できない場合、弊社からの回答を受け取れない可能性がございますので、予め受信設定のご確認をお願いいたします。
        </p>
      </div>
    </div>
  )
}