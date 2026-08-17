<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import {
  invalidateGetDeclaredActivityAssociations,
  useAssociateActivityWithTraces,
  useSearchTracesForAssociationWithDeclaredActivity,
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationModal } from '@/features/student/global'
import { AssociateTracesModal } from '@/features/student/traces'
import { useTraceAssociationModal } from '@/features/student/traces/composables/use-trace-associations/use-trace-associations'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateTracesToDeclaredActivityProps {
  show: boolean
  declaredActivityId: string
}

const { show, declaredActivityId } = defineProps<AssociateTracesToDeclaredActivityProps>()

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
} = useSearchTracesForAssociationWithDeclaredActivity(computed(() => declaredActivityId), params, {
  query: { enabled: computed(() => show) }
})

const traces = computed(() => data.value?.data ?? [])

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: mutateAssociateActivityWithTraces, isPending } = useAssociateActivityWithTraces()

function associateActivityWithTraces (idsToAssociate: string[]) {
  mutateAssociateActivityWithTraces({
    declaredActivityId,
    data: { idsToAssociate }
  }, {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => invalidateGetDeclaredActivityAssociations(queryClient, declaredActivityId))

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
    @associate="associateActivityWithTraces"
  />
</template>
