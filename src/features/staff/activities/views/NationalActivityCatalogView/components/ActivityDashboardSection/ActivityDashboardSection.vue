<script lang="ts" setup>
import { EActivityStatus, useGetActivityDashboard } from '@/api/avenir-esr'
import InactiveStudentsDetailsCard
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityDashboardSection/components/InactiveStudentsDetailsCard/InactiveStudentsDetailsCard.vue'
import DashboardCard from '@/features/staff/global/components/cards/DashboardCard/DashboardCard.vue'
import DashboardSection from '@/features/staff/global/components/sections/DashboardSection/DashboardSection.vue'
import { AvButton, CUIDA_ICONS, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityDashboardSectionProps {
  activityId: string
  status: EActivityStatus
}

const { activityId, status } = defineProps<ActivityDashboardSectionProps>()

const { t } = useI18n()

const isDraft = computed(() => status === EActivityStatus.DRAFT)

const inactiveStudentsDetailsShown = ref(false)

const { data: activityDashboard, isLoading, error } = useGetActivityDashboard(computed(() => activityId), {
  query: {
    enabled: computed(() => !!activityId && !isDraft.value),
  },
})

const inactiveStudentsDetailsLabel = computed(() => inactiveStudentsDetailsShown.value
  ? t('staff.activities.views.NationalActivityCatalogView.ActivityDashboardSection.hideDetails')
  : t('staff.activities.views.NationalActivityCatalogView.ActivityDashboardSection.seeDetails'))

function toggleInactiveStudentsDetails (): void {
  inactiveStudentsDetailsShown.value = !inactiveStudentsDetailsShown.value
}
</script>

<template>
  <DashboardSection
    :title="t('staff.activities.views.NationalActivityCatalogView.ActivityDashboardSection.title')"
    :is-loading="isLoading"
    :is-empty="isDraft"
    :empty-state-message="t('staff.activities.views.NationalActivityCatalogView.ActivityDashboardSection.notPublished')"
    :error="error"
    data-testid="activity-dashboard-section"
  >
    <DashboardCard
      :label="t('staff.activities.views.NationalActivityCatalogView.ActivityDashboardSection.uniqueStudentViews', { count: activityDashboard?.uniqueStudentViews ?? 0 })"
      :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
      :value="`${activityDashboard?.uniqueStudentViews ?? 0}`"
      data-testid="unique-student-views-dashboard-card"
    />
    <DashboardCard
      :label="t('staff.activities.views.NationalActivityCatalogView.ActivityDashboardSection.enrolledStudents', { count: activityDashboard?.enrolledStudents ?? 0 })"
      :icon="MDI_ICONS.ACCOUNT_STUDENT_OUTLINE"
      :value="`${activityDashboard?.enrolledStudents ?? 0}`"
      data-testid="enrolled-students-dashboard-card"
    />
    <DashboardCard
      :label="t('staff.activities.views.NationalActivityCatalogView.ActivityDashboardSection.unsubscriptionsLast30Days', { count: activityDashboard?.unsubscriptionsLast30Days ?? 0 })"
      :icon="MDI_ICONS.TRASH_CAN_OUTLINE"
      :value="`${activityDashboard?.unsubscriptionsLast30Days ?? 0}`"
      data-testid="unsubscriptions-last-30-days-dashboard-card"
    />
    <DashboardCard
      :label="t('staff.activities.views.NationalActivityCatalogView.ActivityDashboardSection.inactiveStudentsLast30Days', { count: activityDashboard?.inactiveStudentsLast30Days ?? 0 })"
      :icon="MDI_ICONS.CALENDAR_CLOCK_OUTLINE"
      :value="`${activityDashboard?.inactiveStudentsLast30Days ?? 0}`"
      data-testid="inactive-students-last-30-days-dashboard-card"
    >
      <template #footer>
        <AvButton
          variant="OUTLINED"
          size="SM"
          :icon="CUIDA_ICONS.VISIBILITY_ON_OUTLINE"
          :label="inactiveStudentsDetailsLabel"
          data-testid="inactive-students-see-details-button"
          @click="toggleInactiveStudentsDetails"
        />
      </template>
    </DashboardCard>

    <template #details>
      <InactiveStudentsDetailsCard
        v-if="inactiveStudentsDetailsShown"
        :activity-id="activityId"
      />
    </template>
  </DashboardSection>
</template>
