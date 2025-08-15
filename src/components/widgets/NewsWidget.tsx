"use client";

import { useState, useMemo } from "react";
import { useNews, NewsArticle } from "@/hooks/useNews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const categories = [
  { label: "All", value: "all" },
  { label: "Technology", value: "technology" },
  { label: "Business", value: "business" },
  { label: "Sports", value: "sports" },
  { label: "Entertainment", value: "entertainment" },
];

export default function NewsWidget() {
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  // ✅ Avoid recalculating on every render
  const apiCategory = useMemo(() => (category === "all" ? "" : category), [category]);

  const { articles, loading, error } = useNews({ category: apiCategory, page, pageSize: 6 });

  return (
    <Card className="w-full p-4 bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-4">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Latest News
        </CardTitle>

        {/* Category Select */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
        {loading && <p className="text-gray-900 dark:text-gray-100">Loading news...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && articles.length === 0 && (
          <p className="text-gray-900 dark:text-gray-100">No news found.</p>
        )}

        {articles.map((article: NewsArticle, index) => (
          <div
            key={`${article.url}-${index}`}
            className="flex flex-col sm:flex-row bg-gray-50 dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition p-4 gap-4"
          >
            <img
              src={article.urlToImage || "/placeholder.png"}
              alt={article.title}
              loading="lazy" // ✅ Improves performance by lazy-loading images
              className="w-full sm:w-40 h-32 sm:h-auto object-cover rounded flex-shrink-0"
            />
            <div className="flex flex-col justify-between">
              <h3 className="font-semibold text-lg line-clamp-2 sm:line-clamp-3 text-gray-900 dark:text-gray-100">
                {article.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                {article.description}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer" // ✅ Security improvement
                className="mt-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </CardContent>

      {/* Load More */}
      {articles.length > 0 && !loading && (
        <div className="flex justify-center mt-4">
          <Button onClick={() => setPage((prev) => prev + 1)}>Load More</Button>
        </div>
      )}
    </Card>
  );
}
