<script lang="ts" setup>
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import Loader from '@/common/components/Loader/Loader.vue'
import { useGetDeclaredActivityAssociationsQuery } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import AssociatedElementsTab from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/AssociatedElementsTab/AssociatedElementsTab.vue'
import MyPerspectiveTab from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.vue'
import { ICONS } from '@/features/student/global/icons'
import { AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface MyPerspectiveSectionProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<MyPerspectiveSectionProps>()

const { t } = useI18n()
const { declaredActivityAssociations, isPending, isError } = useGetDeclaredActivityAssociationsQuery(declaredActivityDetails.id)

const activeTab = ref(0)
</script>

<template>
  <AvTabs
    v-model="activeTab"
    data-testid="my-perspective-section"
  >
    <AvTab
      :title="t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveSection.MyPerspectiveTab.title')"
      :icon="ICONS.ACTIVITY_PERSPECTIVE"
      data-testid="my-perspective-tab-item"
    >
      <MyPerspectiveTab :declared-activity-details="declaredActivityDetails" />
    </AvTab>
    <AvTab
      :title="t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveSection.AssociatedElementsTab.title', { count: declaredActivityAssociations?.traceAssociations.length })"
      :icon="ICONS.ASSOCIATED"
      data-testid="associated-elements-tab-item"
    >
      <Loader :is-loading="isPending && !isError">
        <AssociatedElementsTab
          v-if="declaredActivityAssociations"
          :associations="declaredActivityAssociations"
        />
      </Loader>
    </AvTab>
  </AvTabs>
</template>
