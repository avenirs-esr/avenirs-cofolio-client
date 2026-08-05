<script lang="ts" setup>
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import PeriodBadge from '@/common/activities/badges/PeriodBadge/PeriodBadge.vue'
import { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import ValorizedItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'
import { DeclaredExperienceOrganizationBadge, DeclaredExperienceTypeBadge } from '@/features/student/personalCareer'

export interface ValorizedDeclaredExperienceItemProps {
  declaredExperience: DeclaredExperienceViewDTO
}

const { declaredExperience } = defineProps<ValorizedDeclaredExperienceItemProps>()
</script>

<template>
  <ValorizedItem
    :title="declaredExperience.title"
    :item-id="declaredExperience.id"
    :type="ValorizedItemType.DECLARED_EXPERIENCE"
  >
    <DeclaredExperienceOrganizationBadge :organization="declaredExperience.organization" />
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
      <PeriodBadge
        :start-date="declaredExperience.startDate"
        :end-date="declaredExperience.endDate"
      />
    </div>
  </ValorizedItem>
</template>
