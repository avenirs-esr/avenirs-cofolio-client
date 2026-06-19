<script setup lang="ts">
import { invalidateGetStaffActivityWorkingSpace, useDeleteActivityDraft } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

interface DeleteDraftActivityConfirmationModalProps {
  show: boolean
  activityId: string
}

const { show, activityId } = defineProps<DeleteDraftActivityConfirmationModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const queryClient = useQueryClient()
const { mutate } = useDeleteActivityDraft()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { getErrorMessage } = useApiErrors()

function confirmDelete () {
  mutate({ activityDraftId: activityId }, {
    onSuccess: async () => {
      addSuccessMessage(t('staff.activities.modals.DeleteDraftActivityConfirmationModal.deleteSuccess'))
      await invalidateGetStaffActivityWorkingSpace(queryClient)
      emit('deleted')
    },
    onError: (error) => {
      addErrorMessage({
        title: t('staff.activities.modals.DeleteDraftActivityConfirmationModal.deleteError'),
        description: getErrorMessage(error),
      })
    },
  })
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    :title="t('staff.activities.modals.DeleteDraftActivityConfirmationModal.title')"
    :show-description="false"
    data-testid="delete-draft-activity-confirmation-modal"
    @close="emit('close')"
    @confirm="confirmDelete"
  />
</template>
