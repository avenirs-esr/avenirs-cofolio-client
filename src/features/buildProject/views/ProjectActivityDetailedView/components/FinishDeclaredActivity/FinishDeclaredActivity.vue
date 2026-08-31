<script setup lang="ts">
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import FinishDeclaredActivityConfirmModal
  from '@/features/buildProject/views/ProjectActivityDetailedView/components/overlays/FinishDeclaredActivityConfirmModal/FinishDeclaredActivityConfirmModal.vue'
import { AvBadge, AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FinishDeclaredActivityProps {
  status?: EDeclaredActivityStatus
  isLoading?: boolean
}

const { status } = defineProps<FinishDeclaredActivityProps>()

const emit = defineEmits<{
  (e: 'finished'): void
}>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()

function handleConfirm () {
  hideModal()
  emit('finished')
}

const isCompleted = computed(() => status === EDeclaredActivityStatus.COMPLETED)
const isInProgress = computed(() => status === EDeclaredActivityStatus.IN_PROGRESS)
const isSubscribed = computed(() => status === EDeclaredActivityStatus.SUBSCRIBED)
</script>

<template>
  <div
    v-if="!isSubscribed"
    class="av-col av-align-end av-items-end av-pt-md"
    data-testid="finish-declared-activity"
  >
    <AvButton
      v-if="!isCompleted"
      data-testid="finish-declared-activity-button"
      :label="t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivity.finishButton')"
      variant="FLAT"
      :icon="MDI_ICONS.CHECK_CIRCLE_OUTLINE"
      :disabled="!isInProgress"
      @click="displayModal"
    />
    <div
      v-else
      class="av-col av-align-end"
    >
      <AvBadge
        :label="t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivity.finishLabel')"
        color="var(--light-foreground-primary1)"
        background-color="var(--light-background-primary1)"
        :icon="MDI_ICONS.CHECK_CIRCLE"
        data-testid="finish-declared-activity-finished-badge"
      />
    </div>
  </div>
  <FinishDeclaredActivityConfirmModal
    :show="showModal"
    :is-loading="isLoading"
    @close="hideModal"
    @confirm="handleConfirm"
  />
</template>
