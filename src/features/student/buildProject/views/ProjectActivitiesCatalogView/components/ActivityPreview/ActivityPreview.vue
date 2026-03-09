<script lang="ts" setup>
import { type ActivityDetailDTO, EDeclaredActivityStatus } from '@/api/avenir-esr'
import { useModal, useNavigation } from '@/common/composables'
import ActivityStatusBadge from '@/features/student/buildProject/components/badges/ActivityStatusBadge/ActivityStatusBadge.vue'
import ActivityThematicBadge from '@/features/student/buildProject/components/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import UnsubscribeActivitiesConfirmModal from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.vue'
import SubscribeActivityModal from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/SubscribeActivityModal/SubscribeActivityModal.vue'
import { ICONS } from '@/features/student/global/icons'
import { AvButton, AvCard, AvIconText, MDI_ICONS, PH_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityPreviewProps {
  activity: ActivityDetailDTO
}

defineProps<ActivityPreviewProps>()

const { t } = useI18n()
const { navigateToActivityDetailed } = useNavigation()
const { showModal: showUnsubscribeModal, displayModal: displayUnsubscribeModal, hideModal: hideUnsubscribeModal } = useModal()
const { showModal: showSubscribeModal, displayModal: displaySubscribeModal, hideModal: hideSubscribeModal } = useModal()
</script>

<template>
  <div
    class="av-col av-gap-lg"
    data-testid="activity-preview"
  >
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
      data-testid="activity-title"
    />
    <div class="av-row av-wrap av-gap-xs av-pl-5xl">
      <ActivityThematicBadge
        :thematic="activity.thematic"
        data-testid="activity-thematic-badge"
      />
      <ActivityStatusBadge
        v-if="activity.subscribedDeclaredActivity"
        :status="EDeclaredActivityStatus.SUBSCRIBED"
      />
    </div>
    <AvCard
      background-color="var(--card2)"
      border-color="transparent"
    >
      <div class="av-col av-gap-sm">
        <div class="av-col av-row--md av-justify-between--md av-gap-xl">
          <div class="av-col av-flex-fill av-gap-md">
            <span class="n4">{{ t('student.buildProject.activities.views.ProjectActivitiesCatalogView.previewTitle') }}</span>
            <span
              class="s2-regular"
              data-testid="activity-summary"
            >
              {{ activity.summary }}
            </span>
          </div>
          <div class="av-col av-flex-fill av-gap-md">
            <span class="n4">{{ t('student.buildProject.activities.views.ProjectActivitiesCatalogView.periodTitle') }}</span>
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
            v-if="activity.subscribedDeclaredActivity"
            theme="PRIMARY"
            variant="FLAT"
            :label="t('student.buildProject.activities.views.ProjectActivitiesCatalogView.buttons.access')"
            :icon="ICONS.ACTIVITY"
            small
            data-testid="access-button"
            @click="navigateToActivityDetailed({ id: activity.subscribedDeclaredActivity, thematic: activity.thematic })"
          />
          <AvButton
            v-if="activity.subscribedDeclaredActivity"
            variant="OUTLINED"
            theme="PRIMARY"
            :label="t('student.buildProject.activities.buttons.unsubscribe')"
            :icon="MDI_ICONS.TRASH_CAN_OUTLINE"
            small
            data-testid="unsubscribe-button"
            @click="displayUnsubscribeModal"
          />
          <AvButton
            v-else
            variant="OUTLINED"
            theme="PRIMARY"
            :label="t('student.buildProject.activities.buttons.subscribe')"
            :icon="PH_ICONS.NOTE_PENCIL"
            small
            data-testid="subscribe-button"
            @click="displaySubscribeModal"
          />
        </div>
      </div>
    </AvCard>
  </div>

  <UnsubscribeActivitiesConfirmModal
    :show="showUnsubscribeModal"
    :activities="[{ id: activity.id, title: activity.title }]"
    @cancel="hideUnsubscribeModal"
    @unsubscribed="hideUnsubscribeModal"
  />

  <SubscribeActivityModal
    :show="showSubscribeModal"
    :activity="{ id: activity.id, title: activity.title }"
    @cancel="hideSubscribeModal"
    @subscribed="hideSubscribeModal"
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
