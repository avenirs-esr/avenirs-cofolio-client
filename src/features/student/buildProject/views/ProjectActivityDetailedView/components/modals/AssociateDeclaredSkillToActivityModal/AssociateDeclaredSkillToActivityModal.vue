<script lang="ts" setup>
import { invalidateGetDeclaredActivityAssociations, type SearchDeclaredSkillForAssociationParams, useAssociateActivityWithDeclaredSkills, useSearchDeclaredSkillsForAssociation } from '@/api/avenir-esr'
import { AssociateDeclaredSkillsModal } from '@/features/student/declaredSkills'
import { useAssociationModal } from '@/features/student/global'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
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
const queryClient = useQueryClient()

const {
  searchQuery,
  onSearch,
  listenAndDisplayToastOnSearchError,
  onAssociateMutationError
} = useAssociationModal()

const params = computed<SearchDeclaredSkillForAssociationParams>(() => ({
  keyword: searchQuery.value.trim() || undefined,
  page: 0,
  pageSize: 100,
}))

const {
  data,
  isError: isSearchError,
  error: searchError,
  isLoading
} = useSearchDeclaredSkillsForAssociation(activityId, params)

const skills = computed(() => data.value?.data ?? [])

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: mutateAssociateActivityWithDeclaredSkills, isPending } = useAssociateActivityWithDeclaredSkills()

function associateActivityWithDeclaredSkills (idsToAssociate: string[]) {
  mutateAssociateActivityWithDeclaredSkills({ declaredActivityId: activityId, data: { idsToAssociate } }, {
    onError: error => onAssociateMutationError(error),
    onSuccess: async (_, variables) => {
      await invalidateGetDeclaredActivityAssociations(queryClient, activityId)
      const count = variables.data.idsToAssociate.length
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
}
</script>

<template>
  <AssociateDeclaredSkillsModal
    :show="show"
    :skills="skills"
    :is-loading="isLoading || isPending"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="associateActivityWithDeclaredSkills"
  />
</template>
