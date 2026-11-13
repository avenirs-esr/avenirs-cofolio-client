<script setup lang="ts">
import type { DeclaredActivityDetailsDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { Component } from 'vue'
import type { SectionNavigationItem } from '@/common/components/layout/SectionNavigationLayout/SectionNavigationLayout.types'
import { MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ICONS } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import SectionNavigationLayout
  from '@/common/components/layout/SectionNavigationLayout/SectionNavigationLayout.vue'
import { useSectionNavigationLayout } from '@/common/composables'
import ActivityDetails
  from '@/features/student/activities/views/ActivityView/components/ActivityDetails/ActivityDetails.vue'
import MyPerspectiveSection
  from '@/features/student/activities/views/ActivityView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import SubActivityDetails
  from '@/features/student/activities/views/ActivityView/components/SubActivityDetails/SubActivityDetails.vue'
import { ActivitySections } from '@/features/student/activities/views/ActivityView/types'

export interface ActivityLayoutProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<ActivityLayoutProps>()

const emit = defineEmits<{
  (e: 'selectedSection', section: string): void
}>()

const { t } = useI18n()

const reflectionEnabled = computed(() => declaredActivityDetails.activity.enableReflection)
const subActivities = computed(() => declaredActivityDetails.subActivities)
const sideNavigationWidth = computed(() => subActivities.value.length ? undefined : 'fit-content')

const items = computed<SectionNavigationItem[]>(() => [
  {
    id: ActivitySections.DETAIL,
    label: t('global.detail'),
    icon: ICONS.ACTIVITY,
  },
  ...subActivities.value.map((subActivity, index) => ({
    id: subActivity.id,
    label: subActivity.title,
    index: index + 1,
  })),
  ...(reflectionEnabled.value
    ? [
        {
          id: ActivitySections.MY_PERSPECTIVE,
          label: t('student.activities.views.ActivityView.ActivityDetailedSideNavigation.myReflection'),
          icon: MS_ICONS.FEATURED_PLAY_LIST_OUTLINE,
        }
      ]
    : [])
])

const componentBySection = computed<Record<string, Component>>(() => ({
  [ActivitySections.DETAIL]: ActivityDetails,
  ...Object.fromEntries(subActivities.value.map(subActivity => [subActivity.id, SubActivityDetails])),
  [ActivitySections.MY_PERSPECTIVE]: MyPerspectiveSection,
}))

const propsBySection = computed(() => ({
  [ActivitySections.DETAIL]: {
    declaredActivityDetails,
  },
  ...Object.fromEntries(subActivities.value.map(subActivity => [subActivity.id, { declaredActivityDetails, subActivity }])),
  [ActivitySections.MY_PERSPECTIVE]: {
    declaredActivityDetails,
  },
}))

const {
  defaultSection,
  navigateToSelectedSection,
} = useSectionNavigationLayout<string>({
  items,
  fallbackSection: ActivitySections.DETAIL,
})
</script>

<template>
  <SectionNavigationLayout
    :items="items"
    :default-section="defaultSection"
    :component-by-section="componentBySection"
    :props-by-section="propsBySection"
    :select-placeholder="t('global.navigation.accessTo')"
    :side-navigation-width="sideNavigationWidth"
    @selected-item-label="(label) => emit('selectedSection', label)"
    @selected-item="(item) => navigateToSelectedSection(item.itemId)"
  />
</template>
