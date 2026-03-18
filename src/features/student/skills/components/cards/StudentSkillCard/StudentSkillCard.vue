<script lang="ts" setup>
import { ESkillLevelStatus, type SkillLevelProgressOverviewDTO, type SkillOverviewDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { StudentCountAmsIconText } from '@/features/student/ams'
import { FloatingIconCard } from '@/features/student/global'
import StudentCountTracesIconText from '@/features/student/traces/components/base/StudentCountTracesIconText/StudentCountTracesIconText.vue'
import { AvBadge, type AvBadgeProps, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentSkillCardProps {
  skill: SkillOverviewDTO
  skillColor: string
}

const { skill, skillColor } = defineProps<StudentSkillCardProps>()

const name = computed(() => skill.name)
const currentSkillLevel = computed(() => skill.currentSkillLevel)

const { t } = useI18n()
function levelStatusToBadge (status: ESkillLevelStatus): Pick<AvBadgeProps, 'color' | 'backgroundColor' | 'icon'> & { status: string } {
  switch (status) {
    // TODO: return correct values for UNDER_ACQUISITION status when starting #312
    case ESkillLevelStatus.UNDER_REVIEW:
      return {
        status: t('student.skills.cards.StudentSkillCard.badgeStatus.underReview'),
        color: 'var(--light-foreground-primary1)',
        backgroundColor: 'var(--light-background-critical)',
        icon: ICONS_DATA_URL.MDI_DOTS_HORIZONTAL_CIRCLE_OUTLINE
      }
    case ESkillLevelStatus.VALIDATED:
      return {
        status: t('student.skills.cards.StudentSkillCard.badgeStatus.validated'),
        color: 'var(--light-foreground-success)',
        backgroundColor: 'var(--light-background-success)',
        icon: ICONS_DATA_URL.MDI_CHECK_CIRCLE
      }
    case ESkillLevelStatus.FAILED:
      return {
        status: t('student.skills.cards.StudentSkillCard.badgeStatus.failed'),
        color: 'var(--light-foreground-error)',
        backgroundColor: 'var(--light-background-error)',
        icon: ICONS_DATA_URL.MDI_CLOSE_CIRCLE_OUTLINE
      }
    case ESkillLevelStatus.NOT_STARTED:
    case ESkillLevelStatus.UNDER_ACQUISITION:
    case ESkillLevelStatus.TO_BE_EVALUATED:
    default:
      return {
        status: t('student.skills.cards.StudentSkillCard.badgeStatus.toBeEvaluated'),
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        icon: ICONS_DATA_URL.MDI_HOURGLASS
      }
  }
}

function levelToBadge (level: SkillLevelProgressOverviewDTO): Pick<AvBadgeProps, 'label' | 'color' | 'backgroundColor' | 'icon'> {
  const { status, color, backgroundColor, icon } = levelStatusToBadge(level.status)

  return { label: `${level.name} ${status}`, color, backgroundColor, icon }
}

const levelStatusBadge = computed(() => levelToBadge(currentSkillLevel.value))
const varSkillColor = computed(() => `var(${skillColor})`)

const studentSkillRouteName = ROUTES.STUDENT.SKILL.name

const iconOptions = {
  name: MDI_ICONS.STAR_SHOOTING_OUTLINE,
}
</script>

<template>
  <RouterLink
    class="student-skill-card av-w-full"
    :to="{ name: studentSkillRouteName, params: { id: skill.id } }"
    data-testid="skill-card"
  >
    <FloatingIconCard
      :title="name"
      :icon-options="iconOptions"
      :color="varSkillColor"
      title-typography-classes="student-skill-card__title b1-bold"
    >
      <template #body>
        <StudentCountTracesIconText :count-traces="currentSkillLevel.traceCount" />
        <StudentCountAmsIconText :count-ams="currentSkillLevel.activityCount" />
      </template>
      <template #footer>
        <div class="student-skill-card__footer">
          <AvBadge
            data-testid="skill-level-badge"
            v-bind="levelStatusBadge"
            small
            ellipsis
          />
        </div>
      </template>
    </FloatingIconCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

.student-skill-card {
  border-radius: 1.5rem;

  @include dsav.min-width(md) {
    width: 17.25rem;
  }

  :deep(.floating-icon-card__title.b1-bold) {
    color: var(--card2);
  }

}
:deep(.fr-badge--success) {
  color: var(--light-foreground-success) !important;
  background-color: var(--light-background-success) !important;
}

:deep(.fr-badge--info) {
  color: var(--dark-background-primary1) !important;
  background-color: var(--light-background-primary2) !important;
}

:deep(.fr-badge--error) {
  color: var(--light-foreground-error) !important;
  background-color: var(--light-background-error) !important;
}
</style>
