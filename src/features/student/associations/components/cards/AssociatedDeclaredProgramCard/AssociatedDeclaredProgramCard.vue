<script setup lang="ts">
import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import { ICONS, ROUTES } from '@/common/constants'
import AssociationCard from '@/features/student/associations/components/cards/AssociationCard/AssociationCard.vue'
import DeclaredProgramOrganizationBadge
  from '@/features/student/personalCareer/components/badges/DeclaredProgramOrganizationBadge/DeclaredProgramOrganizationBadge.vue'
import DeclaredProgramStatusBadge
  from '@/features/student/personalCareer/components/badges/DeclaredProgramStatusBadge/DeclaredProgramStatusBadge.vue'

export interface AssociatedDeclaredProgramCardProps {
  declaredProgram: DeclaredProgramViewDTO
  disabled?: boolean
}

const { declaredProgram, disabled } = defineProps<AssociatedDeclaredProgramCardProps>()
</script>

<template>
  <AssociationCard
    :title="declaredProgram.title"
    :icon="ICONS.DECLARED_PROGRAMS"
    color="var(--icon)"
    hover-border-color="var(--dark-background-neutral)"
    icon-border-color="var(--other-border-skill-card)"
    background-color="var(--surface-background)"
    :to="{ name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: declaredProgram.id } }"
    :disabled="disabled"
    data-testid="associated-declared-program-card"
    :data-program-id="declaredProgram.id"
  >
    <template #body>
      <DeclaredProgramStatusBadge
        v-if="declaredProgram.status"
        :status="declaredProgram.status"
      />
      <DeclaredProgramOrganizationBadge
        v-if="declaredProgram.organization"
        :organization="declaredProgram.organization"
      />
    </template>
  </AssociationCard>
</template>
