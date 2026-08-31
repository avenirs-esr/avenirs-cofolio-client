<script lang="ts" setup>
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import type { AvLocale } from '@/types'
import { EAssociationContextType } from '@/api/avenir-esr'
import { formatDateToYearMonthLocalized } from '@/common/utils'
import { ValorizedItemType } from '@/features/kit/types/valorized.types'
import CountAssociationsBadge from '@/features/kit/views/StudentToolsKitView/components/CountAssociationsBadge/CountAssociationsBadge.vue'
import ValorizedItem from '@/features/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'
import { DeclaredExperienceOrganizationBadge, DeclaredExperienceTypeBadge } from '@/features/personalCareer'
import { useI18n } from 'vue-i18n'

export interface ValorizedDeclaredExperienceItemProps {
  declaredExperience: DeclaredExperienceViewDTO
}

const { declaredExperience } = defineProps<ValorizedDeclaredExperienceItemProps>()

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

const skillAssociationsCount = computed(
  () => declaredExperience.declaredExperienceAssociationCountDTO.declaredSkillAssociationsCount
)
const traceAssociationsCount = computed(
  () => declaredExperience.declaredExperienceAssociationCountDTO.traceAssociationsCount
)
</script>

<template>
  <ValorizedItem
    :title="declaredExperience.title"
    :item-id="declaredExperience.id"
    :type="ValorizedItemType.DECLARED_EXPERIENCE"
  >
    <DeclaredExperienceOrganizationBadge :organization="organizationLabel" />
    <span
      v-if="declaredExperience.description"
      class="b2-regular av-max-lines"
    >
      {{ declaredExperience.description }}
    </span>
    <div class="av-row av-align-center av-wrap av-gap-xs">
      <DeclaredExperienceTypeBadge
        v-if="declaredExperience.experienceType"
        :experience-type="declaredExperience.experienceType"
      />
      <CountAssociationsBadge
        v-if="skillAssociationsCount > 0"
        :type="EAssociationContextType.DECLARED_SKILL"
        :count="skillAssociationsCount"
      />
      <CountAssociationsBadge
        v-if="traceAssociationsCount > 0"
        :type="EAssociationContextType.TRACE"
        :count="traceAssociationsCount"
      />
    </div>
  </ValorizedItem>
</template>
