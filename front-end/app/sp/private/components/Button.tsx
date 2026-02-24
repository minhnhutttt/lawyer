import Link from "next/link"
import Image from "next/image";

export type FocusAreaItem = {
  iconUrl: string;
  text: string;
};

export type BookingButton = {
  type: "booking";
  phone: string;
};

export type ContactButton = {
  type: "contact";
  url: string;
};

export type CallButton = {
  type: "call";
  phone: string;
};

export type FindButton = {
  type: "find";
  iconUrl: string;
  text: string;
  url: string;
};

type ButtonItem = BookingButton | ContactButton | CallButton | FindButton;

type ButtonProps = {
  btn: ButtonItem
}

export default function RenderButton({ btn }: ButtonProps) {
  switch (btn.type) {
    case "booking":
      return (
        <Link
          href={`tel:${btn.phone}`}
          className="relative text-[13px] md:text-[14px] text-center font-bold w-full max-w-[400px] py-[7px] min-h-[46px] md:min-h-[58px] text-white rounded bg-[linear-gradient(180deg,#ffb415_0%,#ff9600_50%,#ff8500_50%,#ffa600_100%)] border border-[#d38947] [text-shadow:0_-1px_1px_#d38947] hover:opacity-90 flex items-center justify-center gap-2 transition"
        >
          <div className="w-5 h-5 bg-[#ff9900] rounded-full flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <Image src="/icons/icon_tel_w.png" alt="Icon Tel" width={16} height={16} />
          </div>
          電話で<br />面談予約
        </Link>
      )

    case "contact":
      return (
        <Link
          href={btn.url}
          className="relative text-[13px] md:text-[14px] text-center font-bold w-full max-w-[400px] py-[7px] min-h-[46px] md:min-h-[58px] border border-[#bbb] rounded flex items-center justify-center gap-2 hover:opacity-80 transition"
        >
          <div className="w-5 h-5 bg-[#ff9900] rounded-full flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <Image src="/icons/icon_mail_w.png" alt="Icon Mail" width={16} height={16} />
          </div>
          メールで<br />面談予約
        </Link>
      )

    case "call":
      return (
        <Link
          href={`tel:${btn.phone}`}
          className="relative text-[13px] md:text-[14px] text-center font-bold w-full max-w-[400px] py-[7px] min-h-[46px] md:min-h-[58px] text-white rounded bg-[linear-gradient(180deg,#ffb415_0%,#ff9600_50%,#ff8500_50%,#ffa600_100%)] border border-[#d38947] [text-shadow:0_-1px_1px_#d38947] hover:opacity-90 flex items-center justify-center gap-2 transition"
        >
          <div className="w-5 h-5 bg-[#ff9900] rounded-full flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <Image src="/icons/icon_tel_w.png" alt="Icon Tel" width={16} height={16} />
          </div>
          電話する
        </Link>
      )

    case "find":
      return (
        <Link
          href={btn.url}
          className="relative text-[17px] font-bold w-full max-w-[400px] border border-[#bbb] rounded flex items-center hover:opacity-80 transition"
        >
          <div className="w-5 h-5 bg-[#ff9900] rounded-full flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <Image src="/icons/icon_arrowRight_w.png" alt="Icon Tel" width={16} height={16} />
          </div>
          <div className="w-[56px] min-h-[46px] md:min-h-[58px] text-center border-r border-[#eee] mr-4 flex-shrink-0 h-full flex items-center justify-center">
            <Image src={btn.iconUrl} alt={btn.text} width={40} height={40} />
          </div>
          {btn.text}<span className="text-[13px] ml-1">から探す</span>
        </Link>
      )

    default:
      return null
  }
}