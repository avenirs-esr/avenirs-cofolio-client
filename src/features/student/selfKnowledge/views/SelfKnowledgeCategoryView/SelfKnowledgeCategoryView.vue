<script setup lang="ts">
import { type ESelfKnowledgeCategory, invalidateGetSelfKnowledgeElements, useDeleteSelfKnowledgeElements, useGetSelfKnowledgeElementDetails } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import ErrorMessage from '@/common/components/feedback/ErrorMessage/ErrorMessage.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useModal, useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { ErrorCodes } from '@/common/constants'
import SelfKnowledgeElementDetailsContainer from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.vue'
import { useSelfKnowledgeCategory } from '@/features/student/selfKnowledge/composables/use-self-knowledge-category/use-self-knowledge-category'
import SelfKnowledgeElementDetails from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetails/SelfKnowledgeElementDetails.vue'
import SelfKnowledgeElementDetailsDropdown from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetailsDropdown/SelfKnowledgeElementDetailsDropdown.vue'
import { useToasterStore } from '@/store'
import { toSentenceCase } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

interface SelfKnowledgeCategoryViewProps {
  categoryId: string
}

const props = defineProps<SelfKnowledgeCategoryViewProps>()

const { t } = useI18n()
const { navigateToStudentSelfKnowledgeElementUpdate, navigateToStudentBuildProject } = useNavigation()
const { modalOpened: confirmModalOpened, openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal()
const { addErrorMessage, addSuccessMessage } = useToasterStore()

const categoryId = computed(() => props.categoryId as ESelfKnowledgeCategory)

const { categoryTypeLabel } = useSelfKnowledgeCategory(categoryId)

const queryClient = useQueryClient()

const route = useRoute()
const selectedElementId = computed(() => route.query.elementId as string)

const { data: selectedElementDetails, error } = useGetSelfKnowledgeElementDetails(selectedElementId.value, {
  query: { enabled: computed(() => !!selectedElementId.value) }
})

const { isLoading, withTaskLoading } = useTaskLoading()
const { originalErrorCode, isNotFound, getErrorMessage } = useApiErrors(error)

const { mutate: mutateDeleteSelfKnowledgeElements } = useDeleteSelfKnowledgeElements()

function deleteSelfKnowledgeElement () {
  mutateDeleteSelfKnowledgeElements({
    data: [selectedElementId.value]
  }, {
    onError: error => addErrorMessage({
      title: t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.deleteElements.error'),
      description: getErrorMessage(error)
    }),
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetSelfKnowledgeElements(queryClient))
      addSuccessMessage(
        t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.deleteElements.success', { count: 1 })
      )
      navigateToStudentBuildProject(true)
    }
  })
}

const pageTitle = computed(() =>
  `${toSentenceCase(categoryTypeLabel.value)} - ${selectedElementDetails.value?.title ?? ''}`)

const trailingLinks = computed(() => [
  { text: toSentenceCase(categoryTypeLabel.value) },
  { text: selectedElementDetails.value?.title ?? '' }
])

const isSelfKnowledgeNotFound = computed(() => originalErrorCode.value === ErrorCodes.SELF_KNOWLEDGE_ELEMENT_NOT_FOUND || isNotFound.value)

function onUpdateSelected () {
  navigateToStudentSelfKnowledgeElementUpdate({
    categoryId: props.categoryId,
    elementId: selectedElementId.value
  })
}
</script>

<template>
  <DetailedPageTitle
    :title="pageTitle"
    :trailing-links="trailingLinks"
  />

  <QuerySuspense :error="error">
    <template #error>
      <ErrorMessage
        v-if="error"
        :title="isSelfKnowledgeNotFound ? t('student.selfKnowledge.views.SelfKnowledgeCategoryView.errors.notFound.title') : t('global.error.generic')"
        :description="isSelfKnowledgeNotFound ? t('student.selfKnowledge.views.SelfKnowledgeCategoryView.errors.notFound.description') : getErrorMessage(error)"
      />
    </template>

    <SelfKnowledgeElementDetailsContainer v-if="selectedElementDetails">
      <template #title>
        <SelfKnowledgeElementDetailsDropdown
          @update-selected="onUpdateSelected"
          @delete-selected="openConfirmModal"
        />
      </template>

      <SelfKnowledgeElementDetails :element="selectedElementDetails" />
    </SelfKnowledgeElementDetailsContainer>
  </QuerySuspense>

  <ConfirmationModal
    :opened="confirmModalOpened"
    :title="t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.modals.confirmDeleteElements.title', { count: 1 })"
    :description="selectedElementDetails?.title"
    :is-loading="isLoading"
    @close="closeConfirmModal"
    @confirm="deleteSelfKnowledgeElement"
  />
</template>
