<script setup lang="ts">
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import SectionNavigationLayout
  from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.vue'
import MyPerspectiveSection
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/MyPerspectiveSection/MyPerspectiveSection.vue'
import ProjectActivityDetails
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetails/ProjectActivityDetails.vue'
import {
  ACTIVITY_DETAILED_SECTIONS
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/ProjectActivityDetailedView.constants'
import { ICONS } from '@/features/student/global/icons'
import { MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ProjectActivityDetailedLayoutProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<ProjectActivityDetailedLayoutProps>()

const { t } = useI18n()

const items = computed(() => [
  {
    id: ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED,
    label: declaredActivityDetails.activity.title || t('global.detail'),
    icon: ICONS.ACTIVITY,
  },
  {
    id: ACTIVITY_DETAILED_SECTIONS.MY_PERSPECTIVE,
    label: t('student.buildProject.activities.views.ProjectActivityDetailedView.ActivityDetailedSideNavigation.myPerspective'),
    icon: MS_ICONS.FEATURED_PLAY_LIST_OUTLINE,
  },
])

const componentBySection = {
  [ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED]: ProjectActivityDetails,
  [ACTIVITY_DETAILED_SECTIONS.MY_PERSPECTIVE]: MyPerspectiveSection,
}

const propsBySection = computed(() => ({
  [ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED]: {
    declaredActivityDetails,
  },
  [ACTIVITY_DETAILED_SECTIONS.MY_PERSPECTIVE]: {
    declaredActivityDetails,
  },
}))
</script>

<template>
  <SectionNavigationLayout
    :items="items"
    :default-section="ACTIVITY_DETAILED_SECTIONS.ACTIVITY_DETAILED"
    :component-by-section="componentBySection"
    :props-by-section="propsBySection"
    :select-placeholder="t('student.global.navigation.selects.label')"
  />
</template>
