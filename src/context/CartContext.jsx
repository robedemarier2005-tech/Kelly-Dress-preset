'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shopifyCartId, setShopifyCartId] = useState(null);
  const [useShopify, setUseShopify] = useState(false);

  useEffect(() => {
    // Charger le panier depuis localStorage
    const saved = localStorage.getItem('kelly_dress_cart');
    const savedShopifyCartId = localStorage.getItem('kelly_shopify_cart_id');
    
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading cart", e);
      }
    }
    
    if (savedShopifyCartId) {
      setShopifyCartId(savedShopifyCartId);
    }
    
    // Vérifier si Shopify est configuré
    const checkShopifyConfig = async () => {
      try {
        const { shopifyConfig } = await import('../lib/shopify');
        const isConfigured = shopifyConfig.storeDomain !== 'votre-store.myshopify.com' &&
                            shopifyConfig.storefrontAccessToken !== 'votre-access-token';
        setUseShopify(isConfigured);
      } catch (e) {
        console.error("Error checking Shopify config", e);
      }
    };
    
    checkShopifyConfig();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kelly_dress_cart', JSON.stringify(cart));
      if (shopifyCartId) {
        localStorage.setItem('kelly_shopify_cart_id', shopifyCartId);
      }
    }
  }, [cart, isLoaded, shopifyCartId]);

  const addToCart = async (dress, size) => {
    // Ajouter au panier local
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.dress.id === dress.id && item.size === size);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { dress, size, quantity: 1, shopifyLineId: null }];
      }
    });
    
    setIsCartOpen(true); // Open drawer automatically
    
    // Si Shopify est configuré, synchroniser
    if (useShopify) {
      try {
        const { addToCart: shopifyAddToCart, createCart } = await import('../lib/shopify/cart');
        
        // Trouver la variante correspondante
        const variant = dress.shopifyData?.variants?.nodes?.find(v => 
          v.selectedOptions?.some(opt => opt.value === size)
        );
        
        // Si aucune variante trouvée, essayer de trouver par correspondance partielle
        if (!variant && dress.shopifyData?.variants?.nodes?.length > 0) {
          const firstVariant = dress.shopifyData.variants.nodes[0];
          const merchandiseId = firstVariant.id;
          
          if (shopifyCartId) {
            const updatedCart = await shopifyAddToCart(shopifyCartId, [{ merchandiseId, quantity: 1 }]);
            // Mettre à jour le lineId dans le panier local
            const newLine = updatedCart.lines.edges.find(edge => 
              edge.node.merchandise.id === merchandiseId
            );
            if (newLine) {
              setCart(prevCart => prevCart.map(item => 
                item.dress.id === dress.id && item.size === size 
                  ? { ...item, shopifyLineId: newLine.node.id }
                  : item
              ));
            }
          } else {
            const newCart = await createCart([{ merchandiseId, quantity: 1 }]);
            setShopifyCartId(newCart.id);
            // Mettre à jour le lineId dans le panier local
            const newLine = newCart.lines.edges[0];
            if (newLine) {
              setCart(prevCart => prevCart.map(item => 
                item.dress.id === dress.id && item.size === size 
                  ? { ...item, shopifyLineId: newLine.node.id }
                  : item
              ));
            }
          }
          return;
        }
        
        if (variant) {
          const merchandiseId = variant.id;
          
          if (shopifyCartId) {
            const updatedCart = await shopifyAddToCart(shopifyCartId, [{ merchandiseId, quantity: 1 }]);
            // Mettre à jour le lineId dans le panier local
            const newLine = updatedCart.lines.edges.find(edge => 
              edge.node.merchandise.id === merchandiseId
            );
            if (newLine) {
              setCart(prevCart => prevCart.map(item => 
                item.dress.id === dress.id && item.size === size 
                  ? { ...item, shopifyLineId: newLine.node.id }
                  : item
              ));
            }
          } else {
            const newCart = await createCart([{ merchandiseId, quantity: 1 }]);
            setShopifyCartId(newCart.id);
            // Mettre à jour le lineId dans le panier local
            const newLine = newCart.lines.edges[0];
            if (newLine) {
              setCart(prevCart => prevCart.map(item => 
                item.dress.id === dress.id && item.size === size 
                  ? { ...item, shopifyLineId: newLine.node.id }
                  : item
              ));
            }
          }
        }
      } catch (e) {
        console.error("Error syncing with Shopify", e);
      }
    }
  };

  const removeFromCart = async (dressId, size) => {
    // Retirer du panier local
    setCart(prevCart => prevCart.filter(item => !(item.dress.id === dressId && item.size === size)));
    
    // Si Shopify est configuré, synchroniser
    if (useShopify) {
      try {
        const { removeFromCart: shopifyRemoveFromCart } = await import('../lib/shopify/cart');
        
        // Trouver l'item dans le panier local pour obtenir le shopifyLineId
        const cartItem = cart.find(item => item.dress.id === dressId && item.size === size);
        
        if (shopifyCartId && cartItem?.shopifyLineId) {
          await shopifyRemoveFromCart(shopifyCartId, [cartItem.shopifyLineId]);
        }
      } catch (e) {
        console.error("Error syncing with Shopify", e);
      }
    }
  };

  const updateQuantity = async (dressId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(dressId, size);
      return;
    }
    
    // Mettre à jour le panier local
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.dress.id === dressId && item.size === size) {
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
    
    // Si Shopify est configuré, synchroniser
    if (useShopify) {
      try {
        const { updateCart: shopifyUpdateCart } = await import('../lib/shopify/cart');
        
        // Trouver l'item dans le panier local pour obtenir le shopifyLineId
        const cartItem = cart.find(item => item.dress.id === dressId && item.size === size);
        
        if (shopifyCartId && cartItem?.shopifyLineId) {
          await shopifyUpdateCart(shopifyCartId, [{ id: cartItem.shopifyLineId, quantity: newQty }]);
        }
      } catch (e) {
        console.error("Error syncing with Shopify", e);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    setShopifyCartId(null);
    localStorage.removeItem('kelly_shopify_cart_id');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.dress.price * item.quantity), 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  
  // Fonction pour obtenir l'URL de checkout Shopify
  const getCheckoutUrl = async () => {
    if (useShopify && shopifyCartId) {
      try {
        const { getCart } = await import('../lib/shopify/cart');
        const shopifyCart = await getCart(shopifyCartId);
        return shopifyCart?.checkoutUrl || null;
      } catch (e) {
        console.error("Error getting checkout URL", e);
      }
    }
    return null;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isCartOpen,
      openCart,
      closeCart,
      useShopify,
      getCheckoutUrl,
    }}>
      {children}
    </CartContext.Provider>
  );
};
