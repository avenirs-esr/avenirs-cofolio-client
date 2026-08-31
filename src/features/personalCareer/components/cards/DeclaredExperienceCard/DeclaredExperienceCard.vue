<script setup lang="ts">
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import PeriodBadge from '@/common/activities/badges/PeriodBadge/PeriodBadge.vue'
import { ROUTES } from '@/common/constants'
import FloatingIconCard from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import DeclaredExperienceOrganizationBadge
  from '@/features/personalCareer/components/badges/DeclaredExperienceOrganizationBadge/DeclaredExperienceOrganizationBadge.vue'
import DeclaredExperienceTypeBadge
  from '@/features/personalCareer/components/badges/DeclaredExperienceTypeBadge/DeclaredExperienceTypeBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

defineProps<{ declaredExperience: DeclaredExperienceViewDTO }>()

const iconOptions = {
  name: MDI_ICONS.HUB_OUTLINE,
  color: 'var(--icon)',
  right: '0.4rem',
  bottom: 'calc(-1 * 3.3rem)',
  borderColor: 'var(--other-border-skill-card)'
}
</script>

<template>
  <RouterLink
    :to="{ name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name, params: { id: declaredExperience.id } }"
    class="declared-experience-card"
    data-testid="declared-experience-card"
    :data-experience-id="declaredExperience.id"
  >
    <FloatingIconCard
      :title="declaredExperience.title"
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
            <PeriodBadge
              :start-date="declaredExperience.startDate"
              :end-date="declaredExperience.endDate"
            />

            <DeclaredExperienceTypeBadge
              v-if="declaredExperience.experienceType"
              :experience-type="declaredExperience.experienceType"
            />
            <DeclaredExperienceOrganizationBadge
              :organization="declaredExperience.organization"
            />
          </div>
        </div>
      </template>
    </FloatingIconCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.declared-experience-card {
  border-radius: 1.5rem;
}
</style>
