<script lang="ts" setup>
import type {
  AssociationActivity
} from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import {
  type AssociationsCreationRequest,
  invalidateGetDeclaredSkillProgressDetails,
  invalidateGetDeclaredSkillWithDeclaredActivities,
  invalidateSearchDeclaredSkillForAssociation,
  useAssociateDeclaredSkillWithDeclaredActivities,
  useSearchDeclaredActivityForAssociation1
} from '@/api/avenir-esr'
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
  isLoading
} = useSearchDeclaredActivityForAssociation1(declaredSkillId, params)

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const associationActivities = computed<AssociationActivity[]>(() => activities.value
  ? (activities.value.data).map(activity => ({
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
      await invalidateGetDeclaredSkillProgressDetails(queryClient, variables.declaredSkillProgressId)
      await invalidateSearchDeclaredSkillForAssociation(queryClient, variables.declaredSkillProgressId)
      await invalidateGetDeclaredSkillWithDeclaredActivities(queryClient, variables.declaredSkillProgressId)

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
    :is-loading="isLoading || isPending"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
