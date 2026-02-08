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
  bottom: 'calc(-1 * var(--spacing-xl))',
  right: 'var(--spacing-xs)',
  borderColor: 'var(--other-border-skill-card)'
}
</script>

<template>
  <RouterLink
    class="student-trace-card"
    :to="to"
    data-testid="trace-card"
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
        <div class="av-col av-gap-xs">
          <div class="av-row av-align-center av-gap-xs">
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
            <span
              class="b2-regular"
              data-testid="trace-card-skill-count"
            >{{ t('student.traces.cards.StudentTraceCard.skillCount', { count: skillCount }) }}</span>
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
          <div class="av-row av-align-center student-trace-card__type">
            <AvTag
              data-testid="trace-card-type-tag"
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
}
</style>
