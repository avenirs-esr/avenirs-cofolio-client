<script lang="ts" setup>
import {
  EAssociationContextType,
  invalidateGetDeclaredSkillAssociations,
  invalidateGetDeclaredSkillProgressDetails,
  useAssociateDeclaredSkillWithDeclaredExperiences,
  useSearchDeclaredExperiencesForAssociation,
} from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationModal } from '@/features/student/global'
import AssociateDeclaredExperiencesModal
  from '@/features/student/personalCareer/components/modals/AssociateDeclaredExperiencesModal/AssociateDeclaredExperiencesModal.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateDeclaredExperiencesToDeclaredSkillModalProps {
  show: boolean
  declaredSkillId: string
}

const { show, declaredSkillId } = defineProps<AssociateDeclaredExperiencesToDeclaredSkillModalProps>()

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
  contextType: EAssociationContextType.DECLARED_SKILL,
  excludeAssociatedWithElementId: declaredSkillId,
  keyword: searchQuery.value.trim() || undefined,
  page: 0,
  pageSize: 100,
}))

const {
  data: experiences,
  isError: isSearchError,
  error: searchError,
  isLoading: isSearchLoading
} = useSearchDeclaredExperiencesForAssociation(params, {
  query: {
    enabled: computed(() => show),
    select: response => response.data,
  }
})

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: mutateAssociateDeclaredSkillWithDeclaredExperiences, isPending } = useAssociateDeclaredSkillWithDeclaredExperiences()

function onAssociate (ids: string[]) {
  mutateAssociateDeclaredSkillWithDeclaredExperiences({
    declaredSkillProgressId: declaredSkillId,
    data: { idsToAssociate: ids }
  }, {
    onError: error => onAssociateMutationError(error),
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredSkillProgressDetails(queryClient, variables.declaredSkillProgressId),
        invalidateGetDeclaredSkillAssociations(queryClient, variables.declaredSkillProgressId)
      ]))

      addSuccessMessage({
        description: t(
          'student.personalCareer.overlays.AssociateDeclaredExperiencesModal.success',
          { count: variables.data.idsToAssociate.length }
        ),
      })

      emit('associated')
    }
  })
}
</script>

<template>
  <AssociateDeclaredExperiencesModal
    :show="show"
    :experiences="experiences ?? []"
    :is-loading="isSearchLoading || isPending || isLoading"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
