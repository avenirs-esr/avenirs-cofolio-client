# Navigation - `AvNavigation`

## 🌟 Introduction

Le `AvNavigation` est un composant implémentant la navigation `DsfrNavigation` de VueDSFR. La navigation principale est le système central de navigation au sein d’un site. Elle permet d’orienter l’usager à travers les rubriques principales et secondaires du site.

Le composant navigation permet de créer une barre de navigation avec différents types d'item de navigation :
- lien direct
- sous-menu
- mega-menu

🏅 La documentation sur la navigation principale se trouve sur [DSFR](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/navigation-principale)

## 📐 Structure

Chaque onglet se compose des éléments suivants :

- un icône à gauche du titre - optionnel.
- un titre cliquable - obligatoire : permet d’afficher la zone de contenu qui lui est associée.

Si le nombre d’onglets dépasse la largeur du container, un scroll horizontal permet de naviguer entre les différents onglets.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `navItems` | `(DsfrNavigationMenuLinkProps \| DsfrNavigationMenuProps \| DsfrNavigationMegaMenuProps)[]` | | ✅ | Liste des items de navigation. Chaque item peut être :<br>• Un lien direct de navigation (`DsfrNavigationMenuLinkProps`) avec les props `to` et `text`.<br>• Un sous-menu de navigation (`DsfrNavigationMenuProps`) avec les props `title`, `links` et `active`.<br>• Un mega-menu de navigation (`DsfrNavigationMegaMenuProps`) avec les props `title`, `link`, `active` et `menus`. |

## 📡 Évenements

Aucun.

## 🧩 Slots

Aucun.

## 📝 Exemples d'utilisation

```vue
<template>
  <AvNavigation :nav-items="navItems" />
</template>
```
