<script setup lang="ts">
import type { DeclaredProgramDetailedDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import { AvInput, AvPeriodInput, MDI_ICONS, RI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
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
  capitalize(t('student.personalCareer.views.DeclaredProgramDetailedView.declaredProgramDetailed.program'))
)
</script>

<template>
  <div
    class="av-row av-wrap av-nowrap--md av-justify-center av-justify-between--md av-gap-xl"
    :class="{ 'layout-declared-program-detailed--mobile': isMobile }"
    data-testid="layout-declared-program-detailed"
  >
    <div
      class="layout-declared-program-detailed__main av-col av-gap-md"
      data-testid="layout-declared-program-detailed__main"
    >
      <AvInput
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.declaredProgramDetailed.title')"
        label-class="caption-regular"
        :prefix-icon="RI_ICONS.LOADER_LINE"
        :model-value="title"
        disabled
      />

      <AvInput
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.declaredProgramDetailed.organization')"
        label-class="caption-regular"
        :prefix-icon="MDI_ICONS.BUILDING"
        :model-value="organization"
        disabled
      />

      <AvPeriodInput
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.declaredProgramDetailed.period')"
        label-class="caption-regular"
        start-label="Start date"
        end-label="End date"
        :start-model-value="startDate ?? ''"
        :end-model-value="endDate ?? ''"
        :disabled="true"
        :stacked="isMobile"
        separator-spacing="var(--spacing-sm)"
      />

      <AvInput
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.declaredProgramDetailed.result')"
        label-class="caption-regular"
        :prefix-icon="RI_ICONS.LAYOUT_6_LINE"
        :model-value="result ?? ''"
        disabled
      />

      <AvInput
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.declaredProgramDetailed.sourceOfInformation')"
        label-class="caption-regular"
        :prefix-icon="MDI_ICONS.NEWSPAPER_VARIANT"
        :model-value="sourceOfInformation ?? ''"
        disabled
      />
    </div>

    <div
      class="layout-declared-program-detailed__side av-col av-gap-xl"
      data-testid="layout-declared-program-detailed__side"
    >
      <AvInput
        :label="t('student.personalCareer.views.DeclaredProgramDetailedView.declaredProgramDetailed.description')"
        label-class="caption-regular"
        :model-value="description ?? ''"
        disabled
        is-textarea
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
</style>
