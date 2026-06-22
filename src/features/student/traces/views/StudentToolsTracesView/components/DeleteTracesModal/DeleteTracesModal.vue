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
  show: boolean
  totalCount: number
}

const { show, totalCount } = defineProps<DeleteTracesModalProps>()

const emit = defineEmits<{
  cancel: []
  deleted: []
}>()

const { t } = useI18n()
const selectedTraceIds = ref<string[]>([])
const tracesContainer = ref<HTMLElement | null>(null)

const {
  showModal: showConfirmModal,
  displayModal: displayConfirmModal,
  hideModal: hideConfirmModal
} = useModal()

const {
  traces,
  isFetching,
  hasMoreTraces,
  loadMoreTraces,
} = usePaginatedTraces({
  enabled: computed(() => show),
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
  hideConfirmModal()
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
    :show="show"
    data-testid="delete-traces-modal"
    :confirm-button-label="t('student.traces.views.StudentToolsTracesView.deleteTracesModal.confirm', { count: selectedCount })"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selectedCount === 0"
    @close="onCancel"
    @confirm="displayConfirmModal"
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

        <span
          class="b2-light av-text-text1 av-text-center"
          data-testid="delete-traces-modal-description"
        >
          {{ t('student.traces.views.StudentToolsTracesView.deleteTracesModal.description') }}
        </span>
      </div>
    </template>

    <div
      ref="tracesContainer"
      class="delete-traces-modal__content av-col av-justify-center av-gap-sm"
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
    :show="showConfirmModal"
    :on-confirm-delete="onDeleteSuccess"
    :on-close="hideConfirmModal"
  />
</template>

<style lang="scss" scoped>
.delete-traces-modal__content {
  max-height: var(--dimension-8xl);
  overflow-y: auto;
}
</style>
