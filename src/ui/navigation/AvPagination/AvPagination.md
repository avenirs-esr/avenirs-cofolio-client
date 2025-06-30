# Pagination - `AvPagination`

## 🌟 Introduction

Le composant `AvPagination` est une adaptation du code de `DsfrPagination`. C'est un système de pagination conforme aux bonnes pratiques ergonomiques et accessible (ARIA). Il permet de naviguer facilement à travers plusieurs pages avec des fonctionnalités avancées comme la limitation de pages affichées et la gestion des événements.

🏅 La documentation sur le `DsfrPagination` se trouve sur [VueDSFR](https://vue-ds.fr/composants/DsfrPagination)

## 📐 Structure

Ce composant affiche des liens pour la première page, la précédente, les pages centrales, la suivante, et la dernière, avec des contrôles adaptatifs selon l'état de la pagination.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `compact` | `boolean` | `false` | | Permet un affichage compact (`Page x sur y` et une navigation avec uniquement page précédente et page suivante sans texte avec juste l'icône). |
| `pages` | `Page[]` | | ✅ | Liste des pages, où chaque page est un objet contenant des informations comme `href` et `label`. |
| `truncLimit` | `number` | `2` | | Nombre maximum de pages affichées. |
| `currentPage` | `number` | `0` | | Index de la page actuellement sélectionnée (commence à `0`). |
| `firstPageTitle` | `string` | `undefined` | | Texte d'info-bulle pour le lien de la première. |
| `lastPageTitle` | `string` | `undefined` | | Texte d'info-bulle pour le lien de la dernière. |
| `nextPageTitle` | `string` | `undefined` | | Texte d'info-bulle pour le lien de la page. |
| `prevPageTitle` | `string` | `undefined` | | Texte d'info-bulle pour le lien de la page précédente. |

## 📡 Évenements

| Nom | Donnée (*payload*) | Description |
| --- | --- | --- |
| `'update:current-page'` | `number` | Émis lorsque l'utilisateur change de page |

## 🧩 Slots

Aucun.

## 📝 Exemples d'utilisation

```vue
<template>
  <AvPagination
    id="top-pagination"
    :current-page="pageInfo.number"
    :pages="pages"
    aria-label="Pagination haute"
    compact
    @update:current-page="onUpdateCurrentPage"
  />
</template>
```

```vue
<template>
  <AvPagination
    id="bottom-pagination"
    :items="amss"
    :current-page="pageInfo.number"
    :pages="pages"
    aria-label="Pagination basse"
    @update:current-page="onUpdateCurrentPage"
  />
</template>
```
