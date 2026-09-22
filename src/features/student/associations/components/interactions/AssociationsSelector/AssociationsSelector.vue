<script setup lang="ts">
import type { AssociationsDTO, DeclaredActivityViewDTO, DeclaredExperienceViewDTO, DeclaredSkillProgressDTO } from '@/api/avenir-esr'
import type { CompactCardSelectorProps } from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import { EAssociationContextType } from '@/api/avenir-esr'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import { isDeletableDeclaredActivityAssociation } from '@/common/activities/rules/activities.rules'
import { ASSOCIATION_TYPE_ICONS } from '@/common/associations/constants/association-type.constants'
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import DeclaredExperienceTypeBadge
  from '@/features/student/personalCareer/components/badges/DeclaredExperienceTypeBadge/DeclaredExperienceTypeBadge.vue'
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociationsSelectorProps {
  associatedContextType: EAssociationContextType
  associations: AssociationsDTO
  readonly?: boolean
}

defineOptions({
  inheritAttrs: false
})

const { associatedContextType, associations, readonly = false } = defineProps<AssociationsSelectorProps>()

const selectedAssociationIds = defineModel<string[]>({ default: [] })

const { t } = useI18n()

const selectableElements = computed<CompactCardSelectorProps['elements']>(() => {
  switch (associatedContextType) {
    case EAssociationContextType.TRACE:
      return associations.traceAssociations.map(({ associationId, trace }) => ({
        id: associationId,
        title: trace.title
      }))
    case EAssociationContextType.DECLARED_ACTIVITY:
      return associations.declaredActivityAssociations.map(association => ({
        id: association.associationId,
        title: association.declaredActivity.title,
        baseElement: association.declaredActivity,
        showSlot: true,
        disabled: !isDeletableDeclaredActivityAssociation(association)
      }))
    case EAssociationContextType.DECLARED_SKILL:
      return associations.declaredSkillAssociations.map(({ associationId, declaredSkill }) => ({
        id: associationId,
        title: declaredSkill.title,
        baseElement: declaredSkill,
        showSlot: true
      }))
    case EAssociationContextType.DECLARED_EXPERIENCE:
      return associations.declaredExperienceAssociations.map(({ associationId, declaredExperience }) => ({
        id: associationId,
        title: declaredExperience.title,
        baseElement: declaredExperience,
        showSlot: !!declaredExperience.experienceType
      }))
    default:
      return []
  }
})

const isLight = computed(() => associatedContextType === EAssociationContextType.DECLARED_ACTIVITY)
</script>

<template>
  <CompactCardSelector
    v-model="selectedAssociationIds"
    :elements="selectableElements"
    :icon="ASSOCIATION_TYPE_ICONS[associatedContextType]"
    :icon-color="isLight ? 'var(--icon)' : undefined"
    :background-color="isLight ? 'var(--surface-background)' : undefined"
    :readonly="readonly"
    data-testid="associations-selector"
  >
    <template #default="{ element }">
      <DeclaredActivityStatusBadge
        v-if="associatedContextType === EAssociationContextType.DECLARED_ACTIVITY"
        :status="(element as DeclaredActivityViewDTO).status"
      />
      <AvBadge
        v-else-if="associatedContextType === EAssociationContextType.DECLARED_SKILL"
        :label="t(`student.declaredSkills.declaredSkillTypes.${(element as DeclaredSkillProgressDTO).type}`)"
        color="var(--text1)"
        border-color="var(--other-border-skill-card)"
        background-color="var(--surface-background)"
        :icon="MDI_ICONS.BOOKMARK_CHECK"
        small
        ellipsis
      />
      <DeclaredExperienceTypeBadge
        v-else-if="associatedContextType === EAssociationContextType.DECLARED_EXPERIENCE"
        :experience-type="(element as DeclaredExperienceViewDTO).experienceType!"
      />
    </template>
  </CompactCardSelector>
</template>
