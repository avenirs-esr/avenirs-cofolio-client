<script lang="ts" setup>
import { ICONS } from '@/common/constants'
import FeedbacksHistoryTab from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/interaction/tabs/FeedbacksHistoryTab/FeedbacksHistoryTab.vue'
import WriteFeedbackTab from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/interaction/tabs/WriteFeedbackTab/WriteFeedbackTab.vue'
import { AvFloatingPanel, AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface WriteFeedbackFloatingPanelProps {
  activityTitle: string
}

defineProps<WriteFeedbackFloatingPanelProps>()

enum WriteFeedbackFloatingPanelTabs {
  MY_FEEDBACK = 0,
  HISTORY = 1,
}

const { t } = useI18n()
const activeTab = ref(WriteFeedbackFloatingPanelTabs.MY_FEEDBACK)
</script>

<template>
  <AvFloatingPanel
    :title="t('staff.feedbacks.views.ActivityFeedbacksView.WriteFeedbackFloatingPanel.title')"
    :subtitle="activityTitle"
    :icon="ICONS.FEEDBACK"
    width="35rem"
  >
    <AvTabs
      v-model="activeTab"
      compact
    >
      <AvTab
        :title="t('staff.feedbacks.views.ActivityFeedbacksView.WriteFeedbackFloatingPanel.tabs.write.title')"
        :name="WriteFeedbackFloatingPanelTabs.MY_FEEDBACK"
      >
        <WriteFeedbackTab />
      </AvTab>
      <AvTab
        :title="t('staff.feedbacks.views.ActivityFeedbacksView.WriteFeedbackFloatingPanel.tabs.history.title')"
        :name="WriteFeedbackFloatingPanelTabs.HISTORY"
      >
        <FeedbacksHistoryTab />
      </AvTab>
    </AvTabs>
  </AvFloatingPanel>
</template>
