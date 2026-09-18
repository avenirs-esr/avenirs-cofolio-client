<script lang="ts" setup>
import {
  type AssociationsCreationRequest,
  EAssociationContextType,
  invalidateGetAssociations,
  invalidateGetDeclaredSkillProgressDetails,
  invalidateSearchForAssociation,
  useAssociate,
  useSearchForAssociation
} from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationModal } from '@/features/student/global'
import AssociateActivitiesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateActivitiesToDeclaredSkillModalProps {
  opened: boolean
  declaredSkillId: string
}

const { declaredSkillId } = defineProps<AssociateActivitiesToDeclaredSkillModalProps>()

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
  pageSize: 100,
}))

const {
  data: activities,
  isError: isSearchError,
  error: searchError,
  isLoading: isSearchLoading
} = useSearchForAssociation(
  EAssociationContextType.DECLARED_SKILL,
  computed(() => declaredSkillId),
  EAssociationContextType.DECLARED_ACTIVITY,
  params,
  {
    query: {
      select: response => response.data,
    }
  }
)

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: mutateAssociateDeclaredSkillWithDeclaredActivities, isPending } = useAssociate()

function associateDeclaredSkillWithActivities (data: AssociationsCreationRequest) {
  mutateAssociateDeclaredSkillWithDeclaredActivities({
    contextType: EAssociationContextType.DECLARED_SKILL,
    elementId: declaredSkillId,
    associatedContextType: EAssociationContextType.DECLARED_ACTIVITY,
    data
  }, {
    onError: error => onAssociateMutationError(error),
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredSkillProgressDetails(queryClient, variables.elementId),
        invalidateSearchForAssociation(queryClient, variables.contextType, variables.elementId, variables.associatedContextType),
        invalidateGetAssociations(queryClient, variables.contextType, variables.elementId)
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
    :opened="opened"
    :activities="activities ?? []"
    :is-loading="isSearchLoading || isPending || isLoading"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
