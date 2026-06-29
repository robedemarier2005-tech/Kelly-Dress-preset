# Guide d'Intégration Shopify - Kelly Dress

## Configuration Actuelle ✅

Votre site est déjà configuré avec les credentials Shopify:

- **Store Domain:** `kelly-wedding-studio.myshopify.com`
- **Storefront Access Token:** Configuré
- **API Version:** 2025-07

## Comment ça fonctionne

### 1. Récupération automatique des produits

Le site récupère automatiquement vos produits depuis Shopify via la Storefront API:

```javascript
// Dans src/lib/shopify/index.js
export async function getData(dataType) {
  if (isConfigured) {
    const shopifyProducts = await getProducts(250);
    return mapShopifyProductsToDresses(shopifyProducts);
  }
  // Fallback sur données statiques si Shopify non configuré
}
```

### 2. Gestion du panier Shopify

Quand un client ajoute un produit au panier:

1. **Panier local:** Le produit est ajouté au panier React local
2. **Synchronisation Shopify:** Si Shopify est configuré, le panier est synchronisé
3. **Checkout:** Le client est redirigé vers le checkout Shopify sécurisé

```javascript
// Dans src/context/CartContext.jsx
const addToCart = async (dress, size) => {
  // Ajout au panier local
  setCart(prevCart => [...]);
  
  // Synchronisation Shopify
  if (useShopify) {
    const variant = dress.shopifyData?.variants?.nodes?.find(v => 
      v.selectedOptions?.some(opt => opt.value === size)
    );
    if (variant) {
      await createCart([{ merchandiseId: variant.id, quantity: 1 }]);
    }
  }
};
```

### 3. Redirection vers le checkout Shopify

```javascript
const handleShopifyCheckout = async () => {
  const checkoutUrl = await getCheckoutUrl();
  window.location.href = checkoutUrl;
  // → Redirection vers checkout.shopify.com
  // → Paiement sécurisé via Shopify
  // → Commande créée dans votre admin Shopify
};
```

## Étapes pour compléter l'intégration

### Étape 1: Ajouter vos produits dans Shopify Admin

1. Connectez-vous à votre admin Shopify: `https://kelly-wedding-studio.myshopify.com/admin`
2. Allez dans **Produits** > **Ajouter un produit**
3. Pour chaque robe:
   - **Titre:** Nom de la robe (ex: "Courte Dentelle")
   - **Description:** Description détaillée
   - **Images:** Uploadez les photos de la robe
   - **Prix:** Prix en euros
   - **Variants:** Créez des variants pour chaque taille (34, 36, 38, 40, 42)
   - **Tags:** Ajoutez des tags pour les collections (ex: "Princess", "Mermaid", "Evening")
   - **Type de produit:** "Robe de mariée"

### Étape 2: Organiser vos produits en collections

1. Allez dans **Produits** > **Collections**
2. Créez des collections:
   - **Princess** - Robes princesse
   - **Mermaid** - Robes sirène
   - **Evening** - Robes de soirée
   - **Couture** - Robes haute couture
3. Ajoutez les produits correspondants à chaque collection

### Étape 3: Configurer les tags pour le filtrage

Pour que le filtrage fonctionne sur votre site, ajoutez ces tags à vos produits Shopify:

- **Silhouette:** `silhouette:princesse`, `silhouette:sirene`, `silhouette:fourreau`
- **Style:** `style:dentelle`, `style:glamour`, `style:minimaliste`
- **Collection:** `collection:princess`, `collection:mermaid`, `collection:evening`

### Étape 4: Activer le Storefront API

1. Allez dans **Paramètres** > **Apps et canaux de vente** > **Develop apps**
2. Créez une nouvelle app ou utilisez une existante
3. Configurez les **Storefront API access scopes**:
   - `read_products`
   - `read_product_listings`
   - `read_inventory`
4. Générez un **Storefront API access token**
5. Copiez ce token et mettez-le à jour dans votre fichier `.env` si nécessaire

### Étape 5: Tester l'intégration

1. Ajoutez quelques produits dans Shopify
2. Lancez votre site: `npm run dev`
3. Allez sur la page `/catalog`
4. Vérifiez que les produits Shopify s'affichent
5. Testez l'ajout au panier
6. Testez le checkout (redirection vers Shopify)

## Avantages de cette intégration

✅ **Gestion centralisée:** Tous vos produits et stocks gérés dans Shopify
✅ **Paiement sécurisé:** Checkout Shopify avec SSL et conformité PCI
✅ **Gestion des commandes:** Toutes les commandes dans votre admin Shopify
✅ **Stock en temps réel:** Le stock est synchronisé automatiquement
✅ **Livraison:** Configuration des frais de port dans Shopify
✅ **Multi-devise:** Support automatique des devises si nécessaire
✅ **Analytics:** Données de vente dans Shopify Analytics

## Dépannage

### Les produits ne s'affichent pas

1. Vérifiez que vos produits sont **publiés** dans Shopify (statut "Actif")
2. Vérifiez que le Storefront API access token est correct
3. Vérifiez la console du navigateur pour les erreurs

### Le checkout ne fonctionne pas

1. Vérifiez que les variants sont correctement configurés dans Shopify
2. Vérifiez que le `merchandiseId` correspond bien à un variant Shopify valide
3. Consultez les logs Shopify pour les erreurs de panier

### Erreur "Shopify store domain not configured"

1. Vérifiez que le fichier `.env` existe à la racine du projet
2. Vérifiez que les variables d'environnement sont correctement définies
3. Redémarrez le serveur de développement après modification du `.env`

## Support

Pour plus d'informations sur la Storefront API Shopify:
- [Documentation officielle Shopify](https://shopify.dev/docs/api/storefront)
- [Guide d'intégration React](https://shopify.dev/docs/api/storefront/2025-07)
