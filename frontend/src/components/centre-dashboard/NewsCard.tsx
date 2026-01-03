import { motion } from 'framer-motion'
import { Newspaper, Calendar, Tag } from 'lucide-react'
import { NewsItem } from '../../api/center'
import EmptyState from '../applicant-dashboard/EmptyState'

interface NewsCardProps {
  news: NewsItem[]
}

export default function NewsCard({ news }: NewsCardProps) {
  const displayNews = news.slice(0, 5)

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
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
            <Newspaper className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">News & Announcements</h2>
        </div>
      </div>

      {displayNews.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No news available"
          description="Check back later for updates and announcements"
        />
      ) : (
        <div className="space-y-4">
          {displayNews.map((item) => (
            <div
              key={item.news_id}
              className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex-1">
                  {item.news_title}
                </h3>
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md">
                  <Tag className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">{item.category_name}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                {item.news_desc}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {formatDate(item.start_datetime)} - {formatDate(item.end_datetime)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {news.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            View all news →
          </button>
        </div>
      )}
    </motion.div>
  )
}

