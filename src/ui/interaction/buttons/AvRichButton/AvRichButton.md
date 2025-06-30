# Boutons riches - `AvRichButton`

## 🌟 Introduction

Le bouton riche est un élément d’interaction avec une interface permettant à l’utilisateur d’effectuer une action.

Le `AvRichButton` est un composant Vue élégant et réutilisable, conçu pour simplifier la création de boutons riches personnalisés. Il intègre des icônes optionnelles et un gestionnaire de clics. Son utilisation est simple, avec une grande flexibilité pour s'adapter à différents contextes.

Par la présence d'un slot par défaut, le contenu du bouton est hautement paramétrable. La propriété `label` permet d'affecter le `title` et le `aria-label` du bouton.

## 📐 Structure

Les boutons riches sont consistent en un bouton composé de :

- une icone gauche optionnelle
- un slot par défaut pour le contenu du bouton
- une icone droite optionnelle

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | | ✅ | Étiquette textuelle du bouton. |
| `iconLeft` | `string` | `undefined` | | Icône à afficher à gauche dans le bouton. Doit être un nom d'icône. |
| `iconRigt` | `string` | `undefined` | | Icône à afficher à droite dans le bouton. Doit être un nom d'icône. |
| `customPadding` | `string` | `'1rem'` | | Permet de modifier le padding du bouton. |
| `onClick` | `($event: MouseEvent) => void` | `undefined` | | Fonction appelée lors du clic sur le bouton. |

## 📡 Évenements

Aucun.

## 🧩 Slots

| Nom | Description |
| --- | --- |
| `default` | Slot par défaut pour le contenu du bouton riche. |

## 📝 Exemples d'utilisation

```vue
<template>
  <AvRichButton
    label="Éditer mon profil"
    icon-right="mdi:pencil-outline"
  >
    <span>Éditer mon profil</span>
  </AvRichButton>
</template>
```

```vue
<template>
  <AvRichButton
    icon-right="mdi:arrow-right-thin"
    label="Nom d'une page"
    custom-padding="0.5rem"
  >
    <div class="body">
      <AvVIcon
        :name="MDI_ICONS.FILE_ACCOUNT_OUTLINE"
        color="var(--other-background-base)"
        :size="1.5"
      />
      <div class="description ellipsis-container">
        <span class="ellipsis b1-regular">Nom d'une page</span>
        <span class="ellipsis caption-light">Dernière mise à jour : le 02/02/2025</span>
      </div>
    </div>
  </AvRichButton>
</template>
```
