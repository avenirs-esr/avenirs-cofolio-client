<script setup lang="ts">
import { RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ConfirmationModal, useApiErrors } from '@avenirs-esr/shared'
import { invalidateGetStaffActivityWorkingSpace, useUnpublishActivity } from '@avenirs-esr/shared/api/avenir-esr'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { useToasterStore } from '@/store'

interface UnpublishActivityConfirmationModalProps {
  opened: boolean
  activityId: string
}

const { opened, activityId } = defineProps<UnpublishActivityConfirmationModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'unpublished'): void
}>()

const { t } = useI18n()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { getErrorMessage } = useApiErrors()

const queryClient = useQueryClient()
const { mutate: unpublishActivity } = useUnpublishActivity({
  mutation: {
    onSuccess: async () => {
      addSuccessMessage(t('staff.activities.modals.UnpublishActivityConfirmationModal.unpublishSuccess'))
      await invalidateGetStaffActivityWorkingSpace(queryClient)
      emit('unpublished')
    },
    onError: (error) => {
      addErrorMessage({
        title: t('staff.activities.modals.UnpublishActivityConfirmationModal.unpublishError'),
        description: getErrorMessage(error),
      })
    },
  }
})
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :title="t('staff.activities.modals.UnpublishActivityConfirmationModal.title')"
    :show-description="false"
    :confirm-button-label="t('global.buttons.unpublish')"
    :confirm-button-icon="RI_ICONS.EYE_OFF_LINE"
    data-testid="unpublish-activity-confirmation-modal"
    @close="emit('close')"
    @confirm="() => unpublishActivity({ activityId })"
  />
</template>
