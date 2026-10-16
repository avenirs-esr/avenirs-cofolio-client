<script lang="ts" setup>
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import { AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EAssociationContextType, useGetAssociations } from '@/api/avenir-esr'
import { isDeclaredActivitySubmitted, isDeclaredActivityUnsubscribed, shouldDisplayTraceLimit } from '@/common/activities/rules/activities.rules'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { ICONS } from '@/common/constants'
import { ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities'
import TraceAssociationLimitCard from '@/features/student/activities/views/ActivityView/components/cards/TraceAssociationLimitCard/TraceAssociationLimitCard.vue'
import { MyPerspectiveSectionTab } from '@/features/student/activities/views/ActivityView/components/MyPerspectiveSection/MyPerspectiveSection.types'
import MyPerspectiveTab from '@/features/student/activities/views/ActivityView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.vue'
import { countElementAssociations, ElementAssociations } from '@/features/student/associations'

export interface MyPerspectiveSectionProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<MyPerspectiveSectionProps>()

const { t } = useI18n()
const { data: declaredActivityAssociations, isPending, error } = useGetAssociations(EAssociationContextType.DECLARED_ACTIVITY, declaredActivityDetails.id)
const activeTab = useEnumRouteQuery('tab', MyPerspectiveSectionTab, MyPerspectiveSectionTab.MY_PERSPECTIVE)

const associationsCount = computed(() => countElementAssociations(EAssociationContextType.DECLARED_ACTIVITY, declaredActivityAssociations.value))
const readOnly = computed(() => isDeclaredActivityUnsubscribed(declaredActivityDetails.status) || isDeclaredActivitySubmitted(declaredActivityDetails.status))
const actionsDisabledTooltip = computed(() => {
  if (isDeclaredActivityUnsubscribed(declaredActivityDetails.status)) {
    return t('student.activities.views.ActivityView.MyPerspectiveSection.associationsDisabledTooltip')
  }

  if (isDeclaredActivitySubmitted(declaredActivityDetails.status)) {
    return t('student.activities.views.ActivityView.MyPerspectiveSection.associationsSubmittedDisabledTooltip')
  }

  return undefined
})
</script>

<template>
  <AvTabs
    v-model="activeTab"
    data-testid="my-perspective-section"
  >
    <AvTab
      :title="t('student.activities.views.ActivityView.MyPerspectiveSection.tabs.myPerspective')"
      :icon="ICONS.ACTIVITY_PERSPECTIVE"
      data-testid="my-perspective-tab-item"
    >
      <MyPerspectiveTab :declared-activity-details="declaredActivityDetails" />
    </AvTab>
    <AvTab
      :title="t('student.activities.views.ActivityView.MyPerspectiveSection.tabs.associatedElements', { count: associationsCount })"
      :icon="ICONS.ASSOCIATIONS"
      data-testid="associated-elements-tab-item"
    >
      <ElementAssociations
        :context-type="EAssociationContextType.DECLARED_ACTIVITY"
        :element-id="declaredActivityDetails.id"
        :associations="declaredActivityAssociations"
        :error="error"
        :is-loading="isPending"
        :actions-disabled="readOnly"
        :actions-disabled-tooltip="actionsDisabledTooltip"
      >
        <template #header="{ getLimit }">
          <TraceAssociationLimitCard
            v-if="shouldDisplayTraceLimit(getLimit(EAssociationContextType.TRACE))"
            :trace-allowed-associations="getLimit(EAssociationContextType.TRACE).max ?? ACTIVITY_TRACE_SETTING_INFINITY_VALUE"
          />
        </template>
      </ElementAssociations>
    </AvTab>
  </AvTabs>
</template>
