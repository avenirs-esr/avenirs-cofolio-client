<script setup lang="ts">
import type { EFeedbackStatus } from '@/api/avenir-esr'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { ROUTES } from '@/common/constants'

export interface FeedbackActivityTitleProps {
  feedback: { id: string, status?: EFeedbackStatus }
  activity: { id?: string, title: string }
  withNav?: boolean
}

const { feedback, activity, withNav = false } = defineProps<FeedbackActivityTitleProps>()

const titleRef = ref<HTMLElement | null>(null)
const { isTruncated } = useTextTruncation(titleRef)

const to = computed(() => ({
  name: ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name,
  params: { feedbackId: feedback.id }
}))

const routerProps = computed(() => withNav ? { to: to.value } : {})
</script>

<template>
  <div
    class="feedback-title av-col av-gap-xs"
    data-testid="feedback-title"
    :data-feedback-id="feedback.id"
    :data-activity-id="activity.id"
    :data-feedback-status="feedback.status"
  >
    <AvTooltip
      :disabled="!isTruncated"
      :content="activity.title"
    >
      <component
        :is="withNav ? 'RouterLink' : 'div'"
        v-bind="routerProps"
        class="title"
        :class="{ 'title--hoverable': withNav }"
        data-testid="feedback-title-content"
        :data-feedback-id="feedback.id"
        :data-activity-id="activity.id"
        :data-feedback-status="feedback.status"
      >
        <span
          ref="titleRef"
          class="av-max-lines b1-bold av-text-text1"
        >
          {{ activity.title }}
        </span>
      </component>
    </AvTooltip>
  </div>
</template>

<style scoped lang="scss">
.feedback-title {
  --max-lines: 2;

  .title--hoverable:hover > * {
    color: var(--light-foreground-primary2);
    text-decoration: underline;
  }
}
</style>
