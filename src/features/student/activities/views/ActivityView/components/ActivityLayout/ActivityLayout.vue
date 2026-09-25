<script setup lang="ts">
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import SectionNavigationLayout
  from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.vue'
import { useSectionNavigationLayout } from '@/common/composables'
import { ICONS } from '@/common/constants'
import ActivityDetails
  from '@/features/student/activities/views/ActivityView/components/ActivityDetails/ActivityDetails.vue'
import MyPerspectiveSection
  from '@/features/student/activities/views/ActivityView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import { ActivitySections } from '@/features/student/activities/views/ActivityView/types'
import { MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityLayoutProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<ActivityLayoutProps>()

const emit = defineEmits<{
  (e: 'selectedSection', section: string): void
}>()

const { t } = useI18n()

const reflectionEnabled = computed(() => declaredActivityDetails.activity.enableReflection)

const items = computed(() => [
  {
    id: ActivitySections.DETAIL,
    label: t('global.detail'),
    icon: ICONS.ACTIVITY,
  },
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

const componentBySection = {
  [ActivitySections.DETAIL]: ActivityDetails,
  [ActivitySections.MY_PERSPECTIVE]: MyPerspectiveSection,
}

const propsBySection = computed(() => ({
  [ActivitySections.DETAIL]: {
    declaredActivityDetails,
  },
  [ActivitySections.MY_PERSPECTIVE]: {
    declaredActivityDetails,
  },
}))

const {
  defaultSection,
  navigateToSelectedSection,
} = useSectionNavigationLayout<ActivitySections>({
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
    :select-placeholder="t('student.global.navigation.selects.label')"
    side-navigation-width="fit-content"
    @selected-item-label="(label) => emit('selectedSection', label)"
    @selected-item="(item) => navigateToSelectedSection(item.itemId)"
  />
</template>
