# Sélecteur de tag - `AvTagPicker`

## 🌟 Introduction

Le `AvTagPicker` est un composant Vue permettant à un utilisateur de choisir un élément dans un ensemble donné. Les éléments sélectionnables consistent en des `DsfrTag`.

La liste de `DsfrTag` fournit une liste d’option parmi lesquelles l’utilisateur peut choisir.

## 📐 Structure

Les boutons sont composés de :

- Un label - obligatoire, en utilisant la prop `label`, permet l'affichage du label lorsque `iconOnly` est `false`, permet également la connexion à `title` et `aria-label` ;
- Une icône, pouvant être modifiée (voir les icônes disponibles) - optionnelle.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `options` | `AvTagPickerOption[]` | | ✅ | Liste des options disponibles dans le picker. |
| `label` | `string` | | | Libellé affiché au-dessus du picker. |
| `labelColor` | `string` | `'var(--text2)'` | | Couleur du libellé. |
| `labelTypographyClass` | `string` | `'b2-regular'` | | Classe de typographie appliquée au libellé. |
| `multiple` | `boolean` | `false` | | Active le mode de sélection multiple si `true`. |
| `selected` (mode simple) | `AvTagPickerOption` | | | Option sélectionnée (mode simple). |
| `selected` (mode multiple) | `AvTagPickerOption[]` | | | Options sélectionnées (mode multiple). |
| `handleSelectChange` (simple) | `(selected: AvTagPickerOption) => void` | | ✅ | Méthode appelée lors de la sélection en mode simple. |
| `handleSelectChange` (multiple) | `(selected: AvTagPickerOption[]) => void` | | ✅ | Méthode appelée lors de la sélection en mode multiple. |

## 📡 Évenements

Aucun.

## 🧩 Slots

Aucun.

## 📝 Exemples d'utilisation

```vue
<template>
  <AvTagPicker
    :options="options"
    :selected="selectedOption"
    :handle-select-change="handleSelectChange"
    :multiple="false"
    label="Nombre de résultats par page :"
    label-typography-class="b2-regular"
    label-color="var(--text2)"
  />
</template>
```
