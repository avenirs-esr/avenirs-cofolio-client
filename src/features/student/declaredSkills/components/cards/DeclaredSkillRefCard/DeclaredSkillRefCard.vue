<script setup lang="ts">
import type {
  DeclaredSkillCategoryDTO,
  EExternalSkillType
} from '@/api/avenir-esr'
import { AvBadge, AvCard, AvIcon, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeclaredSkillRefCardProps {
  type: EExternalSkillType
  pathSegments: DeclaredSkillCategoryDTO[]
}

const { type, pathSegments } = defineProps<DeclaredSkillRefCardProps>()

const { t } = useI18n()
</script>

<template>
  <div
    class="av-col av-gap-xxs"
    data-testid="ref__container"
  >
    <span class="caption-regular">{{ t('student.declaredSkills.cards.DeclaredSkillRefCard.refTitle') }}</span>
    <AvCard>
      <div
        class="av-col av-gap-xs"
        data-testid="ref__content"
      >
        <div
          class="av-row av-gap-xxs av-align-center"
          data-testid="ref__type"
        >
          <AvIcon
            :name="MDI_ICONS.CIRCLE"
            color="var(--dark-background-primary1)"
            :size="0.5"
          />
          <AvBadge
            background-color="var(--surface-background)"
            border-color="var(--other-border-skill-card)"
            color="var(--text1)"
            :label="t(`student.declaredSkills.declaredSkillTypes.${type}`)"
            no-icon
          />
        </div>

        <div
          v-for="(segment, index) in pathSegments"
          :key="index"
          class="ref__item"
          :style="{ paddingLeft: `calc(${index + 1} * var(--spacing-sm))` }"
          data-testid="ref__item"
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
            class="av-row av-gap-xxs av-align-start"
            data-testid="ref__last-segment"
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
  &--item {
    :deep(.icon-text--container) {
      align-items: start;
    }
  }
}
</style>
