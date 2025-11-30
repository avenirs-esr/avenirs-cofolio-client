<script setup lang="ts">
import type { AdditionalSkillProgressDetailsDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import AdditionalSkillLevelBadge from '@/features/student/additionalSkills/components/badges/AdditionalSkillLevelBadge/AdditionalSkillLevelBadge.vue'
import AdditionalSkillRefCard from '@/features/student/additionalSkills/components/cards/AdditionalSkillRefCard/AdditionalSkillRefCard.vue'
import { AvCard, AvInput, RI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface AdditionalSkillDetailsProps {
  additionalSkillProgressDetails: AdditionalSkillProgressDetailsDTO
}

const { additionalSkillProgressDetails } = defineProps<AdditionalSkillDetailsProps>()
const { title, description, type, pathSegments, level, createdAt, updatedAt } = additionalSkillProgressDetails

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()

const createdAtPrefix = computed(() => capitalize(t('student.skills.skill')))
</script>

<template>
  <div
    class="layout-additional-skill-details"
    :class="{
      'layout-additional-skill-details--mobile': isMobile,
    }"
  >
    <div class="layout-additional-skill-details__main">
      <AvInput
        :label="t('student.views.studentAdditionalSkillView.tabs.details.skillTitle')"
        label-class="caption-regular"
        :prefix-icon="RI_ICONS.LOADER_LINE"
        :model-value="title"
        disabled
      />
      <AdditionalSkillRefCard
        :type="type"
        :path-segments="pathSegments"
      />
      <AvCard
        class="level-card"
        border-color="transparent"
      >
        <div class="level-card--content">
          <span class="b2-regular">{{ t('student.views.studentAdditionalSkillView.tabs.details.levelTitle') }}</span>
          <AdditionalSkillLevelBadge :level="level" />
        </div>
      </AvCard>
      <CreationUpdateDateDetails
        :created-at="createdAt"
        :created-at-prefix="createdAtPrefix"
        :updated-at="updatedAt"
      />
    </div>
    <div class="layout-additional-skill-details__side">
      <AvInput
        :label="t('student.views.studentAdditionalSkillView.tabs.details.descriptionTitle')"
        label-class="caption-regular"
        :model-value="description"
        :maxlength="400"
        is-textarea
        disabled
      >
        <template #customCaptions>
          <span class="caption-regular">
            {{ t('global.inputs.limit', { count: description?.length ?? 0, maxlength: 400 }) }}
          </span>
        </template>
      </AvInput>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-additional-skill-details {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: var(--spacing-xl);

  &__main {
    display: flex;
    flex-direction: column;
    flex: 1 1 300px;
    min-width: 300px;
    gap: var(--spacing-md);
  }

  &__side {
    display: flex;
    flex-direction: column;
    flex: 1 1 300px;
    min-width: 300px;
    gap: var(--spacing-xl);

    :deep(textarea) {
      min-height: 35vh !important;
      resize: none;
    }
  }

  &--mobile {
    flex-wrap: wrap;
    justify-content: center;

    &__side,
    &__main {
      flex: 1 1 100%;
      max-width: 100%;
    }
  }
}

.level-card {
  &--content {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: var(--spacing-sm);
  }
}

.date-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

:deep() {
  .av-card {
    border-radius: var(--radius-lg) !important;
  }
}
</style>
