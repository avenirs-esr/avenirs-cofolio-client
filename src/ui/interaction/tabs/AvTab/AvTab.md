# Onglets - `AvTab`

## 🌟 Introduction

Le `AvTab` est un composant déclaratif utilisé exclusivement dans le slot `default` de `AvTabs`.
`AvTab` permet de configurer un onglet en transmettant ses props (comme `title` et `icon`) au composant `AvTabs` sans gérer de rendu.

Il agit comme un composant proxy : il expose des informations (props) utilisées par `AvTabs` pour générer l'interface.

🚫 Ce composant n'affiche rien par lui-même et ne doit pas être utilisé hors de `AvTabs`.

## 📐 Structure

Aucune.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | | ✅ | Titre de l'onglet affiché dans la barre des onglets. |
| `icon` | `string` | `undefined` | | Icône de l'onglet. |

## 📡 Évenements

Aucun.

## 🧩 Slots

| Nom | Description |
| --- | --- |
| `default` | Slot par défaut pour le contenu de l'onglet. |

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
