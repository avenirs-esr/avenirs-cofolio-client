<script lang="ts" setup>
import type { DsfrBadgeProps } from '@gouvminint/vue-dsfr'
import type { StudentSkillCardProps } from './StudentSkillCard.types'
import { studentEducationSkillsRoute } from '@/features/student/routes'
import { type LevelDTO, LevelStatus } from '@/types'
import { AvCard, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { skill, skillColor, to = studentEducationSkillsRoute } = defineProps<StudentSkillCardProps>()
const { name, trackCount, activityCount, levels } = skill

const { t } = useI18n()

function levelStatusToBadgeInfo (status: LevelDTO['status']): { status: string, type: DsfrBadgeProps['type'] } {
  switch (status) {
    case LevelStatus.TO_EVALUATE:
      return { status: t('student.cards.studentSkillCard.badgeStatus.toEvaluate'), type: 'new' }
    case LevelStatus.UNDER_REVIEW:
      return { status: t('student.cards.studentSkillCard.badgeStatus.underReview'), type: 'info' }
    case LevelStatus.VALIDATED:
      return { status: t('student.cards.studentSkillCard.badgeStatus.validated'), type: 'success' }
    case LevelStatus.NOT_VALIDATED:
      return { status: t('student.cards.studentSkillCard.badgeStatus.notValidated'), type: 'error' }
  }
}

function levelToBadge (level: LevelDTO) {
  const { status, type } = levelStatusToBadgeInfo(level.status)
  const label = `${level.name} ${status}`

  return { label, type }
}

const firstBadge = computed(() => levelToBadge(levels[0]))
const secondBadge = computed(() => levels.length > 1 ? levelToBadge(levels[1]) : undefined)
const computedHoverBorderColor = computed(() => `var(${skillColor})`)

const theme = ref({
  hoverBorderColor: computedHoverBorderColor,
})
</script>

<template>
  <RouterLink
    class="student-skill-card"
    :to="to"
  >
    <AvCard
      border-color="--other-border-skill-card"
      :title-background="skillColor"
      title-height="6.6875rem"
      :to="to"
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
            <VIcon
              :name="MDI_ICONS.STAR_SHOOTING"
              color="var(--background-card2)"
              scale="2"
            />
          </div>
        </div>
      </template>
      <template #body>
        <div class="student-skill-card__body">
          <div class="student-skill-card__line">
            <VIcon :name="MDI_ICONS.ATTACH_FILE" />
            <span class="student-skill-card__desc">{{ t('student.cards.studentSkillCard.trackCount', { count: trackCount }) }}</span>
          </div>
          <div class="student-skill-card__line">
            <VIcon :name="MDI_ICONS.TEST_TUBE_EMPTY" />
            <span class="student-skill-card__desc">{{ t('student.cards.studentSkillCard.activityCount', { count: activityCount }) }}</span>
          </div>
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
          <DsfrBadge
            v-if="!!secondBadge"
            :label="secondBadge.label"
            :type="secondBadge.type"
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

.student-skill-card__line {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: center;
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
