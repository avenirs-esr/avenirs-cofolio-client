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
import AssessmentOverviewCard from '@/features/staff/assessments/views/AssessmentsView/components/cards/AssessmentOverviewCard.vue'

interface AssessmentOverviewProps {
  rows: AssessmentTableRow[]
  columns: AvTableColumn<AssessmentTableRow>[]
}
defineProps<AssessmentOverviewProps>()

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
      <span class="av-max-lines b1-regular av-text-text1">
        {{ row.activityTitle }}
      </span>
    </template>
    <template #cell(type)="{ row }">
      <span class="av-max-lines b2-regular">
        {{ row.type }}
      </span>
    </template>
    <template #cell(submitDate)="{ row }">
      <span class="av-max-lines b2-regular">
        {{ row.submitDate ? formatLastModified(row.submitDate) : '' }}
      </span>
    </template>
    <template #cell(status)="{ row }">
      <span class="av-max-lines b2-regular">
        {{ row.status }}
      </span>
    </template>
    <template #cell(activityId)="{ row }">
      <span class="av-row av-justify-center">
        <AvButton
          class="av-justify-center"
          :label="t('staff.assessments.views.AssessmentsView.components.base.AssessmentOverviewList.buttonLabel')"
          :to="{
            name: ROUTES.STAFF.ACTIVITY_ASSESSMENT.name,
            params: {
              declaredActivityId: row.activityId,
            },
          }"
          icon-only
          :icon="
            CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
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
