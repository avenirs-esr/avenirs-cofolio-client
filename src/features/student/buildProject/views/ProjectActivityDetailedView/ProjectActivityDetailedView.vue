<script setup lang="ts">
import Loader from '@/common/components/Loader/Loader.vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useModal } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import ActivityErrorMessage from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
import UnsubscribeActivitiesConfirmModal from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.vue'
import {
  useDeclaredActivitiesDetailedQuery
} from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import ActivityDetailedDropdown from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.vue'
import ProjectActivityDetails
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetails/ProjectActivityDetails.vue'
import { useI18n } from 'vue-i18n'

export interface ProjectActivityDetailedViewProps {
  id: string
}

const { id } = defineProps<ProjectActivityDetailedViewProps>()

const { t } = useI18n()
const { declaredActivityDetail, isLoading, isError, error } = useDeclaredActivitiesDetailedQuery(id)
const { showModal, displayModal, hideModal } = useModal()

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
    <template v-if="declaredActivityDetail">
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
            <span class="n4 av-text-text2">{{ declaredActivityDetail?.activity.title }}</span>
          </span>
        </template>
      </PageTitle>

      <div class="av-row av-justify-end">
        <ActivityDetailedDropdown @unsubscribe-selected="displayModal" />
      </div>

      <ProjectActivityDetails :declared-activity-details="declaredActivityDetail" />

      <UnsubscribeActivitiesConfirmModal
        :show="showModal"
        :activities="[{ id: declaredActivityDetail.id, title: declaredActivityDetail.activity.title }]"
        @cancel="hideModal"
        @unsubscribed="hideModal"
      />
    </template>
  </Loader>

  <ActivityErrorMessage :error="error" />
</template>
