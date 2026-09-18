<script lang="ts" setup>
import {
  EAssociationContextType,
  invalidateGetAssociations,
  invalidateGetDeclaredSkillProgressDetails,
  useAssociate,
  useSearchForAssociation
} from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationModal } from '@/features/student/global'
import AssociateDeclaredExperiencesModal
  from '@/features/student/personalCareer/components/modals/AssociateDeclaredExperiencesModal/AssociateDeclaredExperiencesModal.vue'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateDeclaredExperiencesToDeclaredSkillModalProps {
  opened: boolean
  declaredSkillId: string
}

const { opened, declaredSkillId } = defineProps<AssociateDeclaredExperiencesToDeclaredSkillModalProps>()

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
  data: experiences,
  isError: isSearchError,
  error: searchError,
  isLoading: isSearchLoading
} = useSearchForAssociation(
  EAssociationContextType.DECLARED_SKILL,
  computed(() => declaredSkillId),
  EAssociationContextType.DECLARED_EXPERIENCE,
  params,
  {
    query: {
      enabled: computed(() => opened),
      select: response => response.data,
    }
  }
)

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: mutateAssociateDeclaredSkillWithDeclaredExperiences, isPending } = useAssociate()

function onAssociate (ids: string[]) {
  mutateAssociateDeclaredSkillWithDeclaredExperiences({
    contextType: EAssociationContextType.DECLARED_SKILL,
    elementId: declaredSkillId,
    associatedContextType: EAssociationContextType.DECLARED_EXPERIENCE,
    data: { idsToAssociate: ids }
  }, {
    onError: error => onAssociateMutationError(error),
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => Promise.all([
        invalidateGetDeclaredSkillProgressDetails(queryClient, variables.elementId),
        invalidateGetAssociations(queryClient, variables.contextType, variables.elementId)
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
    :opened="opened"
    :experiences="experiences ?? []"
    :is-loading="isSearchLoading || isPending || isLoading"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
