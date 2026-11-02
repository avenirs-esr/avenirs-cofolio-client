<script lang="ts" setup>
import { AvButton, AvTab, AvTabs, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EActivityRight, EActivityStatus, useCreateDraftFromActivity, useGetActivityContent } from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { useModal } from '@/common/composables/use-modal/use-modal'
import { useNavigation } from '@/common/composables/use-navigation/use-navigation'
import DeleteDraftActivityConfirmationModal
  from '@/features/staff/activities/components/modals/DeleteDraftActivityConfirmationModal/DeleteDraftActivityConfirmationModal.vue'
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

interface NationalActivityCatalogViewProps {
  status: EActivityStatus
  id: string
}

const { status, id } = defineProps<NationalActivityCatalogViewProps>()

const { t } = useI18n()

const { data: activity, isLoading, error } = useGetActivityContent(status, id)

const trailingLinks = computed(() => [{ text: activity.value?.title ?? '' }])

const isDraft = computed(() => status === EActivityStatus.DRAFT)

const canEdit = computed(() => activity.value?.rights.includes(EActivityRight.EDIT) ?? false)

const buttonLabel = computed(() => isDraft.value || activity.value?.haveDraft ? t('staff.activities.views.NationalActivityCatalogView.buttons.resumeDraft') : t('global.buttons.update'))

const editDeleteTooltip = computed(() =>
  !canEdit.value
    ? t('staff.activities.views.ActivitiesView.MoreActionsDropdown.editRightOnlyTooltip')
    : undefined,
)
const { modalOpened: deleteConfirmationOpened, openModal: openDeleteConfirmation, closeModal: closeDeleteConfirmation } = useModal()

const { navigateToStaffActivities, navigateToStaffActivitiesEditNationalActivity } = useNavigation()

const activeTab = useEnumRouteQuery('tab', NationalActivityCatalogTabs, NationalActivityCatalogTabs.CONTENT)

const { mutate: createDraftFromActivity, isPending: isCreatingDraft } = useCreateDraftFromActivity({
  mutation: {
    onSuccess: draft => navigateToStaffActivitiesEditNationalActivity({ id: draft.draftId }),
  },
})

function updateActivity (id: string) {
  if (isDraft.value) {
    return navigateToStaffActivitiesEditNationalActivity({ id })
  }

  createDraftFromActivity({ activityId: id })
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
          :is-loading="isCreatingDraft"
          :label="buttonLabel"
          :disabled="!canEdit"
          :disabled-tooltip="editDeleteTooltip"
          data-testid="edit-draft-button"
          variant="FLAT"
          @click="() => updateActivity(id)"
        />
        <AvButton
          v-if="isDraft"
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
    :error="error"
    :error-title="t('staff.activities.views.NationalActivityCatalogView.errors.fetchActivityContent')"
    :is-loading="isLoading"
  >
    <AvTabs
      v-if="activity"
      v-model="activeTab"
    >
      <AvTab
        :icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
        :title="t('staff.activities.views.NationalActivityCatalogView.tabs.content')"
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
          <ActivityRightsSection />
        </div>
      </AvTab>
    </AvTabs>
  </QuerySuspense>

  <DeleteDraftActivityConfirmationModal
    :activity-id="id"
    :opened="deleteConfirmationOpened"
    @close="closeDeleteConfirmation"
    @deleted="navigateToStaffActivities"
  />
</template>
