# Carte - `AvCard`

## 🌟 Introduction

La carte `AvCard` est un composant permettant de créer des conteneurs stylisés paramétrables.

## 📐 Structure

La carte est composée d'une `div` principale contenant une div pour le title (slot `title`), un slot générique par défaut, une div pour le body (slot `body`) ainsi qu'une div pour le footer (slot `footer`).

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `backgroundColor` | `string` | `'var(--card)'` | | La couleur de fond de la carte. |
| `borderColor` | `string` | `'var(--stroke)'` | | La couleur de bordure de la carte. |
| `titleBackground` | `string` | `'var(--surface-background)'` | | La couleur de fond du titre de la carte. |
| `titleHeight` | `string` | `undefined` | | La hauteur du titre de la carte. |

## 📡 Évenements

Aucun.

## 🧩 Slots

| Nom | Description |
| --- | --- |
| `title` | Slot pour ajouter un titre à la carte. |
| `body` | Slot pour ajouter un corps à la carte. |
| `footer` | Slot pour ajouter un footer à la carte. |
| `default` | Slot par défaut pour le contenu supplémentaire de la carte. |

## 📝 Exemples d'utilisation

```vue
<template>
  <AvCard
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
    title-height="6rem"
  >
    <template #title>
      <span>Du contenu dans le title</span>
    </template>
    <template #body>
      <span>Du contenu dans le body</span>
    </template>
    <template #footer>
      <span>Du contenu dans le footer</span>
    </template>
  </AvCard>
</template>
```

```vue
<template>
  <AvCard>
    <span>Du contenu général</span>
  </AvCard>
</template>
```
