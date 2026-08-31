<script setup lang="ts">
import type { FileDTO } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import ActivityResourcesList from '@/features/activities/components/lists/ActivityResourcesList/ActivityResourcesList.vue'
import { useI18n } from 'vue-i18n'

interface DeleteActivityResourcesModalProps {
  show: boolean
  activityId: string
  files: (FileDTO | File)[]
  links: string[]
  isUpdating: boolean
}

const {
  show,
  activityId,
  files,
  links,
  isUpdating
} = defineProps<DeleteActivityResourcesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()
</script>

<template>
  <ConfirmationModal
    :show="show"
    :is-loading="isUpdating"
    data-testid="delete-activity-resources-confirmation-modal"
    @confirm="emit('confirm')"
    @close="emit('cancel')"
  >
    <template #default>
      <div class="av-col av-gap-sm">
        <span
          class="n5"
          data-testid="delete-activity-resources-confirmation-modal-title"
        >
          {{ t('staff.activities.modals.DeleteActivityResourcesConfirmationModal.title', { count: files.length + links.length }) }}
        </span>

        <ActivityResourcesList
          :activity-id="activityId"
          :files="files"
          :links="links"
          readonly
        />
      </div>
    </template>
  </ConfirmationModal>
</template>
