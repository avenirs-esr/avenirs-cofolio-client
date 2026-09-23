<script setup lang="ts">
import type { DeclaredProgramDetailedDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails, DatePeriodPicker } from '@/common/components'
import ValorizedBadge from '@/common/components/badges/ValorizedBadge/ValorizedBadge.vue'
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
  valorized,
} = declaredProgramDetailed

const { t } = useI18n()

const createdAtPrefix = computed(() =>
  capitalize(t('student.personalCareer.global.program'))
)
</script>

<template>
  <div
    class="av-col av-gap-md"
    data-testid="layout-declared-program-detailed"
  >
    <ValorizedBadge :valorized="valorized ?? false" />
    <div class="av-col av-row--md av-gap-xl">
      <div
        class="layout-declared-program-detailed__main av-col av-gap-md av-flex-fill av-justify-between"
        data-testid="layout-declared-program-detailed__main"
      >
        <DeclaredProgramTitleInput
          :label="t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.title')"
          label-class="caption-regular"
          :model-value="title"
          disabled
        />

        <DeclaredProgramOrganizationInput
          label-class="caption-regular"
          :model-value="organization"
          disabled
        />

        <DatePeriodPicker
          width="var(--dimension-8xl)"
          disabled
          :start-date="startDate ?? ''"
          :end-date="endDate ?? ''"
          :is-ongoing="!endDate"
          type="month"
          label-class="caption-regular"
        />

        <DeclaredProgramResultInput
          :label="t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.result')"
          label-class="caption-regular"
          :model-value="result ?? ''"
          disabled
        />

        <DeclaredProgramSourceOfInformationInput
          label-class="caption-regular"
          :model-value="sourceOfInformation ?? ''"
          disabled
        />
      </div>

      <div
        class="layout-declared-program-detailed__side av-col av-gap-xl av-flex-fill av-justify-between"
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
  </div>
</template>

<style scoped lang="scss">
.layout-declared-program-detailed__side {
  :deep(textarea) {
    height: 100% !important;
    min-height: 10rem;
    flex: 1;
    resize: none;
  }
}
</style>
