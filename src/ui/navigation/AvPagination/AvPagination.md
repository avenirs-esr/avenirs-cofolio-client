# Pagination - `AvPagination`

## 🌟 Introduction

The `AvPagination` component is an adaptation of the `DsfrPagination` code. It is a pagination system compliant with good ergonomic and accessibility practices (ARIA). It allows easy navigation through multiple pages, with advanced features such as page display limitation and event management.

🏅 Documentation on `DsfrPagination` can be found at [VueDSFR](https://vue-ds.fr/composants/DsfrPagination)

## 📐 Structure

This component displays links for the first, previous, middle, next and last pages, with adaptive controls according to pagination status.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `compact` | `boolean` | `false` | | Allows compact display (`Page x of y` and navigation with only previous page and next page without text with just the icon). |
| `pages` | `Page[]` | | ✅ | List of pages, where each page is an object containing information such as `href` and `label`. |
| `truncLimit` | `number` | `2` | | Maximum number of pages displayed. |
| `currentPage` | `number` | `0` | | Index of currently selected page (starts at `0`). |
| `firstPageTitle` | `string` | `undefined` | | Tooltip text for link to first page. |
| `lastPageTitle` | `string` | `undefined` | | Tooltip text for link to last page. |
| `nextPageTitle` | `string` | `undefined` | | Tooltip text for page link. |
| `prevPageTitle` | `string` | `undefined` | | Tooltip text for previous page link. |

## 📡 Events

| Name | Data (*payload*) | Description |
| --- | --- | --- |
| `'update:current-page'` | `number` | Sent when user changes page. |

## 🧩 Slots

None.

## 📝 Examples of use

```vue
<template>
  <AvPagination
    id="top-pagination"
    :current-page="pageInfo.number"
    :pages="pages"
    aria-label="Top pagination"
    compact
    @update:current-page="onUpdateCurrentPage"
  />
</template>
```

```vue
<template>
  <AvPagination
    id="bottom-pagination"
    :items="amss"
    :current-page="pageInfo.number"
    :pages="pages"
    aria-label="Bottom pagination"
    @update:current-page="onUpdateCurrentPage"
  />
</template>
```
