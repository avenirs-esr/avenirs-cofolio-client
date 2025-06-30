<script lang="ts" setup>
import { type Slot, useSlots } from 'vue'

/**
 * Props du composant AvTabs.
 */
interface AvTabsProps {
  /**
   * Aria label de la liste des onglets.
   * Améliore l'accessibilité en fournissant une description pour les lecteurs d'écran.
   */
  ariaLabel?: string

  /**
   * Index de l'onglet sélectionné au chargement.
   * L'index commence à 0.
   */
  modelValue: number
}

const { ariaLabel, modelValue } = defineProps<AvTabsProps>()

/**
 * Événements émis par le composant.
 */
const emit = defineEmits<{
  /**
   * Émis lorsqu'un onglet est sélectionné.
   * @param value Index (`number`) de l'onglet sélectionné.
   */
  (e: 'update:modelValue', value: number): void
}>()

/**
 * Slots disponibles dans le composant AvTabs.
 * Utilisé pour injecter les onglets via des composants `AvTab`.
 */
defineSlots<{
  /**
   *  Slot par défaut pour passer les composants `AvTab`.
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
  padding: 0.5rem 0 !important;
}

:deep(.fr-tabs__tab) {
  @extend .s2-regular;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 0.75rem !important;
  width: 100% !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
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
  left: 0;
  top: 0.5rem;
  bottom: 0.5rem;
  width: 0.0625rem;
  background-color: var(--text1);
}
</style>
