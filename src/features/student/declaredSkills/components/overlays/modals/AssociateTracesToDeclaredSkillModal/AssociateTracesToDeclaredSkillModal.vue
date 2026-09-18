<script lang="ts" setup>
import {
  EAssociationContextType,
  invalidateGetAssociations,
  invalidateGetDeclaredSkillProgressDetails,
  invalidateSearchForAssociation,
  useAssociate,
  useSearchForAssociation
} from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationModal } from '@/features/student/global'
import { AssociateTracesModal } from '@/features/student/traces'
import { useToasterStore } from '@/store'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateTracesToDeclaredSkillModalProps {
  opened: boolean
  declaredSkillId: string
}

const { opened, declaredSkillId } = defineProps<AssociateTracesToDeclaredSkillModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const { t } = useI18n()
const { addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const {
  searchQuery,
  onSearch,
  listenAndDisplayToastOnSearchError,
  onAssociateMutationError
} = useAssociationModal()

const params = computed(() => ({
  keyword: searchQuery.value.trim() || undefined,
  page: 0,
  pageSize: PageSizes.TWENTY,
}))

const {
  data,
  isError: isSearchError,
  error: searchError
} = useSearchForAssociation(
  EAssociationContextType.DECLARED_SKILL,
  computed(() => declaredSkillId),
  EAssociationContextType.TRACE,
  params,
  {
    query: { enabled: computed(() => opened) }
  }
)

const traces = computed(() => data.value?.data ?? [])

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: mutateAssociateDeclaredSkillWithTraces, isPending } = useAssociate({
  mutation: {
    onError: error => onAssociateMutationError(error),
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateGetAssociations(queryClient, variables.contextType, variables.elementId),
        invalidateGetDeclaredSkillProgressDetails(queryClient, variables.elementId),
        invalidateSearchForAssociation(queryClient, variables.contextType, variables.elementId, variables.associatedContextType)
      ]))

      const count = variables.data.idsToAssociate.length

      addSuccessMessage(t('student.traces.modals.AssociateTracesModal.success', { count }))

      emit('associated')
    }
  }
})

function associateDeclaredSkillWithTraces (idsToAssociate: string[]) {
  mutateAssociateDeclaredSkillWithTraces({
    contextType: EAssociationContextType.DECLARED_SKILL,
    elementId: declaredSkillId,
    associatedContextType: EAssociationContextType.TRACE,
    data: { idsToAssociate }
  })
}
</script>

<template>
  <AssociateTracesModal
    :opened="opened"
    :traces="traces"
    :is-loading="isPending || isLoading"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="associateDeclaredSkillWithTraces"
  />
</template>
