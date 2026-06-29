import { executeGraphQL } from './client';

// GraphQL Query pour récupérer tous les produits
const GET_ALL_PRODUCTS_QUERY = `
  query GetAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
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
          images(first: 10) {
            nodes {
              id
              url
              altText
              width
              height
            }
          }
          variants(first: 10) {
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
          collections(first: 10) {
            nodes {
              id
              title
              handle
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
`;

// GraphQL Query pour récupérer un produit par son handle
const GET_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
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
      images(first: 15) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      variants(first: 20) {
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
      collections(first: 10) {
        nodes {
          id
          title
          handle
        }
      }
    }
  }
`;

// GraphQL Query pour rechercher des produits
const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: PRODUCT) {
      edges {
        node {
          ... on Product {
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
      }
    }
  }
`;

/**
 * Récupère tous les produits depuis Shopify
 * @param {number} first - Nombre de produits à récupérer (défaut: 50)
 * @param {string} after - Cursor pour la pagination (optionnel)
 * @returns {Promise<Array>} Liste des produits
 */
export async function getProducts(first = 50, after = null) {
  const variables = { first, after };
  const data = await executeGraphQL(GET_ALL_PRODUCTS_QUERY, variables);
  
  return data.products.edges.map(edge => ({
    ...edge.node,
    pageInfo: data.products.pageInfo,
  }));
}

/**
 * Récupère un produit par son handle depuis Shopify
 * @param {string} handle - Handle du produit (slug)
 * @returns {Promise<Object|null>} Produit ou null si non trouvé
 */
export async function getProduct(handle) {
  const variables = { handle };
  const data = await executeGraphQL(GET_PRODUCT_BY_HANDLE_QUERY, variables);
  
  return data.productByHandle || null;
}

/**
 * Recherche des produits par terme de recherche
 * @param {string} query - Terme de recherche
 * @param {number} first - Nombre de résultats (défaut: 20)
 * @returns {Promise<Array>} Liste des produits correspondants
 */
export async function searchProducts(query, first = 20) {
  const variables = { query, first };
  const data = await executeGraphQL(SEARCH_PRODUCTS_QUERY, variables);
  
  return data.search.edges.map(edge => edge.node);
}

/**
 * Récupère tous les produits avec pagination complète
 * @returns {Promise<Array>} Tous les produits
 */
export async function getAllProductsPaginated() {
  let allProducts = [];
  let hasNextPage = true;
  let after = null;
  
  while (hasNextPage) {
    const result = await getProducts(250, after);
    allProducts = [...allProducts, ...result];
    hasNextPage = result[0]?.pageInfo?.hasNextPage || false;
    after = result[0]?.pageInfo?.endCursor || null;
  }
  
  return allProducts;
}
