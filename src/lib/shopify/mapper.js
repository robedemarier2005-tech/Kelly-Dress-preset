/**
 * Fichier de mapping pour transformer les données Shopify vers le format existant du projet
 * Cela permet de conserver 100% du design et des composants existants
 */

/**
 * Transforme un produit Shopify en format compatible avec le projet
 * @param {Object} shopifyProduct - Produit brut de Shopify
 * @returns {Object} Produit formaté pour le projet
 */
export function mapShopifyProductToDress(shopifyProduct) {
  if (!shopifyProduct) return null;

  // Extraire la première image comme image principale
  const mainImage = shopifyProduct.images?.nodes?.[0];
  const alternateImage = shopifyProduct.images?.nodes?.[1];
  const gallery = shopifyProduct.images?.nodes?.map(img => img.url) || [];

  // Extraire le prix (prendre le prix minimum)
  const price = parseFloat(shopifyProduct.priceRange?.minVariantPrice?.amount) || 0;

  // Extraire les tags pour déterminer la collection si nécessaire
  const tags = shopifyProduct.tags || [];
  
  // Extraire les couleurs depuis les tags ou les variantes
  const colors = extractColorsFromProduct(shopifyProduct);
  
  // Extraire les tailles depuis les variantes
  const sizes = extractSizesFromProduct(shopifyProduct);

  // Extraire les matériaux depuis les tags ou la description
  const materials = extractMaterialsFromProduct(shopifyProduct);

  // Déterminer la silhouette depuis les tags ou le productType
  const silhouette = extractSilhouetteFromProduct(shopifyProduct);

  // Déterminer le style depuis les tags
  const style = extractStyleFromProduct(shopifyProduct);

  // Extraire la collection depuis les tags ou les collections du produit
  const collection = extractCollectionFromProduct(shopifyProduct);

  return {
    id: shopifyProduct.handle, // Utiliser le handle comme ID
    name: shopifyProduct.title,
    reference: extractReferenceFromProduct(shopifyProduct),
    collection: collection,
    silhouette: silhouette,
    style: style,
    price: price,
    colors: colors,
    sizes: sizes,
    materials: materials,
    image: mainImage?.url || '',
    alternateImage: alternateImage?.url || '',
    gallery: gallery,
    description: shopifyProduct.description || shopifyProduct.descriptionHtml || '',
    // Conserver les données brutes Shopify pour référence
    shopifyData: shopifyProduct,
  };
}

/**
 * Transforme une collection Shopify en format compatible avec le projet
 * @param {Object} shopifyCollection - Collection brute de Shopify
 * @returns {Object} Collection formatée pour le projet
 */
export function mapShopifyCollectionToCollection(shopifyCollection) {
  if (!shopifyCollection) return null;

  return {
    id: shopifyCollection.handle,
    name: shopifyCollection.title,
    description: shopifyCollection.description || '',
    image: shopifyCollection.image?.url || '/images/placeholder.jpg',
    productsCount: shopifyCollection.productsCount?.count || 0,
    // Conserver les données brutes Shopify pour référence
    shopifyData: shopifyCollection,
  };
}

/**
 * Transforme une ligne de panier Shopify en format compatible avec le projet
 * @param {Object} cartLine - Ligne de panier Shopify
 * @returns {Object} Ligne de panier formatée
 */
export function mapShopifyCartLineToCartItem(cartLine) {
  if (!cartLine) return null;

  const merchandise = cartLine.merchandise;
  const product = merchandise?.product;

  // Extraire la taille depuis les selectedOptions
  const sizeOption = merchandise?.selectedOptions?.find(opt => opt.name.toLowerCase() === 'size');
  const size = sizeOption?.value || 'Standard';

  // Transformer le produit en format dress
  const dress = mapShopifyProductToDress(product);

  return {
    dress: dress,
    size: size,
    quantity: cartLine.quantity,
    // Conserver les données Shopify pour référence
    shopifyLineId: cartLine.id,
    shopifyVariantId: merchandise?.id,
  };
}

/**
 * Transforme un panier Shopify complet en format compatible avec le projet
 * @param {Object} shopifyCart - Panier Shopify brut
 * @returns {Object} Panier formaté
 */
export function mapShopifyCartToCart(shopifyCart) {
  if (!shopifyCart) return [];

  return shopifyCart.lines?.edges?.map(edge => 
    mapShopifyCartLineToCartItem(edge.node)
  ) || [];
}

// Fonctions utilitaires d'extraction

