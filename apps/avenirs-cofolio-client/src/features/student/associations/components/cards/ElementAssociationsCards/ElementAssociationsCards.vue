<script setup lang="ts">
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { BaseApiException } from '@avenirs-esr/shared'
import type { Slot } from 'vue'
import type { AssociationsDTO, DeclaredActivityAssociationDTO, DeclaredExperienceAssociationDTO, DeclaredProgramAssociationDTO, SkillProgressAssociationDTO, TraceAssociationDTO } from '@/api/avenir-esr'
import type { AssociatedCardConfig } from '@/features/student/associations/components/cards/ElementAssociationsCards/ElementAssociationsCards.type'
import type { AssociationLimitState } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { QuerySuspense } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ASSOCIATION_TYPE_ICONS } from '@/common/associations/constants/association-type.constants'
import AssociatedActivityCard from '@/features/student/associations/components/cards/AssociatedActivityCard/AssociatedActivityCard.vue'
import AssociatedDeclaredExperienceCard from '@/features/student/associations/components/cards/AssociatedDeclaredExperienceCard/AssociatedDeclaredExperienceCard.vue'
import AssociatedDeclaredProgramCard from '@/features/student/associations/components/cards/AssociatedDeclaredProgramCard/AssociatedDeclaredProgramCard.vue'
import AssociatedSkillCard from '@/features/student/associations/components/cards/AssociatedSkillCard/AssociatedSkillCard.vue'
import AssociatedTraceCard from '@/features/student/associations/components/cards/AssociatedTraceCard/AssociatedTraceCard.vue'
import AssociationsCard from '@/features/student/associations/components/cards/AssociationsCard/AssociationsCard.vue'
import { useAssociationLimits } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { EMPTY_ASSOCIATIONS } from '@/features/student/associations/constants/associations.constants'
import {
  countAssociations,
  getAssociableContextTypes,
  getContextTypeSlug,
  isAssociationLimited
} from '@/features/student/associations/utils/associations.utils'

export interface ElementAssociationsCardsProps extends AvInteractiveProps {
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
  disabled = false,
  isLoading = false,
} = defineProps<ElementAssociationsCardsProps>()

defineSlots<{
  header?: Slot<{ getLimit: (associatedContextType: EAssociationContextType) => AssociationLimitState }>
}>()

const { t } = useI18n()
const { getLimit } = useAssociationLimits({
  contextType,
  elementId: () => elementId
})

const associableContextTypes = computed(() => getAssociableContextTypes(contextType))
const associations = computed(() => _associations ?? EMPTY_ASSOCIATIONS)
const slug = computed(() => getContextTypeSlug(contextType))

const countAll = computed(() => countAssociations(_associations, associableContextTypes.value))

const visibleContextTypes = computed(() =>
  associableContextTypes.value.filter(type => getCount(type) > 0)
)

const ASSOCIATED_CARD_CONFIG: Partial<Record<EAssociationContextType, AssociatedCardConfig>> = {
  [EAssociationContextType.TRACE]: {
    component: AssociatedTraceCard,
    getAssociations: association => association.traceAssociations,
    getCardProps: association => ({ associatedTrace: (association as TraceAssociationDTO) })
  },
  [EAssociationContextType.DECLARED_ACTIVITY]: {
    component: AssociatedActivityCard,
    getAssociations: association => association.declaredActivityAssociations,
    getCardProps: association => ({ declaredActivity: (association as DeclaredActivityAssociationDTO).declaredActivity })
  },
  [EAssociationContextType.DECLARED_SKILL]: {
    component: AssociatedSkillCard,
    getAssociations: association => association.skillProgressAssociations,
    getCardProps: association => ({ declaredSkill: (association as SkillProgressAssociationDTO).skillProgress })
  },
  [EAssociationContextType.DECLARED_EXPERIENCE]: {
    component: AssociatedDeclaredExperienceCard,
    getAssociations: association => association.declaredExperienceAssociations,
    getCardProps: association => ({ declaredExperience: (association as DeclaredExperienceAssociationDTO).declaredExperience })
  },
  [EAssociationContextType.DECLARED_PROGRAM]: {
    component: AssociatedDeclaredProgramCard,
    getAssociations: association => association.declaredProgramAssociations,
    getCardProps: association => ({ declaredProgram: (association as DeclaredProgramAssociationDTO).declaredProgram })
  }
}

function getCount (associableContextType: EAssociationContextType) {
  return countAssociations(_associations, [associableContextType])
}

function getTitle (associatedContextType: EAssociationContextType) {
  const limit = getLimit(associatedContextType).max
  const count = getCount(associatedContextType)
  return isAssociationLimited(limit)
    ? t(`student.associations.contextTypes.${associatedContextType}.associatedTitleLimited`, { count, limit })
    : t(`student.associations.contextTypes.${associatedContextType}.associatedTitle`, { count })
}
</script>

<template>
  <div
    class="av-col av-gap-xl"
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
        <AssociationsCard
          v-for="associatedContextType in visibleContextTypes"
          :key="associatedContextType"
          :title="getTitle(associatedContextType)"
          :icon="ASSOCIATION_TYPE_ICONS[associatedContextType]"
          :data-testid="`associated-${getContextTypeSlug(associatedContextType, true)}-card`"
        >
          <template v-if="ASSOCIATED_CARD_CONFIG[associatedContextType]">
            <component
              :is="ASSOCIATED_CARD_CONFIG[associatedContextType].component"
              v-for="association in ASSOCIATED_CARD_CONFIG[associatedContextType].getAssociations(associations)"
              :key="association.associationId"
              v-bind="ASSOCIATED_CARD_CONFIG[associatedContextType].getCardProps(association)"
              :disabled="disabled"
              :disabled-tooltip
            />
          </template>
        </AssociationsCard>
      </div>
    </QuerySuspense>
  </div>
</template>
