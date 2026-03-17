<script lang="ts" setup>
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useI18n } from 'vue-i18n'

export interface ConfirmAssociateTracesModalProps {
  show: boolean
  traces: {
    id: string
    title: string
  }[]
}

const { traces } = defineProps<ConfirmAssociateTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()

function onConfirm () {
  emit('confirm')
}
</script>

<template>
  <ConfirmationModal
    :show="show"
    data-testid="confirm-associate-traces-modal"
    @close="emit('cancel')"
    @confirm="onConfirm"
  >
    <template #header>
      <div
        class="av-row av-flex-fill"
        data-testid="confirm-associate-traces-modal__header"
      >
        <span class="b2-bold av-text-text1">
          {{ t('student.buildProject.activities.views.ProjectActivityDetailedView.ConfirmAssociateTracesModal.title') }}
        </span>
      </div>
    </template>

    <ul
      data-testid="confirm-associate-traces-modal__traces-list"
    >
      <li
        v-for="trace in traces"
        :key="trace.id"
      >
        <span class="b2-light av-text-text2">
          {{ trace.title }}
        </span>
      </li>
    </ul>
  </ConfirmationModal>
</template>
