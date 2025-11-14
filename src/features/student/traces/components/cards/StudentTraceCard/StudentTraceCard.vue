<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import { EPortfolioType, type TraceOverviewDTO } from '@/api/avenir-esr'
import { ROUTE_NAMES } from '@/common/constants'
import StudentCountAmsIconText from '@/features/student/ams/components/base/StudentCountAmsIconText/StudentCountAmsIconText.vue'
import { AvCard, AvIcon, AvIconText, AvTag, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentTraceCardProps {
  trace: TraceOverviewDTO
  to?: RouteLocationRaw
}

const { trace, to = { name: ROUTE_NAMES.STUDENT.TOOLS_TRACES.name } } = defineProps<StudentTraceCardProps>()
const { title, skillCount, AMSCount, isGroup, programName } = trace

const { t } = useI18n()

function getRandomSkillColor () {
  const random = Math.floor(Math.random() * 12) + 1
  return `var(--skill${random})`
}

const category = computed(() => programName && programName !== EPortfolioType.LIFE_PROJECT ? programName : t('student.cards.studentTraceCard.lifeProject'))
const typeInfo = computed(() => isGroup
  ? { label: t('student.cards.studentTraceCard.tagLabel.group'), icon: RI_ICONS.DICE_4_LINE }
  : { label: t('student.cards.studentTraceCard.tagLabel.solo'), icon: RI_ICONS.DICE_1_LINE })

const theme = ref({
  hoverBorderColor: 'var(--dark-background-primary1)',
})
</script>

<template>
  <RouterLink
    class="student-trace-card"
    :to="to"
  >
    <AvCard
      border-color="var(--other-border-skill-card)"
      title-background="var(--surface-background)"
      title-height="4.6875rem"
    >
      <template #title>
        <div class="student-trace-card__title">
          <span
            class="b1-bold student-trace-card__titletruncate"
            :title="title"
          >
            {{ title }}
          </span>
          <div
            class="student-trace-card__icon"
            :style="{ background: 'var(--surface-background)' }"
          >
            <AvIcon
              :name="MDI_ICONS.ATTACH_FILE"
              color="var(--text1)"
              :size="1.9375"
            />
          </div>
        </div>
      </template>
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
            <span class="b2-regular">{{ t('student.cards.studentTraceCard.skillCount', { count: skillCount }) }}</span>
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
    </AvCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.av-card {
  height: 14rem;
  width: 100%;

  &:hover {
    border: 1px solid v-bind('theme.hoverBorderColor') !important;
    box-shadow: 0 0 0 2px v-bind('theme.hoverBorderColor');
  }
}

.student-trace-card {
  display: flex;
  width: 17.125rem;
  border-radius: 1.5rem;

  &__title {
    position: relative;
  }

  &__titlecontent {
    width: 11.25rem;
    height: var(--dimension-2xl);
  }

  &__titletruncate {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: var(--dimension-2xl);
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  &__icon {
    position: absolute;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--other-border-skill-card);
    right: calc(var(--spacing-md) / 2);
    top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-md) / 2);
    padding-top: var(--spacing-md);
  }

  &__line {
    display: flex;
    flex-direction: row;
    gap: calc(var(--spacing-md) / 2);
    align-items: center;
  }

  &__skills {
    gap: var(--spacing-xs);
  }

  &__lineicon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.375rem;
    width: 1.375rem;
    border-radius: var(--radius-sm);
  }
}
</style>
