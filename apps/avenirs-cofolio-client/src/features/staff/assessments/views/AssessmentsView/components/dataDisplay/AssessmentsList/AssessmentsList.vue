<script setup lang="ts">
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { EActivityAssessmentStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { UsePaginatedStaffAssessmentsParams } from '@/features/staff/assessments/composables/use-paginated-staff-assessments'
import type {
  AssessmentTableRow
} from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.types'
import { QuerySuspense } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import Pagination from '@/common/components/navigation/Pagination/Pagination.vue'
import { usePaginatedStaffAssessments } from '@/features/staff/assessments/composables/use-paginated-staff-assessments'
import { useStaffAssessmentsStore } from '@/features/staff/assessments/stores/assessments.store'
import AssessmentOverviewList from '@/features/staff/assessments/views/AssessmentsView/components/base/AssessmentOverviewList.vue'
import AssessmentStatusMultiselect from '@/features/staff/assessments/views/AssessmentsView/components/selects/AssessmentStatusMultiselect.vue'

const { t } = useI18n()
const staffAssessmentsStore = useStaffAssessmentsStore()

const selectedStatuses = ref<EActivityAssessmentStatus[]>([])

const usePaginatedStaffAssessmentsParams = computed<UsePaginatedStaffAssessmentsParams>(() => ({
  statusesRef: selectedStatuses,
  currentPageRef: toRef(staffAssessmentsStore, 'assessmentsCurrentPage'),
  pageSizeRef: toRef(staffAssessmentsStore, 'assessmentsPageSizeSelected'),
}))

const {
  assessments,
  pageInfo,
  isFetching,
  error,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePaginatedStaffAssessments(usePaginatedStaffAssessmentsParams.value)

const ASSESSMENT_WIDTH_MAP: Record<string, string | undefined> = {
  learner: '25%',
  activityTitle: '25%',
  types: '20%',
  submitDate: '13%',
  status: '12%',
  actions: '5%'
}

const columns = computed<AvTableColumn<AssessmentTableRow>[]>(() => {
  return (['learner', 'activityTitle', 'types', 'submitDate', 'status', 'actions'] as const).map(key => ({
    key,
    label: t(`staff.assessments.views.AssessmentsView.components.dataDisplay.AssessmentsList.columns.${key}`),
    width: ASSESSMENT_WIDTH_MAP[key]
  }))
})

const rows = computed<AssessmentTableRow[]>(() => {
  return assessments.value.map(assessment => ({
    id: assessment.id,
    learner: assessment.student,
    activityTitle: assessment.activity.title,
    types: assessment.assessmentTypes,
    submitDate: assessment.submittedAt,
    status: assessment.assessmentStatus,
    actions: assessment.id.toString()
  }))
})

watch(selectedStatuses, () => {
  staffAssessmentsStore.assessmentsCurrentPage = 0
})
</script>

<template>
  <div class="av-col av-gap-md">
    <AssessmentStatusMultiselect v-model="selectedStatuses" />

    <QuerySuspense
      :is-loading="isFetching"
      :error="error"
      :is-empty="rows.length === 0"
      :empty-state-message="t('staff.assessments.views.AssessmentsView.components.dataDisplay.AssessmentsList.noResults')"
      preserve-content
    >
      <Pagination
        v-if="pageInfo"
        :page-info="pageInfo"
        :page-size-selected="pageSizeSelected"
        :on-update-current-page="onUpdateCurrentPage"
        :on-update-page-size="onUpdatePageSize"
      >
        <AssessmentOverviewList
          :rows
          :columns
        />
      </Pagination>
    </QuerySuspense>
  </div>
</template>
