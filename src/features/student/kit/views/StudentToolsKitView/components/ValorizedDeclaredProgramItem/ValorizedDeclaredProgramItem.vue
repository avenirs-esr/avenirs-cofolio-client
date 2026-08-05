<script lang="ts" setup>
import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import type { AvLocale } from '@/types'
import { formatDateToYearLocalized } from '@/common/utils'
import { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import ValorizedItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'
import { DeclaredProgramOrganizationBadge, DeclaredProgramResultBadge, DeclaredProgramStatusBadge } from '@/features/student/personalCareer'
import { useI18n } from 'vue-i18n'

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
    <span
      v-if="declaredProgram.description"
      class="b2-regular av-max-lines"
    >
      {{ declaredProgram.description }}
    </span>
    <div class="av-row av-align-center av-wrap av-gap-xs">
      <DeclaredProgramStatusBadge
        v-if="declaredProgram.status"
        :status="declaredProgram.status"
      />
      <DeclaredProgramResultBadge
        v-if="declaredProgram.result"
        :result="declaredProgram.result"
      />
    </div>
  </ValorizedItem>
</template>
