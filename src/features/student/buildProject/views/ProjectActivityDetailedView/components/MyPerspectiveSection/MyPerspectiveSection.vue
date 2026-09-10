<script lang="ts" setup>
import { type DeclaredActivityDetailsDTO, useGetDeclaredActivityAssociations } from '@/api/avenir-esr'
import { isDeclaredActivityUnsubscribed } from '@/common/activities/rules/activities.rules'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { ICONS } from '@/common/constants'
import { ACTIVITY_TRACE_SETTING_DISABLED_VALUE, ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities'
import { MyPerspectiveSectionTab } from '@/features/student/buildProject/types/activities.types'
import AssociatedElementsTab from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/AssociatedElementsTab/AssociatedElementsTab.vue'
import MyPerspectiveTab from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.vue'
import { AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface MyPerspectiveSectionProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<MyPerspectiveSectionProps>()

const { t } = useI18n()
const { data: declaredActivityAssociations, isPending, error } = useGetDeclaredActivityAssociations(declaredActivityDetails.id)

const activeTab = useEnumRouteQuery('tab', MyPerspectiveSectionTab, MyPerspectiveSectionTab.MY_PERSPECTIVE)
const associationsCount = computed(() =>
  (declaredActivityAssociations.value?.traceAssociations.length ?? 0)
  + (declaredActivityAssociations.value?.declaredSkillAssociations.length ?? 0)
)

const maxTraceAssociationsReached = computed(() =>
  declaredActivityDetails.activity.traceAllowedAssociations !== ACTIVITY_TRACE_SETTING_DISABLED_VALUE
  && declaredActivityDetails.activity.traceAllowedAssociations !== ACTIVITY_TRACE_SETTING_INFINITY_VALUE
  && (declaredActivityAssociations.value?.traceAssociations.length ?? 0) >= declaredActivityDetails.activity.traceAllowedAssociations
)

const traceAssociationsDisabled = computed(() =>
  declaredActivityDetails.activity.traceAllowedAssociations === ACTIVITY_TRACE_SETTING_DISABLED_VALUE
)

const readOnly = computed(() => isDeclaredActivityUnsubscribed(declaredActivityDetails.status))
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
      :title="t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveSection.AssociatedElementsTab.title', { count: associationsCount })"
      :icon="ICONS.ASSOCIATED"
      data-testid="associated-elements-tab-item"
    >
      <AssociatedElementsTab
        v-if="declaredActivityAssociations"
        :declared-activity-id="declaredActivityDetails.id"
        :associations="declaredActivityAssociations"
        :count-associations="associationsCount"
        :trace-allowed-associations="declaredActivityDetails.activity.traceAllowedAssociations"
        :error="error"
        :is-loading="isPending"
        :trace-associations-disabled="traceAssociationsDisabled"
        :max-trace-associations-reached="maxTraceAssociationsReached"
        :read-only="readOnly"
      />
    </AvTab>
  </AvTabs>
</template>
