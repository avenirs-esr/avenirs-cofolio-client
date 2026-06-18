<script setup lang="ts">
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useI18n } from 'vue-i18n'

interface DeleteDraftActivityConfirmationModalProps {
  show: boolean
}

const { show } = defineProps<DeleteDraftActivityConfirmationModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()
</script>

<template>
  <ConfirmationModal
    :show="show"
    :title="t('staff.activities.modals.DeleteDraftActivityConfirmationModal.title')"
    no-description
    @close="emit('close')"
    @confirm="emit('confirm')"
  />
</template>
