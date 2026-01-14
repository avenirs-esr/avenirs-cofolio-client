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
    class="av-row av-wrap av-nowrap--md av-justify-center av-justify-between--md av-gap-xl"
    :class="{
      'layout-declared-skill-details--mobile': isMobile,
    }"
    data-testid="layout-declared-skill-details"
  >
    <div
      class="layout-declared-skill-details__main av-col av-gap-md"
      data-testid="layout-declared-skill-details__main"
    >
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
        <div
          class="av-row av-align-center av-w-full av-gap-sm"
          data-testid="level-card__content"
        >
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
    <div
      class="layout-declared-skill-details__side av-col av-gap-xl"
      data-testid="layout-declared-skill-details__side"
    >
      <DeclaredSkillCommentInput
        :model-value="description"
        disabled
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-declared-skill-details {
  &__main {
    flex: 1 1 300px;
    min-width: 300px;
  }

  &__side {
    flex: 1 1 300px;
    min-width: 300px;

    :deep(textarea) {
      min-height: 35vh !important;
      resize: none;
    }
  }

  &--mobile {
    &__side,
    &__main {
      flex: 1 1 100%;
      max-width: 100%;
    }
  }
}

:deep() {
  .av-card {
    border-radius: var(--radius-lg) !important;
  }
}
</style>
