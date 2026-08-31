<script lang="ts" setup>
import {
  EAssociationContextType,
  invalidateGetDeclaredExperience,
  invalidateGetDeclaredExperienceAssociations,
  useAssociateDeclaredExperienceWithDeclaredSkills,
  useSearchDeclaredSkillsForAssociation,
} from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { AssociateDeclaredSkillsModal } from '@/features/declaredSkills'
import { useAssociationModal } from '@/features/global'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateDeclaredSkillsToDeclaredExperienceModalProps {
  show: boolean
  declaredExperienceId: string
}

const { show, declaredExperienceId } = defineProps<AssociateDeclaredSkillsToDeclaredExperienceModalProps>()

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
  contextType: EAssociationContextType.DECLARED_EXPERIENCE,
  excludeAssociatedWithElementId: declaredExperienceId,
  keyword: searchQuery.value.trim() || undefined,
  page: 0,
  pageSize: 20
}))

const {
  data,
  isError: isSearchError,
  error: searchError
} = useSearchDeclaredSkillsForAssociation(params, {
  query: { enabled: computed(() => show) }
})

const skills = computed(() => data.value?.data ?? [])

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: mutateAssociateDeclaredExperienceWithDeclaredSkills, isPending } = useAssociateDeclaredExperienceWithDeclaredSkills({
  mutation: {
    onError: error => onAssociateMutationError(error),
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredExperienceAssociations(queryClient, declaredExperienceId),
        invalidateGetDeclaredExperience(queryClient, declaredExperienceId)
      ]))

      const count = variables.data.idsToAssociate.length

      addSuccessMessage({
        timeout: 2000,
        description: t('student.declaredSkills.overlays.modals.AssociateDeclaredSkillsModal.success', { count }),
      })

      emit('associated')
    }
  }
})

function onAssociate (idsToAssociate: string[]) {
  mutateAssociateDeclaredExperienceWithDeclaredSkills({ experienceId: declaredExperienceId, data: { idsToAssociate } })
}
</script>

<template>
  <AssociateDeclaredSkillsModal
    :show="show"
    :skills="skills"
    :is-loading="isPending || isLoading"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
