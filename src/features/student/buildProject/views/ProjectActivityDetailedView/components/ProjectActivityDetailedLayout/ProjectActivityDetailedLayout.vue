<script setup lang="ts">
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import SectionNavigationLayout
  from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.vue'
import { useSectionNavigationLayout } from '@/common/composables'
import { ICONS } from '@/common/constants'
import MyPerspectiveSection
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import ProjectActivityDetails
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetails/ProjectActivityDetails.vue'
import { ProjectActivityDetailedSections } from '@/features/student/buildProject/views/ProjectActivityDetailedView/types'
import { MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ProjectActivityDetailedLayoutProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<ProjectActivityDetailedLayoutProps>()

const emit = defineEmits<{
  (e: 'selectedSection', section: string): void
}>()

const { t } = useI18n()

const reflectionEnabled = computed(() => declaredActivityDetails.activity.enableReflection)

const items = computed(() => [
  {
    id: ProjectActivityDetailedSections.DETAIL,
    label: t('global.detail'),
    icon: ICONS.ACTIVITY,
  },
  ...(reflectionEnabled.value
    ? [
        {
          id: ProjectActivityDetailedSections.MY_PERSPECTIVE,
          label: t('student.buildProject.activities.views.ProjectActivityDetailedView.ActivityDetailedSideNavigation.myPerspective'),
          icon: MS_ICONS.FEATURED_PLAY_LIST_OUTLINE,
        }
      ]
    : [])
])

const componentBySection = {
  [ProjectActivityDetailedSections.DETAIL]: ProjectActivityDetails,
  [ProjectActivityDetailedSections.MY_PERSPECTIVE]: MyPerspectiveSection,
}

const propsBySection = computed(() => ({
  [ProjectActivityDetailedSections.DETAIL]: {
    declaredActivityDetails,
  },
  [ProjectActivityDetailedSections.MY_PERSPECTIVE]: {
    declaredActivityDetails,
  },
}))

const {
  defaultSection,
  navigateToSelectedSection,
} = useSectionNavigationLayout<ProjectActivityDetailedSections>({
  items,
  fallbackSection: ProjectActivityDetailedSections.DETAIL,
})
</script>

<template>
  <SectionNavigationLayout
    :items="items"
    :default-section="defaultSection"
    :component-by-section="componentBySection"
    :props-by-section="propsBySection"
    :select-placeholder="t('student.global.navigation.selects.label')"
    @selected-item-label="(label) => emit('selectedSection', label)"
    @selected-item="(item) => navigateToSelectedSection(item.itemId)"
  />
</template>
