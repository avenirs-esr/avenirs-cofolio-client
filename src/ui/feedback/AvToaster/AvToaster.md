# Toasts - `AvToaster`

## 🌟 Introduction

Le composant `AvToaster` est un composant qui permet d'afficher des alertes sous forme de notification en bas de page.

Ce composant autonome doit être placé au plus haut niveau de l'application (par exemple dans `App.vue`) et fonctionne de façon indépendante avec les messages présents dans le store Pinia `toaster`.

## 📐 Structure

Le toaster est composé d'un ensemble d'`AvAlert` (1 par message dans le store Pinia `toaster`).

## 🛠️ Props

Aucune.

## 📡 Évenements

Aucun.

## 🧩 Slots

Aucun.

## 📝 Exemples d'utilisation

```vue
<template>
  <AvToaster />
</template>
```
