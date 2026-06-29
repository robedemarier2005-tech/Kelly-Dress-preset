import { executeGraphQL } from './client';

// GraphQL Mutation pour créer un panier
const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        createdAt
        updatedAt
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  product {
                    id
                    title
                    handle
                    productType
                    vendor
                    tags
                    images(first: 5) {
                      nodes {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// GraphQL Mutation pour ajouter un produit au panier
const CART_ADD_MUTATION = `
  mutation CartAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  product {
                    id
                    title
                    handle
                    productType
                    vendor
                    tags
                    images(first: 5) {
                      nodes {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// GraphQL Mutation pour mettre à jour une ligne du panier
const CART_UPDATE_MUTATION = `
  mutation CartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  product {
                    id
                    title
                    handle
                    productType
                    vendor
                    tags
                    images(first: 5) {
                      nodes {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// GraphQL Mutation pour supprimer des lignes du panier
const CART_REMOVE_MUTATION = `
  mutation CartRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  product {
                    id
                    title
                    handle
                    productType
                    vendor
                    tags
                    images(first: 5) {
                      nodes {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// GraphQL Query pour récupérer un panier existant
const CART_QUERY = `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      createdAt
      updatedAt
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                product {
                  id
                  title
                  handle
                  productType
                  vendor
                  tags
                  images(first: 5) {
                    nodes {
                      id
                      url
                      altText
                      width
                      height
                    }
                  }
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

/**
 * Crée un nouveau panier Shopify
 * @param {Array} lines - Lignes à ajouter au panier (format: [{ merchandiseId: "gid://...", quantity: 1 }])
 * @returns {Promise<Object>} Panier créé
 */
export async function createCart(lines = []) {
  const input = { lines };
  const data = await executeGraphQL(CART_CREATE_MUTATION, { input });
  
  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(`Cart creation error: ${data.cartCreate.userErrors[0].message}`);
  }
  
  return data.cartCreate.cart;
}

/**
 * Ajoute des produits au panier existant
 * @param {string} cartId - ID du panier Shopify
 * @param {Array} lines - Lignes à ajouter (format: [{ merchandiseId: "gid://...", quantity: 1 }])
 * @returns {Promise<Object>} Panier mis à jour
 */
export async function addToCart(cartId, lines) {
  const data = await executeGraphQL(CART_ADD_MUTATION, { cartId, lines });
  
  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(`Cart add error: ${data.cartLinesAdd.userErrors[0].message}`);
  }
  
  return data.cartLinesAdd.cart;
}

/**
 * Met à jour la quantité d'une ligne du panier
 * @param {string} cartId - ID du panier Shopify
 * @param {Array} lines - Lignes à mettre à jour (format: [{ id: "gid://...", quantity: 2 }])
 * @returns {Promise<Object>} Panier mis à jour
 */
export async function updateCart(cartId, lines) {
  const data = await executeGraphQL(CART_UPDATE_MUTATION, { cartId, lines });
  
  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(`Cart update error: ${data.cartLinesUpdate.userErrors[0].message}`);
  }
  
  return data.cartLinesUpdate.cart;
}

/**
 * Supprime des lignes du panier
 * @param {string} cartId - ID du panier Shopify
 * @param {Array} lineIds - IDs des lignes à supprimer
 * @returns {Promise<Object>} Panier mis à jour
 */
export async function removeFromCart(cartId, lineIds) {
  const data = await executeGraphQL(CART_REMOVE_MUTATION, { cartId, lineIds });
  
  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(`Cart remove error: ${data.cartLinesRemove.userErrors[0].message}`);
  }
  
  return data.cartLinesRemove.cart;
}

/**
 * Récupère un panier existant par son ID
 * @param {string} cartId - ID du panier Shopify
 * @returns {Promise<Object|null>} Panier ou null si non trouvé
 */
export async function getCart(cartId) {
  const data = await executeGraphQL(CART_QUERY, { cartId });
  return data.cart || null;
}

/**
 * Formate le panier Shopify pour une utilisation facile dans l'application
 * @param {Object} cart - Panier Shopify brut
 * @returns {Object} Panier formaté
 */
export function formatCart(cart) {
  if (!cart) return null;
  
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
    lines: cart.lines.edges.map(edge => ({
      id: edge.node.id,
      quantity: edge.node.quantity,
      merchandise: edge.node.merchandise,
    })),
    cost: {
      totalAmount: cart.cost.totalAmount,
      subtotalAmount: cart.cost.subtotalAmount,
      totalTaxAmount: cart.cost.totalTaxAmount,
    },
    totalItems: cart.lines.edges.reduce((sum, edge) => sum + edge.node.quantity, 0),
  };
}

/**
 * Convertit un ID Shopify en format GID
 * @param {string} type - Type de ressource (Product, ProductVariant, Collection, etc.)
 * @param {string} id - ID numérique
 * @returns {string} GID Shopify
 */
export function toGid(type, id) {
  return `gid://shopify/${type}/${id}`;
}

/**
 * Extrait l'ID numérique d'un GID Shopify
 * @param {string} gid - GID Shopify
 * @returns {string} ID numérique
 */
export function fromGid(gid) {
  const parts = gid.split('/');
  return parts[parts.length - 1];
}
