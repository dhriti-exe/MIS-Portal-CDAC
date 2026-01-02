import { motion } from 'framer-motion'
import { Newspaper, ArrowRight } from 'lucide-react'
import { NewsItem } from '../../api/applicant'
import EmptyState from './EmptyState'

interface NewsCardProps {
  news: NewsItem[]
}

export default function NewsCard({ news }: NewsCardProps) {
  const displayNews = news.slice(0, 4)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
          <Newspaper className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Latest News</h2>
      </div>

      {displayNews.length === 0 ? (
        <EmptyState icon={Newspaper} title="No news available" description="Check back later for updates" />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {displayNews.map((item) => (
            <div
              key={item.news_id}
              className="p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition cursor-pointer active:bg-primary-100"
              onClick={() => {
                console.log('Read news:', item.news_id)
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {item.category_name}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">{item.news_title}</h3>
                  {item.news_desc && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{item.news_desc}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Valid: {formatDate(item.start_datetime)} - {formatDate(item.end_datetime)}
                  </p>
                </div>
                <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium self-start sm:self-auto">
                  Read more
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {news.length > 4 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all news →
          </button>
        </div>
      )}
    </motion.div>
  )
}

