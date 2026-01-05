<script setup lang="ts">
import type {
  AdditionalSkillCategoryDTO,
  EExternalSkillType
} from '@/api/avenir-esr'
import { AvBadge, AvCard, AvIcon, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AdditionalSkillRefCardProps {
  type: EExternalSkillType
  pathSegments: AdditionalSkillCategoryDTO[]
}

const { type, pathSegments } = defineProps<AdditionalSkillRefCardProps>()

const { t } = useI18n()
</script>

<template>
  <div class="ref--container">
    <span class="caption-regular">{{ t('student.additionalSkills.cards.AdditionalSkillRefCard.refTitle') }}</span>
    <AvCard>
      <div class="ref--content">
        <div class="ref--type">
          <AvIcon
            :name="MDI_ICONS.CIRCLE"
            color="var(--dark-background-primary1)"
            :size="0.5"
          />
          <AvBadge
            background-color="var(--surface-background)"
            border-color="var(--other-border-skill-card)"
            color="var(--text1)"
            :label="t(`student.additionalSkills.additionalSkillTypes.${type}`)"
            no-icon
          />
        </div>

        <div
          v-for="(segment, index) in pathSegments"
          :key="index"
          class="ref--item"
          :style="{ paddingLeft: `calc(${index + 1} * var(--spacing-sm))` }"
        >
          <AvIconText
            v-if="index < pathSegments.length - 1"
            :icon="MDI_ICONS.ARROW_RIGHT_BOTTOM"
            icon-color="var(--dark-background-primary1)"
            :text="segment.libelle"
            text-color="var(--text1)"
            inline
          />
          <div
            v-else
            class="ref--last-segment"
          >
            <AvIcon
              :name="MDI_ICONS.ARROW_RIGHT_BOTTOM"
              color="var(--dark-background-primary1)"
              :size="1.3125"
            />
            <AvBadge
              background-color="var(--light-background-accent)"
              color="var(--dark-background-accent)"
              :label="segment.libelle"
              no-icon
            />
          </div>
        </div>
      </div>
    </AvCard>
  </div>
</template>

<style scoped lang="scss">
.ref {
  &--container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxs);
  }

  &--content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &--type, &--last-segment {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-xxs);
    align-items: center;
  }

  &--last-segment {
    align-items: start;
  }

  &--item {
    :deep(.icon-text--container) {
      align-items: start;
    }
  }
}
</style>
