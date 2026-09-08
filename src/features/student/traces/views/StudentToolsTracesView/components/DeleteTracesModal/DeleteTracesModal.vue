<script lang="ts" setup>
import { ConfirmationModal } from '@/common/components'
import { useModal } from '@/common/composables'
import { INFINITE_SCROLL_BOTTOM_DISTANCE } from '@/common/constants'
import { TracesSelector } from '@/features/student/traces'
import TraceDeletionConfirmationModal
  from '@/features/student/traces/components/modals/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import { usePaginatedTraces } from '@/features/student/traces/composables/use-paginated-traces/use-paginated-traces'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useInfiniteScroll } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

export interface DeleteTracesModalProps {
  opened: boolean
  totalCount: number
}

const { opened, totalCount } = defineProps<DeleteTracesModalProps>()

const emit = defineEmits<{
  cancel: []
  deleted: []
}>()

const { t } = useI18n()
const selectedTraceIds = ref<string[]>([])
const tracesContainer = ref<HTMLElement | null>(null)

const {
  modalOpened: confirmModalOpened,
  openModal: openConfirmModal,
  closeModal: closeConfirmModal
} = useModal()

const {
  traces,
  isFetching,
  hasMoreTraces,
  loadMoreTraces,
} = usePaginatedTraces({
  enabled: computed(() => opened),
  pageSize: computed(() => totalCount)
})

const selectedCount = computed(() => selectedTraceIds.value.length)

function resetSelectedTraces () {
  selectedTraceIds.value = []
}

function onCancel () {
  resetSelectedTraces()
  emit('cancel')
}

function onDeleteSuccess () {
  closeConfirmModal()
  resetSelectedTraces()
  emit('deleted')
}

useInfiniteScroll(tracesContainer, loadMoreTraces, {
  distance: INFINITE_SCROLL_BOTTOM_DISTANCE,
  canLoadMore: () => !isFetching.value && hasMoreTraces.value
})
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    data-testid="delete-traces-modal"
    :confirm-button-label="t('student.traces.views.StudentToolsTracesView.deleteTracesModal.confirm', { count: selectedCount })"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selectedCount === 0"
    @close="onCancel"
    @confirm="openConfirmModal"
  >
    <template #header>
      <div
        class="av-col av-gap-sm av-w-full"
        data-testid="header"
      >
        <span
          class="b2-regular av-text-text1 av-text-center"
          data-testid="delete-traces-modal-title"
        >
          {{ t('student.traces.views.StudentToolsTracesView.deleteTracesModal.title', { count: traces.length }) }}
        </span>
      </div>
    </template>

    <div
      ref="tracesContainer"
      class="delete-traces-modal__content av-col av-gap-sm"
    >
      <TracesSelector
        v-if="traces.length"
        v-model="selectedTraceIds"
        :traces="traces"
        compact
      />
    </div>
  </ConfirmationModal>

  <TraceDeletionConfirmationModal
    :trace-ids="selectedTraceIds"
    :title="t('student.traces.views.StudentToolsTracesView.deleteTracesModal.confirmationTitle', { count: selectedCount })"
    :opened="confirmModalOpened"
    :on-confirm-delete="onDeleteSuccess"
    :on-close="closeConfirmModal"
  />
</template>

<style lang="scss" scoped>
.delete-traces-modal__content {
  max-height: var(--dimension-8xl);
  overflow-y: auto;
}
</style>
