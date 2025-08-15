// src/hooks/useNews.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

interface UseNewsProps {
  category?: string;
  searchTerm?: string;
  pageSize?: number;
  page?: number;
}

export const useNews = ({
  category = "",
  searchTerm = "",
  pageSize = 4,
  page = 1,
}: UseNewsProps) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        category,
        searchTerm,
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      const res = await fetch(`/api/news?${queryParams.toString()}`, { cache: "no-store" });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setArticles(data.articles || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error fetching news");
    } finally {
      setLoading(false);
    }
  }, [category, searchTerm, page, pageSize]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { articles, loading, error, refetch: fetchNews };
};
