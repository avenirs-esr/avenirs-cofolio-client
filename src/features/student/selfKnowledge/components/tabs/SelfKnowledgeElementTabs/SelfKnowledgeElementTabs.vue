<script setup lang="ts">
import type { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import type { Slot } from 'vue'
import { ICONS } from '@/common/constants'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface SelfKnowledgeProps {
  categoryType: ESelfKnowledgeCategoryType
}

const { categoryType } = defineProps<SelfKnowledgeProps>()

defineSlots<{
  element?: Slot
  associations?: Slot
}>()

const { t } = useI18n()

const categoryTypeLabel = computed(() => t(`student.selfKnowledge.tabs.SelfKnowledgeElementTabs.category.titles.${categoryType}`))
const activeTab = ref(0)
</script>

<template>
  <AvTabs v-model="activeTab">
    <AvTab
      :title="categoryTypeLabel"
      :icon="MDI_ICONS.INFORMATION_OUTLINE"
    >
      <slot name="element" />
    </AvTab>
    <AvTab
      :title="t('student.selfKnowledge.tabs.SelfKnowledgeElementTabs.associations.title', 0)"
      :icon="ICONS.ASSOCIATIONS"
    >
      <slot name="associations" />
    </AvTab>
  </AvTabs>
</template>

<style scoped lang="scss">

</style>
