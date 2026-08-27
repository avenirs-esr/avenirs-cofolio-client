<script lang="ts" setup>
import type { FeedbackDetailsDTO } from '@/api/avenir-esr'
import { EFeedbackStatus, useGetFeedbackHistory } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import FeedbacksHistoryTab from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/FeedbacksHistoryTab/FeedbacksHistoryTab.vue'
import WriteFeedbackTab from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/WriteFeedbackTab/WriteFeedbackTab.vue'
import { AvFloatingPanel, AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbackManagementFloatingPanelProps {
  feedback: FeedbackDetailsDTO
  activityTitle: string
}

const { feedback, activityTitle } = defineProps<FeedbackManagementFloatingPanelProps>()

enum FeedbackManagementFloatingPanelTabs {
  MY_FEEDBACK = 0,
  HISTORY = 1,
}

const { t } = useI18n()

const isSeen = computed(() => feedback.status === EFeedbackStatus.SEEN)

function getDefaultTab () {
  return isSeen.value
    ? FeedbackManagementFloatingPanelTabs.HISTORY
    : FeedbackManagementFloatingPanelTabs.MY_FEEDBACK
}

const activeTab = ref(getDefaultTab())
const panelRef = ref<InstanceType<typeof AvFloatingPanel> | null>(null)

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

function togglePanel () {
  panelRef.value?.toggleCollapsed()
}

watch(isSeen, (newValue) => {
  if (newValue) {
    activeTab.value = getDefaultTab()
  }
})
</script>

<template>
  <AvFloatingPanel
    ref="panelRef"
    :title="t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.title')"
    :subtitle="activityTitle"
    :icon="ICONS.FEEDBACK"
    width="35rem"
    class="writing-feedback-floating-panel"
    data-testid="writing-feedback-floating-panel"
  >
    <div class="av-px-xs">
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
            @feedback-sent="togglePanel"
            @cancel="togglePanel"
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
  </AvFloatingPanel>
</template>

<style scoped lang="scss">
.writing-feedback-floating-panel > :deep(.av-card[data-collapsed='false'] > .av-card__content-collapsible) {
  height: 70vh;
  overflow-y: auto;
}
</style>
