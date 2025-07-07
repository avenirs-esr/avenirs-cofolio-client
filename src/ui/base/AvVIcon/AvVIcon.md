# Icons - `AvVIcon`

## 🌟 Introduction

The `AvVIcon` component places a `VIcon` in a square `div` of configurable size. It's a Vue.js component for displaying icons with a wide range of customization options, including animations, colors, and sizes. It's designed to be flexible and performant, with support for various display options, flip options, and accessible titles.

It has exactly the same API as OhVueIcon, and uses `@iconify/vue` under the hood.

::: warning
Icon names must be those from [Iconify-vue](https://icon-sets.iconify.design/).
:::

🏅 The documentation for the `VIcon` can be found at [VueDSFR](https://vue-ds.fr/composants/VIcon)

## 📐 Structure

The icon is composed of a square `div` of configurable size containing the `VIcon` component.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `size` | `number` | `1` | | The size in rem of the icon container and a ratio for the icon scale. |
| `name` | `string` | | ✅ | The name of the icon to display. |
| `verticalAlign` | `string` | `'-0.2em'` | | Vertical alignment of the icon relative to the baseline. |
| `animation` | `'spin' \| 'wrench' \| 'pulse' \| 'spin-pulse' \| 'flash' \| 'float'` | `undefined` | | Animation type applied to the icon. |
| `speed` | `'fast' \| 'slow'` | `undefined` | | Animation speed, if defined. |
| `flip` | `'horizontal' \| 'vertical' \| 'both'` | `undefined` | | Flips the icon horizontally, vertically, or both. |
| `label` | `string` | `undefined` | | ARIA label for accessibility. |
| `title` | `number` | `undefined` | | Icon title (`<title>` tag), used for accessibility and tooltips. |
| `color` | `string` | `undefined` | | Main color of the icon. |
| `inverse` | `boolean` | `false` | | Reverses the icon color. |
| `ssr` | `boolean` | `1` | | Enables server-side rendering. |

## 📡 Events

None.

## 🧩 Slots

None.

## 📝 Examples of use

```vue
<template>
  <AvVIcon
    name="mdi:warning-outline"
    color="var(--icon)"
    :size="2"
  />
</template>
```
