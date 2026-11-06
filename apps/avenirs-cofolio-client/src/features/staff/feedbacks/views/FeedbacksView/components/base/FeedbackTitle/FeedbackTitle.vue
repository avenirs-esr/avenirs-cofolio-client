<script setup lang="ts">
import { AvTooltip } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/common/constants'

export interface FeedbackTitleProps {
  feedback: { id: string, title: string }
  withNav?: boolean
}

const { feedback, withNav = false } = defineProps<FeedbackTitleProps>()
const { t } = useI18n()

const to = computed(() => ({
  name: ROUTES.STAFF.ACTIVITY_FEEDBACK.name,
  params: { feedbackId: feedback.id }
}))

const routerProps = computed(() => withNav ? { to: to.value } : {})
</script>

<template>
  <div
    class="feedback-title av-col av-gap-xs"
    data-testid="feedback-title"
    :data-group-id="feedback.id"
  >
    <AvTooltip
      :content="t('staff.feedbacks.views.FeedbacksView.FeedBackTitle.access')"
    >
      <component
        :is="withNav ? 'RouterLink' : 'div'"
        v-bind="routerProps"
        class="title"
        :class="{ 'title--hoverable': withNav }"
        data-testid="feedback-title-content"
        :data-group-id="feedback.id"
      >
        <span
          class="av-max-lines b1-bold av-text-text1"
        >
          {{ feedback.title }}
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
