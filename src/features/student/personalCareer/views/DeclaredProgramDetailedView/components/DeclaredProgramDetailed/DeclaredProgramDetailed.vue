<script setup lang="ts">
import type { DeclaredProgramDetailedDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import DeclaredProgramDescriptionTextarea
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramDescriptionTextarea/DeclaredProgramDescriptionTextarea.vue'
import DeclaredProgramOrganizationInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramOrganizationInput/DeclaredProgramOrganizationInput.vue'
import DeclaredProgramResultInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramResultInput/DeclaredProgramResultInput.vue'
import DeclaredProgramSourceOfInformationInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramSourceOfInformationInput/DeclaredProgramSourceOfInformationInput.vue'
import DeclaredProgramTitleInput
  from '@/features/student/personalCareer/components/interactions/inputs/DeclaredProgramTitleInput/DeclaredProgramTitleInput.vue'
import { AvPeriodInput, MDI_ICONS, RI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface DeclaredProgramDetailedProps {
  declaredProgramDetailed: DeclaredProgramDetailedDTO
}

const { declaredProgramDetailed } = defineProps<DeclaredProgramDetailedProps>()

const {
  title,
  organization,
  startDate,
  endDate,
  result,
  sourceOfInformation,
  description,
  createdAt,
  updatedAt,
} = declaredProgramDetailed

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()

const createdAtPrefix = computed(() =>
  capitalize(t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.program'))
)
</script>

<template>
  <div
    class="av-col av-row--md av-justify-between av-gap-xl"
    data-testid="layout-declared-program-detailed"
  >
    <div
      class="layout-declared-program-detailed__main av-col av-gap-md av-flex-fill"
      data-testid="layout-declared-program-detailed__main"
    >
      <DeclaredProgramTitleInput
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.title')"
        label-class="caption-regular"
        :prefix-icon="RI_ICONS.LOADER_LINE"
        :model-value="title"
        disabled
      />

      <DeclaredProgramOrganizationInput
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.organization')"
        label-class="caption-regular"
        :prefix-icon="MDI_ICONS.BUILDING"
        :model-value="organization"
        disabled
      />

      <AvPeriodInput
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.period')"
        label-class="caption-regular"
        start-label="Start date"
        end-label="End date"
        :start-model-value="startDate ?? ''"
        :end-model-value="endDate ?? ''"
        :disabled="true"
        :stacked="isMobile"
        separator-spacing="var(--spacing-sm)"
      />

      <DeclaredProgramResultInput
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.result')"
        label-class="caption-regular"
        :prefix-icon="RI_ICONS.LAYOUT_6_LINE"
        :model-value="result ?? ''"
        disabled
      />

      <DeclaredProgramSourceOfInformationInput
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.sourceOfInformation')"
        label-class="caption-regular"
        :prefix-icon="MDI_ICONS.NEWSPAPER_VARIANT"
        :model-value="sourceOfInformation ?? ''"
        disabled
      />
    </div>

    <div
      class="layout-declared-program-detailed__side av-col av-gap-xl av-flex-fill"
      data-testid="layout-declared-program-detailed__side"
    >
      <DeclaredProgramDescriptionTextarea
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.description')"
        label-class="caption-regular"
        :model-value="description ?? ''"
        disabled
      />

      <CreationUpdateDateDetails
        :created-at="createdAt"
        :created-at-prefix="createdAtPrefix"
        :updated-at="updatedAt"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-declared-program-detailed {
  &__side {
    :deep(textarea) {
      min-height: 35vh !important;
      resize: none;
    }
  }
}
</style>
