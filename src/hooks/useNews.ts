// src/hooks/useNews.ts
"use client";

import { useState, useEffect } from "react";

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

export const useNews = ({ category = "", searchTerm = "", pageSize = 4, page = 1 }: UseNewsProps) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        if (!apiKey) throw new Error("News API key not set");

        const query = searchTerm || category || "latest";
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=${query}&pageSize=${pageSize}&page=${page}&sortBy=publishedAt&apiKey=${apiKey}`
        );
        const data = await res.json();

        if (data.status !== "ok") throw new Error(data.message || "Failed to fetch news");

        setArticles(data.articles || []);
      } catch (err: any) {
        setError(err.message || "Error fetching news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, searchTerm, page, pageSize]);

  return { articles, loading, error };
};
