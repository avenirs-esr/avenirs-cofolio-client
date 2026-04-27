<script lang="ts" setup>
import type {
  AssociationActivity
} from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import {
  type AssociationsCreationRequest,
  EAssociationContextType,
  invalidateGetDeclaredSkillProgressDetails,
  invalidateGetDeclaredSkillWithDeclaredActivities,
  invalidateSearchDeclaredActivitiesForAssociation,
  useAssociateDeclaredSkillWithDeclaredActivities,
  useSearchDeclaredActivitiesForAssociation
} from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationModal } from '@/features/student/global'
import AssociateActivitiesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateActivitiesToDeclaredSkillModalProps {
  show: boolean
  declaredSkillId: string
}

const { show, declaredSkillId } = defineProps<AssociateActivitiesToDeclaredSkillModalProps>()

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
  excludeAssociatedWithElementId: declaredSkillId,
  contextType: EAssociationContextType.DECLARED_SKILL,
  keyword: searchQuery.value.trim() || undefined,
  page: 0,
  pageSize: 100,
}))

const {
  data: activities,
  isError: isSearchError,
  error: searchError,
  isLoading: isSearchLoading
} = useSearchDeclaredActivitiesForAssociation(params, {
  query: {
    select: response => response.data,
  }
})

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const associationActivities = computed<AssociationActivity[]>(() => activities.value
  ? (activities.value).map(activity => ({
      id: activity.id,
      title: activity.title,
      thematic: activity.thematic,
      disabled: activity.disabled
    }))
  : []
)

const { mutate: mutateAssociateDeclaredSkillWithDeclaredActivities, isPending } = useAssociateDeclaredSkillWithDeclaredActivities()

function associateDeclaredSkillWithActivities (data: AssociationsCreationRequest) {
  mutateAssociateDeclaredSkillWithDeclaredActivities({
    declaredSkillProgressId: declaredSkillId,
    data
  }, {
    onError: error => onAssociateMutationError(error),
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredSkillProgressDetails(queryClient, variables.declaredSkillProgressId),
        invalidateSearchDeclaredActivitiesForAssociation(queryClient),
        invalidateGetDeclaredSkillWithDeclaredActivities(queryClient, variables.declaredSkillProgressId)
      ]))

      addSuccessMessage({
        timeout: 2000,
        description: t(
          'student.traces.views.StudentTraceView.AssociateActivitiesModal.success',
          { count: variables.data.idsToAssociate.length }
        ),
      })

      emit('associated')
    }
  })
}

function onAssociate (ids: string[]) {
  const associationsCreationRequest: AssociationsCreationRequest = {
    idsToAssociate: ids,
  }

  associateDeclaredSkillWithActivities(associationsCreationRequest)
}
</script>

<template>
  <AssociateActivitiesModal
    :show="show"
    :activities="associationActivities"
    :is-loading="isSearchLoading || isPending || isLoading"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
