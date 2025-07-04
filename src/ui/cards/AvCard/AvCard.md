# Cards - `AvCard`

## 🌟 Introduction

The `AvCard` card is a component for creating customizable styled containers.

## 📐 Structure

The card is composed of a main `div` containing a div for the title (slot `title`), a generic slot by default, a div for the body (slot `body`) as well as a div for the footer (slot `footer`).

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `backgroundColor` | `string` | `'var(--card)'` | | The background color of the card. |
| `borderColor` | `string` | `'var(--stroke)'` | | The border color of the card. |
| `titleBackground` | `string` | `'var(--surface-background)'` | | The background color of the card title. |
| `titleHeight` | `string` | `undefined` | | The height of the card title. |

## 📡 Events

None.

## 🧩 Slots

| Name | Description |
| --- | --- |
| `title` | Slot to add a title to the card. |
| `body` | Slot to add a body to the card. |
| `footer` | Slot to add a footer to the card. |
| `default` | Default slot for additional card content. |

## 📝 Examples of use

```vue
<template>
  <AvCard
    background-color="var(--other-background-base)"
    title-background="var(--other-background-base)"
    title-height="6rem"
  >
    <template #title>
      <span>Some content in title</span>
    </template>
    <template #body>
      <span>Some content in body</span>
    </template>
    <template #footer>
      <span>Some content in footer</span>
    </template>
  </AvCard>
</template>
```

```vue
<template>
  <AvCard>
    <span>Du contenu général</span>
  </AvCard>
</template>
```
