import Link from "next/link"

interface TagsProps {
  text: string;
  href: string;
}

const Tags = ({ title, tags }: { title: string, tags: TagsProps[] }) => {
  return (
    <div>
        <p className="md:text-[16px] text-[14px] font-bold mb-3">{title}</p>
        <div className="flex flex-wrap gap-2">
            {tags.map(({ text, href }) => (
                <Link href={href} key={text} className="p-2.5 rounded-[28px] leading-none font-medium border border-[#d9d9d9] md:text-[14px] text-[12px]">{text}</Link>
            ))}
        </div>
    </div>
  )
}

export default Tags