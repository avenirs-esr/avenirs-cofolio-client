<script lang="ts" setup>
import type { ActivityContentDTO } from '@/api/avenir-esr'
import ActivityDescriptionContent from '@/common/activities/components/ActivityDescriptionContent/ActivityDescriptionContent.vue'
import ActivityRecommendedCompletionContextsList from '@/common/activities/components/ActivityRecommendedCompletionContextsList/ActivityRecommendedCompletionContextsList.vue'
import { ICONS } from '@/common/constants'
import { AvAccordion, AvAccordionsGroup, AvButton, AvDrawer, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityDetailsDrawerProps {
  show: boolean
  activity: ActivityContentDTO
}

defineProps<ActivityDetailsDrawerProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
</script>

<template>
  <AvDrawer
    :show="show"
    position="right"
    width="40rem"
    data-testid="activity-details-drawer"
    @escape-pressed="emit('close')"
    @click-outside="emit('close')"
  >
    <div class="av-col av-gap-md">
      <AvIconText
        :icon="ICONS.ACTIVITY"
        icon-color="var(--icon)"
        :text="activity.title"
        text-color="var(--text1)"
        typography-class="n6"
        data-testid="activity-details-drawer-title"
      />

      <AvAccordionsGroup :active-accordion="0">
        <AvAccordion
          :title="t('global.activities.components.ActivityDetailsDrawer.sections.consign')"
          :icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
          data-testid="activity-details-drawer-consign-accordion"
        >
          <ActivityDescriptionContent :description="activity.description" />
        </AvAccordion>

        <AvAccordion
          :title="t('global.activities.components.ActivityDetailsDrawer.sections.context')"
          :icon="MDI_ICONS.MAP_MARKER_OUTLINE"
          data-testid="activity-details-drawer-context-accordion"
        >
          <ActivityRecommendedCompletionContextsList :recommended-completion-contexts="activity.recommendedCompletionContexts" />
        </AvAccordion>
      </AvAccordionsGroup>
    </div>

    <template #footer>
      <div class="av-row av-justify-end av-p-md">
        <AvButton
          :label="t('global.buttons.close')"
          :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          data-testid="activity-details-drawer-close-button"
          @click="emit('close')"
        />
      </div>
    </template>
  </AvDrawer>
</template>
