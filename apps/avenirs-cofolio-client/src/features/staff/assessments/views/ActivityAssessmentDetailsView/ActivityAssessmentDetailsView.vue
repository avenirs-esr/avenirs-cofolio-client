<script lang="ts" setup>
import { AvButton, AvIconText, CUIDA_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useGetAssessmentDetails } from '@/api/avenir-esr'
import ActivityDetailsDrawer from '@/common/activities/components/ActivityDetailsDrawer/ActivityDetailsDrawer.vue'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import { useModal } from '@/common/composables'
import { ICONS } from '@/common/constants'
import AssessmentAssociatedElementSummaryCard
  from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/cards/AssessmentAssociatedElementSummaryCard/AssessmentAssociatedElementSummaryCard.vue'
import ActivityAssessmentStudentInformation
  from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/dataDisplay/ActivityAssessmentStudentInformation/ActivityAssessmentStudentInformation.vue'
import AssessmentManagementFloatingPanel
  from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/overlays/AssessmentManagementFloatingPanel/AssessmentManagementFloatingPanel.vue'
import StudentPerspectiveCard from '@/features/staff/feedbacks/components/cards/StudentPerspectiveCard/StudentPerspectiveCard.vue'

export interface ActivityAssessmentDetailsViewProps {
  declaredActivityId?: string
}

defineProps<ActivityAssessmentDetailsViewProps>()

const { t } = useI18n()
const route = useRoute()

const selectedDeclaredActivityId = computed(() => {
  const { declaredActivityId } = route.params
  return Array.isArray(declaredActivityId) ? (declaredActivityId[0] ?? '') : (declaredActivityId ?? '')
})

const { data: assessment, isLoading: isAssessmentDetailsLoading, error: assessmentDetailsError } = useGetAssessmentDetails(
  selectedDeclaredActivityId,
  {
    query: {
      enabled: computed(() => !!selectedDeclaredActivityId.value),
    },
  },
)

const activityTitle = computed(() => assessment.value?.activity.title ?? '')
const studentPerspective = computed(() => assessment.value?.reflexion ?? '')
const showStudentPerspective = computed(() =>
  !!assessment.value?.activity.enableReflection && !!studentPerspective.value
)
const hasAssociatedElements = computed(() => {
  const associations = assessment.value?.associations
  return !!associations
    && [associations.traces, associations.skillProgresses, associations.declaredExperiences].some(elements => elements.length > 0)
})
const expectsAssessment = computed(() => {
  const assessmentSetup = assessment.value?.activity.assessment
  return !!assessmentSetup
    && (!!assessmentSetup.comment || !!assessmentSetup.validation || (assessmentSetup.grade !== undefined && assessmentSetup.grade !== null))
})

const { modalOpened: showActivityDetailsDrawer, openModal: displayActivityDetailsDrawer, closeModal: hideActivityDetailsDrawer } = useModal()

const pageSubTitle = computed(() => `${t('global.activities.activity')} "${activityTitle.value}"`)

const trailingLinks = computed(() => [{ text: pageSubTitle.value }])
</script>

<template>
  <PageTitle
    :trailing-links="trailingLinks"
    :title="t('staff.assessments.views.ActivityAssessmentDetailsView.title')"
  />

  <QuerySuspense
    :is-loading="isAssessmentDetailsLoading"
    :error="assessmentDetailsError"
  >
    <div
      v-if="assessment"
      class="av-col av-gap-lg"
    >
      <div class="av-col av-gap-sm av-py-sm page-sub-title">
        <div class="av-col av-row--md av-justify-between--md av-align-center--md av-gap-sm av-wrap">
          <AvIconText
            :icon="ICONS.ACTIVITY"
            icon-color="var(--icon)"
            :text="pageSubTitle"
            text-color="var(--dark-background-primary1)"
            typography-class="n5"
            gap="var(--spacing-xs)"
            data-testid="page-sub-title"
          />
          <AvButton
            :label="t('staff.assessments.views.ActivityAssessmentDetailsView.seeActivity')"
            :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
            data-testid="see-activity"
            @click="displayActivityDetailsDrawer"
          />
        </div>
        <ActivityAssessmentStudentInformation
          :student="assessment.student"
          :submitted-at="assessment.submittedAt"
          :status="assessment.status"
        />
      </div>

      <StudentPerspectiveCard
        v-if="showStudentPerspective"
        :perspective="studentPerspective"
      />

      <AssessmentAssociatedElementSummaryCard
        v-if="hasAssociatedElements"
        :associations="assessment.associations"
      />
    </div>
  </QuerySuspense>

  <AssessmentManagementFloatingPanel
    v-if="assessment && expectsAssessment"
    :key="assessment.declaredActivityId"
    :assessment="assessment"
    :activity-title="activityTitle"
  />

  <ActivityDetailsDrawer
    v-if="assessment"
    :show="showActivityDetailsDrawer"
    :activity="assessment.activity"
    @close="hideActivityDetailsDrawer"
  />
</template>

<style scoped lang="scss">
.page-sub-title {
  border-top: 1px solid var(--stroke);
  border-bottom: 1px solid var(--stroke);
}
</style>
