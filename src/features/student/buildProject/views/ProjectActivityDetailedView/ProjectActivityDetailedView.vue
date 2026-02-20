<script setup lang="ts">
import Loader from '@/common/components/Loader/Loader.vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import ActivityErrorMessage from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
import { useActivityDetailQuery } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { useI18n } from 'vue-i18n'

export interface ProjectActivityDetailedViewProps {
  id: string
}

const { id } = defineProps<ProjectActivityDetailedViewProps>()

const { t } = useI18n()
const { activityDetail, isLoading, isError, error } = useActivityDetailQuery(id)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.activities') }
])
</script>

<template>
  <Loader
    :is-loading="isLoading && !isError"
    size="2xl"
  >
    <template v-if="activityDetail">
      <PageTitle
        :title="t('global.detail')"
        :breadcrumb-links="breadcrumbLinks"
        :back="ROUTES.STUDENT.HOME"
      >
        <template #title>
          <span
            class="n2 av-text-title"
            data-testid="activity-detail-title"
          >
            {{ t('global.detail') }}
            <span class="n4 av-text-text2">{{ activityDetail?.title }}</span>
          </span>
        </template>
      </PageTitle>
    </template>
  </Loader>

  <ActivityErrorMessage :error="error" />
</template>
