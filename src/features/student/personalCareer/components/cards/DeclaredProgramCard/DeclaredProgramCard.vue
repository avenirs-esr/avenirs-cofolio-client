<script setup lang="ts">
import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import DeclaredProgramOrganizationBadge
  from '@/features/student/personalCareer/components/badges/DeclaredProgramOrganizationBadge/DeclaredProgramOrganizationBadge.vue'
import DeclaredProgramResultBadge
  from '@/features/student/personalCareer/components/badges/DeclaredProgramResultBadge/DeclaredProgramResultBadge.vue'
import DeclaredProgramStatusBadge
  from '@/features/student/personalCareer/components/badges/DeclaredProgramStatusBadge/DeclaredProgramStatusBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

const { declaredProgram } = defineProps<{ declaredProgram: DeclaredProgramViewDTO }>()

const iconOptions = {
  name: MDI_ICONS.SCHOOL_OUTLINE,
  color: 'var(--icon)',
  right: '0.75rem',
  bottom: 'calc(-1 * 3.3rem)',
  borderColor: 'var(--other-border-skill-card)'
}
</script>

<template>
  <RouterLink
    :to="{ name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: declaredProgram.id } }"
    class="declared-program-card"
  >
    <FloatingIconCard
      :title="declaredProgram.title"
      :icon-options="iconOptions"
      color="var(--surface-background)"
      border-color="var(--other-border-skill-card)"
      border-color-on-hover="var(--dark-background-primary1)"
      :header-rows="1"
      title-typography-classes="n6"
      title-color="var(--text1)"
      height="12.8rem"
    >
      <template #body>
        <div class="av-col av-pr-4xl--md av-pt-xl av-pt-none--md">
          <div class="av-col av-row--md av-align-end av-justify-end--md av-gap-sm">
            <DeclaredProgramStatusBadge
              v-if="declaredProgram.status"
              :status="declaredProgram.status"
            />
            <DeclaredProgramResultBadge
              v-if="declaredProgram.result"
              class="av-hidden av-unhidden--md"
              :result="declaredProgram.result"
            />

            <DeclaredProgramOrganizationBadge
              v-if="declaredProgram.organization"
              :organization="declaredProgram.organization"
            />
          </div>
        </div>
      </template>
    </FloatingIconCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.declared-program-card {
  border-radius: 1.5rem;
}

.floating-icon-card {
  flex: 1 !important;
}
</style>
