<script lang="ts" setup>
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import ActivityStatusBadge from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.vue'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import { useDateUtils } from '@/common/composables'
import { ICONS, ROUTES } from '@/common/constants'
import { AvCard, AvIcon, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityCardProps {
  activity: ActivityTableRow
  withStatus?: boolean
}

const { activity } = defineProps<ActivityCardProps>()

const { t } = useI18n()

const { formatLastModified } = useDateUtils()

const ownerLabel = computed(() => `${t('global.colon', { before: t('staff.activities.views.ActivitiesView.columns.owner') })} ${activity.owner}`)
const updatedAtLabel = computed(() => `${t('global.colon', { before: t('global.updated') })} ${formatLastModified(activity.updatedAt)}`)
const to = computed(() => ({
  name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
  params: { status: activity.status, id: activity.id }
}))
</script>

<template>
  <RouterLink
    :to="to"
    :title="activity.title"
    class="av-max-lines b1-regular av-text-text1"
  >
    <AvCard
      background-color="var(--card)"
      title-background="var(--card)"
      class="activity-card"
      data-testid="activity-card-title"
      :data-activity-id="activity.id"
      :data-activity-status="activity.status"
    >
      <template #title>
        <div class="av-row av-w-full av-gap-sm av-align-center">
          <div class="av-flex-fill">
            <span class="av-max-lines b1-regular av-text-text1">
              {{ activity.title }}
            </span>
          </div>
          <div class="icon-container av-col av-align-center av-justify-center av-p-xs av-radius-lg">
            <AvIcon
              :size="2.1875"
              :name="ICONS.ACTIVITY"
              color="var(--icon)"
            />
          </div>
        </div>
      </template>

      <div class="details av-col av-gap-sm av-pb-xs av--mt-sm">
        <div class="av-row av-w-full av-gap-xs av-wrap av-align-center">
          <ActivityThematicBadge :thematic="activity.thematic" />
          <ActivityStatusBadge
            v-if="withStatus"
            :status="activity.status"
          />
        </div>

        <AvIconText
          :icon="MDI_ICONS.PERSON_OUTLINE"
          icon-color="var(--icon)"
          :text="ownerLabel"
          text-color="var(--text2)"
          typography-class="b2-regular"
        />
      </div>

      <div class="av-row av-w-full">
        <AvIconText
          :icon="MDI_ICONS.CLOCK_ARROW"
          icon-color="var(--icon)"
          :text="updatedAtLabel"
          text-color="var(--text2)"
          typography-class="b2-regular"
        />
      </div>
    </AvCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.activity-card {
  --max-lines: 2;

  .details {
    border-bottom: 1px solid var(--stroke);
  }

  .icon-container {
    background-color: var(--light-background-neutral);
  }
}
</style>
