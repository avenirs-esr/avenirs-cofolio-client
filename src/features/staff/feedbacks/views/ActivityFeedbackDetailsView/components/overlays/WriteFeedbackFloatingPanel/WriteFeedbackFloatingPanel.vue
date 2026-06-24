<script lang="ts" setup>
import type { FeedbackDetailsDTO } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import FeedbacksHistoryTab from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/FeedbacksHistoryTab/FeedbacksHistoryTab.vue'
import WriteFeedbackTab from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/WriteFeedbackTab/WriteFeedbackTab.vue'
import { AvFloatingPanel, AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface WriteFeedbackFloatingPanelProps {
  feedback: FeedbackDetailsDTO
  activityTitle: string
}

defineProps<WriteFeedbackFloatingPanelProps>()

enum WriteFeedbackFloatingPanelTabs {
  MY_FEEDBACK = 0,
  HISTORY = 1,
}

const { t } = useI18n()
const activeTab = ref(WriteFeedbackFloatingPanelTabs.MY_FEEDBACK)

const panelRef = ref<InstanceType<typeof AvFloatingPanel> | null>(null)

function togglePanel () {
  panelRef.value?.toggleCollapsed()
}
</script>

<template>
  <AvFloatingPanel
    ref="panelRef"
    :title="t('staff.feedbacks.views.ActivityFeedbackDetailsView.WriteFeedbackFloatingPanel.title')"
    :subtitle="activityTitle"
    :icon="ICONS.FEEDBACK"
    width="35rem"
    data-testid="writing-feedback-floating-panel"
  >
    <div class="av-px-xs">
      <AvTabs
        v-model="activeTab"
        compact
        :lazy-render="false"
      >
        <AvTab
          :title="t('staff.feedbacks.views.ActivityFeedbackDetailsView.WriteFeedbackFloatingPanel.tabs.write.title')"
          :name="WriteFeedbackFloatingPanelTabs.MY_FEEDBACK"
        >
          <WriteFeedbackTab
            :feedback="feedback"
            @cancel="togglePanel"
            @feedback-sent="togglePanel"
          />
        </AvTab>
        <AvTab
          :title="t('staff.feedbacks.views.ActivityFeedbackDetailsView.WriteFeedbackFloatingPanel.tabs.history.title')"
          :name="WriteFeedbackFloatingPanelTabs.HISTORY"
        >
          <FeedbacksHistoryTab />
        </AvTab>
      </AvTabs>
    </div>
  </AvFloatingPanel>
</template>

<style scoped lang="scss">
:deep() {
  .av-card[data-collapsed='false'] > .av-card__content-collapsible {
    height: 60vh;
    overflow-y: auto;
  }
}
</style>
