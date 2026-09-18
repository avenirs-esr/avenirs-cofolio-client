<script lang="ts" setup>
import {
  EAssociationContextType,
  useAssociate,
  useSearchForAssociation
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useAssociationModal } from '@/features/student/global'
import AssociateDeclaredExperiencesModal
  from '@/features/student/personalCareer/components/modals/AssociateDeclaredExperiencesModal/AssociateDeclaredExperiencesModal.vue'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export interface AssociateDeclaredExperiencesToTracesModalProps {
  opened: boolean
  traceId: string
}

const { traceId } = defineProps<AssociateDeclaredExperiencesToTracesModalProps>()

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

const { data: associationExperiences, isError: isSearchError, error: searchError, isPending: isLoading } = useSearchForAssociation(
  EAssociationContextType.TRACE,
  computed(() => traceId),
  EAssociationContextType.DECLARED_EXPERIENCE,
  params,
  {
    query: {
      select: response => response.data
    }
  }
)

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const { mutate: associateTraceWithDeclaredExperiences, isPending } = useAssociate()

function onAssociate (ids: string[]) {
  associateTraceWithDeclaredExperiences({
    contextType: EAssociationContextType.TRACE,
    elementId: traceId,
    associatedContextType: EAssociationContextType.DECLARED_EXPERIENCE,
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
    :opened="opened"
    :experiences="associationExperiences ?? []"
    :is-loading="isLoading || isPending"
    @cancel="emit('cancel')"
    @search="onSearch"
    @associate="onAssociate"
  />
</template>
