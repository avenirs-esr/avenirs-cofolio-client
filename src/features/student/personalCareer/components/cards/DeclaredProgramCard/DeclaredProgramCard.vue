<script setup lang="ts">
import type { DeclaredProgramViewDTO, EProgramStatus } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { AvBadge, ICONS_DATA_URL, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { declaredProgram } = defineProps<{ declaredProgram: DeclaredProgramViewDTO }>()

const { t } = useI18n()

const iconOptions = {
  name: MDI_ICONS.SCHOOL_OUTLINE,
  color: 'var(--text1)',
  right: '0.75rem',
  bottom: 'calc(-1 * 3.3rem)',
  borderColor: 'var(--other-border-skill-card)'
}

const statusColorMap: Record<EProgramStatus, string> = {
  NOT_STARTED: 'var(--light-background-neutral)',
  IN_PROGRESS: 'var(--light-background-primary2)',
  COMPLETED: 'var(--light-background-neutral)'
}

const statusIconMap: Record<EProgramStatus, string> = {
  NOT_STARTED: ICONS_DATA_URL.MDI_HOURGLASS,
  IN_PROGRESS: ICONS_DATA_URL.MDI_HOURGLASS,
  COMPLETED: MDI_ICONS.CHECK_CIRCLE
}

const statusTextColorMap: Record<EProgramStatus, string> = {
  NOT_STARTED: 'var(--text1)',
  IN_PROGRESS: 'var(--light-foreground-primary1)',
  COMPLETED: 'var(--text1)'
}

const statusBadgeProps = computed(() => {
  const status = declaredProgram.status

  return {
    label: status ? t(`student.personalCareer.declaredProgramStatus.${status}`) : t(`student.personalCareer.declaredProgramStatus.NOT_STARTED`),
    backgroundColor: status ? statusColorMap[status] : statusColorMap.NOT_STARTED,
    icon: status ? statusIconMap[status] : statusIconMap.NOT_STARTED,
    color: status ? statusTextColorMap[status] : statusTextColorMap.NOT_STARTED,
  }
})
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
      height="12.8rem"
    >
      <template #body>
        <div class="av-col av-pr-4xl--md av-pt-xl av-pt-none--md">
          <div class="av-col av-row--md av-align-end av-justify-end--md av-gap-sm">
            <AvBadge
              v-if="declaredProgram.status"
              v-bind="statusBadgeProps"
            />
            <AvBadge
              v-if="declaredProgram.result"
              class="av-hidden av-unhidden--md"
              :label="declaredProgram.result"
              :icon="RI_ICONS.LAYOUT_6_LINE"
              color="var(--card2)"
              background-color="var(--dark-background-primary1)"
              ellipsis
            />

            <AvBadge
              v-if="declaredProgram.organization"
              :label="declaredProgram.organization"
              :icon="MDI_ICONS.BUILDING"
              color="var(--text1)"
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
.declared-program-card {
  border-radius: 1.5rem;
}

:deep(.n5) {
  color: var(--text1);
}

.floating-icon-card {
  flex: 1 !important;
}
</style>
