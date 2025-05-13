<script lang="ts" setup>
import type { LevelDTO, SkillDTO } from '@/types'
import type { DsfrBadgeProps } from '@gouvminint/vue-dsfr'
import type { RouteLocationRaw } from 'vue-router'
import { STUDENT_EDUCATION_SKILLS_ROUTE } from '@/features/student/routes'
import { MDI_ICONS } from '@/ui'
import AvCard from '../AvCard/AvCard.vue'

export interface AvSkillCardProps {
  skill: SkillDTO
  skillColor: string
  to?: RouteLocationRaw
}

const { skill, skillColor, to = { name: STUDENT_EDUCATION_SKILLS_ROUTE } } = defineProps<AvSkillCardProps>()
const { name, trackCount, activityCount, levels } = skill

function levelStatusToBadgeInfo (status: LevelDTO['status']): { status: string, type: DsfrBadgeProps['type'] } {
  switch (status) {
    case 'TO_EVALUATE':
      return { status: 'à évaluer', type: 'new' }
    case 'UNDER_REVIEW':
      return { status: 'en cours d\'évaluation', type: 'info' }
    case 'VALIDATED':
      return { status: 'validé', type: 'success' }
    case 'NOT_VALIDATED':
      return { status: 'non validé', type: 'error' }
  }
}

function levelToBadge (level: LevelDTO) {
  const { status, type } = levelStatusToBadgeInfo(level.status)
  const label = `${level.name} ${status}`

  return { label, type }
}

const firstBadge = computed(() => levelToBadge(levels[0]))
const secondBadge = computed(() => levels.length > 1 ? levelToBadge(levels[1]) : undefined)
</script>

<template>
  <div class="av-skill-card">
    <RouterLink :to="to">
      <AvCard
        border-color="--other-skill-card-border"
        :title-background="skillColor"
        title-height="6.6875rem"
        :style="{ '--hover-border-color': `var(${skillColor})` }"
      >
        <template #title>
          <div class="av-skill-card__title">
            <h6 class="n6">
              {{ name }}
            </h6>
            <div
              class="av-skill-card__icon"
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
          <div class="av-skill-card__body">
            <div class="av-skill-card__line">
              <VIcon :name="MDI_ICONS.ATTACH_FILE" />
              <span class="av-skill-card__desc">{{ trackCount }} traces</span>
            </div>
            <div class="av-skill-card__line">
              <VIcon :name="MDI_ICONS.TEST_TUBE_EMPTY" />
              <span class="av-skill-card__desc">{{ activityCount }} mises en situation</span>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="av-skill-card__footer">
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
  </div>
</template>

<style lang="scss" scoped>
.av-card:hover {
  border: 1px solid var(--hover-border-color) !important;
  box-shadow: 0 0 0 2px var(--hover-border-color);
}

.av-skill-card {
  width: 17.25rem;
}

.av-card {
  height: 16.875rem;
}

.av-skill-card__title {
  position: relative
}

.av-skill-card__icon {
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

.av-skill-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.av-skill-card__line {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: center;
}

.av-skill-card__footer {
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
