# Onglets - `AvTabs`

## 🌟 Introduction

Le `AvTabs` est un composant implémentant le `DsfrTabs` de VueDSFR tout en gérant automatiquement l'ajout des `DsfrTabItem` en fonction des `AvTab` présents dans le slot `default`.

Le composant onglet permet aux utilisateurs de naviguer dans différentes sections de contenu au sein d’une même page.

Le système d'onglet aide à regrouper différents contenus dans un espace limité et permet de diviser un contenu dense en sections accessibles individuellement afin de faciliter la lecture pour l'utilisateur.

🏅 La documentation sur le `DsfrTabs` se trouve sur [VueDSFR](https://vue-ds.fr/composants/DsfrTabs)

## 📐 Structure

Chaque onglet se compose des éléments suivants :

- un icône à gauche du titre - optionnel.
- un titre cliquable - obligatoire : permet d’afficher la zone de contenu qui lui est associée.

Si le nombre d’onglets dépasse la largeur du container, un scroll horizontal permet de naviguer entre les différents onglets.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `undefined` | | Aria label de la liste des onglets. |
| `modelValue` | `number` | | ✅ | Index de l'onglet sélectionné au chargement (commence à 0). |

## 📡 Évenements

| Nom | Donnée (*payload*) | Description |
| --- | --- | --- |
| `'update:modelValue'` | Index (`number`) de l'onglet sélectionné | Émis lorsqu'un onglet est sélectionné. |

## 🧩 Slots

| Nom | Description |
| --- | --- |
| `default` | Slot par défaut pour l'ajout des différents onglets (chaque onglet doit être dans un `AvTab`). |

## 📝 Exemples d'utilisation

```vue
<template>
  <AvTabs v-model="activeTab">
    <AvTab
      title="Liste de mes AMS"
      icon="mdi:format-list-bulleted"
    >
      <AmsListContainer />
    </AvTab>
    <AvTab
      title="Planning de mes AMS"
      icon="mdi:calendar-month-outline"
    >
      <AmsPlanningContainer />
    </AvTab>
  </AvTabs>
</template>
```
