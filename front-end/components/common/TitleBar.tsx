import Image from 'next/image';
import React from 'react';

interface TitleBarProps {
  children: React.ReactNode;
  icon?: string;
  right?: string
}

const TitleBar: React.FC<TitleBarProps> = ({ children, icon, right }) => {
  return (
    <div className="bg-[#efe5d9] justify-between rounded-[3px] text-[#74542b] text-[16px] md:text-[18px] font-bold mb-[15px] px-[15px] py-[7px] [text-shadow:0_1px_0_#fff] flex items-center gap-1 max-md:flex-col max-md:items-center">
      <span className='flex items-center gap-1'>
        {icon &&
        <Image
        src={icon}
        alt=""
        width={30}
        height={30}
        className="md:w-[30px] w-5 md:flex-[0_0_30px] flex-[0_0_20px]"
      />
      }
        <span>{children}</span>
      </span>
      {right && <span className='text-[10px] text-[#74542b]'>{right}</span>}
      
    </div>
  );
};

export default TitleBar;
