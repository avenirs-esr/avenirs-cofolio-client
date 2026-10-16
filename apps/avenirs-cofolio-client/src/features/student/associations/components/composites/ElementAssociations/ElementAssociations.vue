<script setup lang="ts">
import type { Slot } from 'vue'
import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { AssociationLimitState } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { useI18n } from 'vue-i18n'
import { QuerySuspense } from '@/common/components'
import AssociatedElementsCard from '@/features/student/associations/components/cards/AssociatedElementsCard/AssociatedElementsCard.vue'
import { useAssociationLimits } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { EMPTY_ASSOCIATIONS } from '@/features/student/associations/constants/associations.constants'
import {
  countAssociations,
  getAssociableContextTypes,
  getContextTypeSlug
} from '@/features/student/associations/utils/associations.utils'

export interface ElementAssociationsProps {
  /** Context type of the element whose associations are displayed. */
  contextType: EAssociationContextType
  elementId: string
  associations: AssociationsDTO | undefined
  error?: BaseApiException | null
  isLoading?: boolean
}

const {
  contextType,
  elementId,
  associations: _associations,
  error,
  isLoading = false,
} = defineProps<ElementAssociationsProps>()

defineSlots<{
  /** Displayed above the associated elements. */
  header?: Slot<{ getLimit: (associatedContextType: EAssociationContextType) => AssociationLimitState }>
}>()

const { t } = useI18n()

const associableContextTypes = computed(() => getAssociableContextTypes(contextType))
const associations = computed(() => _associations ?? EMPTY_ASSOCIATIONS)
const slug = computed(() => getContextTypeSlug(contextType))

const countAll = computed(() => countAssociations(_associations, associableContextTypes.value))

const { getLimit } = useAssociationLimits({
  contextType,
  elementId: () => elementId
})
</script>

<template>
  <div
    class="av-col av-gap-xl av-pt-xl"
    :data-testid="`${slug}-associations`"
  >
    <slot
      name="header"
      :get-limit="getLimit"
    />
    <QuerySuspense
      :error="error"
      :error-title="t(`student.associations.contextTypes.${contextType}.fetchAssociationsError`)"
      :empty-state-message="t(`student.associations.contextTypes.${contextType}.emptyAssociations`)"
      :is-empty="countAll === 0"
      :is-loading="isLoading"
    >
      <div class="av-col av-gap-md">
        <AssociatedElementsCard
          v-for="associatedContextType in associableContextTypes"
          :key="associatedContextType"
          :associated-context-type
          :associations
          :limit="getLimit(associatedContextType).max"
        />
      </div>
    </QuerySuspense>
  </div>
</template>
