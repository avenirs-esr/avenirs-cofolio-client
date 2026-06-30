<script setup lang="ts">
import { EActivityStatus, useGetActivityContent } from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { useModal } from '@/common/composables/use-modal/use-modal'
import { useNavigation } from '@/common/composables/use-navigation/use-navigation'
import { ROUTES } from '@/common/constants'
import DeleteDraftActivityConfirmationModal from '@/features/staff/activities/components/modals/DeleteDraftActivityConfirmationModal/DeleteDraftActivityConfirmationModal.vue'
import NationalActivityCatalogPreviewTab from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityCatalogPreviewTab/NationalActivityCatalogPreviewTab.vue'
import NationalActivityContentTab from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.vue'
import { AvButton, AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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

const isDraft = computed(() => status === EActivityStatus.DRAFT)

const { showModal: showDeleteConfirmation, displayModal: displayDeleteConfirmation, hideModal: hideDeleteConfirmation } = useModal()

const { navigateToStaffActivities, navigateToStaffActivitiesEditNationalActivity } = useNavigation()

enum NationalActivityCatalogTabs {
  CONTENT = 0,
  PREVIEW = 1,
}

const activeTab = useEnumRouteQuery('tab', NationalActivityCatalogTabs, NationalActivityCatalogTabs.CONTENT)
</script>

<template>
  <PageTitle
    :title="t('staff.activities.views.NationalActivityCatalogView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />

  <div
    v-if="isDraft"
    class="av-row av-justify-end av-py-md av-gap-sm"
  >
    <AvButton
      :label="t('global.buttons.update')"
      variant="FLAT"
      :icon="MDI_ICONS.PENCIL_OUTLINE"
      small
      data-testid="edit-draft-button"
      @click="() => navigateToStaffActivitiesEditNationalActivity({ id })"
    />
    <AvButton
      :label="t('global.buttons.delete')"
      variant="OUTLINED"
      :icon="MDI_ICONS.TRASH_CAN_OUTLINE"
      small
      data-testid="delete-draft-button"
      @click="displayDeleteConfirmation"
    />
  </div>

  <QuerySuspense
    :is-loading="isLoading"
    :error="error"
    :error-title="t('staff.activities.views.NationalActivityCatalogView.errors.fetchActivityContent')"
  >
    <AvTabs
      v-if="activity"
      v-model="activeTab"
    >
      <AvTab
        :title="t('staff.activities.views.NationalActivityCatalogView.tabs.content')"
        :icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
        data-testid="national-activity-catalog-content-tab-item"
      >
        <NationalActivityContentTab :activity="activity" />
      </AvTab>
      <AvTab
        :title="t('staff.activities.views.NationalActivityCatalogView.tabs.preview')"
        :icon="MDI_ICONS.BOOK_OPEN_VARIANT"
        data-testid="national-activity-catalog-preview-tab-item"
      >
        <NationalActivityCatalogPreviewTab
          :activity-id="activity.id"
          :status="status"
        />
      </AvTab>
    </AvTabs>
  </QuerySuspense>

  <DeleteDraftActivityConfirmationModal
    :show="showDeleteConfirmation"
    :activity-id="id"
    @close="hideDeleteConfirmation"
    @deleted="navigateToStaffActivities"
  />
</template>
