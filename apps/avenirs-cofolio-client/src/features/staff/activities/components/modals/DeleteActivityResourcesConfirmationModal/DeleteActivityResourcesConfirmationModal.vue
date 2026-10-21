<script setup lang="ts">
import type { FileDTO } from '@/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import ActivityResourcesList from '@/common/components/interaction/lists/ActivityResourcesList/ActivityResourcesList.vue'
import ConfirmationModal from '@/common/components/overlay/modals/ConfirmationModal/ConfirmationModal.vue'

interface DeleteActivityResourcesModalProps {
  opened: boolean
  activityId: string
  files: (FileDTO | File)[]
  links: string[]
  isUpdating: boolean
}

const {
  opened,
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
    :opened="opened"
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
