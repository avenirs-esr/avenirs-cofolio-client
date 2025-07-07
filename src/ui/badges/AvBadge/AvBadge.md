# Badges - `AvBadge`

## 🌟 Introduction

The `AvBadge` is a component that implements the VueDSFR `DsfrBadge`. This Vue component is ideal for displaying short, important information, such as categories, labels, or statuses.

🏅 The documentation for the `DsfrBadge` can be found at [VueDSFR](https://vue-ds.fr/composants/DsfrBadge)

## 📐 Structure

- The component is a `p` element with the `fr-badge` class.
- Props allow you to modify the badge appearance according to the props: color, icon presence, size, and handling of overly long text.
- The `label` is displayed inside a `span`, potentially with the `ellipsis` prop and a defined or maximum size to handle truncated text.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `color` | `string` | | ✅ | The color of the text to display in the badge. |
| `backgroundColor` | `string` | | ✅ | The background color of the badge. |
| `borderColor` | `string` | | | The color of the badge border. |
| `iconPath` | `string` | | | The link to the public icon in the project (e.g., `/assets/icons/calendar-clock-outline.svg`). |
| `type` | `'success' \| 'warning' \| 'error' \| 'info'` | 'info' | | Sets the badge type. |
| `label` | `string` | | ✅ | The text to display in the badge. |
| `noIcon` | `boolean` | `false` | | If `true`, the badge is displayed without an icon. |
| `small` | `boolean` | `false` | | If `true`, displays a reduced-size badge. |
| `ellipsis` | `boolean` | `false` | | If `true`, the text is truncated with an ellipsis if it is too long. |

## 📡 Events

None.

## 🧩 Slots

None.

## 📝 Examples of use

```vue
<template>
  <AvBadge
    label="In progress"
    color="var(--dark-background-primary1)"
    background-color="var(--light-background-primary2)"
    icon-path="/assets/icons/calendar-range-outline.svg"
    small
  />
</template>
```