function extractColorsFromProduct(product) {
  // Chercher les couleurs dans les tags (format: color:Blanc, color:Ivoire)
  const colorTags = product.tags?.filter(tag => tag.startsWith('color:')) || [];
  if (colorTags.length > 0) {
    return colorTags.map(tag => tag.replace('color:', ''));
  }
  
  // Sinon, extraire depuis les variantes
  const colors = new Set();
  product.variants?.nodes?.forEach(variant => {
    const colorOption = variant.selectedOptions?.find(opt => 
      opt.name.toLowerCase() === 'color'
    );
    if (colorOption) {
      colors.add(colorOption.value);
    }
  });
  
  return colors.size > 0 ? Array.from(colors) : ['Blanc'];
}

function extractSizesFromProduct(product) {
  const sizes = new Set();
  product.variants?.nodes?.forEach(variant => {
    const sizeOption = variant.selectedOptions?.find(opt => 
      opt.name.toLowerCase() === 'size'
    );
    if (sizeOption) {
      sizes.add(sizeOption.value);
    }
  });
  
  return sizes.size > 0 ? Array.from(sizes) : ['34', '36', '38', '40', '42'];
}

function extractMaterialsFromProduct(product) {
  // Chercher les matériaux dans les tags (format: material:Dentelle, material:Satin)
  const materialTags = product.tags?.filter(tag => tag.startsWith('material:')) || [];
  if (materialTags.length > 0) {
    return materialTags.map(tag => tag.replace('material:', ''));
  }
  
  // Sinon, retourner une valeur par défaut basée sur le productType
  return ['Dentelle', 'Satin'];
}

function extractSilhouetteFromProduct(product) {
  // Chercher la silhouette dans les tags (format: silhouette:Princesse)
  const silhouetteTag = product.tags?.find(tag => tag.startsWith('silhouette:'));
  if (silhouetteTag) {
    return silhouetteTag.replace('silhouette:', '');
  }
  
  // Sinon, utiliser le productType comme fallback
  const typeMap = {
    'Princess': 'Princesse',
    'Mermaid': 'Sirène',
    'Evening': 'Fourreau',
  };
  
  return typeMap[product.productType] || 'Princesse';
}

function extractStyleFromProduct(product) {
  // Chercher le style dans les tags (format: style:Dentelle)
  const styleTag = product.tags?.find(tag => tag.startsWith('style:'));
  if (styleTag) {
    return styleTag.replace('style:', '');
  }
  
  // Sinon, déterminer depuis les tags généraux
  if (product.tags?.includes('minimaliste')) return 'Minimaliste';
  if (product.tags?.includes('glamour')) return 'Glamour';
  if (product.tags?.includes('dentelle')) return 'Dentelle';
  
  return 'Minimaliste';
}

function extractCollectionFromProduct(product) {
  // Chercher la collection dans les tags (format: collection:Princess)
  const collectionTag = product.tags?.find(tag => tag.startsWith('collection:'));
  if (collectionTag) {
    return collectionTag.replace('collection:', '');
  }
  
  // Sinon, utiliser la première collection du produit
  const firstCollection = product.collections?.nodes?.[0];
  if (firstCollection) {
    return firstCollection.title;
  }
  
  // Fallback sur le productType
  return product.productType || 'Collection 2026';
}

function extractReferenceFromProduct(product) {
  // Chercher la référence dans les tags (format: ref:KD-2616-EVENING)
  const refTag = product.tags?.find(tag => tag.startsWith('ref:'));
  if (refTag) {
    return refTag.replace('ref:', '');
  }
  
  // Sinon, générer une référence depuis l'ID Shopify
  const id = product.id?.split('/').pop() || '';
  return `KD-${id.toUpperCase()}`;
}

/**
 * Transforme un tableau de produits Shopify en tableau de dresses
 * @param {Array} shopifyProducts - Tableau de produits Shopify
 * @returns {Array} Tableau de dresses formatées
 */
export function mapShopifyProductsToDresses(shopifyProducts) {
  return shopifyProducts.map(product => mapShopifyProductToDress(product)).filter(Boolean);
}

/**
 * Transforme un tableau de collections Shopify en tableau de collections
 * @param {Array} shopifyCollections - Tableau de collections Shopify
 * @returns {Array} Tableau de collections formatées
 */
export function mapShopifyCollectionsToCollections(shopifyCollections) {
  return shopifyCollections.map(collection => mapShopifyCollectionToCollection(collection)).filter(Boolean);
}
