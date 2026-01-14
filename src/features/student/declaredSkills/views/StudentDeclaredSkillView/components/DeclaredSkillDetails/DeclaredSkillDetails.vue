<script setup lang="ts">
import type { DeclaredSkillProgressDetailsDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import DeclaredSkillLevelBadge from '@/features/student/declaredSkills/components/badges/DeclaredSkillLevelBadge/DeclaredSkillLevelBadge.vue'
import DeclaredSkillRefCard from '@/features/student/declaredSkills/components/cards/DeclaredSkillRefCard/DeclaredSkillRefCard.vue'
import DeclaredSkillCommentInput
  from '@/features/student/declaredSkills/components/interactions/inputs/DeclaredSkillCommentInput/DeclaredSkillCommentInput.vue'
import { AvCard, AvInput, RI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface DeclaredSkillDetailsProps {
  declaredSkillProgressDetails: DeclaredSkillProgressDetailsDTO
}

const { declaredSkillProgressDetails } = defineProps<DeclaredSkillDetailsProps>()
const { title, description, type, pathSegments, level, createdAt, updatedAt } = declaredSkillProgressDetails
const { t } = useI18n()
const { isMobile } = useAvBreakpoints()

const createdAtPrefix = computed(() => capitalize(t('student.skills.skill')))
</script>

<template>
  <div
    class="layout-declared-skill-details"
    :class="{
      'layout-declared-skill-details--mobile': isMobile,
    }"
  >
    <div class="layout-declared-skill-details__main">
      <AvInput
        :label="t('student.declaredSkills.views.StudentDeclaredSkillView.declaredSkillDetails.skillTitle')"
        label-class="caption-regular"
        :prefix-icon="RI_ICONS.LOADER_LINE"
        :model-value="title"
        disabled
      />
      <DeclaredSkillRefCard
        :type="type"
        :path-segments="pathSegments"
      />
      <AvCard
        class="level-card"
        border-color="transparent"
      >
        <div class="level-card--content">
          <span class="b2-regular">{{ t('student.declaredSkills.views.StudentDeclaredSkillView.declaredSkillDetails.levelTitle') }}</span>
          <DeclaredSkillLevelBadge :level="level" />
        </div>
      </AvCard>
      <CreationUpdateDateDetails
        :created-at="createdAt"
        :created-at-prefix="createdAtPrefix"
        :updated-at="updatedAt"
      />
    </div>
    <div class="layout-declared-skill-details__side">
      <DeclaredSkillCommentInput
        :model-value="description"
        disabled
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-declared-skill-details {
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
