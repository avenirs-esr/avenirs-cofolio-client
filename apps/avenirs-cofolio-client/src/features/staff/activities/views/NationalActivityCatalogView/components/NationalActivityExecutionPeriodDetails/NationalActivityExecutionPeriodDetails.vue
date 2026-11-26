<script setup lang="ts">
import { DatePeriodPicker, ICONS } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'

export interface NationalActivityExecutionPeriodDetailsProps {
  startDate: string
  endDate: string
}

const { startDate, endDate } = defineProps<NationalActivityExecutionPeriodDetailsProps>()

const { t } = useI18n()
</script>

<template>
  <IconTitleCardContainer
    :title="t('staff.activities.views.NationalActivityCatalogView.NationalActivityExecutionPeriodDetails.title')"
    :title-icon="ICONS.PERIOD"
    background-color="var(--other-background-base)"
    data-testid="national-activity-execution-period-details"
  >
    <DatePeriodPicker
      type="date"
      :show-ongoing="false"
      :start-date
      :end-date
      disabled
      data-testid="date-period-picker"
    />
  </IconTitleCardContainer>
</template>

<style scoped lang="scss">

</style>
