# Liste de liens d’en-tête - `AvHeaderMenuLinks`

## 🌟 Introduction

Le composant `AvHeaderMenuLinks` est une adaptation du code de `DsfrHeaderMenuLinks`. Il a pour vocation à être utilisé dans le composant `AvHeader`.

Il fournit une structure de navigation sous forme de liste, en utilisant le composant `AvButton`

🏅 La documentation sur le `DsfrHeaderMenuLinks` se trouve sur [VueDSFR](https://vue-ds.fr/composants/DsfrHeaderMenuLinks)

## 📐 Structure

  - `<nav>` : Le composant principal.
  - Englobe une liste `<ul>` de `<AvButton>`.
  - Chaque `AvButton` est un élément de la liste et est rendu dynamiquement.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `links` | `{ icon?: string \| InstanceType<typeof VIcon>['$props'], label?: string, onClick?: ($event: MouseEvent) => void }[]` | `undefined` | | Un tableau d'objets de props pour chaque `AvButton`. |
| `navAriaLabel` | `string` | `'Menu secondaire'` | | Label ARIA pour la navigation, utile pour l'accessibilité. |

## 📡 Évenements

| Nom | Donnée (*payload*) | Description |
| --- | --- | --- |
| `'linkClick'` | Événement de clic (`MouseEvent`) | Événement déclenché lorsque l'un des liens est cliqué. |

## 🧩 Slots

Aucun.
