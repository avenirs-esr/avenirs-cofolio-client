<script setup lang="ts">
import type { EActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { SubActivityOverviewDTO } from '@/api/avenir-esr'
import { AvList, AvListItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import { ROUTES } from '@/common/constants'

export interface NationalActivitySubActivitiesListProps {
  subActivities: SubActivityOverviewDTO[]
  status: EActivityStatus
}

const { subActivities, status } = defineProps<NationalActivitySubActivitiesListProps>()

const { t } = useI18n()
</script>

<template>
  <IconTitleCardContainer
    :title="t('global.activities.contentSectionTypes.SUB_ACTIVITIES')"
    :title-icon="MDI_ICONS.FILE_TREE_OUTLINE"
    data-testid="national-activity-sub-activities-list"
  >
    <AvList
      :aria-label="t('global.activities.contentSectionTypes.SUB_ACTIVITIES')"
      divided
    >
      <RouterLink
        v-for="(subActivity, index) in subActivities"
        :key="subActivity.id"
        v-slot="{ href, navigate }"
        :to="{ name: ROUTES.STAFF.ACTIVITY_CATALOG.name, params: { status, id: subActivity.id } }"
        custom
      >
        <AvListItem
          :index="index + 1"
          :title="subActivity.title"
          :href="href"
          @click="navigate"
        />
      </RouterLink>
    </AvList>
  </IconTitleCardContainer>
</template>
