<script lang="ts" setup>
import type { DsfrBadgeProps } from '@gouvminint/vue-dsfr'
import type { StudentSkillCardProps } from './StudentSkillCard.types'
import { type SkillLevelOverviewDTO, SkillLevelStatus } from '@/api/avenir-esr'
import { StudentCountAmsIconText, StudentCountTracesIconText } from '@/features/student/components/'
import { studentSkillRoute } from '@/features/student/routes'
import { AvCard, AvVIcon, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { skill, skillColor } = defineProps<StudentSkillCardProps>()
const { name, traceCount, activityCount, currentSkillLevel } = skill

const { t } = useI18n()

function levelStatusToBadgeInfo (status: SkillLevelStatus): { status: string, type: DsfrBadgeProps['type'] } {
  switch (status) {
    case SkillLevelStatus.NOT_STARTED:
    case SkillLevelStatus.TO_BE_EVALUATED:
      return { status: t('student.cards.studentSkillCard.badgeStatus.toBeEvaluated'), type: 'new' }
    case SkillLevelStatus.UNDER_REVIEW:
      return { status: t('student.cards.studentSkillCard.badgeStatus.underReview'), type: 'info' }
    case SkillLevelStatus.VALIDATED:
      return { status: t('student.cards.studentSkillCard.badgeStatus.validated'), type: 'success' }
    case SkillLevelStatus.FAILED:
      return { status: t('student.cards.studentSkillCard.badgeStatus.failed'), type: 'error' }
  }
}

function levelToBadge (level: SkillLevelOverviewDTO) {
  const { status, type } = levelStatusToBadgeInfo(level.status)
  const label = `${level.name} ${status}`

  return { label, type }
}

const firstBadge = computed(() => levelToBadge(currentSkillLevel))
const computedHoverBorderColor = computed(() => `var(${skillColor})`)

const theme = ref({
  hoverBorderColor: computedHoverBorderColor,
})
</script>

<template>
  <RouterLink
    class="student-skill-card"
    :to="{ name: studentSkillRoute.name, params: { id: skill.id } }"
  >
    <AvCard
      border-color="--other-border-skill-card"
      :title-background="skillColor"
      title-height="6.6875rem"
    >
      <template #title>
        <div class="student-skill-card__title">
          <span class="n6 skill-name">
            {{ name }}
          </span>
          <div
            class="student-skill-card__icon"
            :style="{ background: `var(${skillColor})` }"
          >
            <AvVIcon
              :name="MDI_ICONS.STAR_SHOOTING"
              color="var(--background-card2)"
              :size="2.0625"
            />
          </div>
        </div>
      </template>
      <template #body>
        <div class="student-skill-card__body">
          <StudentCountTracesIconText
            :count-traces="traceCount"
            gap="0.75rem"
          />
          <StudentCountAmsIconText
            :count-ams="activityCount"
            gap="0.75rem"
          />
        </div>
      </template>
      <template #footer>
        <div class="student-skill-card__footer">
          <DsfrBadge
            :label="firstBadge.label"
            :type="firstBadge.type"
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
}

.av-card:hover {
  border: 1px solid v-bind('theme.hoverBorderColor') !important;
  box-shadow: 0 0 0 2px v-bind('theme.hoverBorderColor');
}

.skill-name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 3;
}

.student-skill-card {
  display: flex;
  width: 17.25rem;
  border-radius: 1.5rem;
}

.student-skill-card__title {
  position: relative
}

.student-skill-card__icon {
  position: absolute;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 0.75rem;
  border: 1px solid white;
  right: 0;
  top: 4.6875rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.student-skill-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.student-skill-card__footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.fr-badge--success {
  color: var(--light-foreground-success);
  background-color: var(--light-background-success);
}

.fr-badge--new {
  color: var(--foreground-text1);
  background-color: var(--light-background-neutral);
}

.fr-badge--info {
  color: var(--dark-background-primary1);
  background-color: var(--light-background-primary2);
}

.fr-badge--error {
  color: var(--light-foreground-error);
  background-color: var(--light-background-error);
}

.n6 {
  color: var(--background-card2);
}
</style>
