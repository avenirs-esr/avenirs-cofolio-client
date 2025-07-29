<script lang="ts" setup>
import type { AdditionalSkillDTO } from '@/api/avenir-esr'

import { AvBadge, AvCard, AvVIcon, MDI_ICONS } from '@/ui'

export interface StudentDetailedAdditionalSkillCardProps {
  additionalSkill: AdditionalSkillDTO
}

const { additionalSkill } = defineProps<StudentDetailedAdditionalSkillCardProps>()
const basePath = import.meta.env.BASE_URL
const skillColor = 'var(--dark-background-primary1)'
const typeBadge = {
  label: additionalSkill.type,
  color: 'var(--text1)',
  borderColor: 'var(--other-border-skill-card)',
  backgroundColor: 'var(--surface-background)',
  iconPath: `${basePath}assets/icons/bookmark-check.svg`
}
const pathBadge = {
  label: additionalSkill.pathSegments.join(', '),
  color: 'var(--dark-background-accent)',
  backgroundColor: 'var(--light-background-accent)',
  iconPath: `${basePath}assets/icons/stars.svg`
}
</script>

<template>
  <AvCard
    border-color="var(--other-border-skill-card)"
    title-background="var(--dark-background-primary1)"
  >
    <template #title>
      <div class="title-container ellipsis-container">
        <span class="n5 ellipsis">
          {{ additionalSkill.title }}
        </span>
        <div
          class="icon-container"
          :style="{ background: skillColor }"
        >
          <AvVIcon
            :name="MDI_ICONS.STARS"
            color="var(--other-background-base)"
            :size="2.5625"
          />
        </div>
      </div>
    </template>
    <template #body>
      <div class="body-container">
        <div class="firstline-container">
          <div class="line-container">
            <AvBadge
              v-bind="typeBadge"
              small
              ellipsis
            />
            <AvBadge
              v-bind="pathBadge"
              small
              ellipsis
            />
          </div>
        </div>
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.av-card {
  width: 100%;
}

.av-card:hover {
  border: 1px solid v-bind('skillColor') !important;
  box-shadow: 0 0 0 2px v-bind('skillColor');
}

.title-container {
  position: relative
}

.icon-container {
  position: absolute;
  width: 3.125rem;
  height: 3.125rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--other-background-base);
  right: 0;
  top: var(--spacing-xl);
  display: flex;
  justify-content: center;
  align-items: center;
}

.body-container {
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   gap: var(--spacing-xxs);
   padding-top: var(--spacing-xs);
 }

.firstline-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-right: 3.5rem;
}

.line-container {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-sm);
  align-items: center;
}

.n6 {
  color: var(--text1);
}

.n5 {
  color: var(--other-background-base);
}
</style>
