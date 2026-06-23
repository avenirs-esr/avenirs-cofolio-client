<script setup lang="ts">
import { EActivityStatus, useGetActivityContent } from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useModal } from '@/common/composables/use-modal/use-modal'
import { useNavigation } from '@/common/composables/use-navigation/use-navigation'
import { ROUTES } from '@/common/constants'
import DeleteDraftActivityConfirmationModal from '@/features/staff/activities/components/modals/DeleteDraftActivityConfirmationModal/DeleteDraftActivityConfirmationModal.vue'
import NationalActivityContentTab from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.vue'
import { AvButton } from '@avenirs-esr/avenirs-dsav'
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
      data-testid="edit-draft-button"
      @click="() => navigateToStaffActivitiesEditNationalActivity({ id })"
    />
    <AvButton
      :label="t('global.buttons.delete')"
      variant="OUTLINED"
      data-testid="delete-draft-button"
      @click="displayDeleteConfirmation"
    />
  </div>

  <QuerySuspense
    :is-loading="isLoading"
    :error="error"
    :error-title="t('staff.activities.views.NationalActivityCatalogView.errors.fetchActivityContent')"
  >
    <div class="av-col av-flex-fill">
      <NationalActivityContentTab :activity="activity!" />
    </div>
  </QuerySuspense>

  <DeleteDraftActivityConfirmationModal
    :show="showDeleteConfirmation"
    :activity-id="id"
    @close="hideDeleteConfirmation"
    @deleted="navigateToStaffActivities"
  />
</template>
