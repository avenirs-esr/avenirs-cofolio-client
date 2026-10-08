<script lang="ts" setup>
import type { FeedbackDetailsDTO } from '@/api/avenir-esr'
import { EFeedbackStatus, useGetFeedbackHistory } from '@/api/avenir-esr'
import FloatingPanel from '@/common/components/overlay/FloatingPanel/FloatingPanel.vue'
import { ICONS } from '@/common/constants'
import FeedbacksHistoryTab from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/FeedbacksHistoryTab/FeedbacksHistoryTab.vue'
import WriteFeedbackTab from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/WriteFeedbackTab/WriteFeedbackTab.vue'
import { FeedbackManagementFloatingPanelTabs } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/overlays/FeedbackManagementFloatingPanel/FeedbackManagementFloatingPanel.types'
import { AvTab, AvTabs, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbackManagementFloatingPanelProps {
  feedback: FeedbackDetailsDTO
  activityTitle: string
}

const { feedback, activityTitle } = defineProps<FeedbackManagementFloatingPanelProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()

const isSeen = computed(() => feedback.status === EFeedbackStatus.SEEN)

function getDefaultTab () {
  return isSeen.value
    ? FeedbackManagementFloatingPanelTabs.HISTORY
    : FeedbackManagementFloatingPanelTabs.MY_FEEDBACK
}

const floatingPanel = ref<InstanceType<typeof FloatingPanel>>()
const activeTab = ref(getDefaultTab())

const activityId = computed(() => feedback.declaredActivityId)

const {
  data: feedbackHistory,
  isLoading: isHistoryLoading,
  error: historyError,
} = useGetFeedbackHistory(activityId, {
  query: {
    enabled: computed(() => !!activityId.value),
  },
})

const feedbacks = computed(() => feedbackHistory.value ?? [])
const feedbacksCount = computed(() => feedbacks.value.length)
const maxIterations = computed(() => feedback.activity.feedbackAllowedIterations)

const historyTabTitle = computed(() =>
  t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.history.title', {
    count: feedbacksCount.value,
  })
)

watch(isSeen, (newValue) => {
  if (newValue) {
    activeTab.value = getDefaultTab()
  }
})
</script>

<template>
  <FloatingPanel
    ref="floatingPanel"
    :title="t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.title')"
    :subtitle="!isMobile ? activityTitle : undefined"
    :icon="ICONS.FEEDBACK"
    class="writing-feedback-floating-panel"
    data-testid="writing-feedback-floating-panel"
  >
    <div class="av-col av-gap-sm av-px-xs">
      <span
        v-if="isMobile"
        class="b2-bold title--mobile av-pb-sm av-separator-bottom"
      >{{ activityTitle }}</span>
      <AvTabs
        v-model="activeTab"
        compact
        :lazy-render="false"
      >
        <AvTab
          :title="t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.title')"
          :name="FeedbackManagementFloatingPanelTabs.MY_FEEDBACK"
          :disabled="isSeen"
          data-testid="write-feedback-tab-button"
        >
          <WriteFeedbackTab
            :feedback="feedback"
            @feedback-sent="floatingPanel?.togglePanel"
            @cancel="floatingPanel?.togglePanel"
          />
        </AvTab>
        <AvTab
          :title="historyTabTitle"
          :name="FeedbackManagementFloatingPanelTabs.HISTORY"
          data-testid="history-tab-button"
        >
          <FeedbacksHistoryTab
            :feedbacks="feedbacks"
            :max-iterations="maxIterations"
            :is-loading="isHistoryLoading"
            :error="historyError"
          />
        </AvTab>
      </AvTabs>
    </div>
  </FloatingPanel>
</template>

<style scoped lang="scss">
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

.writing-feedback-floating-panel > :deep(.av-card[data-collapsed='false'] > .av-card__content-collapsible) {
  overscroll-behavior-y: contain;
  overflow-y: auto;

  @include dsav.min-width(md) {
    height: 70vh;
  }
}

:deep() {
  .av-card__title {
    background-color: var(--light-background-primary2) !important;
  }
}
</style>
