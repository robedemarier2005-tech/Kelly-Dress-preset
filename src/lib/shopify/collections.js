import { executeGraphQL } from './client';

// GraphQL Query pour récupérer toutes les collections
const GET_ALL_COLLECTIONS_QUERY = `
  query GetAllCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
          productsCount {
            count
          }
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// GraphQL Query pour récupérer une collection par son handle
const GET_COLLECTION_BY_HANDLE_QUERY = `
  query GetCollectionByHandle($handle: String!, $first: Int!, $after: String) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
        width
        height
      }
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            vendor
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              nodes {
                id
                url
                altText
                width
                height
              }
            }
            variants(first: 5) {
              nodes {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

// GraphQL Query pour récupérer les produits d'une collection
const GET_COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProducts($handle: String!, $first: Int!, $after: String) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            vendor
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              nodes {
                id
                url
                altText
                width
                height
              }
            }
            variants(first: 5) {
              nodes {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

/**
 * Récupère toutes les collections depuis Shopify
 * @param {number} first - Nombre de collections à récupérer (défaut: 50)
 * @param {string} after - Cursor pour la pagination (optionnel)
 * @returns {Promise<Array>} Liste des collections
 */
export async function getCollections(first = 50, after = null) {
  const variables = { first, after };
  const data = await executeGraphQL(GET_ALL_COLLECTIONS_QUERY, variables);
  
  return data.collections.edges.map(edge => ({
    ...edge.node,
    pageInfo: data.collections.pageInfo,
  }));
}

/**
 * Récupère une collection par son handle depuis Shopify
 * @param {string} handle - Handle de la collection (slug)
 * @param {number} first - Nombre de produits à récupérer (défaut: 50)
 * @param {string} after - Cursor pour la pagination (optionnel)
 * @returns {Promise<Object|null>} Collection ou null si non trouvée
 */
export async function getCollection(handle, first = 50, after = null) {
  const variables = { handle, first, after };
  const data = await executeGraphQL(GET_COLLECTION_BY_HANDLE_QUERY, variables);
  
  return data.collectionByHandle || null;
}

/**
 * Récupère les produits d'une collection
 * @param {string} handle - Handle de la collection
 * @param {number} first - Nombre de produits à récupérer (défaut: 50)
 * @param {string} after - Cursor pour la pagination (optionnel)
 * @returns {Promise<Object|null>} Collection avec ses produits ou null si non trouvée
 */
export async function getCollectionProducts(handle, first = 50, after = null) {
  const variables = { handle, first, after };
  const data = await executeGraphQL(GET_COLLECTION_PRODUCTS_QUERY, variables);
  
  return data.collectionByHandle || null;
}

/**
 * Récupère toutes les collections avec pagination complète
 * @returns {Promise<Array>} Toutes les collections
 */
export async function getAllCollectionsPaginated() {
  let allCollections = [];
  let hasNextPage = true;
  let after = null;
  
  while (hasNextPage) {
    const result = await getCollections(250, after);
    allCollections = [...allCollections, ...result];
    hasNextPage = result[0]?.pageInfo?.hasNextPage || false;
    after = result[0]?.pageInfo?.endCursor || null;
  }
  
  return allCollections;
}

/**
 * Récupère tous les produits d'une collection avec pagination complète
 * @param {string} handle - Handle de la collection
 * @returns {Promise<Array>} Tous les produits de la collection
 */
export async function getAllCollectionProductsPaginated(handle) {
  let allProducts = [];
  let hasNextPage = true;
  let after = null;
  
  while (hasNextPage) {
    const result = await getCollectionProducts(handle, 250, after);
    if (!result) break;
    
    allProducts = [...allProducts, ...result.products.edges.map(edge => edge.node)];
    hasNextPage = result.products.pageInfo?.hasNextPage || false;
    after = result.products.pageInfo?.endCursor || null;
  }
  
  return allProducts;
}
