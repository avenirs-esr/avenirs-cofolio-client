<script lang="ts" setup>
import type { ActivityDetailDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import ActivityThemacticBadge from '@/features/student/buildProject/components/badges/ActivityThemacticBadge/ActivityThemacticBadge.vue'
import UnsubscribeActivitiesConfirmModal from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.vue'
import { ICONS } from '@/features/student/global/icons'
import { AvButton, AvCard, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityPreviewProps {
  activity: ActivityDetailDTO
}

defineProps<ActivityPreviewProps>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()
</script>

<template>
  <div class="av-col av-gap-lg">
    <AvCard
      v-if="activity.banner"
      background-color="var(--card2)"
      border-color="transparent"
      class="activity-banner-container"
    >
      <img
        :src="activity.banner.url"
        :alt="activity.banner.fileName"
        class="activity-banner av-w-full av-h-full av-radius-2xl"
        data-testid="activity-banner"
      >
    </AvCard>
    <AvIconText
      :icon="ICONS.ACTIVITY"
      icon-color="var(--icon)"
      :text="activity.title"
      text-color="var(--dark-background-primary1)"
      typography-class="n2"
      gap="var(--spacing-md)"
      inline
    />
    <div class="av-row av-wrap av-gap-xs av-pl-5xl">
      <ActivityThemacticBadge :thematic="activity.thematic" />
    </div>
    <AvCard
      background-color="var(--card2)"
      border-color="transparent"
    >
      <div class="av-col av-gap-sm">
        <div class="av-col av-row--md av-justify-between--md av-gap-xl">
          <div class="av-col av-flex-fill av-gap-md">
            <span class="n4">{{ t('student.buildProject.views.ProjectActivitiesCatalogView.previewTitle') }}</span>
            <span
              class="s2-regular"
              data-testid="activity-summary"
            >
              {{ activity.summary }}
            </span>
          </div>
          <div class="av-col av-flex-fill av-gap-md">
            <span class="n4">{{ t('student.buildProject.views.ProjectActivitiesCatalogView.periodTitle') }}</span>
            <span
              class="s2-bold"
              data-testid="activity-execution-period-info"
            >
              {{ activity.executionPeriodInfo }}
            </span>
          </div>
        </div>
        <div class="av-row av-justify-end av-gap-md">
          <AvButton
            variant="OUTLINED"
            theme="PRIMARY"
            :label="t('student.buildProject.views.ProjectActivitiesCatalogView.unsubscribe')"
            :icon="MDI_ICONS.TRASH_CAN_OUTLINE"
            data-testid="unsubscribe-button"
            @click="displayModal"
          />
        </div>
      </div>
    </AvCard>
  </div>

  <UnsubscribeActivitiesConfirmModal
    :show="showModal"
    :activities="[{ id: activity.id, title: activity.title }]"
    @cancel="hideModal"
    @unsubscribed="hideModal"
  />
</template>

<style lang="scss" scoped>
.activity-banner-container {
  height: 18.75rem;
}

.activity-banner {
  object-fit: cover;
}

.n4 {
  color: var(--dark-background-primary1);
}

.s2-regular {
  color: var(--text1);
}

.s2-bold {
  color: var(--dark-background-primary1);
  white-space: pre-line;
}
</style>
