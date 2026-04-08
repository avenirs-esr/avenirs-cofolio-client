<script lang="ts" setup>
import type { AssociationsCreationRequest } from '@/api/avenir-esr'
import { AssociateDeclaredSkillsModal } from '@/features/student/declaredSkills'
import { useAssociationModal } from '@/features/student/global'
import {
  useAssociateTraceWithDeclaredSkillsMutation,
  useSearchDeclaredSkillsForAssociationWithTraceQuery
} from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useToasterStore } from '@/store'
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

const {
  searchQuery,
  onSearch,
  listenAndDisplayToastOnSearchError,
  onAssociateMutationError
} = useAssociationModal()

const {
  skills,
  isError: isSearchError,
  error: searchError,
  isLoading
} = useSearchDeclaredSkillsForAssociationWithTraceQuery({
  traceId: computed(() => traceId),
  params: computed(() => ({
    keyword: searchQuery.value.trim() || undefined,
    page: 0,
    pageSize: 100,
  }))
})

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: associateTraceWithDeclaredSkills, isPending } = useAssociateTraceWithDeclaredSkillsMutation({
  onError: error => onAssociateMutationError(error),
  onSuccess: (_, variables) => {
    const count = variables.associationsCreationRequest.idsToAssociate.length
    addSuccessMessage({
      timeout: 2000,
      description: t(
        'student.declaredSkills.overlays.modals.AssociateDeclaredSkillsModal.success',
        { count }
      ),
    })
    emit('associated')
  }
})

function onAssociate (ids: string[]) {
  const associationsCreationRequest: AssociationsCreationRequest = {
    idsToAssociate: ids,
  }
  associateTraceWithDeclaredSkills({ traceId, associationsCreationRequest })
}
</script>

<template>
  <AssociateDeclaredSkillsModal
    :show="show"
    :skills="skills"
    :is-loading="isLoading || isPending"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
