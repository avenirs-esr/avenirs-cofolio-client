<script setup lang="ts">
import type { Component } from 'vue'
import StudentProjectTrajectoriesActivitiesSection from '@/features/student/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesActivitiesSection/StudentProjectTrajectoriesActivitiesSection.vue'
import StudentProjectTrajectoriesBuildProjectSection from '@/features/student/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesBuildProjectSection/StudentProjectTrajectoriesBuildProjectSection.vue'
import StudentProjectTrajectoriesExploreFuturesSection from '@/features/student/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesExploreFuturesSection/StudentProjectTrajectoriesExploreFuturesSection.vue'
import StudentProjectTrajectoriesSelfKnowledgeSection from '@/features/student/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesSelfKnowledgeSection/StudentProjectTrajectoriesSelfKnowledgeSection.vue'
import StudentProjectTrajectoriesTrajectoriesSection from '@/features/student/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesTrajectoriesSection/StudentProjectTrajectoriesTrajectoriesSection.vue'
import { ProjectTrajectoryItems } from '@/features/student/views/StudentProjectTrajectoriesView/types'
import { AvSideNavigation, type AvSideNavigationItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isSideMenuCollapsed = ref<boolean>(false)

const selectedItem = ref<ProjectTrajectoryItems>(ProjectTrajectoryItems.BUILD_PROJECT)

const sectionsMap: Record<ProjectTrajectoryItems, Component> = {
  [ProjectTrajectoryItems.BUILD_PROJECT]: StudentProjectTrajectoriesBuildProjectSection,
  [ProjectTrajectoryItems.TRAJECTORIES]: StudentProjectTrajectoriesTrajectoriesSection,
  [ProjectTrajectoryItems.SELF_KNOWLEDGE]: StudentProjectTrajectoriesSelfKnowledgeSection,
  [ProjectTrajectoryItems.EXPLORE_FUTURES]: StudentProjectTrajectoriesExploreFuturesSection,
  [ProjectTrajectoryItems.ACTIVITIES]: StudentProjectTrajectoriesActivitiesSection
}

const ALL_ITEMS: AvSideNavigationItem[] = [
  {
    id: ProjectTrajectoryItems.BUILD_PROJECT,
    label: t('student.views.studentProjectTrajectoriesView.buildProject.title'),
    icon: MDI_ICONS.BRIEFCASE_VARIANT_OUTLINE,
  },
  {
    id: ProjectTrajectoryItems.SELF_KNOWLEDGE,
    label: t('student.views.studentProjectTrajectoriesView.selfKnowledge.title'),
    icon: MDI_ICONS.FAMILY
  },
  {
    id: ProjectTrajectoryItems.EXPLORE_FUTURES,
    label: t('student.views.studentProjectTrajectoriesView.exploreFutures.title'),
    icon: MDI_ICONS.IMAGE_FILTER_CENTER_FOCUS_WEAK
  },
  {
    id: ProjectTrajectoryItems.TRAJECTORIES,
    label: t('student.views.studentProjectTrajectoriesView.trajectories.title'),
    icon: MDI_ICONS.ARROW_DECISION
  },
  {
    id: ProjectTrajectoryItems.ACTIVITIES,
    label: t('student.views.studentProjectTrajectoriesView.activities.title'),
    icon: MDI_ICONS.TARGET_ARROW
  }
]

const items = computed<AvSideNavigationItem[]>(() => {
  if (__DEMO_MODE__) {
    return ALL_ITEMS.slice(0, 1)
  }
  return ALL_ITEMS
})

const displayedSection = computed<Component>(() => {
  return sectionsMap[selectedItem.value]
})
</script>

<template>
  <div class="student-project-trajectories-container">
    <AvSideNavigation
      v-model:is-side-menu-collapsed="isSideMenuCollapsed"
      v-model:selected-item="selectedItem"
      :items="items"
    />
    <div class="student-project-trajectories-container__content">
      <component :is="displayedSection" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-project-trajectories-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: calc(100vh - 28.15rem);

  &__content {
    flex: 1;
    padding: var(--spacing-lg);

    h2 {
      margin-bottom: var(--spacing-md);
    }
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-style: italic;
  }
}
</style>
