<script lang="ts" setup>
import { type Slot, useSlots } from 'vue'

/**
 * AvTabs component Props.
 */
export interface AvTabsProps {
  /**
   * Aria label for tab list.
   * Improves accessibility by providing a description for screen readers.
   */
  ariaLabel?: string

  /**
   * Index of selected tab on loading.
   * Index starts at 0.
   */
  modelValue: number
}

const { ariaLabel, modelValue } = defineProps<AvTabsProps>()

/**
 * Events emitted by the component.
 */
const emit = defineEmits<{
  /**
   * Emitted when a tab is selected.
   * @param value Index (`number`) of the selected tab.
   */
  (e: 'update:modelValue', value: number): void
}>()

/**
 * Slots available in AvTabs component.
 * Used to inject tabs via `AvTab` components.
 */
defineSlots<{
  /**
   * Default slot for passing `AvTab` components.
   */
  default?: Slot
}>()

const slots = useSlots()
const activeTab = ref(modelValue)

const tabItems = computed(() => slots.default?.() || [])

function selectTab (offset: number) {
  const totalTabs = tabItems.value.length
  activeTab.value = (activeTab.value + offset + totalTabs) % totalTabs
}

function selectPrevious () {
  selectTab(-1)
}

function selectNext () {
  selectTab(1)
}

function selectFirst () {
  activeTab.value = 0
}

function selectLast () {
  activeTab.value = tabItems.value.length - 1
}

watch(() => modelValue, (val) => {
  if (val !== undefined) {
    activeTab.value = val
  }
})

watch(activeTab, (val) => {
  emit('update:modelValue', val)
})

defineExpose({ activeTab })
</script>

<template>
  <DsfrTabs
    v-model="activeTab"
    :tab-list-name="ariaLabel ?? 'Liste d’onglets'"
    :tab-titles="[]"
  >
    <template #tab-items>
      <DsfrTabItem
        v-for="(tab, index) in tabItems"
        :key="index"
        :tab-id="`tab-${index}`"
        :panel-id="`panel-${index}`"
        :icon="tab.props?.icon"
        @click="activeTab = index"
        @next="selectNext"
        @previous="selectPrevious"
        @first="selectFirst"
        @last="selectLast"
      >
        {{ tab.props?.title }}
      </DsfrTabItem>
    </template>
    <DsfrTabContent
      v-for="(tab, index) in tabItems"
      :key="index"
      :panel-id="`panel-${index}`"
      :tab-id="`tab-${index}`"
    >
      <component :is="(tab.children as Record<string, unknown>).default" />
    </DsfrTabContent>
  </DsfrTabs>
</template>

<style lang="scss" scoped>
@use "@/ui/styles/typography.scss" as typography;

.fr-tabs {
  box-shadow: none !important;
}

.fr-tabs::before {
  box-shadow: none !important;
}

:deep(.fr-tabs__list) {
  display: flex !important;
  width: 100% !important;
  background: var(--surface-background) !important;
  gap: 0.75rem !important;
  align-items: center !important;
}

:deep(.fr-tabs__list > li) {
  width: 100% !important;
  flex: 1 1 0% !important;
  padding: var(--spacing-xs) var(--spacing-none) !important;
}

:deep(.fr-tabs__tab) {
  @extend .s2-regular;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: var(--radius-lg) !important;
  width: 100% !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: var(--text2);
}

:deep(.fr-tabs__tab[aria-selected=true]:not(:disabled)) {
  @extend .s2-bold;
  color: var(--dark-background-primary1) !important;
  background: var(--other-background-base) !important;
}

:deep(.fr-tabs__tab:not([aria-selected=true]:not(:disabled)):hover  ) {
  color: var(--dark-background-primary1);
}

:deep(.fr-tabs__list > li:not(:first-child)) {
  position: relative;
}

:deep(.fr-tabs__list > li:not(:first-child))::before {
  content: "";
  position: absolute;
  left: var(--spacing-none);
  top: var(--spacing-xs);
  bottom: var(--spacing-xs);
  width: 0.0625rem;
  background-color: var(--text1);
}
</style>
