<script lang="ts" setup>
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import type { AvLocale } from '@/types'
import { formatDateToYearMonthLocalized } from '@/common/utils'
import { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import ValorizedItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'
import { DeclaredExperienceOrganizationBadge, DeclaredExperienceTypeBadge } from '@/features/student/personalCareer'
import { isProfessional } from '@/features/student/personalCareer/utils/experiences-utils/experiences-utils'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ValorizedDeclaredExperienceItemProps {
  declaredExperience: DeclaredExperienceViewDTO
}

const { declaredExperience } = defineProps<ValorizedDeclaredExperienceItemProps>()

const descriptionRef = ref<HTMLElement | null>(null)
const { isTruncated } = useTextTruncation(descriptionRef)

const { t, locale } = useI18n()
const currentLocale = computed(() => locale.value as AvLocale)

const period = computed(() => {
  const start = formatDateToYearMonthLocalized(declaredExperience.startDate, currentLocale.value)
  const end = declaredExperience.endDate
    ? formatDateToYearMonthLocalized(declaredExperience.endDate, currentLocale.value)
    : t('global.dates.ongoing')

  return `${start} - ${end}`
})

const organizationLabel = computed(() => `${declaredExperience.organization} • ${period.value}`)
</script>

<template>
  <ValorizedItem
    :title="declaredExperience.title"
    :item-id="declaredExperience.id"
    :type="ValorizedItemType.DECLARED_EXPERIENCE"
  >
    <DeclaredExperienceOrganizationBadge :organization="organizationLabel" />

    <AvTooltip
      v-if="declaredExperience.description"
      :disabled="!isTruncated"
      :content="declaredExperience.description"
      force-focusable
    >
      <span
        ref="descriptionRef"
        class="b2-regular av-max-lines"
      >
        {{ declaredExperience.description }}
      </span>
    </AvTooltip>
    <div class="av-row av-align-center av-wrap av-gap-xs">
      <DeclaredExperienceTypeBadge
        v-if="declaredExperience.experienceType && isProfessional(declaredExperience, false)"
        :experience-type="declaredExperience.experienceType"
      />
    </div>
  </ValorizedItem>
</template>
