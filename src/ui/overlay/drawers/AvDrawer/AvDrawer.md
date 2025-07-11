# Drawers - `AvDrawer`

## 🌟 Introduction

The drawer is a panel that slides in from the edge of the screen, providing additional content or navigation options without leaving the current page. This component is designed to display contextual information, actions, or secondary navigation in a non-intrusive way.

The `AvDrawer` component offers flexible positioning (left or right), customizable dimensions, and an optional backdrop overlay. It provides a clean, accessible way to present supplementary content while maintaining focus on the primary interface.

It features smooth animations, proper z-index management, and integrates seamlessly with the design system's styling tokens.

## 📐 Structure

The drawer consists of the following elements:
- **Container**: The main drawer panel that slides in from the specified edge
- **Backdrop** (optional): Semi-transparent overlay that dims the background content
- **Content Area**: Flexible content container that accepts any slotted content

The drawer integrates:
- Fixed positioning for consistent placement
- Conditional backdrop for modal-like behavior
- Position-specific styling (left/right rounded corners and shadows)
- Responsive width and padding customization

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `show` | `boolean` | | ✅ | Controls drawer visibility (open/closed state). |
| `position` | `'left' \| 'right'` | `'right'` | | Position from which drawer slides in. |
| `width` | `string` | `'35rem'` | | Width of the drawer panel. |
| `backdrop` | `boolean` | `true` | | Whether to show backdrop overlay behind drawer. |
| `padding` | `string` | `'var(--spacing-md)'` | | Internal padding of drawer content area. |

## 🧩 Slots

| Name | Description |
| --- | --- |
| `default` | Slot for drawer content. Can contain any HTML or Vue components. |

## 📝 Examples of use

### Basic Usage

```vue
<script setup lang="ts">
const isDrawerOpen = ref(false)
</script>

<template>
  <div>
    <AvButton
      label="Open Drawer"
      @click="isDrawerOpen = true"
    />

    <AvDrawer :show="isDrawerOpen">
      <h3>Drawer Content</h3>
      <p>This is the drawer content area.</p>
    </AvDrawer>
  </div>
</template>
```

### Left Position with Custom Width

```vue
<template>
  <AvDrawer
    :show="isDrawerOpen"
    position="left"
    width="25rem"
  >
    <div class="navigation">
      <h3>Navigation</h3>
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
  </AvDrawer>
</template>
```

### Without Backdrop

```vue
<template>
  <AvDrawer
    :show="isDrawerOpen"
    :backdrop="false"
    width="20rem"
  >
    <div class="sidebar">
      <h3>Sidebar Content</h3>
      <p>This drawer appears without dimming the background.</p>
    </div>
  </AvDrawer>
</template>
```

### Custom Padding

```vue
<template>
  <AvDrawer
    :show="isDrawerOpen"
    padding="var(--spacing-lg)"
  >
    <div class="content">
      <h3>Spacious Content</h3>
      <p>This drawer has larger internal padding.</p>
    </div>
  </AvDrawer>
</template>
```

## 🎨 Styling

The drawer uses the following design tokens:
- `--dialog` for background color
- `--surface-background` for border color
- `--radius-hg` for rounded corners
- `--spacing-md` for default padding
- Position-specific box shadows for depth

The component automatically applies appropriate border radius and shadows based on the position prop:
- **Left position**: Rounded on the right side with left-side shadow
- **Right position**: Rounded on the left side with right-side shadow
