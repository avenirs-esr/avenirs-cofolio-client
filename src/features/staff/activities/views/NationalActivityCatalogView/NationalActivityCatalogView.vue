<script setup lang="ts">
import type { EActivityStatus } from '@/api/avenir-esr'
import { useGetActivityContent } from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import NationalActivityContentTab from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.vue'
import { useI18n } from 'vue-i18n'

interface NationalActivityCatalogViewProps {
  status: EActivityStatus
  id: string
}

const { status, id } = defineProps<NationalActivityCatalogViewProps>()

const { t } = useI18n()

const { data: activity, isLoading, error } = useGetActivityContent(status, id)

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.activities.header'), to: ROUTES.STAFF.ACTIVITIES },
  { text: t('staff.activities.views.NationalActivityCatalogView.title') },
])
</script>

<template>
  <PageTitle
    :title="t('staff.activities.views.NationalActivityCatalogView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
  <QuerySuspense
    :is-loading="isLoading"
    :error="error"
    :error-title="t('staff.activities.views.NationalActivityCatalogView.errors.fetchActivityContent')"
  >
    <div class="av-col av-flex-fill">
      <NationalActivityContentTab :activity="activity!" />
    </div>
  </QuerySuspense>
</template>
