<script setup lang="ts">
import type { SectionNavigationItem } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import type { Component } from 'vue'
import SectionNavigationLayout
  from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.vue'
import { useSectionNavigationLayout } from '@/common/composables'
import StudentProjectTrajectoriesBuildProjectSection
  from '@/features/student/global/views/StudentBuildProjectView/components/StudentProjectTrajectoriesBuildProjectSection/StudentProjectTrajectoriesBuildProjectSection.vue'
import { BuildProjectItems } from '@/features/student/global/views/StudentBuildProjectView/types'
import { SelfKnowledgeMainSection } from '@/features/student/selfKnowledge'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'selectedSection', section: string): void
}>()

const { t } = useI18n()

const items = computed<SectionNavigationItem[]>(() => [
  {
    id: BuildProjectItems.BUILD_PROJECT,
    label: t('student.global.views.StudentBuildProjectView.buildProject.title'),
    icon: RI_ICONS.DRAW_LINE,
  },
  {
    id: BuildProjectItems.SELF_KNOWLEDGE,
    label: t('student.selfKnowledge.SelfKnowledgeMainSection.title.menu'),
    icon: MDI_ICONS.FAMILY
  },
])

const componentBySection = {
  [BuildProjectItems.BUILD_PROJECT]: StudentProjectTrajectoriesBuildProjectSection,
  [BuildProjectItems.SELF_KNOWLEDGE]: SelfKnowledgeMainSection,
} satisfies Record<BuildProjectItems, Component>

const {
  defaultSection,
  navigateToSelectedSection,
} = useSectionNavigationLayout<BuildProjectItems>({
  items,
  fallbackSection: BuildProjectItems.BUILD_PROJECT,
})
</script>

<template>
  <div class="student-project-trajectories-container av-w-full">
    <SectionNavigationLayout
      :items="items"
      :default-section="defaultSection"
      :component-by-section="componentBySection"
      :select-placeholder="t('student.global.navigation.selects.label')"
      :select-label="t('student.global.navigation.selects.label')"
      side-navigation-width="11rem"
      data-testid="project-trajectories-layout"
      @selected-item-label="(label) => emit('selectedSection', label)"
      @selected-item="(item) => navigateToSelectedSection(item.itemId)"
    />
  </div>
</template>

<style lang="scss" scoped>
.student-project-trajectories-container {
  min-height: calc(100vh - 28.15rem);
}
</style>
