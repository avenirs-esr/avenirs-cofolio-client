<script setup lang="ts">
import type { SectionNavigationItem } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import type { Component } from 'vue'
import SectionNavigationLayout
  from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.vue'
import { useSectionNavigationLayout } from '@/common/composables'
import { ICONS } from '@/common/constants'
import StudentProjectMindMapSection
  from '@/features/student/global/views/StudentBuildProjectView/components/StudentProjectMindMapSection/StudentProjectMindMapSection.vue'
import { BuildProjectItems } from '@/features/student/global/views/StudentBuildProjectView/types'
import { SelfKnowledgeMainSection } from '@/features/student/selfKnowledge'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'selectedSection', section: string): void
}>()

const { t } = useI18n()

const items = computed<SectionNavigationItem[]>(() => [
  {
    id: BuildProjectItems.MIND_MAP,
    label: t('student.global.views.StudentBuildProjectView.StudentProjectMindMapSection.title'),
    icon: ICONS.MIND_MAP,
  },
  {
    id: BuildProjectItems.SELF_KNOWLEDGE,
    label: t('student.selfKnowledge.SelfKnowledgeMainSection.title.menu'),
    icon: ICONS.SELF_KNOWLEDGE
  },
])

const componentBySection = {
  [BuildProjectItems.MIND_MAP]: StudentProjectMindMapSection,
  [BuildProjectItems.SELF_KNOWLEDGE]: SelfKnowledgeMainSection,
} satisfies Record<BuildProjectItems, Component>

const {
  defaultSection,
  navigateToSelectedSection,
} = useSectionNavigationLayout<BuildProjectItems>({
  items,
  fallbackSection: BuildProjectItems.MIND_MAP,
})
</script>

<template>
  <div class="student-project-build-project-container av-w-full">
    <SectionNavigationLayout
      :items="items"
      :default-section="defaultSection"
      :component-by-section="componentBySection"
      :select-placeholder="t('student.global.navigation.selects.label')"
      :select-label="t('student.global.navigation.selects.label')"
      side-navigation-width="11rem"
      data-testid="project-build-project-layout"
      @selected-item-label="(label) => emit('selectedSection', label)"
      @selected-item="(item) => navigateToSelectedSection(item.itemId)"
    />
  </div>
</template>

<style lang="scss" scoped>
.student-project-build-project-container {
  min-height: calc(100vh - 28.15rem);
}
</style>
