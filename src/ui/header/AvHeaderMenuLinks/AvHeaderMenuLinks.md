# Header menu links - `AvHeaderMenuLinks`

## 🌟 Introduction

The `AvHeaderMenuLinks` component is an adaptation of the `DsfrHeaderMenuLinks` code. It is intended to be used within the `AvHeader` component.

It provides a list-based navigation structure using the `AvButton` component.

🏅 The documentation for `DsfrHeaderMenuLinks` can be found at [VueDSFR](https://vue-ds.fr/composants/DsfrHeaderMenuLinks)

## 📐 Structure

- `<nav>`: The main component.
- Encloses a `<ul>` list of `<AvButton>`.
- Each `AvButton` is an item in the list and is dynamically rendered.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `links` | `{ icon?: string \| InstanceType<typeof VIcon>['$props'], label?: string, onClick?: ($event: MouseEvent) => void }[]` | `undefined` | | An array of prop objects for each `AvButton`. |
| `navAriaLabel` | `string` | `'Menu secondaire'` | | ARIA label for navigation, useful for accessibility. |

## 📡 Events

| Name | Data (*payload*) | Description |
| --- | --- | --- |
| `'linkClick'` | Click Event (`MouseEvent`) | Event triggered when one of the links is clicked. |

## 🧩 Slots

None.
