# Modales - `AvModal`

## 🌟 Introduction

Le composant `AvModal` est une implémentation de `DsfrModal`. La modale permet de concentrer l’attention de l’utilisateur exclusivement sur une tâche ou un élément d’information, sans perdre le contexte de la page en cours. Ce composant nécessite une action de l’utilisateur afin d'être ouvert ou fermé.

Le composant `AvModal` est une fenêtre modale configurable, offrant des fonctionnalités avancées telles que le piégeage de focus, l'écoute des touches d'échappement pour la fermeture, et la gestion des boutons d'action. Ce composant est conçu pour afficher des dialogues et des alertes de manière accessible et ergonomique.

🏅 La documentation sur le `DsfrModal` se trouve sur [VueDSFR](https://vue-ds.fr/composants/DsfrModal)

## 📐 Structure

La modale par défaut permet de mettre en évidence une information qui ne nécessite pas d’action de l’utilisateur. Elle s’affiche à la suite du clic sur un bouton.

Elle se compose des éléments suivants :

- Le titre (slot `header`), optionnel
- La zone de contenu (slot `default`), obligatoire
- La zode de pied justifiée à droite, qui peut être remplie en utilisant le slot `footer`, avec toujours le bouton fermer à gauche des éléments du slot. Cette zone ne doit contenir que des boutons.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `modalId` | `string` | `useRandomId('modal', 'dialog')` | | Identifiant unique pour la modale. |
| `opened` | `boolean` | `false` | | Indique si la modale est ouverte. |
| `isAlert` | `boolean` | `false` | | Spécifie si la modale est une alerte (rôle `"alertdialog"` si `true`) ou non (le rôle sera  alors `"dialog"`). |
| `origin` | `{ focus: () => void }` | `{ focus() {} }` | | Référence à l'élément d'origine pour redonner le focus après fermeture. |
| `icon` | `string` | `undefined` | | Nom de l'icône à afficher dans le titre de la modale. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `md` | | Taille de la modale. |
| `closeButtonLabel` | `string` | `TODO` | | Label et titre (pour l'accessibilité) du bouton de fermeture. |
| `closeButtonVariant` | `'DEFAULT' \| 'OUTLINED' \| undefined` | `'DEFAULT'` | | Variant du bouton de fermeture : sans bordure (`DEFAULT`) ou avec bordure (`OUTLINED`). |

## 📡 Évenements

| Nom | Donnée (*payload*) | Description |
| --- | --- | --- |
| `'close'` | `number` | Événement émis lorsque la modale est fermée. |

## 🧩 Slots

| Nom | Description |
| --- | --- |
| `default` | Slot par défaut pour le contenu de la modale. |
| `header` | Slot par défaut pour le titre de la modale. |
| `footer` | Slot par défaut pour la zone de pied de la modale. |

## 📝 Exemples d'utilisation

```vue
<script lang="ts" setup>
const { showModal, displayModal, hideModal } = useModal()
</script>

<template>
  <AvButton
    label="Ouvrir la modale"
    :on-click="displayModal"
  />
  <AvModal
    :opened="showModal"
    close-button-label="Fermer"
    size="lg"
    @close="hideModal"
  >
    <template #header>
      <span class="n5">Un super titre</span>
    </template>
    <span class="b2-regular">Un super contenu</span>
    <template #footer>
      <AvButton label="Un bouton qui sera à droite du bouton 'Fermer'" />
    </template>
  </AvModal>
</template>
```
