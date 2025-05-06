<script lang="ts" setup>
import type { AvSkillCardProps } from './types'
import { type DsfrBadgeProps, VIcon } from '@gouvminint/vue-dsfr'
import { AvCard } from '.'
import { AvSkillAcademicIcon } from '../icons'
import { palette, RI_ICONS } from '../tokens'
import { defaultAvSkillCardProps } from './defaults'

const props = withDefaults(defineProps<AvSkillCardProps>(), defaultAvSkillCardProps)

function getFirstBadge (): { label: string, type: DsfrBadgeProps['type'] } {
  if (props.lastValidatedLevel === 0) {
    switch (props.currentLevelStatus) {
      case 'toEvaluate':
        return { label: `Niv. ${props.lastValidatedLevel + 1} à évaluer`, type: 'new' }
      case 'evaluating':
        return { label: `Niv. ${props.lastValidatedLevel + 1} en cours d'évaluation`, type: 'info' }
    }
  }
  else {
    return { label: `Niv. ${props.lastValidatedLevel} validé`, type: 'success' }
  }
}

function getSecondBadge (): { label: string, type: DsfrBadgeProps['type'] } {
  if (props.lastValidatedLevel > 0 && props.lastValidatedLevel < props.maxLevel) {
    return { label: `Niv. ${props.lastValidatedLevel + 1} à évaluer`, type: 'new' }
  }
  else {
    return { label: '', type: 'info' }
  }
}

const IconToRender = props.skill === 'academic' ? AvSkillAcademicIcon : AvSkillAcademicIcon
const shouldRenderSecondBadge = props.lastValidatedLevel > 0 && props.lastValidatedLevel < props.maxLevel && props.currentLevelStatus !== 'evaluating'
const firstBadge = getFirstBadge()
const secondBadge = getSecondBadge()
</script>

<template>
  <AvCard
    :border-color="palette.other.border.skillCard"
    :title-background="props.skillColor"
    height="268px"
  >
    <template #title>
      <div
        class="av-skill-card__header"
      >
        <h5
          class="av-skill-card__title"
          :style="{ '--av-skill-card-title-color': palette.background.card2 }"
        >
          {{ props.title }}
        </h5>
        <div
          class="av-skill-card__icon"
          :style="{ '--av-skill-card-icon-bg': props.skillColor }"
        >
          <component
            :is="IconToRender"
            size="35"
            color="white"
            class="av-skill-card__svg"
          />
        </div>
      </div>
    </template>

    <template #body>
      <div class="av-skill-card__body">
        <div class="av-skill-card__line">
          <VIcon :name="RI_ICONS.ATTACHMENT" />
          <span class="av-skill-card__desc">{{ props.attachments }} traces</span>
        </div>
        <div class="av-skill-card__line">
          <VIcon :name="RI_ICONS.TEST_TUBE" />
          <span class="av-skill-card__desc">{{ props.practices }} mises en situation</span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="av-skill-card__badges">
        <DsfrBadge
          :label="firstBadge.label"
          :type="firstBadge.type"
          small
          ellipsis
        />
        <DsfrBadge
          v-if="shouldRenderSecondBadge"
          :label="secondBadge.label"
          :type="secondBadge.type"
          small
          ellipsis
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.av-skill-card {
  &__header {
    position: relative;
    width: 244px;
    height: 84px;
  }

  &__title {
    color: var(--av-skill-card-title-color);
    line-height: 30px;
  }

  &__icon {
    position: absolute;
    width: 51px;
    height: 51px;
    border-radius: 10px;
    border: 1px solid white;
    background-color: var(--av-skill-card-icon-bg);
    right: 0;
    top: 84px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__line {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: center;
  }

  &__badges {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__desc {
    font-size: 14px;
  }
}

.fr-badge--success {
  color: $light-foreground-success;
  background-color: $light-background-success;
}

.fr-badge--new {
  color: $foreground-text1;
  background-color: $light-background-neutral;
}

.fr-badge--info {
  color: $dark-background-primary1;
  background-color: $light-foreground-primary2;
}
</style>
