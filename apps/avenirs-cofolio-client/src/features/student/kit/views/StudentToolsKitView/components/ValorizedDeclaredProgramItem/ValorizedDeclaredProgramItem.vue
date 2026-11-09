<script lang="ts" setup>
import type { AvLocale } from '@avenirs-esr/shared'
import type { DeclaredProgramViewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { formatDateToYearLocalized } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import ValorizedItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'
import { DeclaredProgramOrganizationBadge, DeclaredProgramResultBadge } from '@/features/student/personalCareer'

export interface ValorizedDeclaredProgramItemProps {
  declaredProgram: DeclaredProgramViewDTO
}

const { declaredProgram } = defineProps<ValorizedDeclaredProgramItemProps>()

const { t, locale } = useI18n()
const currentLocale = computed(() => locale.value as AvLocale)

const period = computed(() => {
  if (!declaredProgram.startDate) {
    return undefined
  }

  const start = formatDateToYearLocalized(declaredProgram.startDate, currentLocale.value)
  const end = declaredProgram.endDate
    ? formatDateToYearLocalized(declaredProgram.endDate, currentLocale.value)
    : t('global.dates.ongoing')

  return `${start} - ${end}`
})
</script>

<template>
  <ValorizedItem
    :title="declaredProgram.title"
    :item-id="declaredProgram.id"
    :type="ValorizedItemType.DECLARED_PROGRAM"
  >
    <DeclaredProgramOrganizationBadge
      :organization="declaredProgram.organization"
      :period="period"
    />
    <div class="av-row">
      <DeclaredProgramResultBadge
        v-if="declaredProgram.result"
        :result="declaredProgram.result"
      />
    </div>
  </ValorizedItem>
</template>
