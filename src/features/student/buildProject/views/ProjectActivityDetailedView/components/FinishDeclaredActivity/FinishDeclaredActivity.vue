<script setup lang="ts">
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import FinishDeclaredActivityConfirmModal
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/FinishDeclaredActivityConfirmModal/FinishDeclaredActivityConfirmModal.vue'
import { AvBadge, AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FinishDeclaredActivityProps {
  finishedAt?: string
  status?: EDeclaredActivityStatus
}

const { finishedAt, status } = defineProps<FinishDeclaredActivityProps>()

const emit = defineEmits<{
  (e: 'finished'): void
}>()

const { t } = useI18n()
const showConfirmModal = ref(false)

function openConfirmModal () {
  showConfirmModal.value = true
}

function closeConfirmModal () {
  showConfirmModal.value = false
}

function handleConfirm () {
  showConfirmModal.value = false
  emit('finished')
}

const isCompleted = computed(() => status === EDeclaredActivityStatus.COMPLETED)
const finishedAtFormatted = computed(() => {
  if (!finishedAt) {
    return ''
  }

  return new Date(finishedAt).toLocaleDateString('fr-FR')
})
</script>

<template>
  <div
    class="av-col av-align-end av-items-end av-pt-md"
    data-testid="finish-declared-activity"
  >
    <AvButton
      v-if="!isCompleted"
      data-testid="finish-declared-activity-button"
      :label="t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivity.finishButton')"
      variant="FLAT"
      :icon="MDI_ICONS.CHECK_CIRCLE_OUTLINE"
      @click="openConfirmModal"
    />
    <div
      v-if="isCompleted"
      class="av-col av-align-end"
    >
      <AvBadge
        :label="t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivity.finishLabel')"
        color="var(--light-foreground-primary1)"
        background-color="var(--light-background-primary1)"
        :icon="MDI_ICONS.CHECK_CIRCLE"
        data-testid="finish-declared-activity-finished-badge"
      />
      <p class="av-text-text2">
        {{ t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivity.finishedAt', { date: finishedAtFormatted }) }}
      </p>
    </div>
    <FinishDeclaredActivityConfirmModal
      :show="showConfirmModal"
      @close="closeConfirmModal"
      @confirm="handleConfirm"
    />
  </div>
</template>
