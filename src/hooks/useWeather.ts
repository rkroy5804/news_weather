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

interface NewsApiResponse {
  status: "ok" | "error";
  totalResults: number;
  articles: NewsArticle[];
  code?: string;
  message?: string;
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
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      if (!apiKey) throw new Error("News API key not set");

      const query = encodeURIComponent(searchTerm || category || "latest");
      const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${apiKey}`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data: NewsApiResponse = await res.json();
      if (data.status !== "ok") throw new Error(data.message || "Failed to fetch news");

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
