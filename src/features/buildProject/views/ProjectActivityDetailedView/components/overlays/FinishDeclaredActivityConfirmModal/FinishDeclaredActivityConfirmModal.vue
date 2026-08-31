<script setup lang="ts">
import { ConfirmationModal } from '@/common/components'
import { useI18n } from 'vue-i18n'

export interface FinishDeclaredActivityConfirmModalProps {
  show: boolean
  isLoading?: boolean
}

const { show } = defineProps<FinishDeclaredActivityConfirmModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
</script>

<template>
  <ConfirmationModal
    :show="show"
    data-testid="finish-declared-activity-confirm-modal"
    :title="t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivityConfirmModal.title')"
    :description="t('student.buildProject.activities.views.ProjectActivityDetailedView.FinishDeclaredActivityConfirmModal.description')"
    :is-loading="isLoading"
    @close="emit('close')"
    @confirm="emit('confirm')"
  />
</template>
