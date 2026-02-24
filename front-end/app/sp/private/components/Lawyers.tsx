import Image from "next/image";
import FocusAreas from "./FocusAreas";
import RenderButton from "./Button";
import { BookingButton, ContactButton, CallButton } from "./Button";

export type FocusAreaItem = {
  iconUrl: string;
  text: string;
};

type ButtonItem = BookingButton | ContactButton | CallButton;

export type LawyerItem = {
  imgUrl?: string;
  name: string;
  title: string;
  address: string;
  focusAreas?: FocusAreaItem[];
  btnList?: ButtonItem[];
  isWishlisted?: boolean;
};

type LawyerProps = {
  lawyerItems?: LawyerItem[]
}

const defaultLawyerItems: LawyerItem[] = []

export default function Lawyers({ lawyerItems = defaultLawyerItems }: LawyerProps) {
  return (
    <div className="space-y-3 px-0 md:px-10 mb-5 md:mb-10">
      {lawyerItems.map((lawyerItem, index) => (
        <div className="border border-[#ddd] rounded-[5px]" key={index}>
          <div className="flex flex-row items-start p-4 md:p-[42px] pb-2 md:pb-4 gap-[10px] relative">
            {/* Avatar */}
            {lawyerItem.imgUrl && (
              <div className="w-[58px] flex-shrink-0">
                <Image
                  src={lawyerItem.imgUrl}
                  alt={`${lawyerItem.name} 弁護士`}
                  width={58}
                  height={77}
                />
              </div>
            )}
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[3px] mb-[2px] text-[#222] font-bold">
                <span className="text-[17px]">{lawyerItem.name}</span>
                <span className="text-[11px] mt-[3px]">弁護士</span>
              </div>
              <div className="text-[13px] text-[#777]">{lawyerItem.title}</div>
              <div className="text-[13px] text-[#777]">{lawyerItem.address}</div>
            </div>
            {/* Star icon */}
            <div className={`absolute top-2.5 right-2.5 cursor-pointer ${lawyerItem.isWishlisted ? 'text-[#ffcc00]' : 'text-[#eee]'}`}>
              {lawyerItem.isWishlisted ? (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
              ) : (
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
              )}
            </div>
          </div>
          {/* Tag section */}
          <FocusAreas focusItems={lawyerItem.focusAreas} />

          {/* CTA */}
          {lawyerItem.btnList && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4 md:mb-[42px] px-4">
              {lawyerItem.btnList.map((btn, index) => {
                return (<RenderButton key={index} btn={btn} />)
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}



