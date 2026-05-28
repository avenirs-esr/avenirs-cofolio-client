<script lang="ts" setup>
import type { AssociationDeclaredExperiences } from '@/features/student/personalCareer/components/modals/AssociateDeclaredExperiencesModal/AssociateDeclaredExperiencesModal.vue'
import {
  useAssociateTraceWithDeclaredExperiences,
  useSearchDeclaredExperiencesForAssociation,
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useAssociationModal } from '@/features/student/global'
import AssociateDeclaredExperiencesModal
  from '@/features/student/personalCareer/components/modals/AssociateDeclaredExperiencesModal/AssociateDeclaredExperiencesModal.vue'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface AssociateDeclaredExperiencesToTracesModalProps {
  show: boolean
  traceId: string
}

const { show, traceId } = defineProps<AssociateDeclaredExperiencesToTracesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()

const {
  searchQuery,
  onSearch,
  listenAndDisplayToastOnSearchError,
} = useAssociationModal()

const params = computed(() => ({
  keyword: searchQuery.value.trim() || undefined,
  page: 0,
  pageSize: 100,
}))

const { data: associationExperiences, isError: isSearchError, error: searchError, isPending: isLoading } = useSearchDeclaredExperiencesForAssociation(params, {
  query: {
    select: (response): AssociationDeclaredExperiences[] => response.data.map(experience => ({
      id: experience.id,
      title: experience.title,
      experienceType: experience.experienceType,
      disabled: experience.disabled
    }))
  }
})

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: associateTraceWithDeclaredExperiences, isPending } = useAssociateTraceWithDeclaredExperiences()

function onAssociate (ids: string[]) {
  associateTraceWithDeclaredExperiences({
    traceId,
    data: { idsToAssociate: ids }
  }, {
    onError: (error) => {
      addErrorMessage({
        title: t('global.error.generic'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: (_, variables) => {
      const count = variables.data.idsToAssociate.length
      addSuccessMessage({
        timeout: 2000,
        description: t(
          'student.personalCareer.overlays.AssociateDeclaredExperiencesModal.success',
          { count }
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
    :experiences="associationExperiences ?? []"
    :is-loading="isLoading || isPending"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
