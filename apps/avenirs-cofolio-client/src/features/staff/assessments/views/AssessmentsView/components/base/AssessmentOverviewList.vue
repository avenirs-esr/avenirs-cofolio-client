<script setup lang="ts">
import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type {
  AssessmentTableRow
} from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.types'
import { AvButton, AvTable, CUIDA_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useDateUtils } from '@/common/composables/use-date-utils/use-date-utils'
import { ROUTES } from '@/common/constants'
import UserInfo from '@/features/staff/admin/components/base/UserInfo/UserInfo.vue'
import AssessmentStatusBadge from '@/features/staff/assessments/components/badges/AssessmentStatusBadge/AssessmentStatusBadge.vue'
import AssessmentTypeBadge from '@/features/staff/assessments/components/badges/AssessmentTypeBadge/AssessmentTypeBadge.vue'
import AssessmentActivityTitle from '@/features/staff/assessments/views/AssessmentsView/components/AssessmentActivityTitle/AssessmentActivityTitle.vue'
import AssessmentOverviewCard from '@/features/staff/assessments/views/AssessmentsView/components/cards/AssessmentOverviewCard.vue'

interface AssessmentOverviewListProps {
  rows: AssessmentTableRow[]
  columns: AvTableColumn<AssessmentTableRow>[]
}
defineProps<AssessmentOverviewListProps>()

const { formatLastModified } = useDateUtils()

const { t } = useI18n()

const { isBelowLg } = useAvBreakpoints()
</script>

<template>
  <div
    v-if="isBelowLg"
    class="av-col av-gap-sm"
    data-testid="group-overview-list-cards"
  >
    <AssessmentOverviewCard
      v-for="assessment in rows"
      :key="assessment.id"
      :assessment="assessment"
    />
  </div>
  <AvTable
    v-else
    :rows="rows"
    :columns="columns"
    row-key="id"
    data-testid="group-overview-list-table"
  >
    <template #cell(learner)="{ row }">
      <UserInfo :user="row.learner" />
    </template>
    <template #cell(activityTitle)="{ row }">
      <AssessmentActivityTitle :activity-title="row.activityTitle" />
    </template>
    <template #cell(type)="{ row }">
      <span class=" b1-regular">
        <AssessmentTypeBadge :activity-type="row.type" />
      </span>
    </template>
    <template #cell(submitDate)="{ row }">
      <span
        v-if="row.submitDate"
        class=" b1-regular"
      >
        {{ formatLastModified(row.submitDate) }}
      </span>
    </template>
    <template #cell(status)="{ row }">
      <AssessmentStatusBadge :assessment-status="row.status" />
    </template>
    <template #cell(actions)="{ row }">
      <span class="av-row av-justify-center">
        <AvButton
          :label="t('staff.assessments.views.AssessmentsView.components.base.AssessmentOverviewList.buttonLabel')"
          :to="{
            name: ROUTES.STAFF.ACTIVITY_ASSESSMENT.name,
            params: {
              declaredActivityId: row.actions,
            },
          }"
          icon-only
          :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
        />
      </span>
    </template>
  </AvTable>
</template>

<style lang="scss" scoped>
.av-table {
  --max-lines: 2;
}
</style>
