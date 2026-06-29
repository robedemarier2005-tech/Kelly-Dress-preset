/**
 * Point d'entrée principal pour l'intégration Shopify
 * Exporte toutes les fonctions nécessaires pour utiliser Shopify Storefront API
 */

// Configuration et client
export { shopifyConfig, validateConfig } from './config';
export { shopifyClient, executeGraphQL } from './client';

// Import des fonctions pour utilisation interne
import { getProducts, getProduct, searchProducts, getAllProductsPaginated } from './products';
import { getCollections, getCollection, getCollectionProducts, getAllCollectionsPaginated, getAllCollectionProductsPaginated } from './collections';
import { createCart, addToCart, updateCart, removeFromCart, getCart, formatCart, toGid, fromGid } from './cart';
import { mapShopifyProductToDress, mapShopifyCollectionToCollection, mapShopifyCartLineToCartItem, mapShopifyCartToCart, mapShopifyProductsToDresses, mapShopifyCollectionsToCollections } from './mapper';

// Ré-export pour utilisation externe
export {
  getProducts,
  getProduct,
  searchProducts,
  getAllProductsPaginated,
  getCollections,
  getCollection,
  getCollectionProducts,
  getAllCollectionsPaginated,
  getAllCollectionProductsPaginated,
  createCart,
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
  formatCart,
  toGid,
  fromGid,
  mapShopifyProductToDress,
  mapShopifyCollectionToCollection,
  mapShopifyCartLineToCartItem,
  mapShopifyCartToCart,
  mapShopifyProductsToDresses,
  mapShopifyCollectionsToCollections,
};

/**
 * Fonction de compatibilité pour récupérer les données
 * Utilise Shopify si configuré, sinon retourne les données statiques
 * @param {string} dataType - Type de données ('products' ou 'collections')
 * @returns {Promise<Array>} Données formatées
 */
export async function getData(dataType) {
  try {
    // Vérifier si Shopify est configuré
    const { shopifyConfig } = await import('./config');
    const isConfigured = shopifyConfig.storeDomain !== 'votre-store.myshopify.com' &&
                        shopifyConfig.storefrontAccessToken !== 'votre-access-token';
    
    if (isConfigured) {
      // Utiliser Shopify
      if (dataType === 'products') {
        const shopifyProducts = await getProducts(250);
        const { mapShopifyProductsToDresses } = await import('./mapper');
        return mapShopifyProductsToDresses(shopifyProducts);
      } else if (dataType === 'collections') {
        const shopifyCollections = await getCollections(250);
        const { mapShopifyCollectionsToCollections } = await import('./mapper');
        return mapShopifyCollectionsToCollections(shopifyCollections);
      }
    }
  } catch (error) {
    console.warn('Shopify API error, falling back to static data:', error);
  }
  
  // Fallback sur les données statiques
  if (dataType === 'products') {
    const { dressesData } = await import('../../data/dresses');
    return dressesData;
  } else if (dataType === 'collections') {
    const { collectionsData } = await import('../../data/dresses');
    return collectionsData;
  }
  
  return [];
}

/**
 * Fonction de compatibilité pour récupérer un produit par ID/handle
 * @param {string} id - ID ou handle du produit
 * @returns {Promise<Object|null>} Produit ou null
 */
export async function getProductById(id) {
  try {
    const { shopifyConfig } = await import('./config');
    const isConfigured = shopifyConfig.storeDomain !== 'votre-store.myshopify.com' &&
                        shopifyConfig.storefrontAccessToken !== 'votre-access-token';
    
    if (isConfigured) {
      const shopifyProduct = await getProduct(id);
      const { mapShopifyProductToDress } = await import('./mapper');
      return mapShopifyProductToDress(shopifyProduct);
    }
  } catch (error) {
    console.warn('Shopify API error, falling back to static data:', error);
  }
  
  // Fallback sur les données statiques
  const { dressesData } = await import('../../data/dresses');
  return dressesData.find(dress => dress.id === id) || null;
}

/**
 * Fonction de compatibilité pour récupérer une collection par ID/handle
 * @param {string} id - ID ou handle de la collection
 * @returns {Promise<Object|null>} Collection ou null
 */
export async function getCollectionById(id) {
  try {
    const { shopifyConfig } = await import('./config');
    const isConfigured = shopifyConfig.storeDomain !== 'votre-store.myshopify.com' &&
                        shopifyConfig.storefrontAccessToken !== 'votre-access-token';
    
    if (isConfigured) {
      const shopifyCollection = await getCollection(id);
      const { mapShopifyCollectionToCollection } = await import('./mapper');
      return mapShopifyCollectionToCollection(shopifyCollection);
    }
  } catch (error) {
    console.warn('Shopify API error, falling back to static data:', error);
  }
  
  // Fallback sur les données statiques
  const { collectionsData } = await import('../../data/dresses');
  return collectionsData.find(collection => collection.id === id) || null;
}
