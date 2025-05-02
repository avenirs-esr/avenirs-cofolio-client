<script lang="ts" setup>
import type { AvSkillCardProps } from './types'
import { type DsfrBadgeProps, VIcon } from '@gouvminint/vue-dsfr'
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
  <div
    class="av-skill-card"
    :style="{ '--av-skill-card-bg': palette.background.card }"
  >
    <div
      class="av-skill-card__header"
      :style="{ '--av-skill-card-header-bg': props.skillColor }"
    >
      <div class="av-skill-card__content">
        <h5
          class="av-skill-card__title"
          :style="{ '--av-skill-card-title-color': palette.background.card2 }"
        >
          {{ props.title }}
        </h5>
      </div>
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
    <div class="av-skill-card__body">
      <div class="av-skill-card__bodycontent">
        <div class="av-skill-card__line">
          <VIcon :name="RI_ICONS.ATTACHMENT" />
          <span class="av-skill-card__desc">{{ props.attachments }} traces</span>
        </div>
        <div class="av-skill-card__line">
          <VIcon :name="RI_ICONS.TEST_TUBE" />
          <span class="av-skill-card__desc">{{ props.practices }} mises en situation</span>
        </div>
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.av-skill-card {
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  border: 1px solid #D9D9DA;
  overflow: hidden;
  background-color: var(--av-skill-card-bg);
  width: fit-content;
  height: 268px;

  &__header {
    padding: 1rem 1rem 0.5rem;
    background-color: var(--av-skill-card-header-bg);
    color: var(--av-skill-card-title-color);
    position: relative;
  }

  &__title {
    color: var(--av-skill-card-title-color);
  }

  &__icon {
    position: absolute;
    width: 51px;
    height: 51px;
    border-radius: 10px;
    border: 1px solid white;
    background-color: var(--av-skill-card-icon-bg);
    right: 20px;
    bottom: -35px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__body {
    position: relative;
    padding: 1rem 1rem 0.75rem;
    flex-grow: 1;
    box-sizing: border-box;
  }

  &__content {
    display: flex;
    flex-direction: column;
    width: 244px;
    gap: 0.75rem;
  }

  &__bodycontent {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 244px;
    gap: 0.75rem;
    bottom: 0.75rem;
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
</style>
