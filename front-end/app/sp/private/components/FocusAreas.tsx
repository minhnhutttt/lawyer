import Image from "next/image";
import { FocusAreaItem } from "./Lawyers"

type FocusProps = {
  focusItems?: FocusAreaItem[]
  className?: string
}

const defaultFocusItems: FocusAreaItem[] = []

export default function FocusAreas({ focusItems = defaultFocusItems, className = '' }: FocusProps) {
  return (
    <div className={`bg-[#fefcf1] border-t border-b border-[#fff3d1] px-4 md:px-[42px] py-3 mb-4 md:mb-[42px] flex flex-wrap gap-2 md:gap-3 text-[10px] items-center ${className}`}>
      <Image
        src="/images/flag_pf.png"
        alt="flag"
        width={44}
        height={20}
      />
      {focusItems.map((focusItem, index) => (
        <div key={index} className="flex items-center gap-1">
          {focusItem.iconUrl && (
            <span className="flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center">
              <Image src={focusItem.iconUrl} alt="icon" width={18} height={18} />
            </span>
          )}
          {focusItem.text}
        </div>
      ))}
    </div>
  )
}