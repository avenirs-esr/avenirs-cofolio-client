# Navigation - `AvSideNavigation`

## 🌟 Introduction

The `AvSideNavigation` component is a comprehensive side navigation solution that combines the functionality of `AvSideMenu`, `AvList`, and `AvListItem` components. It provides an accessible and user-friendly way to display navigational options in a collapsible side menu format.

This component is designed to offer a clean and consistent navigation experience, with support for collapsed states, custom icons, and keyboard navigation. It automatically handles the display of labels when expanded and shows only icons when collapsed.

## 📐 Structure

The side navigation consists of the following elements:
- **Container**: The main `AvSideMenu` wrapper that handles the collapsible behavior
- **Navigation List**: An `AvList` that contains all navigation items
- **Navigation Items**: Individual `AvListItem` components that represent each navigational option

The component integrates:
- Automatic label hiding/showing based on collapsed state
- Icon-only display when collapsed
- Selection state management
- Keyboard navigation support

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `items` | `AvSideNavigationItem[]` | | ✓ | Array of navigation items, each containing id, label, and icon |
| `collapsedWidth` | `string` | `'3.5rem'` | | Width of the side menu when collapsed |

### AvSideNavigationItem Interface

```typescript
interface AvSideNavigationItem {
  id: string // Unique identifier for the item
  label: string // Display text for the item
  icon: string // Icon identifier (from MDI_ICONS or RI_ICONS)
}
```

## 📡 Events

The component uses `defineModel` for two-way binding:

| Model | Type | Description |
| --- | --- | --- |
| `selectedItem` | `string` | Currently selected navigation item ID |
| `isSideMenuCollapsed` | `boolean` | Whether the side menu is in collapsed state |

## 🧩 Slots

None.

## 📝 Examples of use

### Basic Usage

```vue
<script setup lang="ts">
import { MDI_ICONS } from '@/ui/tokens/icons'
const selectedItem = ref('dashboard')
const isCollapsed = ref(false)

const navigationItems: AvSideNavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: MDI_ICONS.HOME_VARIANT_OUTLINE
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: MDI_ICONS.PENCIL_OUTLINE
  }
]
</script>

<template>
  <AvSideNavigation
    v-model:selected-item="selectedItem"
    v-model:is-side-menu-collapsed="isCollapsed"
    :items="navigationItems"
  />
</template>
```

### Custom Collapsed Width

```vue
<template>
  <AvSideNavigation
    v-model:selected-item="selectedItem"
    v-model:is-side-menu-collapsed="isCollapsed"
    :items="navigationItems"
    collapsed-width="5rem"
  />
</template>
```

### Full Implementation Example

```vue
<script setup lang="ts">
import type { AvSideNavigationItem } from '@/ui'
import { MDI_ICONS } from '@/ui/tokens/icons'
import DashboardView from './views/DashboardView.vue'
import ProfileView from './views/ProfileView.vue'
import SettingsView from './views/SettingsView.vue'

const currentSection = ref('dashboard')
const menuCollapsed = ref(false)

const navigationItems: AvSideNavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: MDI_ICONS.HOME_VARIANT_OUTLINE
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: MDI_ICONS.PENCIL_OUTLINE
  }
]

const componentsMap = {
  dashboard: DashboardView,
  profile: ProfileView,
  settings: SettingsView
}

const currentComponent = computed(() => {
  return componentsMap[currentSection.value] || DashboardView
})
</script>

<template>
  <div class="app-layout">
    <AvSideNavigation
      v-model:selected-item="currentSection"
      v-model:is-side-menu-collapsed="menuCollapsed"
      :items="navigationItems"
    />
    <main class="main-content">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  padding: var(--spacing-lg);
}
</style>
```

## 🎨 Styling Notes

The component automatically applies styling for:
- Rounded borders on the right side of menu items (`border-radius: var(--radius-xl) 0 0 var(--radius-xl)`)
- Centered content when collapsed
- Hidden labels in collapsed state using deep CSS selectors

The styling follows the same patterns as the reference implementation in the student project experiences view.
