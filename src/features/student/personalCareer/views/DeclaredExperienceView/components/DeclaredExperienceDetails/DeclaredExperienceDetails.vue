<script setup lang="ts">
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import DeclaredExperienceActivitySectorInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceActivitySectorInput/DeclaredExperienceActivitySectorInput.vue'
import DeclaredExperienceDescriptionTextarea
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceDescriptionTextarea/DeclaredExperienceDescriptionTextarea.vue'
import DeclaredExperienceLinkInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceLinkInput/DeclaredExperienceLinkInput.vue'
import DeclaredExperienceLocationInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceLocationInput/DeclaredExperienceLocationInput.vue'
import DeclaredExperienceOrganizationInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceOrganizationInput/DeclaredExperienceOrganizationInput.vue'
import DeclaredExperiencePeriodInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperiencePeriodInput/DeclaredExperiencePeriodInput.vue'
import DeclaredExperienceReviewTextarea
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceReviewTextarea/DeclaredExperienceReviewTextarea.vue'
import DeclaredExperienceSourceOfInformationInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceSourceOfInformationInput/DeclaredExperienceSourceOfInformationInput.vue'
import DeclaredExperienceTitleInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTitleInput/DeclaredExperienceTitleInput.vue'
import DeclaredExperienceTypeSelect
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceTypeSelect/DeclaredExperienceTypeSelect.vue'
import { useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface DeclaredExperienceDetailedProps {
  declaredExperienceDetails: DeclaredExperienceViewDTO
}

const { declaredExperienceDetails } = defineProps<DeclaredExperienceDetailedProps>()

const {
  title,
  experienceType,
  organization,
  activitySector,
  location,
  description,
  sourceOfInformation,
  summary,
  externalLink,
  startDate,
  endDate,
  createdAt,
  updatedAt,
} = toRefs(declaredExperienceDetails)

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()

const createdAtPrefixed = computed(() =>
  capitalize(t('student.personalCareer.views.DeclaredExperienceView.DeclaredExperienceDetails.experience'))
)
</script>

<template>
  <div
    class="av-col av-row--md av-justify-between av-gap-xl"
    data-testid="layout-declared-experience-detailed"
  >
    <div
      class="layout-declared-experience-detailed__main av-col av-gap-md av-flex-fill"
      data-testid="layout-declared-experience-detailed__main"
    >
      <div class="av-row av-justify-between av-align-center">
        <DeclaredExperienceTitleInput
          :model-value="title"
          disabled
        />

        <DeclaredExperienceTypeSelect
          class="av-flex-fill av-max-width-select"
          :model-value="experienceType"
          disabled
        />
      </div>

      <div class="av-row av-justify-between av-align-center">
        <DeclaredExperienceOrganizationInput
          :model-value="organization"
          disabled
        />

        <DeclaredExperienceLocationInput
          :model-value="location"
          disabled
        />
      </div>

      <DeclaredExperienceActivitySectorInput
        :model-value="activitySector"
        disabled
      />

      <DeclaredExperiencePeriodInput
        :start-model-value="startDate ?? ''"
        :end-model-value="endDate ?? ''"
        :start-date-disabled="true"
        :end-date-disabled="true"
        :stacked="isMobile"
      />

      <DeclaredExperienceSourceOfInformationInput
        :model-value="sourceOfInformation"
        disabled
      />

      <DeclaredExperienceLinkInput
        :label="t('student.personalCareer.interactions.inputs.DeclaredExperienceLinkInput.labelDetails')"
        :model-value="externalLink"
        disabled
      />
    </div>

    <div
      class="layout-declared-experience-detailed__side av-col av-gap-xl av-flex-fill"
      data-testid="layout-declared-experience-detailed__side"
    >
      <DeclaredExperienceDescriptionTextarea
        :model-value="description ?? ''"
        disabled
      />

      <DeclaredExperienceReviewTextarea
        :model-value="summary ?? ''"
        disabled
      />

      <CreationUpdateDateDetails
        :created-at="createdAt"
        :created-at-prefix="createdAtPrefixed"
        :updated-at="updatedAt"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-declared-experience-detailed {
  &__side {
    :deep(textarea) {
      min-height: 10rem !important;
      resize: none;
    }
  }
}

.av-max-width-select {
  max-width: 16rem;
}
</style>
