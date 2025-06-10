<script lang="ts" setup>
import { StudentLevelBadge } from '@/features/student/components/'
import { studentSkillRoute } from '@/features/student/routes'
import { LevelStatus, type SkillDTO_Temp } from '@/types'
import { AvBadge, AvCard, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { skill, skillColor } = defineProps<{ skill: SkillDTO_Temp, skillColor: string }>()
const { name, trackCount, activityCount, levelCount, currentLevel } = skill

const { t } = useI18n()

const computedHoverBorderColor = computed(() => `var(${skillColor})`)
const showLevelBadge = computed(() => currentLevel.status === LevelStatus.TO_EVALUATE || currentLevel.status === LevelStatus.UNDER_REVIEW)
// TODO: placeholder waiting for US specific to feedback
const mockedFeedbackCount = computed(() => Math.floor(Math.random() * 6))

const hoverBorderColor = ref(computedHoverBorderColor)
</script>

<template>
  <RouterLink
    class="student-detailed-skill-card"
    :to="{ name: studentSkillRoute.name, params: { id: skill.id } }"
  >
    <AvCard
      border-color="--other-border-skill-card"
      :title-background="skillColor"
    >
      <template #title>
        <div class="student-detailed-skill-card__title ellipsis-container">
          <span class="n5 ellipsis">
            {{ name }}
          </span>
          <div
            class="student-detailed-skill-card__icon"
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
        <div class="student-detailed-skill-card__body">
          <div class="student-detailed-skill-card__firstLine">
            <div class="student-detailed-skill-card__line">
              <span class="n6">{{ skill.currentLevel.name }}</span>
              <StudentLevelBadge
                v-if="showLevelBadge"
                :level="currentLevel"
              />
              <AvBadge
                v-if="mockedFeedbackCount > 0"
                class="student-detailed-skill-card__feedback-badge"
                :label="t('student.cards.studentDetailedSkillCard.feedbackCount', { count: mockedFeedbackCount })"
                color="var(--dark-background-warn)"
                background-color="var(--light-background-warn)"
                icon-path="/assets/icons/message-badge.svg"
                small
                ellipsis
              />
            </div>
            <div class="student-detailed-skill-card__line">
              <AvBadge
                :label="`${levelCount} niveaux`"
                color="var(--foreground-text)"
                background-color="var(--background-surface-background)"
                icon-path="/assets/icons/text-box-check-outline.svg"
                small
                ellipsis
              />
            </div>
          </div>
          <div class="student-detailed-skill-card__line">
            <span class="s2-regular">{{ skill.currentLevel.shortDescription }}</span>
          </div>
          <div class="student-detailed-skill-card__line">
            <div class="student-detailed-skill-card__counts">
              <VIcon :name="MDI_ICONS.ATTACH_FILE" />
              <span class="student-detailed-skill-card__desc">{{ t('student.cards.studentDetailedSkillCard.trackCount', { count: trackCount }) }}</span>
            </div>
            <div class="student-detailed-skill-card__counts">
              <VIcon :name="MDI_ICONS.TEST_TUBE_EMPTY" />
              <span class="student-detailed-skill-card__desc">{{ t('student.cards.studentDetailedSkillCard.activityCount', { count: activityCount }) }}</span>
            </div>
          </div>
        </div>
      </template>
    </AvCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.av-card {
  width: 100%;
}

.av-card:hover {
  border: 1px solid v-bind('hoverBorderColor') !important;
  box-shadow: 0 0 0 2px v-bind('hoverBorderColor');
}

.student-detailed-skill-card {
  display: flex;
  width: 100%;
  border-radius: 1.5rem;
}

.student-detailed-skill-card__title {
  position: relative
}

.student-detailed-skill-card__icon {
  position: absolute;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 0.75rem;
  border: 1px solid white;
  right: 0;
  top: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.student-detailed-skill-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.student-detailed-skill-card__firstLine {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 3.5rem;
}

.student-detailed-skill-card__line {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
}

.student-detailed-skill-card__counts {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: center;
}

.student-detailed-skill-card__footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.n5 {
  color: var(--background-card2);
}

.n6 {
  color: var(--foreground-text1);
}
</style>
