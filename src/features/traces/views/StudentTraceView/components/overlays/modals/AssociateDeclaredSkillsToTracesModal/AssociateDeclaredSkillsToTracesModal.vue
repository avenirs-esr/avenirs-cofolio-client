<script lang="ts" setup>
import { type AssociationsCreationRequest, invalidateGetTraceAssociations, invalidateGetTraceDetail, invalidateGetTracesSummary, invalidateSearchDeclaredSkillForAssociation, invalidateTracesView, useAssociateTraceWithDeclaredSkill, useSearchDeclaredSkillForAssociation } from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { AssociateDeclaredSkillsModal } from '@/features/declaredSkills'
import { useAssociationModal } from '@/features/global'
import { useToasterStore } from '@/store'
import { keepPreviousData, useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateDeclaredSkillsToTracesModalProps {
  show: boolean
  traceId: string
}

const { show, traceId } = defineProps<AssociateDeclaredSkillsToTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const { t } = useI18n()
const { addSuccessMessage } = useToasterStore()
const { isLoading: isTaskLoading, withTaskLoading } = useTaskLoading()
const queryClient = useQueryClient()

const {
  searchQuery,
  onSearch,
  listenAndDisplayToastOnSearchError,
  onAssociateMutationError
} = useAssociationModal()

const enabled = computed(() => !!traceId)
const params = computed(() => ({
  keyword: searchQuery.value.trim() || undefined,
  page: 0,
  pageSize: 100,
}))

const {
  data,
  isError: isSearchError,
  error: searchError,
  isLoading
} = useSearchDeclaredSkillForAssociation(computed(() => traceId), params, {
  query: {
    enabled: enabled.value,
    placeholderData: keepPreviousData,
  }
})

const skills = computed(() => data.value?.data || [])

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: associateTraceWithDeclaredSkills, isPending } = useAssociateTraceWithDeclaredSkill({
  mutation: {
    onError: error => onAssociateMutationError(error),
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateTracesView(queryClient, {}),
        invalidateGetTracesSummary(queryClient),
        invalidateGetTraceDetail(queryClient, traceId),
        invalidateGetTraceAssociations(queryClient, traceId),
        invalidateSearchDeclaredSkillForAssociation(queryClient, traceId, params.value)
      ]))
      const count = variables.data.idsToAssociate.length
      addSuccessMessage({
        timeout: 2000,
        description: t(
          'student.declaredSkills.overlays.modals.AssociateDeclaredSkillsModal.success',
          { count }
        ),
      })
      emit('associated')
    }
  }
})

function onAssociate (ids: string[]) {
  const data: AssociationsCreationRequest = { idsToAssociate: ids }
  associateTraceWithDeclaredSkills({ traceId, data })
}
</script>

<template>
  <AssociateDeclaredSkillsModal
    :show="show"
    :skills="skills"
    :is-loading="isLoading || isPending || isTaskLoading"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
