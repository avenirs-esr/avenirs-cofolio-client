<script lang="ts" setup>
import { type DeclaredActivityDetailsDTO, EAssociationContextType, useGetAssociations } from '@/api/avenir-esr'
import { isActivityAssociationToTraceDisabled, isDeclaredActivityUnsubscribed } from '@/common/activities/rules/activities.rules'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { ICONS } from '@/common/constants'
import { ACTIVITY_TRACE_SETTING_DISABLED_VALUE, ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities'
import TraceAssociationLimitCard from '@/features/student/activities/views/ActivityView/components/cards/TraceAssociationLimitCard/TraceAssociationLimitCard.vue'
import MyPerspectiveTab from '@/features/student/activities/views/ActivityView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.vue'
import { type AssociationLimits, countElementAssociations, ElementAssociations } from '@/features/student/associations'
import { AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface MyPerspectiveSectionProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<MyPerspectiveSectionProps>()

enum MyPerspectiveSectionTab {
  MY_PERSPECTIVE = 0,
  ASSOCIATED_ELEMENTS = 1,
}

const { t } = useI18n()
const { data: declaredActivityAssociations, isPending, error } = useGetAssociations(EAssociationContextType.DECLARED_ACTIVITY, declaredActivityDetails.id)

const activeTab = useEnumRouteQuery('tab', MyPerspectiveSectionTab, MyPerspectiveSectionTab.MY_PERSPECTIVE)
const associationsCount = computed(() => countElementAssociations(EAssociationContextType.DECLARED_ACTIVITY, declaredActivityAssociations.value))

const traceAllowedAssociations = computed(() => declaredActivityDetails.activity.traceAllowedAssociations)

const associationLimits = computed<AssociationLimits>(() => ({
  [EAssociationContextType.TRACE]: traceAllowedAssociations.value
}))

const maxTraceAssociationsReached = computed(() =>
  traceAllowedAssociations.value !== ACTIVITY_TRACE_SETTING_DISABLED_VALUE
  && traceAllowedAssociations.value !== ACTIVITY_TRACE_SETTING_INFINITY_VALUE
  && (declaredActivityAssociations.value?.traceAssociations.length ?? 0) >= traceAllowedAssociations.value
)

const traceAssociationEnabled = computed(() => !isActivityAssociationToTraceDisabled({ traceAllowedAssociations: traceAllowedAssociations.value }))

const readOnly = computed(() => isDeclaredActivityUnsubscribed(declaredActivityDetails.status))
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
        :limits="associationLimits"
        :actions-disabled="readOnly"
        :actions-disabled-tooltip="t('student.activities.views.ActivityView.MyPerspectiveSection.associationsDisabledTooltip')"
      >
        <template #footer>
          <span
            v-if="maxTraceAssociationsReached"
            class="caption-light av-text-right"
            data-testid="max-trace-associations-reached"
          >
            {{ t('student.activities.views.ActivityView.MyPerspectiveSection.maxTraceAssociationsReached') }}
          </span>
        </template>

        <template #header>
          <TraceAssociationLimitCard
            v-if="traceAssociationEnabled"
            :trace-allowed-associations="traceAllowedAssociations"
          />
        </template>
      </ElementAssociations>
    </AvTab>
  </AvTabs>
</template>
