"use client";

import { useState, ReactNode } from "react";

type ExpandableSectionProps = {
  children: ReactNode;
  collapsedHeight?: number;
  openText?: string;
  closeText?: string;
};

export default function ExpandableSection({
  children,
  collapsedHeight = 90,
  openText = "続きを見る",
  closeText = "閉じる",
}: ExpandableSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* CONTENT */}
      <div
        className={`relative overflow-hidden`}
        style={{
          maxHeight: open ? "9999px" : `${collapsedHeight}px`,
        }}
      >
        {children}

        {/* OPEN BUTTON */}
        {!open && (
          <div className="absolute bottom-0 inset-x-0 flex justify-center items-center bg-[linear-gradient(180deg,_hsla(0,_0%,_100%,_0)_20%,_#fff_90%)]">
            <button
              onClick={() => setOpen(true)}
              className="md:text-[14px] text-[12px] flex items-center justify-center rounded-full border border-[#d9d9d9] md:min-w-[168px] min-w-[120px] font-bold py-1.5 md:py-2.5 bg-white hover:bg-[#f2f2f2] duration-150"
            >
              {openText}
            </button>
          </div>
        )}
      </div>

      {/* CLOSE BUTTON */}
      {open && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setOpen(false)}
            className="md:text-[14px] text-[12px] flex items-center justify-center rounded-full border border-[#d9d9d9] md:min-w-[168px] min-w-[120px] font-bold py-1.5 md:py-2.5 bg-white hover:bg-[#f2f2f2] duration-150"
          >
            {closeText}
          </button>
        </div>
      )}
    </div>
  );
}
