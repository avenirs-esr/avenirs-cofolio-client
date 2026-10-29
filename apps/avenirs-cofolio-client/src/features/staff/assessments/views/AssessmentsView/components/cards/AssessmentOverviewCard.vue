<script setup lang="ts">
import type {
  AssessmentTableRow
} from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.types'
import { useI18n } from 'vue-i18n'
import Card from '@/common/components/cards/Card/Card.vue'
import { useDateUtils } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import UserInfo from '@/features/staff/admin/components/base/UserInfo/UserInfo.vue'
import AssessmentStatusBadge from '@/features/staff/assessments/components/badges/AssessmentStatusBadge/AssessmentStatusBadge.vue'
import AssessmentTypeBadge from '@/features/staff/assessments/components/badges/AssessmentTypeBadge/AssessmentTypeBadge.vue'
import AssessmentActivityTitle from '@/features/staff/assessments/views/AssessmentsView/components/AssessmentActivityTitle/AssessmentActivityTitle.vue'

interface AssessmentOverviewCardProps {
  assessment: AssessmentTableRow
}

const { assessment } = defineProps<AssessmentOverviewCardProps>()

const { formatLastModified } = useDateUtils()
const { t } = useI18n()
</script>

<template>
  <RouterLink
    :to="{
      name: ROUTES.STAFF.ACTIVITY_ASSESSMENT.name,
      params: { declaredActivityId: assessment.actions },
    }"
  >
    <Card
      background-color="var(--card)"
      title-background="var(--card)"
      class="assessment-overview-card"
      radius="var(--radius-lg)"
      data-testid="assessment-overview-card"
      :data-assessment-id="assessment.id"
    >
      <div class="av-col av-gap-sm">
        <UserInfo
          :user="assessment.learner"
        />

        <AssessmentActivityTitle :activity-title="assessment.activityTitle" />

        <AssessmentTypeBadge :activity-type="assessment.type" />

        <span
          class="b2-regular"
          data-testid="submitDate"
        >
          {{ t('global.colon', { before: t('staff.assessments.views.AssessmentsView.components.dataDisplay.AssessmentsList.columns.submitDate') }) }}
          {{ assessment.submitDate ? formatLastModified(assessment.submitDate) : '' }}
        </span>

        <AssessmentStatusBadge :assessment-status="assessment.status" />
      </div>
    </Card>
  </RouterLink>
</template>

<style lang="scss" scoped>
.av-card:hover {
  border: 1px solid var(--dark-background-primary1) !important;
  box-shadow: 0 0 0 2px var(--dark-background-primary1);
}

.assessment-overview-card {
  --max-lines: 2;
}
</style>
