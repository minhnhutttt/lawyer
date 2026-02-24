import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ButtonLinkProps {
  children: React.ReactNode;
  link: string;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ children, link }) => {
  return (
    <Link href={link} className="text-sm font-bold pr-5 bg-[url(/images/icon_arrow_right_middle.png)] bg-no-repeat bg-right text-[#005ebb]">
                            {children}</Link>
  );
};

export default ButtonLink;
