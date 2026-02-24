'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const list = [
    {
      title: '弁護士検索',
      items: [
        {
          href: '/search',
          text: '弁護士を探す',
        },
        {
          href: '/private/bookmark/lawyer/',
          text: 'お気に入りの弁護士をみる',
        },
        {
          href: '/private/view/lawyer/',
          text: '閲覧した弁護士をみる',
        },
      ]
    },
    {
      title: 'みんなの法律相談',
      items: [
        {
          href: '/bbs',
          text: 'みんなの相談をみる',
        },
        {
          href: '/bbs/question/',
          text: '相談を投稿する',
        },
        {
          href: '/sp/private/view/question/',
          text: '閲覧した相談をみる',
        },
      ]
    },
    {
      title: '一括見積り',
      items: [
        {
          href: '/estimate/',
          text: '一括見積りをはじめる',
        },
        {
          href: '/faq/316/',
          text: '一括見積りのよくあるお問い合わせ ',
        },
      ]
    },
    {
      title: 'その他サービス',
      items: [
        {
          href: '/bbs',
          text: '弁護士ドットコムニュース',
        },
        {
          href: '/mother/',
          text: '妊娠中のお母さんのためのお悩み対処法 ',
        },
      ]
    },
    {
      title: 'ヘルプ',
      items: [
        {
          href: '/about',
          text: 'はじめての方へ',
        },
        {
          href: '/faq/',
          text: 'よくあるお問い合わせ ',
        },
        {
          href: '/rules/',
          text: '利用規約 ',
        },
      ]
    }
  ]

  return (
    <header className="bg-white shadow-sm relative z-50 py-4 px-2 [box-shadow:0_1px_4px_rgba(38,_34,_33,_.12)]">
      <div className="w-full max-w-[980px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex flex-col items-start">
          <Image
            src="/images/logo.png"
            alt=""
            width={360}
            height={60}
            className="md:w-[240px] w-[192px]"
            priority
          />
        </Link>

        <div className="flex gap-2.5">
          <Link href="/sp/private/view/question/" className="flex flex-col items-center gap-2 min-w-10">
            <Image
              src="/icons/history.svg"
              alt=""
              width={16}
              height={16}
              priority
            />
            <span className="text-[10px] leading-none">閲覧履歴</span>
          </Link>
          <Link href="/sp/private/view/question/" className="flex flex-col items-center gap-2 min-w-10">
            <Image
              src="/icons/favorite.svg"
              alt=""
              width={16}
              height={16}
              priority
            />
            <span className="text-[10px] leading-none">お気に入り</span>
          </Link>

          {/* MENU BUTTON */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-2 min-w-10"
          >
            <Image
              src="/icons/menu.svg"
              alt=""
              width={16}
              height={16}
              priority
            />
            <span className="text-[10px] leading-none">メニュー</span>
          </button>
        </div>
      </div>

      {/* MENU OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-50 overflow-auto text-base bg-white">
          <div className="h-[66px] md:h-[90px] bg-white py-2 pl-4 flex items-center">
            <div className="w-full max-w-[960px] mx-auto flex items-center justify-between pr-2">
              <button
                onClick={() => setOpen(false)}
                className="text-[#639] py-3 text-sm underline md:text-base font-bold  before:border-solid before:border-t-2 before:border-r-2 before:content-[''] before:inline-block before:h-2 before:-translate-y-1/4 before:-rotate-[135deg] before:w-2 before:mr-1 before:border-[#f7723e]"
              >
                弁護士ドットコム トップ
              </button>

              <button
                onClick={() => setOpen(false)}
                className="flex flex-col items-center gap-2 min-w-10"
              >
                <Image
                  src="/icons/close.svg"
                  alt=""
                  width={20}
                  height={20}
                  priority
                />
                <span className="text-[10px] leading-none">閉じる</span>
              </button>
            </div>
          </div>

          <div className="bg-[#F1ECEA]/50 py-4 px-6">
            <div className="w-full max-w-[1104px] mx-auto">
              <div className="w-full md:max-w-[66.6666667%] mx-auto space-y-4">
                <div className="px-6 py-4 bg-white md:px-8 md:py-6">
                  <p className="text-[10px] md:text-[11px] leading-[1.4] mb-3 text-center">
                    みんなの法律相談で弁護士に相談するには<br className="md:hidden" />
                    「弁護士ドットコムID」が必要になります。
                  </p>
                  <div className="flex justify-center max-md:flex-col">
                    <div className="w-full mb-3 md:w-1/3 md:mx-2">
                      <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center w-full bg-[#f7723e] rounded-full text-xs font-bold px-4 py-3 text-white relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-white after:top-1/2 after:right-4"
                      >
                        新規会員登録
                        <span className="bg-white text-[#e94a00] rounded-[16px] text-[10px] font-normal ml-2 py-0.5 px-1">
                          無料
                        </span>
                      </Link>
                    </div>
                    <div className="w-full mb-3 md:w-1/3 md:mx-2">
                      <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center w-full bg-white border-[#bbb3af] border rounded-full text-xs font-bold px-4 py-3 text-[#262221] relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4"
                      >
                        ログインする
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-white md:px-8 md:py-6">
                  <p className="text-[10px] md:text-[11px] leading-[1.4] mb-3 text-center">
                    さらにプレミアムサービスに登録すると、<br className="md:hidden" />
                    コーヒー1杯分のお値段で専門家の回答が見放題になります。
                  </p>
                  <div className="flex justify-center">
                    <div className="max-w-[400px] w-full md:mx-2">
                      <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center w-full bg-[#f7723e] rounded-full text-xs font-bold px-4 py-3 text-white relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-white after:top-1/2 after:right-4 before:size-[14px] before:bg-[url(/icons/link-p.svg)] before:bg-cover before:absolute before:left-4"
                      >
                        プレミアムサービスについて見る
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center mb-4">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="text-[#625d5b] bg-[#f0ecec] border border-[#d5d5d5] rounded-full text-[11px] font-semibold py-1 h-9 px-5 w-fit"
                  >
                    弁護士ログインはこちら
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[1104px] mx-auto mt-14 max-md:px-5">
            <div className="w-full md:max-w-[66.6666667%] mx-auto space-y-4">
              <div className="overflow-hidden">
                {list.map((menu, index) => (
                  <div className="mb-14" key={index}>
                    <p className="md:text-[18px] font-bold mb-4 leading-[1.4]">
                      {menu.title}
                    </p>
                    <ul className="flex flex-wrap -mx-6 overflow-hidden">
                      {menu.items.map((item, i) => (
                        <li className="w-full px-6 md:w-1/2" key={i}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="p-4 pl-0 flex w-full relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4 text-base font-bold text-[#005ebb] border-t border-[#e9e5e4] -mt-px"
                          >
                            {item.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
