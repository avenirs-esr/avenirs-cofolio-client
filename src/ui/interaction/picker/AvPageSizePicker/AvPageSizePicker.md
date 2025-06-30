# Sélecteur de nombre de résultats par page - `AvPageSizePicker`

## 🌟 Introduction

Le `AvPageSizePicker` est un composant implémentant le `AvTagPicker` et dédié à la sélection de nombre de résultats par page.

## 📐 Structure

Les sélecteurs de nombre de résultats par page sont composés d'un `AvTagPicker` auquel des options spécifiques au nombre de résultats par page sont affectées.

## 🛠️ Props

| Nom | Type | Défaut | Obligatoire | Description |
| --- | --- | --- | --- | --- |
| `pageSizeSelected` | `PageSizes` | | ✅ | Indique le nombre de résultats par page sélectionné. |
| `handleSelectChange` | `(val: AvTagPickerOption) => void` | | ✅ | Méthode exécutée à la mise à jour de la sélection. |

## 📡 Évenements

Aucun.

## 🧩 Slots

Aucun.

## 📝 Exemples d'utilisation

```vue
<script setup lang="ts">
const amsStore = useAmsStore()

function handleSelectChange (val: AvTagPickerOption): void {
  const numberVal = Number(val.value)
  if (pageSizeValues.includes(numberVal)) {
    amsStore.pageSizeSelected = numberVal as PageSizes
  }
}
</script>

<template>
  <AvPageSizePicker
    :page-size-selected="amsStore.pageSizeSelected"
    :handle-select-change="handleSelectChange"
  />
</template>
```
