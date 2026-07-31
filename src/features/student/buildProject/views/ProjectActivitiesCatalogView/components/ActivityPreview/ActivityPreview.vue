<script lang="ts" setup>
import type { ActivityPresentationDTO } from '@/api/avenir-esr'
import ActivityCatalogHeader from '@/common/activities/components/ActivityCatalogHeader/ActivityCatalogHeader.vue'
import ActivityCatalogPreviewCard from '@/common/activities/components/ActivityCatalogPreviewCard/ActivityCatalogPreviewCard.vue'
import { useModal } from '@/common/composables'
import { ICONS, ROUTES } from '@/common/constants'
import SubscribeActivityConfirmModal from '@/features/student/buildProject/components/modals/SubscribeActivityConfirmModal/SubscribeActivityConfirmModal.vue'
import UnsubscribeActivitiesConfirmModal from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.vue'
import { AvButton, MDI_ICONS, PH_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityPreviewProps {
  activity: ActivityPresentationDTO
}

defineProps<ActivityPreviewProps>()

const { t } = useI18n()
const { showModal: showUnsubscribeModal, displayModal: displayUnsubscribeModal, hideModal: hideUnsubscribeModal } = useModal()
const { showModal: showSubscribeModal, displayModal: displaySubscribeModal, hideModal: hideSubscribeModal } = useModal()
</script>

<template>
  <div
    class="av-col av-gap-lg"
    data-testid="activity-preview"
  >
    <ActivityCatalogHeader
      :banner="activity.banner"
      :title="activity.title"
      :thematic="activity.thematic"
      :subscribed-declared-activity="activity.subscribedDeclaredActivity"
    />
    <ActivityCatalogPreviewCard
      :summary="activity.summary"
      :recommended-completion-contexts="activity.recommendedCompletionContexts"
    >
      <template #actions>
        <AvButton
          v-if="activity.subscribedDeclaredActivity"
          theme="PRIMARY"
          variant="FLAT"
          :label="t('student.buildProject.activities.views.ProjectActivitiesCatalogView.buttons.access')"
          :icon="ICONS.ACTIVITY"
          small
          :to="{
            name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name,
            params: { id: activity.subscribedDeclaredActivity, thematic: activity.thematic },
          }"
          data-testid="access-button"
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
      </template>
    </ActivityCatalogPreviewCard>
  </div>

  <UnsubscribeActivitiesConfirmModal
    :show="showUnsubscribeModal"
    :activities="[{ id: activity.id, title: activity.title }]"
    @cancel="hideUnsubscribeModal"
    @unsubscribed="hideUnsubscribeModal"
  />

  <SubscribeActivityConfirmModal
    :show="showSubscribeModal"
    :activity="{ id: activity.id, title: activity.title }"
    @cancel="hideSubscribeModal"
    @subscribed="hideSubscribeModal"
  />
</template>
