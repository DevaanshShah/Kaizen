import { Clock } from "lucide-react"

export function NewsSection() {
  const newsArticles = [
    {
      title: "Tech Giants Report Strong Q4 Earnings Despite Economic Headwinds",
      excerpt: "Major technology companies exceeded analyst expectations, with cloud computing and digital advertising driving growth.",
      author: "Michael Chen",
      time: "4 hours ago",
      category: "Technology",
      image: "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "Oil Prices Surge on Middle East Supply Concerns",
      excerpt: "Crude oil futures jumped 3% as geopolitical tensions raise questions about global energy supply chains.",
      author: "Emma Rodriguez",
      time: "6 hours ago",
      category: "Energy",
      image: "https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "Housing Market Shows Signs of Stabilization",
      excerpt: "New data suggests the real estate market may be finding its footing after months of declining sales and rising rates.",
      author: "David Park",
      time: "8 hours ago",
      category: "Real Estate",
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "European Central Bank Maintains Hawkish Stance",
      excerpt: "ECB officials signal continued commitment to fighting inflation despite growing recession concerns across the eurozone.",
      author: "Sophie Laurent",
      time: "10 hours ago",
      category: "Global Markets",
      image: "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "Cryptocurrency Market Rebounds After Regulatory Clarity",
      excerpt: "Bitcoin and major altcoins rally following positive regulatory developments in key markets.",
      author: "Alex Thompson",
      time: "12 hours ago",
      category: "Crypto",
      image: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      title: "Manufacturing Data Points to Economic Resilience",
      excerpt: "Latest PMI figures suggest industrial activity remains robust despite global economic uncertainties.",
      author: "Rachel Kim",
      time: "14 hours ago",
      category: "Economy",
      image: "https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">View all news →</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article, index) => (
            <article
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {article.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.time}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                <div className="text-sm text-gray-500">
                  By {article.author}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}