// Shopify Storefront API Configuration
// IMPORTANT: Remplacez ces valeurs par vos credentials Shopify réels
// Vous pouvez obtenir ces valeurs depuis votre admin Shopify > Settings > Apps and sales channels > Develop apps

export const shopifyConfig = {
  // Domaine de votre boutique Shopify (ex: votre-store.myshopify.com)
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN || 'kelly-wedding-studio.myshopify.com',
  
  // Access Token Storefront API (créez un app custom dans Shopify admin)
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '174cc9aad6c5e4455272b5a2c9ee137b',
  
  // Version de l'API Shopify (version stable recommandée)
  apiVersion: process.env.SHOPIFY_API_VERSION || '2025-07',
  
  // Language locale pour les requêtes
  defaultLocale: 'fr',
};

// Validation de la configuration
export function validateConfig() {
  if (!shopifyConfig.storeDomain || shopifyConfig.storeDomain === 'votre-store.myshopify.com') {
    console.warn('⚠️ Shopify store domain not configured. Please set SHOPIFY_STORE_DOMAIN in your environment variables.');
  }
  if (!shopifyConfig.storefrontAccessToken || shopifyConfig.storefrontAccessToken === 'votre-access-token') {
    console.warn('⚠️ Shopify storefront access token not configured. Please set NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN in your environment variables.');
  }
}
