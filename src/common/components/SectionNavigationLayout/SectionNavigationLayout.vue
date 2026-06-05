<script
  setup
  lang="ts"
  generic="T extends Record<string, Component>"
>
import type {
  SectionNavigationItem,
  SectionPropsBySection,
  SectionSelection,
} from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import type {
  AvSelectOption,
  AvSelectSelectedOption,
  AvSideNavigationMenuItem,
  AvSideNavigationSelectedItem,
} from '@avenirs-esr/avenirs-dsav'
import Loader from '@/common/components/Loader/Loader.vue'
import {
  AvSelect,
  AvSideNavigation,
  useAvBreakpoints,
} from '@avenirs-esr/avenirs-dsav'
import { type Component, markRaw } from 'vue'

export interface SectionNavigationLayoutProps<TComponents extends Record<string, Component>> {
  items: SectionNavigationItem[]
  defaultSection: keyof TComponents & string
  componentBySection: TComponents
  propsBySection?: SectionPropsBySection<TComponents>
  sideNavigationWidth?: string
  selectPlaceholder: string
  selectLabel?: string
  isLoading?: boolean
}

const {
  items,
  defaultSection,
  componentBySection,
  propsBySection,
  sideNavigationWidth = '15rem',
  selectPlaceholder,
  selectLabel,
  isLoading = false,
} = defineProps<SectionNavigationLayoutProps<T>>()

const emit = defineEmits<{
  (e: 'selectedItem', item: SectionSelection): void
  (e: 'selectedItemLabel', label: string): void
}>()

const resolvedPropsBySection = computed<SectionPropsBySection<T>>(() => propsBySection ?? {})
const resolvedSelectLabel = computed(() => selectLabel ?? selectPlaceholder)

const { isMobile } = useAvBreakpoints()

const selectedItem = ref<SectionSelection>({
  itemId: defaultSection,
})

const selectedSection = computed<string>(() => {
  const itemId = selectedItem.value.itemId

  if (itemId && componentBySection[itemId]) {
    return itemId
  }

  return defaultSection
})

const displayedComponent = computed<Component>(() =>
  markRaw(componentBySection[selectedSection.value]),
)

const displayedProps = computed<Record<string, unknown>>(() => {
  return resolvedPropsBySection.value[selectedSection.value] ?? {}
})

const sideNavigationItems = computed<AvSideNavigationMenuItem[]>(() =>
  items.map(item => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
  })),
)

const selectOptions = computed<AvSelectOption[]>(() =>
  items.map(item => ({
    id: item.id,
    label: item.label,
  })),
)

const isSideMenuCollapsed = ref(false)

function onSelectChange (value: AvSelectSelectedOption) {
  selectedItem.value = {
    itemId: value.itemId,
    parentId: value.parentId,
  }
}

function onSideNavigationChange (value: AvSideNavigationSelectedItem) {
  selectedItem.value = {
    itemId: value.itemId,
    parentId: value.parentId,
  }
}

watch(() => defaultSection, (newDefaultSection) => {
  if (selectedItem.value.itemId === newDefaultSection) {
    return
  }

  selectedItem.value = {
    itemId: newDefaultSection,
  }
})

watch(selectedItem, (newItem) => {
  emit('selectedItem', newItem)
  const label = items.find(item => item.id === newItem.itemId)?.label ?? ''
  emit('selectedItemLabel', label)
}, { immediate: true })
</script>

<template>
  <div
    class="av-py-md av-gap-sm"
    :class="[isMobile ? 'av-col' : 'av-row']"
    data-testid="section-navigation-layout"
  >
    <Loader
      :is-loading="isLoading"
      size="2xl"
    >
      <AvSideNavigation
        v-if="!isMobile"
        v-model:is-side-menu-collapsed="isSideMenuCollapsed"
        :selected-item="selectedItem"
        :items="sideNavigationItems"
        data-testid="section-navigation-side-navigation"
        :width="sideNavigationWidth"
        @update:selected-item="onSideNavigationChange"
      />

      <AvSelect
        v-else
        data-testid="section-navigation-select-navigation"
        :selected-item="selectedItem"
        :options="selectOptions"
        :placeholder="selectPlaceholder"
        :label="resolvedSelectLabel"
        @update:selected-item="onSelectChange"
      />
    </Loader>

    <div class="section-navigation-layout__content av-col av-gap-sm av-flex-fill">
      <component
        :is="displayedComponent"
        v-bind="displayedProps"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-navigation-layout__content {
  :deep(h2) {
    margin-bottom: var(--spacing-md);
  }
  :deep(h3) {
    margin-bottom: var(--spacing-md);
  }
}
</style>
