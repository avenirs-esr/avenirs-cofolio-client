<script setup lang="ts">
import type { DeclaredSkillProgressDetailsDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import ValorizedBadge from '@/common/components/badges/ValorizedBadge/ValorizedBadge.vue'
import Card from '@/common/components/cards/Card/Card.vue'
import DeclaredSkillLevelBadge from '@/features/student/declaredSkills/components/badges/DeclaredSkillLevelBadge/DeclaredSkillLevelBadge.vue'
import DeclaredSkillRefCard from '@/features/student/declaredSkills/components/cards/DeclaredSkillRefCard/DeclaredSkillRefCard.vue'
import DeclaredSkillReflectionInput
  from '@/features/student/declaredSkills/components/interactions/inputs/DeclaredSkillReflectionInput/DeclaredSkillReflectionInput.vue'
import { AvInput, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeclaredSkillDetailsProps {
  declaredSkillProgressDetails: DeclaredSkillProgressDetailsDTO
  hideValorizedBadge?: boolean
  disableRowLayout?: boolean
}

const {
  declaredSkillProgressDetails,
  hideValorizedBadge = false,
  disableRowLayout = false,
} = defineProps<DeclaredSkillDetailsProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
</script>

<template>
  <div
    class="av-col av-justify-center av-justify-between--md av-gap-xl"
    :class="{
      'av-row--md': !disableRowLayout,
      'layout-declared-skill-details--mobile': isMobile,
    }"
    data-testid="layout-declared-skill-details"
  >
    <div
      class="layout-declared-skill-details__main av-col av-gap-md"
      data-testid="layout-declared-skill-details__main"
    >
      <ValorizedBadge
        v-if="!hideValorizedBadge"
        :valorized="declaredSkillProgressDetails.valorized"
      />
      <AvInput
        :label="t('student.declaredSkills.views.StudentDeclaredSkillView.declaredSkillDetails.skillTitle')"
        label-class="caption-regular"
        :model-value="declaredSkillProgressDetails.title"
        disabled
      />
      <DeclaredSkillRefCard
        :type="declaredSkillProgressDetails.type"
        :path-segments="declaredSkillProgressDetails.pathSegments"
      />
      <Card
        class="level-card"
        border-color="transparent"
      >
        <div
          class="av-row av-align-center av-w-full av-gap-sm"
          data-testid="level-card__content"
        >
          <span class="b2-regular">{{ t('student.declaredSkills.views.StudentDeclaredSkillView.declaredSkillDetails.levelTitle') }}</span>
          <DeclaredSkillLevelBadge :level="declaredSkillProgressDetails.level" />
        </div>
      </Card>
    </div>
    <div
      class="layout-declared-skill-details__side av-col av-gap-xl av-justify-between"
      data-testid="layout-declared-skill-details__side"
    >
      <DeclaredSkillReflectionInput
        :model-value="declaredSkillProgressDetails.reflection"
        disabled
      />

      <div class="av-row av-justify-end">
        <CreationUpdateDateDetails
          :created-at="declaredSkillProgressDetails.createdAt"
          :updated-at="declaredSkillProgressDetails.updatedAt"
          has-feminine-label
        />
      </div>
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
