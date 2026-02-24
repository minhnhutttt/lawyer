'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import articlesService from '../../lib/services/articles'
import { Article, ARTICLE_CATEGORIES, ArticleCategory } from '@/lib/types'
import { Loader2, Search, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { ArticleItem, ArticleItemSide } from './components/ArticlesItem'
import { ArticlesRanks } from './components/ArticlesRanks'


export default function ArticlesPage() {
  const { t } = useTranslation()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | ''>('')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const response = await articlesService.getArticles({
          status: 'published',
          query: searchTerm || undefined,
          category: selectedCategory || undefined
        })
        if (response.data) {
          setArticles(response.data)
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [searchTerm, selectedCategory])

  return (
    <div className="w-full">
      <div className="max-xl:px-6 md:pt-5">
        <div className="w-full max-w-[1104px] mx-auto">
          <div className="py-3 flex items-center justify-between md:text-[16px] text-[14px] font-bold max-md:flex-col">
            <div className="flex overflow-auto w-full whitespace-nowrap">
              <button className="p-4 border-b-2 border-[#f7723e] hover:bg-[hsla(17,19%,93%,.55)] duration-150">総合</button>
              <button className="p-4 border-b-2 border-[#e9e5e4] hover:bg-[hsla(17,19%,93%,.55)] duration-150">法曹</button>
              <span className="px-2.5 border-b-2 border-[#e9e5e4] after:bg-[#eee] after:h-6 after:w-px flex items-center justify-center"></span>
              <button className="flex items-center gap-1 p-4 border-b-2 border-[#e9e5e4] after:size-[14px] after:bg-[url(/icons/icon_external_link.svg)] after:bg-cover hover:bg-[hsla(17,19%,93%,.55)] duration-150">
                <Image
                  src="/icons/topics-share-youtube-mono.svg"
                  alt=""
                  width={16}
                  height={16}
                />
                YouTube
              </button>
              <button className="flex items-center gap-1 p-4 border-b-2 border-[#e9e5e4] after:size-[14px] after:bg-[url(/icons/icon_external_link.svg)] after:bg-cover hover:bg-[hsla(17,19%,93%,.55)] duration-150">
                <Image
                  src="/icons/topics-share-tiktok-mono.svg"
                  alt=""
                  width={16}
                  height={16}
                />
                TikTok
              </button>
              <button className="flex items-center gap-1 p-4 border-b-2 border-[#e9e5e4] after:size-[14px] after:bg-[url(/icons/icon_external_link.svg)] after:bg-cover hover:bg-[hsla(17,19%,93%,.55)] duration-150">
                <Image
                  src="/icons/topics-share-spotify-mono.svg"
                  alt=""
                  width={16}
                  height={16}
                />Podcast
              </button>
            </div>
            <div className="relative flex justify-end flex-1 max-md:w-full max-md:mt-6">
              <div className="relative w-full md:w-[340px] md:text-[18px] text-[16px]">
                <input type="text" className="w-full [box-shadow:inset_1px_1px_2px_rgba(38,_34,_33,_.08)] font-normal border border-[#bbb3af] rounded-md py-3 pr-10 pl-4" placeholder='気になるキーワードで検索' />
                <div className="absolute w-12 right-0 bottom-0 top-0 flex items-center justify-center border-l border-[#bbb3af] text-[#bbb3af]">
                  <Search size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Articles Content Section */}
      <div className="w-full max-w-[1152px] mx-auto">
        <div className="flex flex-wrap">
          <div className="mt-10 mb-6 md:[flex-basis:58.3333333333%] md:max-w-[58.3333333333%] max-md:flex-col flex gap-4">
            <header>
              <h1 className="mb-6 md:text-[20px] text-[18px] font-bold max-md:px-6">新着記事</h1>
            </header>
            <div className="md:px-2 px-6 flex-1">
              <Link href="/articles/id" className="flex flex-col">
                <span className="h-[220px] md:h-[321px] mb-4 rounded-md">
                  <Image
                    src="/images/articles/22686_2_1.jpg"
                    alt=""
                    width={1200}
                    height={600}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </span>
                <span className="md:text-[27px] text-[20px] font-bold mb-2">
                  羽賀研二氏が不同意わいせつ容疑で逮捕　起訴されたら、実刑になる可能性は？　過去2度の有罪判決
                </span>
                <span className="md:text-[16px] text-[14px] text-[#716c6b] line-clamp-2 mb-4">
                  タレントの羽賀研二氏が2月9日、沖縄県内の飲食店で女性2人にわいせつな行為をしたとして、不同意わいせ...
                </span>
                <span className="md:text-[14px] text-[12px] text-[#716c6b]">
                  2026年02月10日 12時27分...
                </span>
              </Link>
            </div>
          </div>
          <div className="md:[flex-basis:41.6666666667%] md:mt-10 md:max-w-[41.6666666667%] px-3 md:px-6 space-y-6">
            <ArticleItemSide link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
            <ArticleItemSide link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
          </div>
        </div>
        <div className="flex flex-start flex-wrap max-md:flex-col">
          <div className="mt-10 md:[flex-basis:66.6666666667%] md:max-w-[66.6666666667%] flex-col flex gap-4 mb-[56px]">
            <div className="flex flex-wrap">
              <ArticleItem link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
              <ArticleItem link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
              <ArticleItem link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
              <ArticleItem link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
              <ArticleItem link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
              <ArticleItem link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
            </div>
            <Link href="/articles/id" className="border-t border-[#e9e5e4] py-6 flex relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4 md:text-[18px] text-[16px] font-bold text-[#315dbb] px-6">
              もっと見る
            </Link>
          </div>
          <ArticlesRanks />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-12 flex justify-center">
        <Link href="/articles/id" className="flex relative w-full max-w-[900px] items-center justify-center bg-[#fbf9f8] rounded-full [box-shadow:0_2px_3px_rgba(38,_34,_33,_.08)] py-4 px-6 md:text-[18px] text-[16px] after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 mdLafter:right-8 after:right-4">弁護士ドットコムニュースについて</Link>
      </div>
    </div>
  )
}
