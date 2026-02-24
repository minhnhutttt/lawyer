type TitleProps = {
  children: React.ReactNode
  variant?: 1 | 2
  className?: string
}

export default function ContactTitle({ children, variant = 2, className = '' }: TitleProps) {
  if (variant === 1) {
    return (
      <h1 className={`text-[24px] font-bold pb-[10px] border-b border-[#ddd] ${className}`}>
        {children}
      </h1>
    )
  }

  return (
    <h2 
      className={`bg-[#efe5d9] rounded-[3px] text-[#74542b] text-[18px] font-bold py-[8px] px-[15px] ${className}`}
      style={{ textShadow: '0 1px 0 #fff' }}
    >
      {children}
    </h2>
  )
}