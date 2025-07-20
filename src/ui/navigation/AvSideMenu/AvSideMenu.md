# Navigation - `AvSideMenu`

## 🌟 Introduction

The `AvSideMenu` component is a flexible and accessible navigation side-menu that provides a collapsible sidebar container for navigation purposes. It focuses on layout and collapse functionality, allowing you to insert any content via slots while maintaining full accessibility and keyboard navigation support.

Built with Vue 3 and TypeScript, this component offers smooth transitions, responsive design, and optional collapse functionality that can be enabled or disabled as needed. The component uses **defineModel** for automatic internal state management, working seamlessly both with and without v-model.

## 📐 Structure

The side-menu component consists of the following elements:
- **Header** (optional): Contains the collapse/expand toggle button when `collapsible=true`
- **Toggle Button** (optional): Interactive button to collapse/expand the menu (only when collapsible)
- **Content Area**: Scrollable area containing your custom content via default slot

The component integrates focus management, proper ARIA attributes, and responsive design patterns for optimal accessibility.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | `undefined` |  | Unique identifier for the side-menu |
| `collapsible` | `boolean` | `true` |  | Whether the collapsing feature is enabled |
| `width` | `string` | `'16rem'` |  | Width of the side-menu when expanded |
| `collapsedWidth` | `string` | `'5rem'` |  | Width of the side-menu when collapsed |

### v-model

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `collapsed` | `boolean` | `false` | Whether the side-menu is collapsed (supports v-model with defineModel) |

## 📡 Events

| Name | Data (*payload*) | Description |
| --- | --- | --- |
| `update:collapsed` | `boolean` | Emitted when the collapse state changes (defineModel automatic event) |

## 🧩 Slots

| Name | Description |
| --- | --- |
| `default` | Default slot for custom content (navigation items, menus, etc.) |

## 📝 Examples of use

### With v-model (Controlled)

```vue
<script setup lang="ts">
const isCollapsed = ref(false)
</script>

<template>
  <AvSideMenu
    id="main-nav"
    v-model:collapsed="isCollapsed"
  >
    <nav>
      <ul>
        <li>
          <router-link to="/">
            Home
          </router-link>
        </li>
        <li>
          <router-link to="/profile">
            Profile
          </router-link>
        </li>
        <li>
          <router-link to="/settings">
            Settings
          </router-link>
        </li>
      </ul>
    </nav>
  </AvSideMenu>
</template>
```

### Without v-model (Uncontrolled)

```vue
<template>
  <AvSideMenu id="uncontrolled-nav">
    <nav>
      <ul>
        <li>
          <router-link to="/">
            Home
          </router-link>
        </li>
        <li>
          <router-link to="/profile">
            Profile
          </router-link>
        </li>
        <li>
          <router-link to="/settings">
            Settings
          </router-link>
        </li>
      </ul>
    </nav>
  </AvSideMenu>
</template>
```

### Non-Collapsible Sidemenu

```vue
<template>
  <AvSideMenu
    id="static-nav"
    :collapsible="false"
  >
    <div class="navigation-content">
      <h3>Navigation</h3>
      <nav>
        <router-link to="/">
          Dashboard
        </router-link>
        <router-link to="/users">
          Users
        </router-link>
        <router-link to="/reports">
          Reports
        </router-link>
      </nav>
    </div>
  </AvSideMenu>
</template>
```

### Custom Width

```vue
<script setup lang="ts">
import { MDI_ICONS } from '@/ui/tokens/icons'

const sidebarCollapsed = ref(true)
</script>

<template>
  <AvSideMenu
    id="custom-nav"
    v-model:collapsed="sidebarCollapsed"
    width="20rem"
    collapsed-width="3rem"
  >
    <nav class="nav-menu">
      <div class="nav-item">
        <AvVIcon :name="MDI_ICONS.HOME_VARIANT_OUTLINE" />
        <span v-if="!sidebarCollapsed">Home</span>
      </div>
      <div class="nav-item">
        <AvVIcon :name="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE" />
        <span v-if="!sidebarCollapsed">Profile</span>
      </div>
    </nav>
  </AvSideMenu>
</template>
```

### With Event Handlers

```vue
<script setup lang="ts">
function handleCollapseChange (collapsed: boolean) {
  console.log('Sidemenu collapsed:', collapsed)
  // Save user preference, update layout, etc.
}
</script>

<template>
  <AvSideMenu
    id="event-nav"
    @update:collapsed="handleCollapseChange"
  >
    <div class="custom-navigation">
      <!-- Your navigation content here -->
    </div>
  </AvSideMenu>
</template>
```

### Complete Application Layout

```vue
<script setup lang="ts">
import { MDI_ICONS } from '@/ui/tokens/icons'

const sidebarCollapsed = ref(false)

const navigationItems = [
  {
    label: 'Mon parcours',
    icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
    path: '/'
  },
  {
    label: 'Mes formations',
    icon: MDI_ICONS.BOOK_LOCATION_OUTLINE,
    path: '/formations'
  },
  {
    label: 'Mes expériences',
    icon: MDI_ICONS.BRIEFCASE_VARIANT_OUTLINE,
    path: '/experiences'
  },
  {
    label: 'Mes activités',
    icon: MDI_ICONS.STAR_SHOOTING_OUTLINE,
    path: '/activities'
  }
]

function onSidebarToggle (collapsed: boolean) {
  // Save user preference to localStorage
  localStorage.setItem('sidebar-collapsed', collapsed.toString())
}
</script>

<template>
  <div class="app-layout">
    <AvSideMenu
      id="app-nav"
      v-model:collapsed="sidebarCollapsed"
      width="18rem"
      collapsed-width="4rem"
      @update:collapsed="onSidebarToggle"
    >
      <div class="navigation-wrapper">
        <div class="nav-header">
          <h2 v-if="!sidebarCollapsed">
            Cofolio
          </h2>
        </div>

        <nav class="nav-menu">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ 'nav-item--active': $route.path === item.path }"
          >
            <AvVIcon :name="item.icon" />
            <span v-if="!sidebarCollapsed">{{ item.label }}</span>
          </router-link>
        </nav>
      </div>
    </AvSideMenu>

    <main class="main-content">
      <router-view />
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
  overflow: auto;
  padding: 2rem;
}

.navigation-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.nav-header {
  padding: 1rem;
  border-bottom: 1px solid var(--divider);
}

.nav-menu {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin: 0.25rem;
  color: var(--text1);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: var(--surface-background);
}

.nav-item--active {
  background-color: var(--dark-background-primary1);
  color: white;
}
</style>
```
