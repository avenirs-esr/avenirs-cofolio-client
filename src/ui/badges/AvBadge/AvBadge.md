# Badges - `AvBadge`

## 🌟 Introduction

Le `AvBadge` est un composant implémentant le `DsfrBadge` de VueDSFR. Ce composant Vue est idéal pour afficher des informations courtes et importantes, comme des catégories, des étiquettes ou des statuts.

🏅 La documentation sur le `DsfrBadge` se trouve sur [VueDSFR](https://vue-ds.fr/composants/DsfrBadge)

## 📐 Structure

- Le composant est un élément `p` avec la classe `fr-badge`.
- Props permettent de modifier l'apparence du badge selon les props : couleur, présence d'icône, taille et gestion du texte trop long.
- Le `label` est affiché à l'intérieur d'un `span`, potentiellement avec la prop `ellipsis` et une taille définie ou maximale pour gérer le texte tronqué.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `color` | `string` |  | ✅ | La couleur du texte à afficher dans le badge. |
| `backgroundColor` | `string` |  | ✅ | La couleur de fond du badge. |
| `borderColor` | `string` |  | | La couleur de la bordure du badge. |
| `iconPath` | `string` |  | | Le lien vers l'icône publique au projet (`/assets/icons/calendar-clock-outline.svg` par exemple). |
| `type` | `'success' \| 'warning' \| 'error' \| 'info'` | 'info' |  | Définit le type de badge. |
| `label` | `string` |  | ✅ | Le texte à afficher dans le badge. |
| `noIcon` | `boolean` | `false` | | Si `true`, le badge s'affiche sans icône. |
| `small` | `boolean` | `false` | | Si `true`, affiche un badge de taille réduite. |
| `ellipsis` | `boolean` | `false` | | Si `true`, le texte est tronqué avec des points de suspension s'il est trop long. |

## 📡 Évenements

Aucun.

## 🧩 Slots

Aucun.

## 📝 Exemples d'utilisation

```vue
<template>
  <AvBadge
    label="En cours"
    color="var(--dark-background-primary1)"
    background-color="var(--light-background-primary2)"
    icon-path="/assets/icons/calendar-range-outline.svg"
    small
  />
</template>
```
