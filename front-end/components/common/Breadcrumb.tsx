'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <div className='border-b border-[#e9e5e4] mb-[30px]'>
      <nav aria-label="Breadcrumb" className={`w-full max-w-[980px] mx-auto flex items-center text-xs py-[14px] px-2.5 ${className}`}>
          <ul className="flex items-center flex-wrap gap-1">

            <li className="flex items-center">
                <Link
                  href="/"
                  className="flex items-center gap-1 text-gray-500 hover:text-primary-600 hover:underline"
                  aria-label="Home"
                >
                  <Home className="w-3 h-3" />
                  弁護士ドットコム
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            </li>

            {items.map((item, index) => {
                const isLast = index === items.length - 1
                return (
                  <li key={index} className="flex items-center">
                      {item.href && !isLast ? (
                        <Link
                            href={item.href}
                            className="text-gray-500 hover:text-primary-600 hover:underline"
                        >
                            {item.label}
                        </Link>
                      ) : (
                        <span className="font-medium text-[#333]" aria-current={isLast ? 'page' : undefined}>
                            {item.label}
                        </span>
                      )}
                      {!isLast && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
                  </li>
                )
            })}
          </ul>
      </nav>
    </div>
  )
}
