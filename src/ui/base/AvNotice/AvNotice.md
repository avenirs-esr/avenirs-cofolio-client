# Important information banner - `AvNotice`

## 🌟 Introduction

The `AvNotice` is a component implementing the VueDSFR `DsfrNotice`. The important information banner allows users to view or access important and temporary information.

It is displayed on all pages on desktop and mobile devices. It displays important and urgent information (overuse may cause this banner to "disappear").

🏅 The documentation on the `DsfrNotice` can be found at [VueDSFR](https://vue-ds.fr/composants/DsfrNotice)

## 📐 Structure

The notice consists of the following elements:

- A title (prop `title`, of type `string`):
  - Optional with a default value `''`
- A text (prop `text`, of type `string`):
  - Optional with a default value `''`
- A pictogram and a color determined by the prop `type`, which can be one of the following strings:
  - `'info'`
  - `'warning'`
  - `'alert'`
- An information icon

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | | The banner title. |
| `text` | `string` | `''` | | The banner text. Any text surrounded by ** will be underlined. |
| `type` | `'info' \| 'warning' \| 'alert'` | | ✅ | The banner type. |

## 📡 Events

None.

## 🧩 Slots

None.

## 📝 Examples of use

```vue
<template>
  <AvNotice
    text="You have unassigned tracks. Please note, they will be **deleted within 15 days**. Remember to assign them."
    type="warning"
  />
</template>
```
