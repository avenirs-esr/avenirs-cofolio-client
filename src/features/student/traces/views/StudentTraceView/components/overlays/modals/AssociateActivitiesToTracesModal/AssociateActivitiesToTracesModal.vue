<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import type {
  AssociationActivity
} from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import {
  type AssociationsCreationRequest,
  invalidateGetTraceAssociations,
  invalidateGetTraceDetail,
  invalidateGetTracesSummary,
  invalidateSearchDeclaredActivityForAssociation,
  invalidateTracesView,
  useAssociateTraceWithActivities,
  useSearchDeclaredActivityForAssociation
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationModal } from '@/features/student/global'
import AssociateActivitiesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import { useToasterStore } from '@/store'
import { keepPreviousData, useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateActivitiesToTracesModalProps {
  show: boolean
  traceId: string
}

const { show, traceId } = defineProps<AssociateActivitiesToTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { isLoading: isTaskLoading, withTaskLoading } = useTaskLoading()
const queryClient = useQueryClient()

const {
  searchQuery,
  onSearch,
  listenAndDisplayToastOnSearchError,
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
} = useSearchDeclaredActivityForAssociation(computed(() => traceId), params, {
  query: {
    enabled: enabled.value,
    placeholderData: keepPreviousData,
  }
})

const activities = computed(() => data.value?.data || [])

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const associationActivities = computed<AssociationActivity[]>(() =>
  (activities.value).map(activity => ({
    id: activity.id,
    title: activity.title,
    thematic: activity.thematic,
    disabled: activity.disabled
  }))
)

const { mutate: associateTraceWithActivities, isPending } = useAssociateTraceWithActivities({
  mutation: {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateTracesView(queryClient, {}),
        invalidateGetTracesSummary(queryClient),
        invalidateGetTraceDetail(queryClient, traceId),
        invalidateGetTraceAssociations(queryClient, traceId),
        invalidateSearchDeclaredActivityForAssociation(queryClient, traceId, params.value)
      ]))
      const count = variables.data.idsToAssociate.length
      addSuccessMessage({
        timeout: 2000,
        description: t(
          'student.traces.views.StudentTraceView.AssociateActivitiesModal.success',
          { count }
        ),
      })
      emit('associated')
    }
  }
})

function onAssociate (ids: string[]) {
  const data: AssociationsCreationRequest = { idsToAssociate: ids }
  associateTraceWithActivities({ traceId, data })
}
</script>

<template>
  <AssociateActivitiesModal
    :show="show"
    :activities="associationActivities"
    :is-loading="isLoading || isPending || isTaskLoading"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
