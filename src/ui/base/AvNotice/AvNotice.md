# Bandeau d'information importante - `AvNotice`

## 🌟 Introduction

La `AvNotice` est un composant implémentant la `DsfrNotice` de VueDSFR. Le bandeau d’information importante permet aux utilisateurs de voir ou d’accéder à une information importante et temporaire.

Il est affiché sur l’ensemble des pages en desktop et en mobile. Il affiche une information importante et urgente (un usage trop fréquent risque de faire “disparaitre” ce bandeau).

🏅 La documentation sur le `DsfrNotice` se trouve sur [VueDSFR](https://vue-ds.fr/composants/DsfrNotice)

## 📐 Structure

La notice est composée des éléments suivants :

- Un titre (prop `title`, de type `string`) :
  - Optionnel avec une valeur par défault `''`
- Un texte (prop `text`, de type `string`) :
  - optionnel avec une valeur par défault `''`
- un pictogramme et une couleur déterminés par la prop `type` qui peut valoir une des chaînes suivantes :
  - `'info'`
  - `'warning'`
  - `'alert'`
- Une icône d'information

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | | Le titre du bandeau. |
| `text` | `string` | `''` | | Le texte du bandeau. Toute partie de texte entourée de ** sera soulignée. |
| `type` | `'info' \| 'warning' \| 'alert'` |  | ✅ | Le type de bandeau. |

## 📡 Évenements

Aucun.

## 🧩 Slots

Aucun.

## 📝 Exemples d'utilisation

```vue
<template>
  <AvNotice
    text="Vous avez des traces non assignées. Attention, elles seront **supprimées sous 15 jours**. Pensez à les assigner."
    type="warning"
  />
</template>
```
