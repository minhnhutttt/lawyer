import Link from "next/link";
import { ArticleRank } from "./ArticlesItem";

export const ArticlesRanks = () => (
  <div className="md:[flex-basis:33.3333333333%] md:mt-10 md:max-w-[33.3333333333%] px-3 md:px-6 space-y-6">
            <p className="mb-8 md:text-[20px] text-[18px] font-bold">アクセスランキング</p>
            <div className="flex flex-col">
              <ArticleRank rank={1} link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
              <ArticleRank rank={2} link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
              <ArticleRank rank={3} link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
              <ArticleRank rank={4} link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
              <ArticleRank rank={5} link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
              <ArticleRank rank={6} link="/articles/id" title="コインパーキングに7年放置で逮捕、「長期無断駐車」どうすれば…弁護士が教える撃退法" desc="神戸市内のコインパーキングで約7年にわたり、料金を支払わずに車を停め続け、管理会社の業務を妨害したと" time="2026年02月10日 12時27分" image="/images/articles/22686_2_1.jpg" />
            </div>
            <Link href="/articles/id" className="border-t border-[#e9e5e4] py-6 flex relative after:absolute after:border-t-[2px] after:border-r-[2px] after:h-2 after:w-2 after:rotate-45 after:-translate-y-1/2 after:border-[#f7723e] after:top-1/2 after:right-4 md:text-[18px] text-[16px] font-bold text-[#315dbb] px-6">
            もっと見る
            </Link>
          </div>
)