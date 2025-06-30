# Textes avec icône - `AvIconText`

## 🌟 Introduction

Le `AvIconText` est un composant permettant d'afficher un texte avec une icône à gauche (de préférence une icône [MDI](https://icon-sets.iconify.design/mdi/)). Ce composant Vue est idéal pour afficher des textes avec une icône permettant de visualiser le type d'information transmise par le texte.

## 📐 Structure

- Le composant est un élément `div` constitué d'un composant `AvVIcon` et d'un `span`.
- Props permettent de modifier l'apparence de l'icône et du texte selon les props : couleur, icône, taille et gestion du texte trop long.
- Le `label` est affiché à l'intérieur d'un `span`, potentiellement avec la prop `ellipsis` pour gérer le texte tronqué.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `textColor` | `string` | `'var(--text1)'` | | La couleur du texte. |
| `iconColor` | `string` | `'var(--text1)'` | | La couleur de l'icône. |
| `icon` | `string` |  | ✅ | Le nom de l'icône suivant la nomenclature définie pour `VIcon` sur [VueDSFR](https://vue-ds.fr/composants/VIcon). |
| `text` | `string` |  | ✅ | Le texte à afficher. |
| `typographyClass` | `string` | `'b2-regular'` |  | La classe de typographie à utiliser pour le texte. |
| `gap` | `string` | `'0.25rem'` | | Le gap entre l'icône et le texte. |
| `inline` | `boolean` | `false` | | Si `false`, le texte trop long sera tronqué. |

## 📡 Évenements

Aucun.

## 🧩 Slots

Aucun.

## 📝 Exemples d'utilisation

```vue
<template>
  <AvIconText
    text="Ma messagerie"
    icon="mdi:chat-bubble-outline"
    text-color="var(--title)"
    icon-color="var(--dark-background-primary1)"
    typography-class="n6"
    gap="var(--spacing-md)"
  />
</template>
```
