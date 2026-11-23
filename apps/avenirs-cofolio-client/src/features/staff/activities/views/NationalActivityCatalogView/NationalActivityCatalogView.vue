<script lang="ts" setup>
import { AvButton, AvTab, AvTabs, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { PageTitle, QuerySuspense, useModal } from '@avenirs-esr/shared'
import { EActivityRight, EActivityStatus, useCreateDraftFromActivity, useGetActivityContent } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { useNavigation } from '@/common/composables/use-navigation/use-navigation'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import DeleteDraftActivityConfirmationModal
  from '@/features/staff/activities/components/modals/DeleteDraftActivityConfirmationModal/DeleteDraftActivityConfirmationModal.vue'
import EditPublishedActivityConfirmationModal
  from '@/features/staff/activities/components/modals/EditPublishedActivityConfirmationModal/EditPublishedActivityConfirmationModal.vue'
import ActivityDashboardSection
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityDashboardSection/ActivityDashboardSection.vue'
import ActivityRightsSection
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityRightsSection/ActivityRightsSection.vue'
import NationalActivityCatalogPreviewTab
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityCatalogPreviewTab/NationalActivityCatalogPreviewTab.vue'
import NationalActivityContentTab
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.vue'
import { NationalActivityCatalogTabs }
  from '@/features/staff/activities/views/NationalActivityCatalogView/NationalActivityCatalogView.types'

export interface NationalActivityCatalogViewProps {
  status: EActivityStatus
  id: string
}

const { status, id } = defineProps<NationalActivityCatalogViewProps>()

const { t } = useI18n()

const activityId = computed(() => id)
const activityStatus = computed(() => status)

const {
  data: activity,
  isLoading: isActivityLoading,
  error: activityError
} = useGetActivityContent(activityStatus, activityId)

const parentActivityId = computed(() => activity.value?.mainActivityId ?? '')
const isSubActivity = computed(() => !!parentActivityId.value)

const {
  data: parentActivity,
  isLoading: isParentActivityLoading,
  error: parentActivityError
} = useGetActivityContent(activityStatus, parentActivityId, {
  query: {
    enabled: isSubActivity
  }
})

const isLoading = computed(() => isActivityLoading.value || isParentActivityLoading.value)
const error = computed(() => activityError.value ?? parentActivityError.value)

const trailingLinks = computed(() => [
  ...(parentActivity.value
    ? [
        {
          text: parentActivity.value.title,
          to: {
            name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
            params: { status, id: parentActivity.value.id }
          }
        },
        { text: t(META_BREADCRUMBS.STAFF.ACTIVITIES.SUB_ACTIVITIES.textKey) }
      ]
    : []),
  { text: activity.value?.title ?? '' }
])

const isDraft = computed(() => activityStatus.value === EActivityStatus.DRAFT)

const requiresEditConfirmation = computed(() => isSubActivity.value && !isDraft.value && !activity.value?.haveDraft)

const hasEditRight = computed(() => activity.value?.rights.includes(EActivityRight.EDIT) ?? false)
const canEdit = computed(() => !error.value && hasEditRight.value)

const canManageAuthorizations = computed(() => activity.value?.rights.includes(EActivityRight.MANAGE_AUTHORIZATIONS) ?? false)

const hasPendingRightsChanges = ref(false)

const tabsDisabledTooltip = computed(() =>
  hasPendingRightsChanges.value
    ? t('staff.activities.views.NationalActivityCatalogView.tabs.disabledTooltip')
    : undefined,
)

const buttonLabel = computed(() => isDraft.value || activity.value?.haveDraft
  ? t('staff.activities.views.NationalActivityCatalogView.buttons.resumeDraft')
  : t('global.buttons.update'))

const editDeleteTooltip = computed(() => {
  if (error.value) {
    return t('staff.activities.views.NationalActivityCatalogView.errors.fetchActivityContent')
  }
  if (!hasEditRight.value) {
    return t('staff.activities.views.ActivitiesView.MoreActionsDropdown.editRightOnlyTooltip')
  }
  return undefined
})
const { modalOpened: deleteConfirmationOpened, openModal: openDeleteConfirmation, closeModal: closeDeleteConfirmation } = useModal()
const { modalOpened: editConfirmationOpened, openModal: openEditConfirmation, closeModal: closeEditConfirmation } = useModal()

const { navigateToStaffActivities, navigateToStaffActivitiesEditNationalActivity } = useNavigation()

const activeTab = useEnumRouteQuery('tab', NationalActivityCatalogTabs, NationalActivityCatalogTabs.CONTENT)

const { mutate: createDraftFromActivity, isPending: isCreatingDraft } = useCreateDraftFromActivity({
  mutation: {
    onSuccess: () => navigateToStaffActivitiesEditNationalActivity({ id: activityId.value }),
  },
})

function createDraft () {
  createDraftFromActivity({ activityId: parentActivityId.value || activityId.value })
}

function updateActivity () {
  if (isDraft.value) {
    return navigateToStaffActivitiesEditNationalActivity({ id: activityId.value })
  }

  if (requiresEditConfirmation.value) {
    return openEditConfirmation()
  }

  createDraft()
}

function confirmEdit () {
  closeEditConfirmation()
  createDraft()
}
</script>

<template>
  <PageTitle
    :trailing-links="trailingLinks"
    :title="t('staff.activities.views.NationalActivityCatalogView.title')"
  >
    <template #actions>
      <div
        class="av-row av-gap-sm"
      >
        <AvButton
          :icon="MDI_ICONS.PENCIL_OUTLINE"
          :is-loading="isLoading || isCreatingDraft"
          :label="buttonLabel"
          :disabled="!canEdit"
          :disabled-tooltip="editDeleteTooltip"
          data-testid="edit-draft-button"
          variant="FLAT"
          @click="updateActivity"
        />
        <AvButton
          v-if="!isSubActivity && isDraft"
          :icon="MDI_ICONS.TRASH_CAN_OUTLINE"
          :label="t('global.buttons.delete')"
          data-testid="delete-draft-button"
          :disabled="!canEdit"
          :disabled-tooltip="editDeleteTooltip"
          variant="OUTLINED"
          @click="openDeleteConfirmation"
        />
      </div>
    </template>
  </PageTitle>

  <QuerySuspense
    :error
    :error-title="t('staff.activities.views.NationalActivityCatalogView.errors.fetchActivityContent')"
    :is-loading
  >
    <template v-if="activity">
      <NationalActivityContentTab
        v-if="isSubActivity"
        :activity="activity"
        :status="status"
      />
      <AvTabs
        v-else
        v-model="activeTab"
      >
        <AvTab
          :icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
          :title="t('staff.activities.views.NationalActivityCatalogView.tabs.content')"
          :disabled="hasPendingRightsChanges"
          :disabled-tooltip="tabsDisabledTooltip"
          data-testid="national-activity-catalog-content-tab-item"
        >
          <NationalActivityContentTab
            :activity="activity"
            :status="status"
          />
        </AvTab>
        <AvTab
          :icon="MDI_ICONS.BOOK_OPEN_VARIANT"
          :title="t('staff.activities.views.NationalActivityCatalogView.tabs.preview')"
          :disabled="hasPendingRightsChanges"
          :disabled-tooltip="tabsDisabledTooltip"
          data-testid="national-activity-catalog-preview-tab-item"
        >
          <NationalActivityCatalogPreviewTab
            :activity-id="activity.id"
            :status="status"
          />
        </AvTab>
        <AvTab
          :icon="RI_ICONS.DASHBOARD_2_LINE"
          :title="t('staff.activities.views.NationalActivityCatalogView.tabs.dashboard')"
          data-testid="national-activity-catalog-key-figures-tab-item"
        >
          <div class="av-col av-gap-md">
            <ActivityDashboardSection
              :activity-id="activity.id"
              :status="status"
            />
            <ActivityRightsSection
              :activity-id="activity.id"
              :status="status"
              :can-edit="canManageAuthorizations"
              @dirty-change="hasPendingRightsChanges = $event"
            />
          </div>
        </AvTab>
      </AvTabs>
    </template>
  </QuerySuspense>

  <EditPublishedActivityConfirmationModal
    v-if="activity"
    :activity
    :opened="editConfirmationOpened"
    @close="closeEditConfirmation"
    @confirm="confirmEdit"
  />

  <DeleteDraftActivityConfirmationModal
    :activity-id="id"
    :opened="deleteConfirmationOpened"
    @close="closeDeleteConfirmation"
    @deleted="navigateToStaffActivities"
  />
</template>
