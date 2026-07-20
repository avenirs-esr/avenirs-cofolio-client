<script setup lang="ts">
import { invalidateGetStaffActivityWorkingSpace, useUnpublishActivity } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useToasterStore } from '@/store'
import { RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

interface UnpublishActivityConfirmationModalProps {
  show: boolean
  activityId: string
}

const { show, activityId } = defineProps<UnpublishActivityConfirmationModalProps>()

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
    :show="show"
    :title="t('staff.activities.modals.UnpublishActivityConfirmationModal.title')"
    :show-description="false"
    :confirm-button-label="t('global.buttons.unpublish')"
    :confirm-button-icon="RI_ICONS.EYE_OFF_LINE"
    data-testid="unpublish-activity-confirmation-modal"
    @close="emit('close')"
    @confirm="() => unpublishActivity({ activityId })"
  />
</template>
