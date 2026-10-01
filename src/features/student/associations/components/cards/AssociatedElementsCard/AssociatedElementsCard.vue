<script setup lang="ts">
import type { AssociationsDTO } from '@/api/avenir-esr'
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ASSOCIATION_TYPE_ICONS } from '@/common/associations/constants/association-type.constants'
import AssociatedActivityCard from '@/features/student/associations/components/cards/AssociatedActivityCard/AssociatedActivityCard.vue'
import AssociatedDeclaredExperienceCard
  from '@/features/student/associations/components/cards/AssociatedDeclaredExperienceCard/AssociatedDeclaredExperienceCard.vue'
import AssociatedDeclaredProgramCard
  from '@/features/student/associations/components/cards/AssociatedDeclaredProgramCard/AssociatedDeclaredProgramCard.vue'
import AssociatedSkillCard from '@/features/student/associations/components/cards/AssociatedSkillCard/AssociatedSkillCard.vue'
import AssociatedTraceCard from '@/features/student/associations/components/cards/AssociatedTraceCard/AssociatedTraceCard.vue'
import AssociationsCard from '@/features/student/associations/components/cards/AssociationsCard/AssociationsCard.vue'
import { countAssociations, getContextTypeSlug, isAssociationLimited } from '@/features/student/associations/utils/associations.utils'
import { useI18n } from 'vue-i18n'

export interface AssociatedElementsCardProps extends AvInteractiveProps {
  associatedContextType: EAssociationContextType
  associations: AssociationsDTO
  limit?: number
}

const { associatedContextType, associations, limit, disabled = false } = defineProps<AssociatedElementsCardProps>()

const { t } = useI18n()

const count = computed(() => countAssociations(associations, [associatedContextType]))

const title = computed(() => isAssociationLimited(limit)
  ? t(`student.associations.contextTypes.${associatedContextType}.associatedTitleLimited`, { count: count.value, limit })
  : t(`student.associations.contextTypes.${associatedContextType}.associatedTitle`, { count: count.value }))
</script>

<template>
  <AssociationsCard
    v-if="count > 0"
    :title
    :icon="ASSOCIATION_TYPE_ICONS[associatedContextType]"
    :data-testid="`associated-${getContextTypeSlug(associatedContextType, true)}-card`"
  >
    <template v-if="associatedContextType === EAssociationContextType.TRACE">
      <AssociatedTraceCard
        v-for="association in associations.traceAssociations"
        :key="association.associationId"
        :associated-trace="association"
        :disabled="disabled"
        :disabled-tooltip
      />
    </template>
    <template v-else-if="associatedContextType === EAssociationContextType.DECLARED_ACTIVITY">
      <AssociatedActivityCard
        v-for="association in associations.declaredActivityAssociations"
        :key="association.associationId"
        :declared-activity="association.declaredActivity"
        :disabled="disabled"
        :disabled-tooltip
      />
    </template>
    <template v-else-if="associatedContextType === EAssociationContextType.DECLARED_SKILL">
      <AssociatedSkillCard
        v-for="association in associations.declaredSkillAssociations"
        :key="association.associationId"
        :declared-skill="association.declaredSkill"
        :disabled="disabled"
        :disabled-tooltip
      />
    </template>
    <template v-else-if="associatedContextType === EAssociationContextType.DECLARED_EXPERIENCE">
      <AssociatedDeclaredExperienceCard
        v-for="association in associations.declaredExperienceAssociations"
        :key="association.associationId"
        :declared-experience="association.declaredExperience"
        :disabled="disabled"
        :disabled-tooltip
      />
    </template>
    <template v-else-if="associatedContextType === EAssociationContextType.DECLARED_PROGRAM">
      <AssociatedDeclaredProgramCard
        v-for="association in associations.declaredProgramAssociations"
        :key="association.associationId"
        :declared-program="association.declaredProgram"
        :disabled="disabled"
        :disabled-tooltip
      />
    </template>
  </AssociationsCard>
</template>
