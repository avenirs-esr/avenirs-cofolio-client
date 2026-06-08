<script setup lang="ts">
import type { DeclaredExperienceViewDTO, EExperienceType } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import DeclaredExperienceActivitySectorInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceActivitySectorInput/DeclaredExperienceActivitySectorInput.vue'
import DeclaredExperienceDescriptionTextarea
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceDescriptionTextarea/DeclaredExperienceDescriptionTextarea.vue'
import DeclaredExperienceExternalLinkInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceExternalLinkInput/DeclaredExperienceExternalLinkInput.vue'
import DeclaredExperienceLocationInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceLocationInput/DeclaredExperienceLocationInput.vue'
import DeclaredExperienceOrganizationInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceOrganizationInput/DeclaredExperienceOrganizationInput.vue'
import DeclaredExperiencePeriodInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperiencePeriodInput/DeclaredExperiencePeriodInput.vue'
import DeclaredExperienceSourceOfInformationInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceSourceOfInformationInput/DeclaredExperienceSourceOfInformationInput.vue'
import DeclaredExperienceSummaryTextarea
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceSummaryTextarea/DeclaredExperienceSummaryTextarea.vue'
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
  capitalize(t('student.personalCareer.global.experience'))
)
</script>

<template>
  <div
    class="av-col av-row--md av-justify-between av-gap-xl"
    data-testid="layout-declared-experience-detailed"
  >
    <div
      class="layout-declared-experience-detailed__main av-col av-gap-md av-flex-fill av-justify-between"
      data-testid="layout-declared-experience-detailed__main"
    >
      <div class="av-col av-row--md av-gap-md av-align-baseline--md">
        <div class="av-flex-fill">
          <DeclaredExperienceTitleInput
            :model-value="title"
            disabled
          />
        </div>
        <div class="av-flex-fill">
          <DeclaredExperienceTypeSelect
            :model-value="{ itemId: experienceType as EExperienceType }"
            disabled
          />
        </div>
      </div>

      <DeclaredExperienceOrganizationInput
        :model-value="organization"
        disabled
      />

      <div class="av-col av-row--md av-gap-md av-align-baseline--md">
        <div class="av-flex-fill">
          <DeclaredExperienceActivitySectorInput
            :model-value="activitySector"
            disabled
          />
        </div>
        <div class="av-flex-fill">
          <DeclaredExperienceLocationInput
            :model-value="location"
            disabled
          />
        </div>
      </div>

      <DeclaredExperiencePeriodInput
        label-visible
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

      <DeclaredExperienceExternalLinkInput
        :label="t('student.personalCareer.interactions.inputs.DeclaredExperienceExternalLinkInput.labelDetails')"
        :model-value="externalLink"
        disabled
      />
    </div>

    <div
      class="layout-declared-experience-detailed__side av-col av-gap-xl av-flex-fill"
      data-testid="layout-declared-experience-detailed__side"
    >
      <div class="av-col av-gap-sm av-h-full">
        <DeclaredExperienceDescriptionTextarea
          :model-value="description ?? ''"
          disabled
        />

        <DeclaredExperienceSummaryTextarea
          :model-value="summary ?? ''"
          disabled
        />
      </div>

      <CreationUpdateDateDetails
        :created-at="createdAt"
        :created-at-prefix="createdAtPrefixed"
        :updated-at="updatedAt"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-declared-experience-detailed__side {
  :deep(textarea) {
    height: 100% !important;
    min-height: 10rem;
    flex: 1;
    resize: none;
  }
}
</style>
