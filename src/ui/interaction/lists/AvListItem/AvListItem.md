# Lists - `AvListItem`

## 🌟 Introduction

The AvListItem component represents an individual item within a list container. It provides a flexible and accessible way to display content with optional icons, titles, descriptions, and interactive capabilities while maintaining consistent styling and behavior patterns.

The `AvListItem` component is designed to work seamlessly within `AvList` containers, offering extensive customization for various use cases including navigation menus, content lists, action items, and interactive elements. It supports full accessibility compliance with proper ARIA attributes and keyboard navigation.

It features comprehensive interaction states (hover, focus, active, disabled, selected), flexible content structure with slots, and dynamic tag rendering for different semantic contexts while maintaining visual consistency with the design system.

## 📐 Structure

The list item consists of the following elements:
- The container (component with dynamic tag), mandatory: Root wrapper element that can be div, button, or anchor based on usage
- The icon (optional): Visual indicator displayed on the left side of the content
- The content area (mandatory): Contains title, description, and/or custom content
- Custom content slot (optional): Allows insertion of any custom elements within the content area

The list item integrates:
- Dynamic tag rendering for semantic correctness (div, button, a)
- Full accessibility support with ARIA attributes and keyboard navigation
- Comprehensive interaction states and visual feedback
- Flexible content structure with icon, title, description, and slot support

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `icon` | `string` | | | The icon name according to the naming convention defined for VIcon. |
| `color` | `string` | `'var(--text1)'` | | The icon and text color. |
| `iconSize` | `number` | `1.3125` | | The icon size in rem units. |
| `title` | `string` | | | The main title text for the list item. |
| `description` | `string` | | | The secondary description text. |
| `hoverBackgroundColor` | `string` | `'var(--dark-background-primary1)'` | | Background color when hovered or selected. |
| `colorOnHover` | `string` | `'var(--card)'` | | Text and icon color when hovered or selected. |
| `descriptionColor` | `string` | `'var(--text2)'` | | Color for the description text. |
| `clickable` | `boolean` | `false` | | Whether the list item is interactive and clickable. |
| `disabled` | `boolean` | `false` | | Whether the list item is disabled. |
| `selected` | `boolean` | `false` | | Whether the list item is in selected/active state. |
| `onClick` | `function` | | | Function called when the list item is clicked. |
| `ariaLabel` | `string` | | | Custom ARIA label for accessibility. |
| `ariaDescribedby` | `string` | | | ID of element that describes the list item. |
| `tag` | `'button' \| 'div' \| 'a'` | `'button'` | | HTML tag to use when clickable. |
| `href` | `string` | | | URL when tag is 'a'. |
| `target` | `string` | | | Target attribute when tag is 'a'. |
| `rel` | `string` | | | Rel attribute when tag is 'a'. |
| `role` | `string` | | | ARIA role for the list item. If not provided, defaults based on context. |

## 📡 Events

| Name | Description |
| --- | --- |
| `click` | Emitted when the list item is clicked (only when clickable and not disabled). |

## 🧩 Slots

| Name | Description |
| --- | --- |
| `default` | Default slot for custom content within the list item. |

## 📝 Examples of use

### Basic List Item

```vue
<template>
  <AvListItem
    title="Basic Item"
    description="This is a simple list item"
  />
</template>
```

### Clickable List Item with Icon

```vue
<template>
  <AvListItem
    title="Settings"
    description="Configure your preferences"
    icon="mdi:cog"
    clickable
    @click="handleSettingsClick"
  />
</template>
```

### Navigation Link

```vue
<template>
  <AvListItem
    title="External Link"
    description="Opens in new tab"
    icon="mdi:open-in-new"
    tag="a"
    href="https://example.com"
    target="_blank"
    rel="noopener noreferrer"
    clickable
  />
</template>
```

### Selected State

```vue
<template>
  <AvListItem
    title="Active Item"
    icon="mdi:check-circle"
    selected
    clickable
  />
</template>
```

### Disabled State

```vue
<template>
  <AvListItem
    title="Disabled Item"
    description="This item is not available"
    icon="mdi:block-helper"
    disabled
    clickable
  />
</template>
```

### Custom Content with Slot

```vue
<template>
  <AvListItem
    title="Custom Content"
    icon="mdi:information"
    clickable
  >
    <div class="custom-actions">
      <button>Edit</button>
      <button>Delete</button>
    </div>
  </AvListItem>
</template>
```

### Custom Styling

```vue
<template>
  <AvListItem
    title="Custom Colors"
    description="With custom styling"
    icon="mdi:palette"
    clickable
    color="#2563eb"
    hover-background-color="#dbeafe"
    color-on-hover="#1d4ed8"
    description-color="#6b7280"
  />
</template>
```
