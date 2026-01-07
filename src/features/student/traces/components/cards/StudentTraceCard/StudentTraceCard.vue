<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import { EPortfolioType, type TraceOverviewDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import StudentCountAmsIconText from '@/features/student/ams/components/base/StudentCountAmsIconText/StudentCountAmsIconText.vue'
import { FloatingIconCard } from '@/features/student/global'
import { AvIcon, AvIconText, AvTag, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentTraceCardProps {
  trace: TraceOverviewDTO
  to?: RouteLocationRaw
}

const { trace, to = { name: ROUTES.STUDENT.TOOLS_TRACES.name } } = defineProps<StudentTraceCardProps>()
const { title, skillCount, AMSCount, isGroup, programName } = trace

const { t } = useI18n()

function getRandomSkillColor () {
  const random = Math.floor(Math.random() * 12) + 1
  return `var(--skill${random})`
}

const category = computed(() => programName && programName !== EPortfolioType.LIFE_PROJECT ? programName : t('student.traces.cards.StudentTraceCard.lifeProject'))
const typeInfo = computed(() => isGroup
  ? { label: t('student.traces.cards.StudentTraceCard.tagLabel.group'), icon: RI_ICONS.DICE_4_LINE }
  : { label: t('student.traces.cards.StudentTraceCard.tagLabel.solo'), icon: RI_ICONS.DICE_1_LINE })

const iconOptions = {
  name: MDI_ICONS.ATTACH_FILE,
  color: 'var(--text1)',
  bottom: 'calc(-1 * var(--spacing-lg))',
  right: '0.75rem',
  borderColor: 'var(--other-border-skill-card)'
}
</script>

<template>
  <RouterLink
    class="student-trace-card"
    :to="to"
  >
    <FloatingIconCard
      :title="title"
      :icon-options="iconOptions"
      border-color="var(--other-border-skill-card)"
      border-color-on-hover="var(--dark-background-primary1)"
      color="var(--surface-background)"
      :header-rows="2"
      height="14rem"
      title-typography-classes="b1-bold"
    >
      <template #body>
        <div class="student-trace-card__body">
          <div class="student-trace-card__line student-trace-card__skills">
            <div
              v-for="n in Math.min(skillCount, 3)"
              :key="n"
              class="student-trace-card__lineicon"
              :style="{ backgroundColor: getRandomSkillColor() }"
            >
              <AvIcon
                :name="MDI_ICONS.STAR_SHOOTING_OUTLINE"
                color="var(--other-background-base)"
              />
            </div>
            <span class="b2-regular">{{ t('student.traces.cards.StudentTraceCard.skillCount', { count: skillCount }) }}</span>
          </div>
          <div class="student-trace-card__activities">
            <StudentCountAmsIconText
              :count-ams="AMSCount"
              gap="0.75rem"
            />
          </div>
          <div class="student-trace-card__category">
            <AvIconText
              :icon="MDI_ICONS.SWAP_VERTICAL_VARIANT"
              :text="category"
              icon-color="var(--text1)"
              text-color="var(--text1)"
              typography-class="b2-regular"
              gap="0.75rem"
            />
          </div>
          <div class="student-trace-card__line student-trace-card__type">
            <AvTag
              :label="typeInfo.label"
              :icon="typeInfo.icon"
            />
          </div>
        </div>
      </template>
    </FloatingIconCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

.student-trace-card {
  width: 100%;

  @include dsav.min-width(md) {
    width: 17.25rem;
  }

  :deep(.av-card:hover) {
    border: 1px solid var(--dark-background-primary1) !important;
    box-shadow: 0 0 0 2px var(--dark-background-primary1);
  }
  :deep(.floating-icon-card__icon) {
    width: 2.75rem;
    height: 2.75rem;
  }
}

.student-trace-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.student-trace-card__line {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
}

.student-trace-card__line.student-trace-card__skills {
  gap: var(--spacing-xs);
}

.student-trace-card__categoryText {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}

.fr-tag {
  color: var(--text2);
  background-color: var(--light-background-neutral);
  align-items: center;
  padding: var(--spacing-none) var(--spacing-xs) var(--spacing-none) var(--spacing-xs);
  min-height: unset;
  width: unset;
  border-radius: var(--radius-sm);
}
</style>
