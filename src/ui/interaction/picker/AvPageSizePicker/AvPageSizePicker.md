# Picker for number of results per page - `AvPageSizePicker`

## 🌟 Introduction

The `AvPageSizePicker` is a component implementing the `AvTagPicker` and dedicated to selecting the number of results per page.

## 📐 Structure

The pickers for number of results per page consist of an `AvTagPicker` to which options specific to the number of results per page are assigned.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | | ✅ | Label of the page size picker. |
| `pageSizeSelected` | `PageSizes` | | ✅ | Indicates the number of results per page selected. |
| `handleSelectChange` | `(val: AvTagPickerOption) => void` | | ✅ | Method executed when selection is updated. |

## 📡 Events

None.

## 🧩 Slots

None.

## 📝 Examples of use

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
    label="Number of results per pages:"
    :page-size-selected="amsStore.pageSizeSelected"
    :handle-select-change="handleSelectChange"
  />
</template>
```
