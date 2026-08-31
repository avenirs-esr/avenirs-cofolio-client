<script setup lang="ts">
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import { ICONS, ROUTES } from '@/common/constants'
import AssociationCard from '@/features/global/components/cards/AssociationCard/AssociationCard.vue'
import DeclaredExperienceTypeBadge
  from '@/features/personalCareer/components/badges/DeclaredExperienceTypeBadge/DeclaredExperienceTypeBadge.vue'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface AssociatedDeclaredExperienceCardProps {
  declaredExperience: DeclaredExperienceViewDTO
  disabled?: boolean
}

const { declaredExperience, disabled } = defineProps<AssociatedDeclaredExperienceCardProps>()
</script>

<template>
  <AssociationCard
    :title="declaredExperience.title"
    :icon="ICONS.EXPERIENCES"
    color="var(--icon)"
    hover-border-color="var(--dark-background-neutral)"
    icon-border-color="var(--other-border-skill-card)"
    background-color="var(--surface-background)"
    :to="{ name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name, params: { id: declaredExperience.id } }"
    :disabled="disabled"
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
