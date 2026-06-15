<script lang="ts" setup>
import { useModal } from '@/common/composables'
import { INFINITE_SCROLL_BOTTOM_DISTANCE } from '@/common/constants'
import { TracesSelector } from '@/features/student/traces'
import { usePaginatedTraces } from '@/features/student/traces/composables/use-paginated-traces/use-paginated-traces'
import TraceDeletionConfirmationModal
  from '@/features/student/traces/views/StudentTraceView/components/TraceDeletionConfirmationModal/TraceDeletionConfirmationModal.vue'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useInfiniteScroll } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

export interface DeleteTracesModalProps {
  show: boolean
  totalCount: number
}

const props = defineProps<DeleteTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'deleted'): void
}>()

const { show, totalCount } = toRefs(props)

const { t } = useI18n()

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
  enabled: computed(() => show.value),
  pageSize: totalCount
})

const selectedTraceIds = ref<string[]>([])

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

const tracesContainer = ref<HTMLElement | null>(null)

useInfiniteScroll(
  tracesContainer,
  loadMoreTraces,
  {
    distance: INFINITE_SCROLL_BOTTOM_DISTANCE,
    canLoadMore: () => !isFetching.value && hasMoreTraces.value
  }
)
</script>

<template>
  <AvModal
    :opened="show"
    data-testid="delete-traces-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.traces.views.StudentToolsTracesView.deleteTracesModal.confirm', { count: selectedTraceIds.length })"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selectedTraceIds.length === 0"
    @close="onCancel"
    @confirm="displayConfirmModal"
  >
    <template #header>
      <div
        class="av-col av-gap-sm av-w-full"
        data-testid="header"
      >
        <div class="av-row av-justify-center">
          <span class="b2-regular av-text-text1 av-text-center">
            {{ t('student.traces.views.StudentToolsTracesView.deleteTracesModal.title', { count: traces.length }) }}
          </span>
        </div>
        <div class="av-row av-justify-center">
          <span class="b2-light av-text-text1 av-text-center">
            {{ t('student.traces.views.StudentToolsTracesView.deleteTracesModal.description') }}
          </span>
        </div>
      </div>
    </template>

    <div
      ref="tracesContainer"
      class="av-col av-gap-sm"
      style="max-height: 400px; overflow-y: auto;"
    >
      <TracesSelector
        v-if="traces.length > 0"
        v-model="selectedTraceIds"
        class="traces-selector--compact"
        :traces="traces"
        compact
      />
    </div>
  </AvModal>

  <TraceDeletionConfirmationModal
    :trace-ids="selectedTraceIds"
    :title="t('student.traces.views.StudentToolsTracesView.deleteTracesModal.confirmationTitle', { count: selectedTraceIds.length })"
    :show="showConfirmModal"
    :on-confirm-delete="onDeleteSuccess"
    :on-close="hideConfirmModal"
  />
</template>
