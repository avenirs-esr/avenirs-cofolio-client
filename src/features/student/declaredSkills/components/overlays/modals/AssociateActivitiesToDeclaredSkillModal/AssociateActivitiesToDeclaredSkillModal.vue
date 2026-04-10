<script lang="ts" setup>
import type { AssociationsCreationRequest } from '@/api/avenir-esr'
import type {
  AssociationActivity
} from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import {
  useAssociateDeclaredSkillWithActivitiesMutation,
  useSearchActivitiesForAssociationWithDeclaredSkillQuery
} from '@/features/student/declaredSkills/queries/use-declared-skills.query/use-declared-skills.query'
import { useAssociationModal } from '@/features/student/global'
import AssociateActivitiesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import { useToasterStore } from '@/store'
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

const {
  searchQuery,
  onSearch,
  listenAndDisplayToastOnSearchError,
  onAssociateMutationError
} = useAssociationModal()

const {
  activities,
  isError: isSearchError,
  error: searchError,
  isLoading
} = useSearchActivitiesForAssociationWithDeclaredSkillQuery({
  declaredSkillId: computed(() => declaredSkillId),
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

const { mutate: associateDeclaredSkillWithActivities, isPending } = useAssociateDeclaredSkillWithActivitiesMutation({
  onError: error => onAssociateMutationError(error),
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

  associateDeclaredSkillWithActivities({
    declaredSkillProgressId: declaredSkillId,
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
