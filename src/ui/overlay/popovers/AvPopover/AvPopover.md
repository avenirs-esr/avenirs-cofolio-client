# Bulles contextuelles - `AvPopover`

## 🌟 Introduction

La popover est un conteneur contextuel qui s’affiche en surimpression à proximité de son élément déclencheur (le trigger). Ce composant permet d’afficher des contenus ou interactions supplémentaires, sans quitter la page courante ni masquer totalement son contexte.

Le composant `AvPopover` est conçu pour proposer un contenu accessible et ergonomique, grâce au piégeage du focus à l’intérieur de la popover lorsqu’elle est ouverte, ainsi qu’à la gestion de la fermeture via la touche Échap. Il offre une grande flexibilité via des slots dédiés au déclencheur (`trigger`) et au contenu (`popover`), permettant d’y insérer n’importe quel contenu ou interaction.

Il utilise un système de positionnement dynamique pour s’afficher à l’endroit adéquat par rapport à son élément déclencheur, tout en garantissant un bon contrôle clavier et une bonne expérience utilisateur.

## 📐 Structure

La popover se compose des éléments suivants :
- Le déclencheur (slot `trigger`), obligatoire : Élément interactif (par exemple, un bouton) qui ouvre ou ferme la popover.
- Le contenu (slot `popover`), obligatoire : Zone de contenu qui peut contenir du texte, des boutons, des listes ou tout autre élément interactif. Cette zone s’affiche à proximité du déclencheur et capte le focus lorsqu’elle est ouverte.

La popover intègre :
- Une gestion du focus (focus trap) pour l’accessibilité clavier.
- Une fermeture via la touche Échap ou le clic à l’extérieur de la popover.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `width` | `string` | `'12.5rem'` | | Largeur de la popover. |
| `padding` | `string` | `'var(--spacing-md)'` | | Padding interne de la popover. |

## 📡 Évenements

Aucun.

## 🧩 Slots

| Nom | Description |
| --- | --- |
| `trigger` | Slot pour le déclencheur de la popover. Fournit la prop `toggle` (fonction pour ouvrir/fermer la popover). |
| `popover` | Slot pour le contenu de la popover. Fournit la prop `close` (fonction pour fermer la popover). |

## 📝 Exemples d'utilisation

```vue
<template>
  <AvPopover
    width="30rem"
    padding="var(--spacing-md)"
  >
    <template #trigger="{ toggle }">
      <AvButton
        label="Ouvrir la popover"
        :on-click="toggle"
      />
    </template>
    <template #popover="{ close }">
      <div class="container">
        <span>Du contenu...</span>
        <AvButton
          label="Fermer"
          :on-click="close"
          size="sm"
        />
      </div>
    </template>
  </AvPopover>
</template>
```
