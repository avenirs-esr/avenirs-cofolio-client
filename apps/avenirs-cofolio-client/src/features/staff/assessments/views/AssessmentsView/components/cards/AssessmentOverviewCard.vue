<script setup lang="ts">
import type {
  AssessmentTableRow
} from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.types'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import Card from '@/common/components/cards/Card/Card.vue'
import { useDateUtils } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import UserInfo from '@/features/staff/admin/components/base/UserInfo/UserInfo.vue'

interface AssessmentOverviewCardProps {
  assessment: AssessmentTableRow
}

const { assessment } = defineProps<AssessmentOverviewCardProps>()

const activityTitleRef = ref<HTMLElement | null>(null)
const typeRef = ref<HTMLElement | null>(null)
const submitDateRef = ref<HTMLElement | null>(null)
const statusRef = ref<HTMLElement | null>(null)

const { isTruncated: isActivityTitleRefTruncated } = useTextTruncation(activityTitleRef)
const { isTruncated: isTypeRefTruncated } = useTextTruncation(typeRef)
const { isTruncated: isSubmitDateRefTruncated } = useTextTruncation(submitDateRef)
const { isTruncated: isStatusRefTruncated } = useTextTruncation(statusRef)

const { formatLastModified } = useDateUtils()
const { t } = useI18n()
</script>

<template>
  <RouterLink
    :to="{
      name: ROUTES.STAFF.ACTIVITY_ASSESSMENT.name,
      params: { declaredActivityId: assessment.activityId },
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

        <AvTooltip
          :content="assessment.activityTitle"
          :disabled="!isActivityTitleRefTruncated"
        >
          <span
            ref="activityTitleRef"
            class="b1-regular av-text-text1 av-max-lines"
            data-testid="activityTitle"
          >
            {{ assessment.activityTitle }}
          </span>
        </AvTooltip>

        <AvTooltip
          :content="assessment.type"
          :disabled="!isTypeRefTruncated"
        >
          <span
            ref="typeRef"
            class="b2-regular av-max-lines"
            data-testid="type"
          >
            {{ t('global.colon', { before: t('staff.assessments.views.AssessmentsView.components.dataDisplay.AssessmentsList.columns.type') }) }}
            {{ assessment.type }}
          </span>
        </AvTooltip>

        <AvTooltip
          :content="assessment.submitDate ? formatLastModified(assessment.submitDate) : ''"
          :disabled="!isSubmitDateRefTruncated"
        >
          <span
            ref="submitDateRef"
            class="b2-regular av-max-lines"
            data-testid="submitDate"
          >
            {{ t('global.colon', { before: t('staff.assessments.views.AssessmentsView.components.dataDisplay.AssessmentsList.columns.submitDate') }) }}
            {{ assessment.submitDate ? formatLastModified(assessment.submitDate) : '' }}
          </span>
        </AvTooltip>

        <AvTooltip
          :content="assessment.status"
          :disabled="!isStatusRefTruncated"
        >
          <span
            ref="statusRef"
            class="b2-regular av-max-lines"
            data-testid="status"
          >
            {{ t('global.colon', { before: t('staff.assessments.views.AssessmentsView.components.dataDisplay.AssessmentsList.columns.status') }) }}
            {{ assessment.status }}
          </span>
        </AvTooltip>
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
