<script lang="ts" setup>
import type { AssociationsCreationRequest } from '@/api/avenir-esr'
import {
  useAssociateActivityWithDeclaredSkillsMutation,
  useSearchDeclaredSkillsForAssociationWithActivityQuery
} from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { AssociateDeclaredSkillsModal } from '@/features/student/declaredSkills'
import { useAssociationModal } from '@/features/student/global'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface AssociateDeclaredSkillsToActivityModalProps {
  show: boolean
  activityId: string
}

const { show, activityId } = defineProps<AssociateDeclaredSkillsToActivityModalProps>()

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
} = useSearchDeclaredSkillsForAssociationWithActivityQuery({
  activityId: computed(() => activityId),
  params: computed(() => ({
    keyword: searchQuery.value.trim() || undefined,
    page: 0,
    pageSize: 100,
  }))
})

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: associateActivityWithDeclaredSkills, isPending } = useAssociateActivityWithDeclaredSkillsMutation({
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
  associateActivityWithDeclaredSkills({ activityId, associationsCreationRequest })
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
