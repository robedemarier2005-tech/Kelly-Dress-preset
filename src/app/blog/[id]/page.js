import React from 'react';
import { notFound } from 'next/navigation';
import { blogArticles } from '../../../data/blog';
import BlogDetailClient from '../../../components/BlogDetailClient';

// Pre-render blog posts
export async function generateStaticParams() {
  return blogArticles.map((art) => ({
    id: art.id,
  }));
}

// Dynamic SEO metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const article = blogArticles.find((a) => a.id === resolvedParams.id);
  
  if (!article) {
    return {
      title: 'Article introuvable | Kelly Dress',
    };
  }

  return {
    title: article.seo?.metaTitle || `${article.title} | Kelly Dress Journal`,
    description: article.seo?.metaDescription || article.excerpt,
    keywords: article.seo?.keywords?.join(', ') || '',
    openGraph: {
      title: article.seo?.metaTitle || `${article.title} | Kelly Dress`,
      description: article.seo?.metaDescription || article.excerpt,
      images: [{ url: article.image }],
    },
  };
}

export default async function BlogArticlePage({ params }) {
  const resolvedParams = await params;
  const article = blogArticles.find((a) => a.id === resolvedParams.id);

  if (!article) {
    notFound();
  }

  return <BlogDetailClient article={article} />;
}
