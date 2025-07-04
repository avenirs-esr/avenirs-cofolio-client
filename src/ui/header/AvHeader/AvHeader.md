# Header - `AvHeader`

## 🌟 Introduction

The `AvHeader` component is an adaptation of the `DsfrHeader` code.

It is an ultra-flexible header component. It integrates a search bar and quick links. It also allows the addition of a main navigation in the `mainnav` slot and a language selector via the `language-selector` prop.

🏅 The documentation for the `DsfrHeader` can be found at [VueDSFR](https://vue-ds.fr/composants/DsfrHeader)

## 📐 Structure

The header consists of:

- the Cofolio brand block.
- the service name.
- a baseline (description) below the site name.
- an optional functional section - offering quick access and/or a search bar and/or a language selector - adapted to the specific needs of each site.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `searchbarId` | `string` | `'searchbar-header'` | | Value of the `id` attribute of the searchbar input. |
| `serviceTitle` | `string` | `undefined` | | Title of the service displayed in the header. |
| `serviceDescription` | `string` | `undefined` | | Short description of the service. |
| `homeTo` | `string \| RouteLocationRaw` | `'/'` | | Homepage link. |
| `modelValue` | `string` | `''` | | Value for the search bar. |
| `placeholder` | `string` | `'Rechercher...'` | | Placeholder for the search bar. |
| `quickLinks` | `DsfrHeaderMenuLinkProps[]` | `() => []` | | Quick links to display in the header. |
| `languageSelector` | `DsfrLanguageSelectorProps` | `undefined` | | Quick links to display in the header. |
| `searchLabel` | `string` | `'Recherche'` | | Label for the search bar. |
| `quickLinksAriaLabel` | `string` | `'Menu secondaire'` | | ARIA label for quick links. |
| `showSearch` | `boolean` | `false` | | Shows or hides the search bar. |
| `showSearchLabel` | `string` | `'Recherche'` | | Label for the button to display the search. |
| `menuLabel` | `string` | `'Menu'` | | Menu label. |
| `menuModalLabel` | `string` | `'Menu'` | | Menu label in modal mode. |
| `closeMenuModalLabel` | `string` | `'Fermer'` | | Menu close button label in modal mode. |
| `homeLabel` | `string` | `'Accueil'` | | Home label comprising the title of the link presenting the service. |

## 📡 Events

| Name | Data (*payload*) | Description |
| --- | --- | --- |
| `'update:modelValue'` | Content (`string`) of the search input field | Emitted when the search bar is updated. |
| `'search'` | Content (`string`) of the search input field | Emitted when a search is performed. |
| `'languageSelect'` | Content (`DsfrLanguageSelectorElement`) of the selected language | Emitted when the user changes the site language. |

## 🧩 Slots

| Name | Description |
| --- | --- |
| `before-quick-links` | Slot to add content before quick links. |
| `after-quick-links` | Slot to add content after quick links. |
| `mainnav` | Slot for the main navigation menu. |
| `default` | Default slot for additional content in the header. |

## 📝 Examples of use

```vue
<script setup lang="ts">
const { languageSelector, selectLanguage } = useLanguageSwitcher()
const searchQuery = ref('')
</script>

<template>
  <AvHeader
    v-model="searchQuery"
    service-title="Student Cofolio"
    home-to="/student"
    show-search
    :language-selector="languageSelector"
    @language-select="selectLanguage($event)"
  >
    <template #before-quick-links>
      <ul class="fr-btns-group">
        <li>
          <StudentMailboxPopover />
        </li>
        <li>
          <StudentNotificationsPopover />
        </li>
        <li>
          <StudentProfilePopover />
        </li>
      </ul>
    </template>
    <template #mainnav>
      <StudentNavigation />
    </template>
  </AvHeader>
</template>
```
