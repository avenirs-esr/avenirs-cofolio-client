<script lang="ts" setup>
import type { AssociationsCreationRequest } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import type {
  AssociationActivity
} from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useAssociationModal } from '@/features/student/global'
import {
  useAssociateTraceWithActivitiesMutation,
  useSearchActivitiesForAssociationQuery
} from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import AssociateActivitiesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import { useToasterStore } from '@/store'
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

const {
  searchQuery,
  onSearch,
  listenAndDisplayToastOnSearchError,
} = useAssociationModal()

const {
  activities,
  isError: isSearchError,
  error: searchError,
  isLoading
} = useSearchActivitiesForAssociationQuery({
  traceId: computed(() => traceId),
  params: computed(() => ({
    keyword: searchQuery.value.trim() || undefined,
    page: 0,
    pageSize: 100,
  }))
})

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const associationActivities = computed<AssociationActivity[]>(() =>
  activities.value.map(activity => ({
    id: activity.id,
    title: activity.title,
    thematic: activity.thematic,
    disabled: activity.disabled
  }))
)

const { mutate: associateTraceWithActivities, isPending } = useAssociateTraceWithActivitiesMutation({
  onError: (error: BaseApiException) => {
    addErrorMessage({
      title: t('global.error.generic'),
      description: getErrorMessage(error),
    })
  },
  onSuccess: (_, variables) => {
    const count = variables.associationsCreationRequest.idsToAssociate.length

    addSuccessMessage({
      timeout: 2000,
      description: t(
        'student.traces.views.StudentTraceView.AssociateActivitiesModal.success',
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

  associateTraceWithActivities({
    traceId,
    associationsCreationRequest
  })
}
</script>

<template>
  <AssociateActivitiesModal
    :show="show"
    :activities="associationActivities"
    :is-loading="isLoading || isPending"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
