<script setup lang="ts">
import type { DeclaredExperienceViewDTO, EExperienceType } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { AvBadge, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineProps<{ declaredExperience: DeclaredExperienceViewDTO }>()

const { t } = useI18n()

const iconOptions = {
  name: MDI_ICONS.HUB_OUTLINE,
  color: 'var(--icon)',
  right: '0.4rem',
  bottom: 'calc(-1 * 3.3rem)',
  borderColor: 'var(--other-border-skill-card)'
}

const experienceTypeColorMap: Record<EExperienceType, string> = {
  PROFESSIONAL: 'var(--dark-background-primary3)',
  PERSONAL: 'var(--dark-background-success)'
}
</script>

<template>
  <RouterLink
    :to="{ name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name, params: { id: declaredExperience.id } }"
    class="declared-experience-card"
  >
    <FloatingIconCard
      :title="declaredExperience.title"
      :icon-options="iconOptions"
      color="var(--surface-background)"
      border-color="var(--other-border-skill-card)"
      border-color-on-hover="var(--dark-background-primary1)"
      :header-rows="1"
      title-typography-classes="n6"
      height="12.8rem"
    >
      <template #body>
        <div class="av-col av-pr-4xl--md av-pt-xl av-pt-none--md">
          <div class="av-col av-row--md av-align-end av-justify-end--md av-gap-sm">
            <AvBadge
              v-if="declaredExperience.experienceType"
              :label="t(`student.personalCareer.declaredExperienceType.${declaredExperience.experienceType}`)"
              :background-color="experienceTypeColorMap[declaredExperience.experienceType]"
              :icon="RI_ICONS.HONOUR_LINE"
              color="var(--card2)"
              ellipsis
            />
            <AvBadge
              v-if="declaredExperience.location"
              :label="declaredExperience.location"
              :icon="MDI_ICONS.MAP_MARKER_OUTLINE"
              color="var(--text2)"
              background-color="transparent"
              ellipsis
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

:deep(.n5) {
  color: var(--text1);
}
</style>
