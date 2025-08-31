# Selects - `AvAutocomplete`

## 🌟 Introduction

The `AvAutocomplete` component is a comprehensive autocomplete/select component that provides search-as-you-type functionality with support for both single and multi-selection modes. It combines an input field with a dropdown containing filterable options, offering a seamless user experience for selecting from large datasets.

This component is designed with accessibility in mind, featuring keyboard navigation, focus management, and proper ARIA attributes. It supports customizable option rendering, debounced search, infinite scrolling, and flexible styling options.

The component follows a modular architecture with separate input, dropdown, and selected items sections, allowing for extensive customization through slots and props.

## 📐 Structure

The autocomplete consists of the following elements:
- **Input field**: Text input with search functionality and customizable options
- **Dropdown**: Contextual overlay containing filtered options with scroll support
- **Selected items**: Optional section displaying selected items as removable tags (multi-select mode)
- **Options list**: Scrollable list of selectable items with custom rendering support

The component integrates:
- Debounced search input to optimize performance
- Click-outside detection for dropdown closure
- Focus trap and keyboard navigation
- Infinite scroll for large datasets
- Loading states and empty state handling

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | Auto-generated | | ID of the input element. |
| `inputOptions` | `Omit<AvInputProps, 'id' \| 'modelValue'>` | `{}` | | Input-related options and configuration. |
| `options` | `T[]` | `[]` | | Options available for selection. |
| `multiSelect` | `boolean` | `false` | | Whether to allow multi-selection. |
| `getOptionLabel` | `(option: T) => string` | | | Function to get display text from option. |
| `getOptionKey` | `(option: T) => string \| number` | | | Function to get unique key from option. |
| `filterOptions` | `(options: T[], query: string) => T[]` | | | Function to filter options based on query. |
| `dropdownWidth` | `string` | `'100%'` | | Width of the dropdown. |
| `maxDropdownHeight` | `string` | `'20rem'` | | Maximum height of the dropdown. |
| `listOptions` | `AvListProps` | `{ size: 'small', ariaLabel: 'Available options list' }` | | Props to pass to the AvList component. |
| `scrollbarClass` | `string` | `'av-autocomplete__scrollbar--default'` | | CSS class to apply to the scrollbar. |
| `dropdownClass` | `string` | `'av-autocomplete__dropdown--default'` | | CSS class to apply to the dropdown. |
| `loading` | `boolean` | `false` | | Whether the component is in loading state. |
| `debounceDelay` | `number` | `300` | | Debounce delay for search input in milliseconds. |
| `maxResults` | `number` | | | Maximum number of results to display. |
| `enableLoadMore` | `boolean` | `false` | | Whether to enable pagination with scroll-to-bottom loading. |
| `showSelectedSection` | `boolean` | `false` | | Whether to show the selected items section below the input. |
| `blurCloseDelay` | `number` | `150` | | Delay before closing dropdown when focus is lost (in milliseconds). |
| `loadMoreThrottleDelay` | `number` | `200` | | Throttle delay for scroll-to-bottom load more (in milliseconds). |
| `serverSideFiltering` | `boolean` | `false` | | Whether filtering is handled server-side. When true, client-side filtering is bypassed. |

## 📡 Events

| Event | Parameters | Description |
| --- | --- | --- |
| `search` | `query: string` | Emitted when user searches for options. |
| `loadMore` | | Emitted when more options should be loaded (infinite scroll). |
| `clear` | | Emitted when the selection is cleared. |

## 🧩 Slots

| Name           | Description                                                                                                                                                         |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `requiredTip`  | Slot for displaying a required field tip in the input.                                                                                                              |
| `item`         | Slot of type AvListItem for customizing how each option is displayed in the dropdown. Provides `option` (T), `isSelected` (boolean), and `toggle` (function) props. |
| `selectedItem` | Slot for customizing how selected items are displayed as tags. Provides `option` (T) and `remove` (function) props.                                                 |
| `empty`        | Slot for customizing the empty state when no options match the search.                                                                                              |

## 📝 Examples of use

