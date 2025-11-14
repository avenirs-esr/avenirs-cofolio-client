<script lang="ts" setup>
import { ESkillLevelStatus, type SkillLevelProgressOverviewDTO, type SkillOverviewDTO } from '@/api/avenir-esr'
import { ROUTE_NAMES } from '@/common/constants'
import StudentCountAmsIconText from '@/features/student/ams/components/base/StudentCountAmsIconText/StudentCountAmsIconText.vue'
import StudentCountTracesIconText from '@/features/student/traces/components/base/StudentCountTracesIconText/StudentCountTracesIconText.vue'
import { AvBadge, type AvBadgeProps, AvCard, AvIcon, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentSkillCardProps {
  skill: SkillOverviewDTO
  skillColor: string
}

const { skill, skillColor } = defineProps<StudentSkillCardProps>()

const name = computed(() => skill.name)
const currentSkillLevel = computed(() => skill.currentSkillLevel)

const { t } = useI18n()

function levelStatusToBadge (status: ESkillLevelStatus): Pick<AvBadgeProps, 'color' | 'backgroundColor' | 'iconDataUrl'> & { status: string } {
  switch (status) {
    // TODO: return correct values for UNDER_ACQUISITION status when starting #312
    case ESkillLevelStatus.UNDER_REVIEW:
      return {
        status: t('student.cards.studentSkillCard.badgeStatus.underReview'),
        color: 'var(--light-foreground-primary1)',
        backgroundColor: 'var(--light-background-critical)',
        iconDataUrl: ICONS_DATA_URL.MDI_DOTS_HORIZONTAL_CIRCLE_OUTLINE
      }
    case ESkillLevelStatus.VALIDATED:
      return {
        status: t('student.cards.studentSkillCard.badgeStatus.validated'),
        color: 'var(--light-foreground-success)',
        backgroundColor: 'var(--light-background-success)',
        iconDataUrl: ICONS_DATA_URL.MDI_CHECK_CIRCLE
      }
    case ESkillLevelStatus.FAILED:
      return {
        status: t('student.cards.studentSkillCard.badgeStatus.failed'),
        color: 'var(--light-foreground-error)',
        backgroundColor: 'var(--light-background-error)',
        iconDataUrl: ICONS_DATA_URL.MDI_CLOSE_CIRCLE_OUTLINE
      }
    case ESkillLevelStatus.NOT_STARTED:
    case ESkillLevelStatus.UNDER_ACQUISITION:
    case ESkillLevelStatus.TO_BE_EVALUATED:
    default:
      return {
        status: t('student.cards.studentSkillCard.badgeStatus.toBeEvaluated'),
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconDataUrl: ICONS_DATA_URL.MDI_HOURGLASS
      }
  }
}

function levelToBadge (level: SkillLevelProgressOverviewDTO): Pick<AvBadgeProps, 'label' | 'color' | 'backgroundColor' | 'iconDataUrl'> {
  const { status, color, backgroundColor, iconDataUrl } = levelStatusToBadge(level.status)

  return { label: `${level.name} ${status}`, color, backgroundColor, iconDataUrl }
}

const levelStatusBadge = computed(() => levelToBadge(currentSkillLevel.value))
const varSkillColor = computed(() => `var(${skillColor})`)

const theme = ref({
  hoverBorderColor: varSkillColor,
})
const studentSkillRouteName = ROUTE_NAMES.STUDENT.SKILL.name
</script>

<template>
  <RouterLink
    class="student-skill-card"
    :to="{ name: studentSkillRouteName, params: { id: skill.id } }"
  >
    <AvCard
      border-color="var(--other-border-skill-card)"
      :title-background="varSkillColor"
      title-height="6.75rem"
    >
      <template #title>
        <div class="student-skill-card__title">
          <span
            class="n6 skill-name"
            :title="name"
          >
            {{ name }}
          </span>
          <div
            class="student-skill-card__icon"
            :style="{ background: `var(${skillColor})` }"
          >
            <AvIcon
              :name="MDI_ICONS.STAR_SHOOTING_OUTLINE"
              color="var(--card2)"
              :size="2.0625"
            />
          </div>
        </div>
      </template>
      <template #body>
        <div class="student-skill-card__body">
          <StudentCountTracesIconText
            :count-traces="currentSkillLevel.traceCount"
            gap="0.75rem"
          />
          <StudentCountAmsIconText
            :count-ams="currentSkillLevel.activityCount"
            gap="0.75rem"
          />
        </div>
      </template>
      <template #footer>
        <div class="student-skill-card__footer">
          <AvBadge
            v-bind="levelStatusBadge"
            small
            ellipsis
          />
        </div>
      </template>
    </AvCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.av-card {
  height: 16.875rem;
  width: 100%;

  &:hover {
    border: 1px solid v-bind('theme.hoverBorderColor') !important;
    box-shadow: 0 0 0 2px v-bind('theme.hoverBorderColor');
  }
}

.student-skill-card {
  display: flex;
  width: 17.25rem;
  border-radius: 1.5rem;

  &__title {
    position: relative;
  }

  &__icon {
    position: absolute;
    width: 3.125rem;
    height: 3.125rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--other-background-base);
    right: 0;
    top: 4.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-xxs);
  }
}

.skill-name {
  color: var(--card2);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
  -webkit-line-clamp: 3;
}
</style>
