<script setup lang="ts">
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import type { AvSideNavigationSelectedItem } from '@avenirs-esr/avenirs-dsav'
import type { Component } from 'vue'
import MyPerspectiveSection
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import ActivityDetailedSelectNavigation
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/navigation/ActivityDetailedSelectNavigation/ActivityDetailedSelectNavigation.vue'
import ActivityDetailedSideNavigation
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/navigation/ActivityDetailedSideNavigation/ActivityDetailedSideNavigation.vue'
import ProjectActivityDetails
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetails/ProjectActivityDetails.vue'
import {
  ACTIVITY_DETAILED_SECTIONS,
  type ActivityDetailedSection
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/ProjectActivityDetailedView.constants'
import { useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'

export interface ProjectActivityDetailedLayoutProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<ProjectActivityDetailedLayoutProps>()

const { isMobile } = useAvBreakpoints()

const selectedItem = ref<AvSideNavigationSelectedItem>({
  itemId: ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED,
})

function isActivityDetailedSection (value: string): value is ActivityDetailedSection {
  return Object.values(ACTIVITY_DETAILED_SECTIONS).includes(value as ActivityDetailedSection)
}

const selectedSection = computed<ActivityDetailedSection>(() => {
  const itemId = selectedItem.value.itemId

  if (itemId && isActivityDetailedSection(itemId)) {
    return itemId
  }

  return ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED
})

const displayedSection = computed<Component>(() => {
  switch (selectedSection.value) {
    case ACTIVITY_DETAILED_SECTIONS.MY_PERSPECTIVE:
      return MyPerspectiveSection
    case ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED:
    default:
      return ProjectActivityDetails
  }
})

const sectionProps = computed<Record<string, unknown>>(() => {
  switch (selectedSection.value) {
    case ACTIVITY_DETAILED_SECTIONS.MY_PERSPECTIVE:
      return {}
    case ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED:
    default:
      return {
        declaredActivityDetails,
      }
  }
})

function updateSelectedItem (value: AvSideNavigationSelectedItem) {
  selectedItem.value = value
}
</script>

<template>
  <div
    class="av-py-md av-gap-sm"
    :class="[isMobile ? 'av-col' : 'av-row']"
    data-testid="activity-detailed-layout"
  >
    <ActivityDetailedSideNavigation
      v-if="!isMobile"
      v-model:selected-item="selectedItem"
      :activity-title="declaredActivityDetails.activity.title"
    />
    <ActivityDetailedSelectNavigation
      v-else
      :selected-item="selectedItem"
      :activity-title="declaredActivityDetails.activity.title"
      @update:selected-item="updateSelectedItem"
    />

    <div class="av-col av-gap-sm av-flex-fill">
      <component
        :is="displayedSection"
        v-bind="sectionProps"
      />
    </div>
  </div>
</template>