### Basic Usage
```vue
<script setup>
const selectedUsers = ref([])
const users = ref([
  { label: 'John Doe', value: 1 },
  { label: 'Jane Smith', value: 2 },
  { label: 'Bob Johnson', value: 3 }
])

function handleSearch (query) {
  // Fetch users based on query
  console.log('Searching for:', query)
}
</script>

<template>
  <AvAutocomplete
    v-model="selectedUsers"
    :options="users"
    :input-options="{
      label: 'Select users',
      placeholder: 'Search for users...',
      required: true,
    }"
    :multi-select="true"
    @search="handleSearch"
  />
</template>
```

### Custom Option Rendering
```vue
<template>
  <AvAutocomplete
    v-model="selectedProjects"
    :options="projects"
    :input-options="{
      label: 'Select project',
      placeholder: 'Search projects...',
    }"
    @search="handleProjectSearch"
  >
    <template #item="{ option, isSelected, toggle }">
      <AvListItem
        :selected="isSelected"
        clickable
        :on-click="toggle"
      >
        <div class="custom-option">
          <div class="project-name">
            {{ option.name }}
          </div>
          <div class="project-description">
            {{ option.description }}
          </div>
          <div
            class="project-status"
            :class="option.status"
          >
            {{ option.status }}
          </div>
        </div>
      </AvListItem>
    </template>

    <template #selectedItem="{ option, remove }">
      <div class="selected-project">
        <span>{{ option.name }}</span>
        <button
          class="remove-btn"
          @click="remove"
        >
          ×
        </button>
      </div>
    </template>

    <template #empty>
      <div class="empty-state">
        <p>No projects found</p>
        <p class="hint">
          Try adjusting your search terms
        </p>
      </div>
    </template>
  </AvAutocomplete>
</template>
```

### With Infinite Scroll
```vue
<script setup>
const selectedItems = ref([])
const items = ref([])
const loading = ref(false)

async function handleSearch (query) {
  loading.value = true
  // Fetch initial results
  const results = await fetchItems(query, 0, 20)
  items.value = results
  loading.value = false
}

async function loadMoreItems () {
  loading.value = true
  // Fetch more results
  const moreResults = await fetchItems(searchQuery.value, items.value.length, 20)
  items.value = [...items.value, ...moreResults]
  loading.value = false
}
</script>

<template>
  <AvAutocomplete
    v-model="selectedItems"
    :options="items"
    :input-options="{
      label: 'Search large dataset',
      placeholder: 'Type to search...',
    }"
    :enable-load-more="true"
    :loading="loading"
    max-dropdown-height="15rem"
    @search="handleSearch"
    @load-more="loadMoreItems"
  />
</template>
```

### Single Select with Custom Functions
```vue
<script setup>
const selectedCategory = ref([])
const categories = ref([
  { id: 1, displayName: 'Technology', code: 'TECH' },
  { id: 2, displayName: 'Science', code: 'SCI' },
  { id: 3, displayName: 'Arts', code: 'ARTS' }
])

function filterCategories (options, query) {
  return options.filter(option =>
    option.displayName.toLowerCase().includes(query.toLowerCase())
    || option.code.toLowerCase().includes(query.toLowerCase())
  )
}
</script>

<template>
  <AvAutocomplete
    v-model="selectedCategory"
    :options="categories"
    :input-options="{
      label: 'Category',
      placeholder: 'Choose a category...',
    }"
    :multi-select="false"
    :get-option-label="(option) => option.displayName"
    :get-option-key="(option) => option.id"
    :filter-options="filterCategories"
    dropdown-width="25rem"
  />
</template>
```

### Server-Side Filtering (Async Mode)
```vue
<script setup>
const selectedUsers = ref([])
const users = ref([])
const loading = ref(false)

async function handleSearch (query) {
  if (!query.trim()) {
    users.value = []
    return
  }

  loading.value = true
  try {
    // Fetch filtered results from API
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
    const filteredUsers = await response.json()
    users.value = filteredUsers
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <AvAutocomplete
    v-model="selectedUsers"
    :options="users"
    :input-options="{
      label: 'Search users',
      placeholder: 'Type to search users...',
    }"
    :loading="loading"
    :server-side-filtering="true"
    :multi-select="true"
    @search="handleSearch"
  />
</template>
```
