import React from 'react';
import { notFound } from 'next/navigation';
import ProductDetailClient from '../../../components/ProductDetailClient';

// Dynamic SEO metadata generation
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  let dress = null;
  
  try {
    const { getProductById } = await import('../../../lib/shopify');
    dress = await getProductById(resolvedParams.id);
  } catch (error) {
    console.error('Error loading product for metadata:', error);
  }
  
  if (!dress) {
    return {
      title: 'Modèle introuvable | Kelly Dress',
    };
  }

  return {
    title: `Robe de Mariée ${dress.name} | Collection ${dress.collection} | Kelly Dress`,
    description: `Découvrez la robe de mariée d'exception ${dress.name} par Kelly Dress. Silhouette ${dress.silhouette} en ${dress.materials[0]}. Confection sur mesure à Paris.`,
    openGraph: {
      title: `Robe de Mariée ${dress.name} | Kelly Dress`,
      description: `Découvrez la robe de mariée d'exception ${dress.name} par Kelly Dress. Confection sur mesure dans nos ateliers de couture.`,
      images: [
        {
          url: dress.image,
          width: 800,
          height: 1000,
          alt: dress.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  let dress = null;
  let allDresses = [];

  try {
    const { getProductById, getData } = await import('../../../lib/shopify');
    dress = await getProductById(resolvedParams.id);
    allDresses = await getData('products');
    
    // Si Shopify ne trouve pas le produit, utiliser les données statiques
    if (!dress) {
      const { dressesData: staticData } = await import('../../../data/dresses');
      dress = staticData.find((d) => d.id === resolvedParams.id);
      allDresses = staticData;
    }
  } catch (error) {
    console.error('Error loading product:', error);
    // Fallback sur données statiques
    const { dressesData: staticData } = await import('../../../data/dresses');
    dress = staticData.find((d) => d.id === resolvedParams.id);
    allDresses = staticData;
  }

  if (!dress) {
    notFound();
  }

  // Get similar dresses (same collection, excluding current)
  const similarDresses = allDresses
    .filter(d => d.collection === dress.collection && d.id !== dress.id)
    .slice(0, 3);

  // If there are not enough in the same collection, add others
  if (similarDresses.length < 3) {
    const extra = allDresses
      .filter(d => d.id !== dress.id && !similarDresses.some(s => s.id === d.id))
      .slice(0, 3 - similarDresses.length);
    similarDresses.push(...extra);
  }

  return <ProductDetailClient dress={dress} similarDresses={similarDresses} />;
}
