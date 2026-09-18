<script lang="ts" setup>
import {
  EAssociationContextType,
  invalidateGetAssociations,
  type SearchForAssociationParams,
  useAssociate,
  useSearchForAssociation
} from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { AssociateDeclaredSkillsModal } from '@/features/student/declaredSkills'
import { useAssociationModal } from '@/features/student/global'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface AssociateDeclaredSkillsToActivityModalProps {
  opened: boolean
  activityId: string
}

const { opened, activityId } = defineProps<AssociateDeclaredSkillsToActivityModalProps>()

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

const params = computed<SearchForAssociationParams>(() => ({
  keyword: searchQuery.value.trim() || undefined,
  page: 0,
  pageSize: 100,
}))

const {
  data: skills,
  isError: isSearchError,
  error: searchError,
  isLoading: isSearchLoading
} = useSearchForAssociation(
  EAssociationContextType.DECLARED_ACTIVITY,
  computed(() => activityId),
  EAssociationContextType.DECLARED_SKILL,
  params,
  { query: { select: response => response.data } }
)

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: mutateAssociateActivityWithDeclaredSkills, isPending } = useAssociate()

function associateActivityWithDeclaredSkills (idsToAssociate: string[]) {
  mutateAssociateActivityWithDeclaredSkills({
    contextType: EAssociationContextType.DECLARED_ACTIVITY,
    elementId: activityId,
    associatedContextType: EAssociationContextType.DECLARED_SKILL,
    data: { idsToAssociate }
  }, {
    onError: error => onAssociateMutationError(error),
    onSuccess: async (_, variables) => {
      await withTaskLoading(() => invalidateGetAssociations(queryClient, EAssociationContextType.DECLARED_ACTIVITY, activityId))
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
    :opened="opened"
    :skills="skills ?? []"
    :is-loading="isSearchLoading || isPending || isLoading"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="associateActivityWithDeclaredSkills"
  />
</template>
