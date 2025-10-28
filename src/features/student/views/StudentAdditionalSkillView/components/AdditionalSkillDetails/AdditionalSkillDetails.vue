<script setup lang="ts">
import { type AdditionalSkillCategoryDTO, type AdditionalSkillProgressDetailsDTO, EAdditionalSkillCategoryType } from '@/api/avenir-esr'
import { useDateUtils } from '@/common/composables'
import AdditionalSkillLevelBadge from '@/features/student/components/badges/AdditionalSkillLevelBadge/AdditionalSkillLevelBadge.vue'
import { AvBadge, AvCard, AvIcon, AvIconText, AvInput, MDI_ICONS, RI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AdditionalSkillDetailsProps {
  additionalSkillProgressDetails: AdditionalSkillProgressDetailsDTO
}

const { additionalSkillProgressDetails } = defineProps<AdditionalSkillDetailsProps>()
const { title, description, type, pathSegments, level, createdAt, updatedAt } = additionalSkillProgressDetails

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
const { formatTranslatedDateTime } = useDateUtils()

function getPathSegmentLabel (segment: AdditionalSkillCategoryDTO) {
  const before = t(`student.additionalSkillCategoryTypes.${EAdditionalSkillCategoryType[segment.type]}`)
  return t('global.colon', { before, after: segment.libelle })
}
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
      <div class="ref--container">
        <span class="caption-regular">{{ t('student.views.studentAdditionalSkillView.tabs.details.refTitle') }}</span>
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
                :label="t(`student.additionalSkillTypes.${type}`)"
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
                :text="getPathSegmentLabel(segment)"
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
                  :label="getPathSegmentLabel(segment)"
                  no-icon
                />
              </div>
            </div>
          </div>
        </AvCard>
      </div>
      <AvCard
        class="level-card"
        border-color="transparent"
      >
        <div class="level-card--content">
          <span class="b2-regular">{{ t('student.views.studentAdditionalSkillView.tabs.details.levelTitle') }}</span>
          <AdditionalSkillLevelBadge :level="level" />
        </div>
      </AvCard>
      <div class="date-details">
        <AvIconText
          v-if="createdAt"
          :icon="RI_ICONS.LOADER_LINE"
          :text="t('student.views.studentAdditionalSkillView.tabs.details.dateDetails.added',
                   { date: formatTranslatedDateTime(createdAt) })"
        />
        <AvIconText
          v-if="updatedAt"
          :icon="MDI_ICONS.PENCIL_OUTLINE"
          :text="t('student.views.studentAdditionalSkillView.tabs.details.dateDetails.updated',
                   { date: formatTranslatedDateTime(updatedAt) })"
        />
      </div>
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
      height: 75vh !important;
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

    :deep(.fr-badge span) {
      text-transform: initial !important;
    }
  }

  &--item {
    :deep(.icon-text--container) {
      align-items: start;
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
