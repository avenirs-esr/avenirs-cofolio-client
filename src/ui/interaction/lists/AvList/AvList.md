# Lists - `AvList`

## 🌟 Introduction

The AvList component is a flexible and accessible container for displaying collections of items. It provides a structured way to present data in a vertical list format with extensive customization options for styling, sizing, and accessibility.

The `AvList` component is designed to work seamlessly with `AvListItem` components, offering consistent spacing, styling, and interaction patterns. It supports various visual configurations including borders, dividers, different sizes, and full accessibility compliance.

## 📐 Structure

The list consists of the following elements:
- The container (div with role), mandatory: Main wrapper that contains all list items with proper semantic structure
- List items (slot content), mandatory: Individual items rendered within the list, typically `AvListItem` components

The list integrates:
- Flexible sizing system for different use cases
- Optional visual enhancements (borders, dividers)
- Full accessibility support with ARIA attributes
- Customizable styling through CSS custom properties

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `backgroundColor` | `string` | `'transparent'` | | Background color of the list container. |
| `borderColor` | `string` | `'var(--stroke)'` | | Border color used for borders and dividers. |
| `borderRadius` | `string` | `'0'` | | Border radius of the list container. |
| `bordered` | `boolean` | `false` | | Whether to show a border around the entire list. |
| `divided` | `boolean` | `false` | | Whether to show dividers between list items. |
| `size` | `'xsmall' \| 'small' \| 'medium' \| 'large'` | `'small'` | | Size variant that controls item padding. |
| `padding` | `string` | `'0'` | | Custom padding for the list container. |
| `ariaLabel` | `string` | | | Accessible label for the list. |
| `ariaLabelledby` | `string` | | | ID of an element that labels the list. |
| `ariaDescribedby` | `string` | | | ID of an element that describes the list. |
| `role` | `'list' \| 'menu' \| 'listbox' \| 'group'` | `'list'` | | Semantic role of the list for accessibility. |

## 📡 Events

None.

## 🧩 Slots

| Name | Description |
| --- | --- |
| `default` | Default slot for AvListItem components or other content. |

## 📝 Examples of use

### Basic List

```vue
<template>
  <AvList>
    <AvListItem title="First Item" />
    <AvListItem title="Second Item" />
    <AvListItem title="Third Item" />
  </AvList>
</template>
```

### Bordered List with Dividers

```vue
<template>
  <AvList
    bordered
    divided
    size="medium"
    border-radius="var(--radius-md)"
  >
    <AvListItem
      title="Item 1"
      icon="mdi:home"
    />
    <AvListItem
      title="Item 2"
      icon="mdi:user"
    />
    <AvListItem
      title="Item 3"
      icon="mdi:settings"
    />
  </AvList>
</template>
```

### Custom Styled List

```vue
<template>
  <AvList
    background-color="var(--surface-alt)"
    border-color="var(--primary)"
    padding="var(--spacing-md)"
    size="large"
    aria-label="Navigation menu"
  >
    <AvListItem
      title="Dashboard"
      clickable
    />
    <AvListItem
      title="Profile"
      clickable
    />
    <AvListItem
      title="Settings"
      clickable
    />
  </AvList>
</template>
```

### Menu List with Accessibility

```vue
<template>
  <AvList
    role="menu"
    aria-labelledby="menu-title"
    divided
    size="medium"
  >
    <AvListItem
      title="New Document"
      clickable
    />
    <AvListItem
      title="Open File"
      clickable
    />
    <AvListItem
      title="Save"
      clickable
    />
  </AvList>
</template>
```
