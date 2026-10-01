<script setup lang="ts">
import type { EActivityStatus } from '@/api/avenir-esr'
import { invalidateGetActivityContent, invalidateGetActivityPresentation, invalidateGetStaffActivityLibrary, invalidateGetStaffActivityWorkingSpace, useDeleteActivityDefinitively } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useToasterStore } from '@/store'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

interface DeleteActivityDefinitivelyConfirmationModalProps {
  opened: boolean
  activityId: string
  activityStatus: EActivityStatus
}

const { opened, activityId, activityStatus } = defineProps<DeleteActivityDefinitivelyConfirmationModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const queryClient = useQueryClient()
const { mutate } = useDeleteActivityDefinitively()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { getErrorMessage } = useApiErrors()

function confirmDelete () {
  mutate({ activityId }, {
    onSuccess: async () => {
      addSuccessMessage(t('staff.activities.modals.DeleteActivityDefinitivelyConfirmationModal.deleteSuccess'))
      await invalidateGetActivityContent(queryClient, activityStatus, activityId)
      await invalidateGetActivityPresentation(queryClient, activityStatus, activityId)
      await invalidateGetStaffActivityWorkingSpace(queryClient)
      await invalidateGetStaffActivityLibrary(queryClient)
      emit('deleted')
    },
    onError: (error) => {
      addErrorMessage({
        title: t('staff.activities.modals.DeleteActivityDefinitivelyConfirmationModal.deleteError'),
        description: getErrorMessage(error),
      })
    },
  })
}
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :title="t('staff.activities.modals.DeleteActivityDefinitivelyConfirmationModal.title')"
    :description="t('staff.activities.modals.DeleteActivityDefinitivelyConfirmationModal.description')"
    :confirm-button-label="t('global.buttons.remove')"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    data-testid="delete-activity-definitively-confirmation-modal"
    @close="emit('close')"
    @confirm="confirmDelete"
  />
</template>
