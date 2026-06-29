import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { shopifyConfig, validateConfig } from './config';

// Valider la configuration au chargement
validateConfig();

// Création du client Storefront API
export const shopifyClient = createStorefrontApiClient({
  storeDomain: shopifyConfig.storeDomain,
  apiVersion: shopifyConfig.apiVersion,
  publicAccessToken: shopifyConfig.storefrontAccessToken,
});

// Fonction utilitaire pour exécuter une requête GraphQL
export async function executeGraphQL(query, variables = {}) {
  try {
    const response = await shopifyClient.request(query, { variables });
    
    if (response.errors) {
      console.error('GraphQL Errors:', response.errors);
      throw new Error(`GraphQL Error: ${response.errors[0].message}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw error;
  }
}

// Types TypeScript pour les réponses Shopify (commentaires pour référence)
/*
interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[];
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    nodes: Array<{
      id: string;
      url: string;
      altText: string | null;
      width: number;
      height: number;
    }>;
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      price: { amount: string; currencyCode: string };
      availableForSale: boolean;
      selectedOptions: Array<{ name: string; value: string }>;
    }>;
  };
  collections: {
    nodes: Array<{
      id: string;
      title: string;
      handle: string;
    }>;
  };
}

interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  products: {
    nodes: ShopifyProduct[];
  };
}
*/
