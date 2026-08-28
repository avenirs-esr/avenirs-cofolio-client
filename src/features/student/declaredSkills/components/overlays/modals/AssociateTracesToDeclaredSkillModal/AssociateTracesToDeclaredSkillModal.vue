<script lang="ts" setup>
import {
  EAssociationContextType,
  invalidateGetDeclaredSkillAssociations,
  invalidateGetDeclaredSkillProgressDetails,
  invalidateSearchTracesForAssociation,
  useAssociateDeclaredSkillWithTraces,
  useSearchTracesForAssociation
} from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationModal } from '@/features/student/global'
import { AssociateTracesModal } from '@/features/student/traces'
import { useTraceAssociationModal } from '@/features/student/traces/composables/use-trace-associations/use-trace-associations'
import { useToasterStore } from '@/store'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateTracesToDeclaredSkillModalProps {
  show: boolean
  declaredSkillId: string
}

const { show, declaredSkillId } = defineProps<AssociateTracesToDeclaredSkillModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const { t } = useI18n()
const { addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const { selectedTraceType, isAssociated } = useTraceAssociationModal()

const {
  searchQuery,
  onSearch,
  listenAndDisplayToastOnSearchError,
  onAssociateMutationError
} = useAssociationModal()

const params = computed(() => ({
  contextType: EAssociationContextType.DECLARED_SKILL,
  excludeAssociatedWithElementId: declaredSkillId,
  isAssociated: isAssociated.value,
  keyword: searchQuery.value.trim() || undefined,
  page: 0,
  pageSize: PageSizes.TWENTY,
}))

const {
  data,
  isError: isSearchError,
  error: searchError
} = useSearchTracesForAssociation(params, {
  query: { enabled: computed(() => show) }
})

const traces = computed(() => data.value?.data ?? [])

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: mutateAssociateDeclaredSkillWithTraces, isPending } = useAssociateDeclaredSkillWithTraces({
  mutation: {
    onError: error => onAssociateMutationError(error),
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredSkillAssociations(queryClient, variables.declaredSkillProgressId),
        invalidateGetDeclaredSkillProgressDetails(queryClient, variables.declaredSkillProgressId),
        invalidateSearchTracesForAssociation(queryClient)
      ]))

      const count = variables.data.idsToAssociate.length

      addSuccessMessage(t('student.traces.modals.AssociateTracesModal.success', { count }))

      emit('associated')
    }
  }
})

function associateDeclaredSkillWithTraces (idsToAssociate: string[]) {
  mutateAssociateDeclaredSkillWithTraces({
    declaredSkillProgressId: declaredSkillId,
    data: { idsToAssociate }
  })
}
</script>

<template>
  <AssociateTracesModal
    v-model:selected-trace-type="selectedTraceType"
    :show="show"
    :traces="traces"
    :is-loading="isPending || isLoading"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="associateDeclaredSkillWithTraces"
  />
</template>
