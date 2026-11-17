<script setup lang="ts">
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { DeclaredExperienceViewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import AssociationCard from '@/features/student/associations/components/cards/AssociationCard/AssociationCard.vue'
import DeclaredExperienceTypeBadge
  from '@/features/student/personalCareer/components/badges/DeclaredExperienceTypeBadge/DeclaredExperienceTypeBadge.vue'

export interface AssociatedDeclaredExperienceCardProps extends AvInteractiveProps {
  declaredExperience: DeclaredExperienceViewDTO
}

const { declaredExperience, disabled } = defineProps<AssociatedDeclaredExperienceCardProps>()
</script>

<template>
  <AssociationCard
    :title="declaredExperience.title"
    :context-type="EAssociationContextType.DECLARED_EXPERIENCE"
    :to="{ name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name, params: { id: declaredExperience.id } }"
    :disabled="disabled"
    :disabled-tooltip
    data-testid="associated-declared-experience-card"
    :data-experience-id="declaredExperience.id"
  >
    <template #body>
      <DeclaredExperienceTypeBadge
        v-if="declaredExperience.experienceType"
        :experience-type="declaredExperience.experienceType"
      />
      <AvIconText
        v-if="declaredExperience.location"
        :icon="MDI_ICONS.MAP_MARKER_OUTLINE"
        icon-color="var(--icon)"
        :text="declaredExperience.location"
        data-testid="declared-experience-location"
      />
    </template>
  </AssociationCard>
</template>
