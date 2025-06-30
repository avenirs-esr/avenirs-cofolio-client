# Boutons - `AvButton`

## 🌟 Introduction

Le `AvButton` est un composant implémentant le `DsfrButton` de VueDSFR. Le bouton est un élément d’interaction avec une interface permettant à l’utilisateur d’effectuer une action.

Le `AvButton` est un composant Vue élégant et réutilisable, conçu pour simplifier la création de boutons personnalisés. Il intègre des tailles ajustables, une icône optionnelle et un gestionnaire de clics, tout en respectant le style de `DSFR`. Son utilisation est simple, avec une grande flexibilité pour s'adapter à différents contextes.

Dans le cadre de `AVENIR(s) ESR`, le bouton a été simplifié afin de n'autoriser que deux variants (`DEFAULT` sans bordure et `OUTLINED` avec bordure) ainsi que deux thèmes (`PRIMARY` bleu foncé et `SECONDARY` gris).

🏅 La documentation sur le `DsfrButton` se trouve sur [VueDSFR](https://vue-ds.fr/composants/DsfrButton)

## 📐 Structure

Les boutons sont composés de :

- Un label - obligatoire, en utilisant la prop `label`, permet l'affichage du label lorsque `iconOnly` est `false`, permet également la connexion à `title` et `aria-label` ;
- Une icône, pouvant être modifiée (voir les icônes disponibles) - optionnelle.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `variant` | `'DEFAULT' \| 'OUTLINED'` | `'DEFAULT'` | | Variant du bouton : sans bordure (`DEFAULT`) ou avec bordure (`OUTLINED`). |
| `theme` | `'PRIMARY' \| 'SECONDARY'` | `'PRIMARY'` | | Thème du bouton : bleu (`PRIMARY`) ou gris (`SECONDARY`). |
| `isLoading` | `boolean` | `false` | | Indique un état de chargement du bouton. |
| `iconScale` | `number` | `undefined` | | Permet de modifier manuellement la taille de l'icône (elle est auomatiquement calculée sans cela). |
| `noRadius` | `boolean` | `false` | | Permet de retirer les radius de la bordure du bouton. |
| `disabled` | `boolean` | `false` | | Indique l'état désactivé du bouton. |
| `label` | `string` | | ✅ | Étiquette textuelle du bouton. |
| `iconRight` | `boolean` | `false` | | Indique la position de l'icône par rapport au texte du bouton : à gauche (`false`) ou à droite (`true`). |
| `iconOnly` | `boolean` | `false` | | Permet de masquer le texte du label (`true`) ou de l'afficher (`false`). |
| `size` | `'sm' \| 'small' \| 'lg' \| 'large' \| 'md' \| 'medium' \| '' \| undefined` | `'md'` | | Taille du bouton. |
| `icon` | `string \| InstanceType<typeof VIcon>['$props']` | `undefined` | | Icône à afficher dans le bouton. Peut être un nom ou une configuration d'icône. |
| `onClick` | `($event: MouseEvent) => void` | `undefined` | | Fonction appelée lors du clic sur le bouton. |

## 📡 Évenements

Aucun.

## 🧩 Slots

Aucun.

## 📝 Exemples d'utilisation

```vue
<template>
  <AvButton
    label="Voir tout"
    :on-click="navigateToStudentDeliverables"
    icon="mdi:arrow-right-thin"
  />
</template>
```

```vue
<template>
  <AvButton
    class="settings-btn"
    icon="mdi:dots-vertical"
    icon-only
    variant="OUTLINED"
    size="sm"
    label="Paramètres de la trace"
    :on-click="toggleSettingsMenu"
  />
</template>
```

```vue
<template>
  <AvButton
    label="Me déconnecter"
    icon="mdi:logout"
    variant="DEFAULT"
    theme="SECONDARY"
    size="sm"
    no-radius
  />
</template>
```
