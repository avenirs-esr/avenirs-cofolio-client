<script setup lang="ts">
import type { Component } from 'vue'
import { useQueryParam, useWatchQueryParam } from '@/common/composables'
import StudentProjectTrajectoriesActivitiesSection from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesActivitiesSection/StudentProjectTrajectoriesActivitiesSection.vue'
import StudentProjectTrajectoriesBuildProjectSection from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesBuildProjectSection/StudentProjectTrajectoriesBuildProjectSection.vue'
import StudentProjectTrajectoriesExploreFuturesSection from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesExploreFuturesSection/StudentProjectTrajectoriesExploreFuturesSection.vue'
import StudentProjectTrajectoriesTrajectoriesSection from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesTrajectoriesSection/StudentProjectTrajectoriesTrajectoriesSection.vue'
import { ProjectTrajectoryItems } from '@/features/student/global/views/StudentProjectTrajectoriesView/types'
import { SelfKnowledgeMainSection } from '@/features/student/selfKnowledge'
import { AvSideNavigation, type AvSideNavigationItem, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isSideMenuCollapsed = ref<boolean>(false)
const { setQueryParamValue } = useQueryParam()
const selectedItem = ref<ProjectTrajectoryItems>(ProjectTrajectoryItems.BUILD_PROJECT)

const sectionsMap: Record<ProjectTrajectoryItems, Component> = {
  [ProjectTrajectoryItems.BUILD_PROJECT]: StudentProjectTrajectoriesBuildProjectSection,
  [ProjectTrajectoryItems.TRAJECTORIES]: StudentProjectTrajectoriesTrajectoriesSection,
  [ProjectTrajectoryItems.SELF_KNOWLEDGE]: SelfKnowledgeMainSection,
  [ProjectTrajectoryItems.EXPLORE_FUTURES]: StudentProjectTrajectoriesExploreFuturesSection,
  [ProjectTrajectoryItems.ACTIVITIES]: StudentProjectTrajectoriesActivitiesSection
}

const ALL_ITEMS = computed<AvSideNavigationItem[]>(() => [
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
  {
    id: ProjectTrajectoryItems.ACTIVITIES,
    label: t('student.global.views.studentProjectTrajectoriesView.activities.title'),
    icon: MDI_ICONS.TARGET_ARROW
  }
])

const items = computed<AvSideNavigationItem[]>(() => {
  if (__DEMO_MODE__) {
    return ALL_ITEMS.value.slice(0, 2)
  }
  return ALL_ITEMS.value
})

const displayedSection = computed<Component>(() => {
  return sectionsMap[selectedItem.value]
})

useWatchQueryParam('section', (newSection) => {
  if (newSection && Object.values(ProjectTrajectoryItems).includes(newSection as ProjectTrajectoryItems)) {
    selectedItem.value = newSection as ProjectTrajectoryItems
  }
})

watch(selectedItem, (newSelectedItem) => {
  setQueryParamValue('section', newSelectedItem)
}, { immediate: true })
</script>

<template>
  <div class="student-project-trajectories-container av-row av-w-full">
    <AvSideNavigation
      v-model:is-side-menu-collapsed="isSideMenuCollapsed"
      v-model:selected-item="selectedItem"
      :items="items"
    />
    <div class="student-project-trajectories-container__content av-col av-flex-fill av-p-lg">
      <component :is="displayedSection" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-project-trajectories-container {
  min-height: calc(100vh - 28.15rem);

  &__content {
    h2 {
      margin-bottom: var(--spacing-md);
    }
  }
}
</style>
