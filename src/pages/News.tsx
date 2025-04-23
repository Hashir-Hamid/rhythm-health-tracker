
import React, { useState, useEffect } from "react";
import { fetchHealthNews, NewsArticle } from "@/services/newsService";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";

const News = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        const articles = await fetchHealthNews();
        setNews(articles);
        setError(null);
      } catch (error) {
        console.error("Error loading news:", error);
        setError("Unable to load health news. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  const formatPublishDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Health News</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Stay updated with the latest health and wellness developments.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="p-6 rounded-lg bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          <p className="text-center">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <div key={index} className="flex flex-col h-full overflow-hidden rounded-lg border shadow-sm bg-white dark:bg-gray-900">
              <div className="h-48 relative overflow-hidden">
                {article.urlToImage ? (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400?text=Health+News";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <span className="text-gray-400 dark:text-gray-500">No image available</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 p-5 space-y-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatPublishDate(article.publishedAt)}</span>
                </div>
                
                <h2 className="text-xl font-semibold line-clamp-2 text-gray-900 dark:text-white">
                  {article.title}
                </h2>
                
                <p className="line-clamp-3 text-gray-600 dark:text-gray-300 text-sm">
                  {article.description || "Read the full article for more details."}
                </p>
                
                <div className="flex space-x-2 pt-2">
                  <span className="bg-health-blue/10 text-health-blue text-xs font-medium px-2.5 py-0.5 rounded dark:bg-health-blue/20">
                    {article.source.name || "Health"}
                  </span>
                </div>
              </div>
              
              <div className="p-5 pt-0">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-health-blue hover:underline"
                >
                  Read more
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
