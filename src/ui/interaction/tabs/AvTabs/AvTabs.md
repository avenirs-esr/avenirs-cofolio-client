# Tabs - `AvTabs`

## 🌟 Introduction

The `AvTabs` component implements VueDSFR `DsfrTabs` while automatically managing the addition of `DsfrTabItem` according to the `AvTab` present in the `default` slot.

The tab component allows users to navigate different content sections within the same page.

The tab system helps to group different contents together in a limited space, and allows dense content to be divided into individually accessible sections to make reading easier for the user.

🏅 Documentation on `DsfrTabs` can be found at [VueDSFR](https://vue-ds.fr/composants/DsfrTabs)

## 📐 Structure

Each tab consists of the following elements:
- an icon to the left of the title - optional.
- a clickable title - mandatory: displays the associated content zone.

If the number of tabs exceeds the width of the container, a horizontal scroll allows you to navigate between the different tabs.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `undefined` | | Aria label of tab list. |
| `modelValue` | `number` | | ✅ | Index of selected tab at loading (starts at 0). |

## 📡 Events

| Name | Data (*payload*) | Description |
| --- | --- | --- |
| `'update:modelValue'` | Index (`number`) of the selected tab | Issued when a tab is selected. |

## 🧩 Slots

| Name | Description |
| --- | --- |
| `default` | Default slot for adding tabs (each tab must be in an `AvTab`). |

## 📝 Examples of use

```vue
<template>
  <AvTabs v-model="activeTab">
    <AvTab
      title="My RPA list"
      icon="mdi:format-list-bulleted"
    >
      <AmsListContainer />
    </AvTab>
    <AvTab
      title="RPA Planning"
      icon="mdi:calendar-month-outline"
    >
      <AmsPlanningContainer />
    </AvTab>
  </AvTabs>
</template>
```
