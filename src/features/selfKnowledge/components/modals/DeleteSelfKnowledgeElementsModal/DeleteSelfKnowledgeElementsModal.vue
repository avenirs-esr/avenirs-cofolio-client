<script lang="ts" setup>
import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import { invalidateGetSelfKnowledgeElements, useDeleteSelfKnowledgeElements } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { INFINITE_SCROLL_BOTTOM_DISTANCE } from '@/common/constants'
import ConfirmDeleteSelfKnowledgeElementsModal from '@/features/selfKnowledge/components/modals/ConfirmDeleteSelfKnowledgeElementsModal/ConfirmDeleteSelfKnowledgeElementsModal.vue'
import SelfKnowledgeElementsSelector from '@/features/selfKnowledge/components/pickers/SelfKnowledgeElementsSelector/SelfKnowledgeElementsSelector.vue'
import {
  useSelfKnowledgePaginatedElements
} from '@/features/selfKnowledge/composables/use-self-knowledge-paginated-elements/use-self-knowledge-paginated-elements'
import { useToasterStore } from '@/store'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useInfiniteScroll } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

export interface DeleteSelfKnowledgeElementsModalProps {
  show: boolean
  categoryType: ESelfKnowledgeCategory
  totalCount: number
}

const props = defineProps<DeleteSelfKnowledgeElementsModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { totalCount, categoryType } = toRefs(props)

const { t } = useI18n()
const {
  showModal: showConfirmModal,
  displayModal: displayConfirmModal,
  hideModal: hideConfirmModal
} = useModal()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()

const {
  elements,
  isFetching,
  hasMoreElements,
  loadMoreElements,
} = useSelfKnowledgePaginatedElements({
  selfKnowledgeCategory: computed(() => categoryType.value),
  pageSize: totalCount
})

function onDeleteSuccess (deletedCount: number) {
  addSuccessMessage(
    t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.deleteElements.success', { count: deletedCount })
  )
  hideConfirmModal()
  emit('confirm')
  resetSelectedElements()
}

const selectedElementIds = ref<string[]>([])

const { mutate: mutateDeleteSelfKnowledgeElements, isPending } = useDeleteSelfKnowledgeElements()

function deleteSelfKnowledgeElements () {
  mutateDeleteSelfKnowledgeElements({ data: selectedElementIds.value }, {
    onSuccess: async (_data, variables) => {
      await withTaskLoading(() => invalidateGetSelfKnowledgeElements(queryClient))
      onDeleteSuccess(variables.data.length)
    },
    onError: error => addErrorMessage({
      title: t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.deleteElements.error'),
      description: getErrorMessage(error)
    })
  })
}

function resetSelectedElements () {
  selectedElementIds.value = []
}

function onCancel () {
  resetSelectedElements()
  emit('cancel')
}

const elementsContainer = ref<HTMLElement | null>(null)

useInfiniteScroll(
  elementsContainer,
  loadMoreElements,
  {
    distance: INFINITE_SCROLL_BOTTOM_DISTANCE,
    canLoadMore: () => !isFetching.value && hasMoreElements.value
  }
)
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.deleteElements.confirmButton',
                             { count: selectedElementIds.length })"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selectedElementIds.length === 0"
    :is-loading="isPending || isLoading"
    @close="onCancel"
    @confirm="displayConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center"
        data-testid="header"
      >
        <span class="b2-regular av-text-text1">
          {{ t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.deleteElements.title',
               { count: elements.length }) }}
        </span>
      </div>
    </template>

    <div
      ref="elementsContainer"
      class="av-col av-gam-sm"
    >
      <SelfKnowledgeElementsSelector
        v-if="elements.length > 0"
        v-model="selectedElementIds"
        :elements="elements"
        :category-type="categoryType"
      />
    </div>
  </AvModal>

  <ConfirmDeleteSelfKnowledgeElementsModal
    :show="showConfirmModal"
    :elements="elements.filter(element => selectedElementIds.includes(element.id))"
    @cancel="hideConfirmModal"
    @confirm="deleteSelfKnowledgeElements"
  />
</template>
