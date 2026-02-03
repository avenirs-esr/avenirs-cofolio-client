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
import { AvPeriodInput, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
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
  capitalize(t('student.personalCareer.global.program'))
)
</script>

<template>
  <div
    class="av-col av-row--md av-gap-xl"
    data-testid="layout-declared-program-detailed"
  >
    <div
      class="layout-declared-program-detailed__main av-col av-gap-md column-equal"
      data-testid="layout-declared-program-detailed__main"
    >
      <DeclaredProgramTitleInput
        class="full-width-input"
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.title')"
        label-class="caption-regular"
        :model-value="title"
        disabled
      />

      <DeclaredProgramOrganizationInput
        class="full-width-input"
        label-class="caption-regular"
        :model-value="organization"
        disabled
      />

      <div class="period-input-wrapper">
        <AvPeriodInput
          class="compact-period-input"
          :label="t('student.personalCareer.interactions.formFields.DeclaredProgramPeriodFormField.label')"
          label-class="caption-regular"
          start-label="Start date"
          end-label="End date"
          :start-model-value="startDate ?? ''"
          :end-model-value="endDate ?? ''"
          :start-date-disabled="true"
          :end-date-disabled="true"
          :stacked="isMobile"
          separator-spacing="var(--spacing-sm)"
        />
      </div>

      <DeclaredProgramResultInput
        class="full-width-input"
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.result')"
        label-class="caption-regular"
        :model-value="result ?? ''"
        disabled
      />

      <DeclaredProgramSourceOfInformationInput
        class="full-width-input"
        label-class="caption-regular"
        :model-value="sourceOfInformation ?? ''"
        disabled
      />
    </div>

    <div
      class="layout-declared-program-detailed__side av-col av-gap-xl column-equal"
      data-testid="layout-declared-program-detailed__side"
    >
      <DeclaredProgramDescriptionTextarea
        class="expand-fill"
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.description')"
        label-class="caption-regular"
        :model-value="description ?? ''"
        disabled
      />

      <CreationUpdateDateDetails
        class="push-to-bottom"
        :created-at="createdAt"
        :created-at-prefix="createdAtPrefix"
        :updated-at="updatedAt"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.column-equal {
  flex: 1 1 0px !important;
  width: 0;
  min-width: 0;
  max-width: 100%;
}

.layout-declared-program-detailed__side {
  display: flex;
  flex-direction: column;

  .expand-fill {
    flex: 1;
    display: flex;
    flex-direction: column;

    :deep(textarea) {
      min-height: 10rem !important;
      height: 100% !important;
      resize: none;
      flex: 1;
    }
    :deep(.fr-input-group) {
      flex: 1; display: flex; flex-direction: column;
    }
  }
}

.push-to-bottom {
  margin-top: auto;
}

.period-input-wrapper {
  display: flex; justify-content: flex-start; width: auto;
}
.compact-period-input {
  width: auto !important;
  :deep(> div) { justify-content: flex-start !important; }
  :deep(.fr-input-group) { flex: 0 0 auto !important; width: auto !important; min-width: 0 !important; }
  :deep(input), :deep(.fr-input) { width: 10rem !important; min-width: 10rem !important; flex: 0 0 auto !important; }
}

.full-width-input {
  width: 100%;
  :deep(.fr-input-group), :deep(.fr-input), :deep(input) {
    width: 100% !important; max-width: 100% !important;
  }
}
</style>
