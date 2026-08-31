<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import {
  invalidateGetDeclaredExperience,
  invalidateGetDeclaredExperienceAssociations,
  useAssociateDeclaredExperienceWithTraces,
  useSearchTracesForAssociationWithDeclaredExperience,
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationModal } from '@/features/global'
import { AssociateTracesModal } from '@/features/traces'
import { useTraceAssociationModal } from '@/features/traces/composables/use-trace-associations/use-trace-associations'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateTracesToDeclaredExperienceModalProps {
  show: boolean
  declaredExperienceId: string
}

const { show, declaredExperienceId } = defineProps<AssociateTracesToDeclaredExperienceModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const { selectedTraceType, isAssociated } = useTraceAssociationModal()

const {
  searchQuery,
  onSearch,
  listenAndDisplayToastOnSearchError
} = useAssociationModal()

const params = computed(() => ({
  isAssociated: isAssociated.value,
  keyword: searchQuery.value.trim() || undefined,
  page: 0,
  pageSize: 20,
  type: selectedTraceType.value.itemId
}))

const {
  data,
  isError: isSearchError,
  error: searchError
} = useSearchTracesForAssociationWithDeclaredExperience(computed(() => declaredExperienceId), params, {
  query: { enabled: computed(() => show) }
})

const traces = computed(() => data.value?.data ?? [])

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: mutateAssociateDeclaredExperienceWithTraces, isPending } = useAssociateDeclaredExperienceWithTraces()

function associateExperienceWithTraces (idsToAssociate: string[]) {
  mutateAssociateDeclaredExperienceWithTraces({
    experienceId: declaredExperienceId,
    data: { idsToAssociate }
  }, {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredExperienceAssociations(queryClient, variables.experienceId),
        invalidateGetDeclaredExperience(queryClient, variables.experienceId)
      ]))

      const count = variables.data.idsToAssociate.length

      addSuccessMessage({
        timeout: 2000,
        description: t('student.traces.modals.AssociateTracesModal.success', { count }),
      })

      emit('associated')
    }
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
    @associate="associateExperienceWithTraces"
  />
</template>
