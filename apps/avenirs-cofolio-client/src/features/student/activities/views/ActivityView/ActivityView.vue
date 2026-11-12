<script setup lang="ts">
import { DetailPageTitle, Loader, useModal } from '@avenirs-esr/shared'
import { EAssociationContextType, useGetAssociations, useGetDeclaredActivityDetails } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import { useDrawer, useNavigation } from '@/common/composables'
import UpdateActivityDrawer
  from '@/features/student/activities/components/drawers/UpdateActivityDrawer/UpdateActivityDrawer.vue'
import ActivityErrorMessage from '@/features/student/activities/components/errors/ActivityErrorMessage/ActivityErrorMessage.vue'
import SubscribeActivityConfirmModal from '@/features/student/activities/components/modals/SubscribeActivityConfirmModal/SubscribeActivityConfirmModal.vue'
import UnsubscribeActivitiesConfirmModal from '@/features/student/activities/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.vue'
import ActivityLayout
  from '@/features/student/activities/views/ActivityView/components/ActivityLayout/ActivityLayout.vue'
import DeleteMyActivityConfirmModal from '@/features/student/activities/views/ActivityView/components/modals/DeleteMyActivityConfirmModal/DeleteMyActivityConfirmModal.vue'
import ActivityDetailedDropdown
  from '@/features/student/activities/views/ActivityView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.vue'
import { countAssociations } from '@/features/student/associations/utils/associations.utils'
import { TanstackStaleTimeConfig } from '@/plugins/tanstack-query/config'

export interface ActivityViewProps {
  id: string
}

const { id } = defineProps<ActivityViewProps>()

const { t } = useI18n()

const { data: declaredActivityDetail, isLoading, isError, error } = useGetDeclaredActivityDetails(id, { query: {
  enabled: !!id,
  staleTime: TanstackStaleTimeConfig.DETAILS
} })

const { data: declaredActivityAssociations } = useGetAssociations(EAssociationContextType.DECLARED_ACTIVITY, id)

const { navigateToStudentProjectActivities } = useNavigation()

const { showDrawer: showUpdateDrawer, displayDrawer: displayUpdateDrawer, hideDrawer: hideUpdateDrawer } = useDrawer()

const {
  modalOpened: subscribeModalOpened,
  openModal: openSubscribeModal,
  closeModal: closeSubscribeModal
} = useModal()
const {
  modalOpened: unsubscribeModalOpened,
  openModal: openUnsubscribeModal,
  closeModal: closeUnsubscribeModal
} = useModal()
const {
  modalOpened: deleteModalOpened,
  openModal: openDeleteModal,
  closeModal: closeDeleteModal
} = useModal()

const lastBreadcrumbLink = ref(t('global.detail'))

const trailingLinks = computed(() => [
  { text: declaredActivityDetail.value?.activity.title ?? '' },
  { text: lastBreadcrumbLink.value }
])

function onDelete () {
  closeDeleteModal()
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
      <DetailPageTitle
        :title="declaredActivityDetail!.activity.title"
        :trailing-links="trailingLinks"
        data-testid="activity-view-title"
      >
        <template #actions>
          <div class="av-row av-justify-end">
            <div class="av-row av-wrap av-col--md av-gap-sm av-gap-xs--md av-align-end">
              <DeclaredActivityStatusBadge
                data-testid="activity-view-status-badge"
                :status="declaredActivityDetail.status"
              />
              <ActivityDetailedDropdown
                :status="declaredActivityDetail.status"
                :activity-status="declaredActivityDetail.activity.activityStatus"
                :element-id="declaredActivityDetail.id"
                :has-associations="countAssociations(declaredActivityAssociations) > 0"
                data-testid="activity-view-detailed-dropdown"
                @update="displayUpdateDrawer"
                @resubscribe="openSubscribeModal"
                @unsubscribe="openUnsubscribeModal"
                @delete="openDeleteModal"
              />
            </div>
          </div>
        </template>
      </DetailPageTitle>

      <ActivityLayout
        :declared-activity-details="declaredActivityDetail"
        @selected-section="lastBreadcrumbLink = $event"
      />

      <UpdateActivityDrawer
        :show="showUpdateDrawer"
        :declared-activity="declaredActivityDetail"
        @close="hideUpdateDrawer"
      />

      <UnsubscribeActivitiesConfirmModal
        :opened="unsubscribeModalOpened"
        :activities="[{ id: declaredActivityDetail.activity.id, title: declaredActivityDetail.activity.title }]"
        :declared-activity-id="declaredActivityDetail.id"
        @cancel="closeUnsubscribeModal"
        @unsubscribed="closeUnsubscribeModal"
      />

      <SubscribeActivityConfirmModal
        :opened="subscribeModalOpened"
        :activity="{ id: declaredActivityDetail.activity.id, title: declaredActivityDetail.activity.title }"
        :declared-activity-id="declaredActivityDetail.id"
        @cancel="closeSubscribeModal"
        @subscribed="closeSubscribeModal"
      />

      <DeleteMyActivityConfirmModal
        :opened="deleteModalOpened"
        :declared-activity-id="declaredActivityDetail.id"
        :activity-id="declaredActivityDetail.activity.id"
        :activity-title="declaredActivityDetail.activity.title "
        @cancel="closeDeleteModal"
        @deleted="onDelete"
      />
    </div>
  </Loader>

  <ActivityErrorMessage :error="error" />
</template>
