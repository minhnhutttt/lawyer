
interface PageTitleProps {
    children: React.ReactNode;
    className?: string;
}

export default function PageTitle({ children, className = "" }: PageTitleProps) {
    return (
        <h1 className={`text-[20px] md:text-[25px] font-bold pb-2.5 border-b border-gray-300 mb-6 md:mb-8 ${className}`}>
            {children}
        </h1>
    );
}