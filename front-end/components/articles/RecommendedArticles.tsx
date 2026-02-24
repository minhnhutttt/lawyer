import {Article} from "@/lib/types/articles";
import Link from "next/link";
import articlesService from "@/lib/server/articles";
import {getTranslations} from '@/lib/server/i18n';

export async function RecommendedArticles({currentArticle}: { currentArticle: Article | null }) {
  const {t} = getTranslations();

  if (!currentArticle) return null;

  try {
    // Get articles from the same category, excluding the current article
    const response = await articlesService.getArticles({
      category: currentArticle.category
    });

    if (!response.data || response.data.length === 0) {
      return null;
    }

    // Filter out current article and limit to max 3
    const recommendedArticles = response.data
      .filter(article => article.id !== currentArticle.id)
      .slice(0, 3);

    // Don't render if no recommendations found
    if (recommendedArticles.length === 0) return null;

    return (
      <div className="border-t border-gray-200 mt-12 pt-8">
        <h3 className="text-xl font-semibold mb-6">
          {t('articles.recommendedArticles')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedArticles.map((article) => (
            <Link
              href={`/articles/${article.slug}`}
              key={article.id}
              className="block group hover:opacity-90 transition-opacity h-full"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                {/* Ảnh cố định height */}
                {article.thumbnail && (
                  <div className="w-full h-40 overflow-hidden flex-shrink-0">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {/* Nội dung stretch đều */}
                <div className="p-4">
                  <span
                    className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
            {t(`articles.categories.${article.category}`)}
          </span>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch recommended articles:', error);
    return null;
  }
}
