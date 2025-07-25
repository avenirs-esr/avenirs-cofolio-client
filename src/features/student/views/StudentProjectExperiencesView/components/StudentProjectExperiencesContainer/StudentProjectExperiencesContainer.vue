<script setup lang="ts">
import type { Component } from 'vue'
import StudentProjectExperiencesActivitiesSection from '@/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesActivitiesSection/StudentProjectExperiencesActivitiesSection.vue'
import StudentProjectExperiencesCareersSection from '@/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesCareersSection/StudentProjectExperiencesCareersSection.vue'
import StudentProjectExperiencesEducationsSection from '@/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesEducationsSection/StudentProjectExperiencesEducationsSection.vue'
import StudentProjectExperiencesExperiencesSection from '@/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesExperiencesSection/StudentProjectExperiencesExperiencesSection.vue'
import StudentProjectExperiencesSideMenuContent from '@/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesSideMenuContent/StudentProjectExperiencesSideMenuContent.vue'
import { ProjectExperienceItems } from '@/features/student/views/StudentProjectExperiencesView/types'
import { AvSideMenu } from '@/ui'

const isSideMenuCollapsed = ref<boolean>(false)

const sectionsMap: Record<ProjectExperienceItems, Component> = {
  [ProjectExperienceItems.CAREERS]: StudentProjectExperiencesCareersSection,
  [ProjectExperienceItems.EDUCATIONS]: StudentProjectExperiencesEducationsSection,
  [ProjectExperienceItems.EXPERIENCES]: StudentProjectExperiencesExperiencesSection,
  [ProjectExperienceItems.ACTIVITIES]: StudentProjectExperiencesActivitiesSection
}

const selectedItem = ref<ProjectExperienceItems>(ProjectExperienceItems.CAREERS)

const displayedSection = computed<Component>(() => {
  return sectionsMap[selectedItem.value]
})
</script>

<template>
  <div class="student-project-experiences-container">
    <AvSideMenu
      v-model:collapsed="isSideMenuCollapsed"
      collapsed-width="3.5rem"
    >
      <StudentProjectExperiencesSideMenuContent
        v-model:selected-item="selectedItem"
        :is-side-menu-collapsed="isSideMenuCollapsed"
      />
    </AvSideMenu>
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
  height: calc(100vh - 28.15rem);

  &__content {
    flex: 1;
    padding: var(--spacing-lg);
    color: black;

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
