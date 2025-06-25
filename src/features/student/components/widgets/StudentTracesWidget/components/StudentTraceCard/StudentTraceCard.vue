<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import { StudentCountAmsIconText } from '@/features/student/components/'
import { studentToolsTracesRoute } from '@/features/student/routes'
import { type TraceOverviewDTO, TraceType } from '@/types'
import { AvCard, AvIconText, AvVIcon, MDI_ICONS, RI_ICONS } from '@/ui'
import { DsfrTag } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'

export interface StudentTraceCardProps {
  trace: TraceOverviewDTO
  to?: RouteLocationRaw
}

const { trace, to = studentToolsTracesRoute } = defineProps<StudentTraceCardProps>()
const { name, skillCount, activityCount, type, course } = trace

const { t } = useI18n()

function getRandomSkillColor () {
  const random = Math.floor(Math.random() * 12) + 1
  return `var(--skill${random})`
}

const category = computed(() => course ?? t('student.cards.studentTraceCard.lifeProject'))
const typeInfo = computed(() => type === TraceType.GROUP
  ? { label: t('student.cards.studentTraceCard.tagLabel.group'), icon: RI_ICONS.DICE_4 }
  : { label: t('student.cards.studentTraceCard.tagLabel.solo'), icon: RI_ICONS.DICE_1 })

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
      border-color="--other-border-skill-card"
      title-background="--background-surface-background"
      title-height="4.375rem"
      :to="to"
    >
      <template #title>
        <div class="student-trace-card__title">
          <span class="b1-bold student-trace-card__titletruncate">
            {{ name }}
          </span>
          <div
            class="student-trace-card__icon"
            :style="{ background: 'var(--background-surface-background)' }"
          >
            <AvVIcon
              :name="MDI_ICONS.ATTACH_FILE"
              color="var(--foreground-text1)"
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
              <AvVIcon
                :name="MDI_ICONS.STAR_SHOOTING"
                color="var(--white)"
              />
            </div>
            <span class="b2-regular">{{ t('student.cards.studentTraceCard.skillCount', { count: skillCount }) }}</span>
          </div>
          <div class="student-trace-card__activities">
            <StudentCountAmsIconText
              :count-ams="activityCount"
              gap="0.75rem"
            />
          </div>
          <div class="student-trace-card__category">
            <AvIconText
              :icon="MDI_ICONS.SWAP_VERTICAL_VARIANT"
              :text="category"
              icon-color="var(--foreground-text1)"
              text-color="var(--foreground-text1)"
              typography-class="b2-regular"
              gap="0.75rem"
            />
          </div>
          <div class="student-trace-card__line student-trace-card__type">
            <DsfrTag
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
}

.av-card:hover {
  border: 1px solid v-bind('theme.hoverBorderColor') !important;
  box-shadow: 0 0 0 2px v-bind('theme.hoverBorderColor');
}

.student-trace-card__body {
  padding-top: 1.5rem;
}

.student-trace-card {
  display: flex;
  width: 17.125rem;
  height: 14rem;
  border-radius: 1.5rem;
}

.student-trace-card__title {
  position: relative
}

.student-trace-card__titlecontent {
  width: 11.25rem;
  height: 3rem;
}

.student-trace-card__titletruncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  overflow-wrap: break-word;
}

.student-trace-card__icon {
  position: absolute;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--other-border-skill-card);
  right: 0.75rem;
  top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
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

.student-trace-card__lineicon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.375rem;
  width: 1.375rem;
  border-radius: 0.25rem;
}

.student-trace-card__line.student-trace-card__skills {
    gap: 0.5rem;
}

.student-trace-card__categoryText {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}

.fr-tag {
  display: block;
  color: var(--foreground-text2);
  background-color: var(--light-background-neutral);
  align-items: center;
  padding: 0 0.5rem 0 0.5rem;
  min-height: unset;
  width: unset;
  border-radius: 0.25rem;
}
</style>
