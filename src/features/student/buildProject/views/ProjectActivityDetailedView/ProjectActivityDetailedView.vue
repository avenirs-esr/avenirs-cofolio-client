<script setup lang="ts">
import { useGetDeclaredActivityDetails } from '@/api/avenir-esr'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import Loader from '@/common/components/Loader/Loader.vue'
import { useDrawer, useModal, useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import ActivityErrorMessage from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
import SubscribeActivityConfirmModal from '@/features/student/buildProject/components/modals/SubscribeActivityConfirmModal/SubscribeActivityConfirmModal.vue'
import UnsubscribeActivitiesConfirmModal from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.vue'
import UpdateActivityDrawer
  from '@/features/student/buildProject/components/overlays/UpdateActivityDrawer/UpdateActivityDrawer.vue'
import { ProjectActivitiesTab } from '@/features/student/buildProject/types/activities.types'
import ActivityDetailedDropdown
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.vue'
import ProjectActivityDetailedLayout
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetailedLayout/ProjectActivityDetailedLayout.vue'
import { TanstackStaleTimeConfig } from '@/plugins/tanstack-query/config'
import { useI18n } from 'vue-i18n'

export interface ProjectActivityDetailedViewProps {
  id: string
}

const { id } = defineProps<ProjectActivityDetailedViewProps>()

const { t } = useI18n()
const { data: declaredActivityDetail, isLoading, isError, error } = useGetDeclaredActivityDetails(id, { query: {
  enabled: !!id,
  staleTime: TanstackStaleTimeConfig.DETAILS
} })
const { navigateToStudentProjectActivities } = useNavigation()
const { modalOpened: unsubscribeModalOpened, openModal: openUnsubscribeModal, closeModal: closeUnsubscribeModal } = useModal()
const { modalOpened: subscribeModalOpened, openModal: openSubscribeModal, closeModal: closeSubscribeModal } = useModal()
const { showDrawer: showUpdateDrawer, displayDrawer: displayUpdateDrawer, hideDrawer: hideUpdateDrawer } = useDrawer()

const lastBreadcrumbLink = ref(t('global.detail'))

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  {
    text: t('student.global.navigation.tabs.project.items.activities'),
    to: { name: ROUTES.STUDENT.PROJECT_ACTIVITIES.name, query: { tab: ProjectActivitiesTab[ProjectActivitiesTab.ACTIVITY_LIBRARY] } }
  },
  { text: declaredActivityDetail.value?.activity.title ?? '' },
  { text: lastBreadcrumbLink.value }
])

function onUnsubscribed () {
  closeUnsubscribeModal()
  navigateToStudentProjectActivities({ replace: true })
}
</script>

<template>
  <Loader
    :is-loading="isLoading && !isError"
    size="2xl"
  >
    <div
      v-if="declaredActivityDetail"
      class="av-col av-gap-sm"
    >
      <DetailedPageTitle
        :title="declaredActivityDetail!.activity.title"
        :breadcrumb-links="breadcrumbLinks"
        data-testid="activity-detail-title"
      />

      <div
        class="av-row av-justify-end"
      >
        <div class="av-col av-gap-xs av-align-end">
          <DeclaredActivityStatusBadge
            data-testid="activity-status-badge"
            :status="declaredActivityDetail.status"
          />
          <ActivityDetailedDropdown
            data-testid="activity-detailed-dropdown"
            :status="declaredActivityDetail.status"
            @unsubscribe-selected="openUnsubscribeModal"
            @update-selected="displayUpdateDrawer"
            @resubscribe-selected="openSubscribeModal"
          />
        </div>
      </div>

      <ProjectActivityDetailedLayout
        :declared-activity-details="declaredActivityDetail"
        @selected-section="lastBreadcrumbLink = $event"
      />

      <UnsubscribeActivitiesConfirmModal
        :opened="unsubscribeModalOpened"
        :activities="[{ id: declaredActivityDetail.activity.id, title: declaredActivityDetail.activity.title }]"
        :declared-activity-id="declaredActivityDetail.id"
        @cancel="closeUnsubscribeModal"
        @unsubscribed="onUnsubscribed"
      />

      <SubscribeActivityConfirmModal
        :opened="subscribeModalOpened"
        :activity="{ id: declaredActivityDetail.activity.id, title: declaredActivityDetail.activity.title }"
        :declared-activity-id="declaredActivityDetail.id"
        @cancel="closeSubscribeModal"
        @subscribed="closeSubscribeModal"
      />

      <UpdateActivityDrawer
        :show="showUpdateDrawer"
        :declared-activity="declaredActivityDetail"
        @close="hideUpdateDrawer"
      />
    </div>
  </Loader>

  <ActivityErrorMessage :error="error" />
</template>
