<script setup lang="ts">
import type { SectionNavigationItem } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import type { Component } from 'vue'
import SectionNavigationLayout
  from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.vue'
import { useSectionNavigationLayout } from '@/common/composables'
import StudentProjectTrajectoriesBuildProjectSection
  from '@/features/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesBuildProjectSection/StudentProjectTrajectoriesBuildProjectSection.vue'
import StudentProjectTrajectoriesExploreFuturesSection
  from '@/features/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesExploreFuturesSection/StudentProjectTrajectoriesExploreFuturesSection.vue'
import StudentProjectTrajectoriesTrajectoriesSection
  from '@/features/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesTrajectoriesSection/StudentProjectTrajectoriesTrajectoriesSection.vue'
import { ProjectTrajectoryItems } from '@/features/global/views/StudentProjectTrajectoriesView/types'
import { SelfKnowledgeMainSection } from '@/features/selfKnowledge'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'selectedSection', section: string): void
}>()

const { t } = useI18n()

const allItems = computed<SectionNavigationItem[]>(() => [
  {
    id: ProjectTrajectoryItems.BUILD_PROJECT,
    label: t('student.global.views.studentProjectTrajectoriesView.buildProject.title'),
    icon: RI_ICONS.DRAW_LINE,
  },
  {
    id: ProjectTrajectoryItems.SELF_KNOWLEDGE,
    label: t('student.selfKnowledge.SelfKnowledgeMainSection.title.menu'),
    icon: MDI_ICONS.FAMILY
  },
  {
    id: ProjectTrajectoryItems.EXPLORE_FUTURES,
    label: t('student.global.views.studentProjectTrajectoriesView.exploreFutures.title'),
    icon: MDI_ICONS.IMAGE_FILTER_CENTER_FOCUS_WEAK
  },
  {
    id: ProjectTrajectoryItems.TRAJECTORIES,
    label: t('student.global.views.studentProjectTrajectoriesView.trajectories.title'),
    icon: MDI_ICONS.ARROW_DECISION
  },
])

const items = computed<SectionNavigationItem[]>(() => {
  if (__DEMO_MODE__) {
    return allItems.value.slice(0, 2)
  }

  return allItems.value
})

const componentBySection = {
  [ProjectTrajectoryItems.BUILD_PROJECT]: StudentProjectTrajectoriesBuildProjectSection,
  [ProjectTrajectoryItems.TRAJECTORIES]: StudentProjectTrajectoriesTrajectoriesSection,
  [ProjectTrajectoryItems.SELF_KNOWLEDGE]: SelfKnowledgeMainSection,
  [ProjectTrajectoryItems.EXPLORE_FUTURES]: StudentProjectTrajectoriesExploreFuturesSection,
} satisfies Record<ProjectTrajectoryItems, Component>

const {
  defaultSection,
  navigateToSelectedSection,
} = useSectionNavigationLayout<ProjectTrajectoryItems>({
  items,
  fallbackSection: ProjectTrajectoryItems.BUILD_PROJECT,
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
