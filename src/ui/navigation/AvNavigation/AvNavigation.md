# Navigation - `AvNavigation`

## 🌟 Introduction

The `AvNavigation` is a component implementing the VueDSFR `DsfrNavigation`. The main navigation is the central navigation system within a site. It guides the user through the site main and secondary sections.

🏅 Documentation on main navigation can be found on [DSFR](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/navigation-principale)

## 📐 Structure

The navigation component can be used to create a navigation bar with different types of navigation items:
- direct link
- submenu
- mega-menu

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `navItems` | `(DsfrNavigationMenuLinkProps \| DsfrNavigationMenuProps \| DsfrNavigationMegaMenuProps)[]` | | ✅ | List of navigation items. Each item can be:<br>• A direct navigation link (`DsfrNavigationMenuLinkProps`) with the `to` and `text` props.<br>• A navigation submenu (`DsfrNavigationMenuProps`) with the `title`, `links` and `active` props.<br>• A navigation mega-menu (`DsfrNavigationMegaMenuProps`) with the `title`, `link`, `active` and `menus` props. |

## 📡 Events

None.

## 🧩 Slots

None.

## 📝 Examples of use

```vue
<template>
  <AvNavigation :nav-items="navItems" />
</template>
```
