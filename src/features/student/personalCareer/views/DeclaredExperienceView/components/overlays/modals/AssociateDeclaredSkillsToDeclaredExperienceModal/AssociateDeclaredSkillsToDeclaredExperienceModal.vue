<script lang="ts" setup>
import {
  EAssociationContextType,
  invalidateGetAssociations,
  invalidateGetDeclaredExperience,
  useAssociate,
  useSearchForAssociation
} from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { AssociateDeclaredSkillsModal } from '@/features/student/declaredSkills'
import { useAssociationModal } from '@/features/student/global'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateDeclaredSkillsToDeclaredExperienceModalProps {
  opened: boolean
  declaredExperienceId: string
}

const { opened, declaredExperienceId } = defineProps<AssociateDeclaredSkillsToDeclaredExperienceModalProps>()

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
  pageSize: 20
}))

const {
  data,
  isError: isSearchError,
  error: searchError
} = useSearchForAssociation(
  EAssociationContextType.DECLARED_EXPERIENCE,
  computed(() => declaredExperienceId),
  EAssociationContextType.DECLARED_SKILL,
  params,
  {
    query: { enabled: computed(() => opened) }
  }
)

const skills = computed(() => data.value?.data ?? [])

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: mutateAssociateDeclaredExperienceWithDeclaredSkills, isPending } = useAssociate({
  mutation: {
    onError: error => onAssociateMutationError(error),
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateGetAssociations(queryClient, EAssociationContextType.DECLARED_EXPERIENCE, declaredExperienceId),
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
  mutateAssociateDeclaredExperienceWithDeclaredSkills({
    contextType: EAssociationContextType.DECLARED_EXPERIENCE,
    elementId: declaredExperienceId,
    associatedContextType: EAssociationContextType.DECLARED_SKILL,
    data: { idsToAssociate }
  })
}
</script>

<template>
  <AssociateDeclaredSkillsModal
    :opened="opened"
    :skills="skills"
    :is-loading="isPending || isLoading"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
