<script setup lang="ts">
import { type EActivityStatus, useGetActivityPresentation } from '@/api/avenir-esr'
import ActivityCatalogHeader from '@/common/activities/components/ActivityCatalogHeader/ActivityCatalogHeader.vue'
import ActivityCatalogPreviewCard from '@/common/activities/components/ActivityCatalogPreviewCard/ActivityCatalogPreviewCard.vue'
import { QuerySuspense } from '@/common/components'
import { useI18n } from 'vue-i18n'

interface NationalActivityCatalogPreviewTabProps {
  activityId: string
  status: EActivityStatus
}

const { activityId, status } = defineProps<NationalActivityCatalogPreviewTabProps>()

const { t } = useI18n()
const {
  data: presentation,
  isLoading,
  error
} = useGetActivityPresentation(status, activityId)
</script>

<template>
  <div data-testid="national-activity-catalog-preview-tab">
    <QuerySuspense
      :is-loading="isLoading"
      :error="error"
      :error-title="t('staff.activities.views.NationalActivityCatalogView.NationalActivityCatalogPreviewTab.errors.fetchActivityPresentation')"
    >
      <div
        v-if="presentation"
        class="av-col av-gap-lg"
      >
        <ActivityCatalogHeader
          :banner="presentation.banner"
          :title="presentation.title"
          :thematic="presentation.thematic"
        />
        <ActivityCatalogPreviewCard
          :summary="presentation.summary"
          :execution-period-info="presentation.executionPeriodInfo"
        />
      </div>
    </QuerySuspense>
  </div>
</template>
