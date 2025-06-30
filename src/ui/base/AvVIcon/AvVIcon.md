# Icônes - `AvVIcon`

## 🌟 Introduction

Le composant `AvVIcon` est un composant plaçant un `VIcon` dans une `div` carrée de taille paramétrable. C'est un composant Vue.js permettant d'afficher des icônes avec une large gamme d'options de personnalisation, y compris des animations, des couleurs, et des tailles. Il est conçu pour être flexible et performant, avec une prise en charge des différentes options d'affichage, de flip, et de titres accessibles.

Il a exactement la même API que OhVueIcon, et utilise `@iconify/vue` sous le capot.

::: warning Attention
Les noms des icônes doivent être ceux de [Iconify-vue](https://icon-sets.iconify.design/).
:::

🏅 La documentation sur le `VIcon` se trouve sur [VueDSFR](https://vue-ds.fr/composants/VIcon)

## 📐 Structure

L'icône est composée d'une `div` carrée à la taille paramétrable contenant le composant `VIcon`.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `size` | `number` | `1` | | La taille du conteneur de l'icône ainsi qu'un ratio pour le scale de l'icône. |
| `name` | `string` | | ✅ | Le nom de l'icône à afficher. |
| `verticalAlign` | `string` | `'-0.2em'` | | Alignement vertical de l'icône par rapport à la ligne de base. |
| `animation` | ``'spin' \| 'wrench' \| 'pulse' \| 'spin-pulse' \| 'flash' \| 'float'`` | `undefined` | | Type d'animation appliqué à l'icône. |
| `speed` | `'fast' \| 'slow'` | `undefined` | | Vitesse de l'animation si elle est définie. |
| `flip` | `'horizontal' \| 'vertical' \| 'both'` | `undefined` | | Inverse l'icône horizontalement, verticalement ou les deux. |
| `label` | `string` | `undefined` | | Étiquette ARIA pour l'accessibilité. |
| `title` | `number` | `undefined` | | Titre de l'icône (balise `<title>`), utilisé pour l'accessibilité et les info-bulles. |
| `color` | `string` | `undefined` | | Couleur principale de l'icône. |
| `inverse` | `boolean` | `false` | | Applique une couleur inversée à l'icône. |
| `ssr` | `boolean` | `1` | | Active le rendu côté serveur (Server-Side Rendering). |

## 📡 Évenements

Aucun.

## 🧩 Slots

Aucun.

## 📝 Exemples d'utilisation

```vue
<template>
  <AvVIcon
    name="mdi:warning-outline"
    color="var(--icon)"
    :size="2"
  />
</template>
```
