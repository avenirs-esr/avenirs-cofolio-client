<script setup lang="ts">
import type { ESelfKnowledgeCategoryType, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import SelfKnowledgeCategoryTab from '@/features/student/selfKnowledge/components/SelfKnowledgeCategoryTab/SelfKnowledgeCategoryTab.vue'
import SelfKnowledgeElementAssociationsTab
  from '@/features/student/selfKnowledge/components/SelfKnowledgeElementAssociationsTab/SelfKnowledgeElementAssociationsTab.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface SelfKnowledgeProps {
  selfKnowledgeElement: SelfKnowledgeElementViewDTO
  categoryType: ESelfKnowledgeCategoryType
}

const { categoryType } = defineProps<SelfKnowledgeProps>()
const { t } = useI18n()

const categoryTypeLabel = computed(() => t(`student.views.selfKnowledgeCategoryView.tabs.category.titles.${categoryType}`))
const activeTab = ref(0)
</script>

<template>
  <AvTabs v-model="activeTab">
    <AvTab
      :title="categoryTypeLabel"
      :icon="MDI_ICONS.INFORMATION_OUTLINE"
    >
      <SelfKnowledgeCategoryTab />
    </AvTab>
    <AvTab
      :title="t('student.views.selfKnowledgeCategoryView.tabs.associations.title', 0)"
      :icon="MDI_ICONS.LINK"
    >
      <SelfKnowledgeElementAssociationsTab />
    </AvTab>
  </AvTabs>
</template>

<style scoped lang="scss">

</style>
