<script setup lang="ts">
import type { Component } from 'vue'
import StudentProjectExperiencesActivitiesSection from '@/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesActivitiesSection/StudentProjectExperiencesActivitiesSection.vue'
import StudentProjectExperiencesCareersSection from '@/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesCareersSection/StudentProjectExperiencesCareersSection.vue'
import StudentProjectExperiencesEducationsSection from '@/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesEducationsSection/StudentProjectExperiencesEducationsSection.vue'
import StudentProjectExperiencesExperiencesSection from '@/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesExperiencesSection/StudentProjectExperiencesExperiencesSection.vue'
import { ProjectExperienceItems } from '@/features/student/views/StudentProjectExperiencesView/types'
import { AvSideNavigation, type AvSideNavigationItem, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isSideMenuCollapsed = ref<boolean>(false)

const selectedItem = ref<ProjectExperienceItems>(ProjectExperienceItems.CAREERS)

const sectionsMap: Record<ProjectExperienceItems, Component> = {
  [ProjectExperienceItems.CAREERS]: StudentProjectExperiencesCareersSection,
  [ProjectExperienceItems.EDUCATIONS]: StudentProjectExperiencesEducationsSection,
  [ProjectExperienceItems.EXPERIENCES]: StudentProjectExperiencesExperiencesSection,
  [ProjectExperienceItems.ACTIVITIES]: StudentProjectExperiencesActivitiesSection
}

const items = computed<AvSideNavigationItem[]>(() => [
  {
    id: ProjectExperienceItems.CAREERS,
    label: t('student.views.studentProjectExperiencesView.careers.title'),
    icon: MDI_ICONS.BRIEFCASE_VARIANT_OUTLINE,
  },
  {
    id: ProjectExperienceItems.EDUCATIONS,
    label: t('student.views.studentProjectExperiencesView.educations.title'),
    icon: MDI_ICONS.SCHOOL_OUTLINE
  },
  {
    id: ProjectExperienceItems.EXPERIENCES,
    label: t('student.views.studentProjectExperiencesView.experiences.title'),
    icon: MDI_ICONS.VECTOR_POLYGON_VARIANT
  },
  {
    id: ProjectExperienceItems.ACTIVITIES,
    label: t('student.views.studentProjectExperiencesView.activities.title'),
    icon: MDI_ICONS.TARGET_ARROW
  }
])

const displayedSection = computed<Component>(() => {
  return sectionsMap[selectedItem.value]
})
</script>

<template>
  <div class="student-project-experiences-container">
    <AvSideNavigation
      v-model:is-side-menu-collapsed="isSideMenuCollapsed"
      v-model:selected-item="selectedItem"
      :items="items"
    />
    <div class="student-project-experiences-container__content">
      <component :is="displayedSection" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-project-experiences-container {
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
