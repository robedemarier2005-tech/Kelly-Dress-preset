# Intégration Shopify Storefront API

Ce document explique comment l'intégration Shopify Storefront API a été ajoutée au projet Kelly Dress.

## Vue d'ensemble

L'intégration Shopify permet d'utiliser Shopify comme back-office pour gérer les produits, collections, variantes, stock, commandes et paiements, tout en conservant 100% du design Next.js existant.

## Architecture

### Fichiers créés dans `src/lib/shopify/`

- **config.js** : Configuration Shopify (domaine, access token, version API 2025-07)
- **client.js** : Client Storefront API avec fonction utilitaire pour les requêtes GraphQL
- **products.js** : Fonctions pour récupérer les produits (getProducts, getProduct, searchProducts)
- **collections.js** : Fonctions pour récupérer les collections (getCollections, getCollection)
- **cart.js** : Fonctions pour gérer le panier Shopify (createCart, addToCart, removeFromCart, updateCart)
- **mapper.js** : Transforme les données Shopify vers le format existant du projet
- **index.js** : Point d'entrée avec fonctions de compatibilité (fallback sur données statiques)

### Fichiers modifiés

- **src/context/CartContext.jsx** : Ajout de la synchronisation avec Shopify
- **src/app/catalog/page.js** : Utilisation des données Shopify avec fallback
- **src/app/catalog/[id]/page.js** : Utilisation des données Shopify avec fallback

## Configuration

### 1. Créer un fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
SHOPIFY_STORE_DOMAIN=votre-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=votre-access-token
SHOPIFY_API_VERSION=2025-07
```

### 2. Obtenir les credentials Shopify

1. Allez dans votre admin Shopify
2. Navigation : Settings > Apps and sales channels > Develop apps
3. Cliquez sur "Create an app"
4. Donnez un nom à votre app (ex: "Kelly Dress Frontend")
5. Configurez les permissions Storefront API :
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_checkouts`
6. Cliquez sur "Create app"
7. Dans la section "Storefront API", cliquez sur "Configure Storefront API access scopes"
8. Cochez les permissions nécessaires
9. Cliquez sur "Install app"
10. Copiez le "Storefront API access token"

### 3. Mettre à jour les variables d'environnement

Remplacez les valeurs dans `.env.local` avec vos credentials Shopify réels.

## Fonctionnement

### Mode de compatibilité

L'intégration utilise un système de fallback automatique :

- **Si Shopify est configuré** : Utilise les données Shopify Storefront API
- **Si Shopify n'est pas configuré** : Utilise les données statiques existantes (`src/data/dresses.js`)

Cela permet de :
- Tester le site sans Shopify
- Déployer progressivement
- Avoir un fallback en cas d'erreur API

### Mapping des données

Le fichier `mapper.js` transforme les données Shopify vers le format existant du projet :

- **Produits** : Shopify Product → Dress (id, name, price, images, etc.)
- **Collections** : Shopify Collection → Collection (id, name, description, image)
- **Panier** : Shopify Cart → Cart (items, total, checkout URL)

Les tags Shopify sont utilisés pour mapper les métadonnées :
- `color:Blanc` → Couleur
- `silhouette:Princesse` → Silhouette
- `style:Dentelle` → Style
- `collection:Princess` → Collection
- `material:Dentelle` → Matériaux
- `ref:KD-2616-EVENING` → Référence

### Panier Shopify

Le CartContext a été étendu pour synchroniser avec Shopify :

- Ajout automatique au panier Shopify quand un produit est ajouté
- Synchronisation des quantités
- Suppression des lignes
- Récupération de l'URL de checkout Shopify
- Fallback sur localStorage si Shopify n'est pas configuré

## Utilisation

### Récupérer les produits

```javascript
import { getData } from '@/lib/shopify';

const products = await getData('products');
```

### Récupérer un produit par ID

```javascript
import { getProductById } from '@/lib/shopify';

const product = await getProductById('courte-dentelle');
```

### Récupérer les collections

```javascript
import { getData } from '@/lib/shopify';

const collections = await getData('collections');
```

### Récupérer une collection par ID

```javascript
import { getCollectionById } from '@/lib/shopify';

const collection = await getCollectionById('princess');
```

### Utiliser le panier Shopify

```javascript
import { useCart } from '@/context/CartContext';

const { useShopify, getCheckoutUrl } = useCart();

// Rediriger vers le checkout Shopify
if (useShopify) {
  const checkoutUrl = await getCheckoutUrl();
  window.location.href = checkoutUrl;
}
```

## Structure des données Shopify

### Produits

Pour que le mapping fonctionne correctement, vos produits Shopify doivent avoir :

- **Handle** : Utilisé comme ID (ex: `courte-dentelle`)
- **Tags** : Pour les métadonnées (couleur, silhouette, style, collection, matériaux, référence)
- **Variantes** : Avec options pour la taille (ex: `Size: 34`, `Size: 36`)
- **Images** : Au moins une image principale
- **Collections** : Assignées aux collections appropriées

### Tags recommandés

```
color:Blanc
color:Ivoire
silhouette:Princesse
silhouette:Sirène
silhouette:Fourreau
style:Dentelle
style:Minimaliste
style:Glamour
collection:Princess
collection:Mermaid
collection:Evening
collection:Couture
material:Dentelle
material:Satin
material:Tulle
ref:KD-2616-EVENING
```

## Avantages

- **Design préservé** : 100% du design Next.js conservé
- **Back-office Shopify** : Gestion facile des produits, collections, commandes
- **Fallback automatique** : Fonctionne même sans Shopify configuré
- **SEO préservé** : Utilise les Server Components Next.js
- **Performance** : Requêtes optimisées Shopify Storefront API
- **TypeScript ready** : Types inclus dans les commentaires
- **Extensible** : Facile d'ajouter de nouvelles fonctionnalités

## Limitations

- Les données statiques (`src/data/dresses.js`) sont conservées comme fallback
- Le panier utilise localStorage comme backup si Shopify échoue
- Les tags Shopify doivent suivre le format spécifié pour un mapping correct

## Déploiement

1. Configurez les variables d'environnement sur votre plateforme de déploiement
2. Assurez-vous que l'access token Shopify Storefront API est correct
3. Testez la connexion en visitant la page catalogue
4. Vérifiez que les produits Shopify apparaissent correctement

## Support

En cas de problème :

1. Vérifiez les variables d'environnement
2. Consultez la console pour les erreurs GraphQL
3. Vérifiez que les produits Shopify ont les tags corrects
4. Le système fallback automatiquement sur les données statiques

## Version API

- **Shopify API Version** : 2025-07
- **Next.js Version** : 16.2.9
- **React Version** : 19.2.4
