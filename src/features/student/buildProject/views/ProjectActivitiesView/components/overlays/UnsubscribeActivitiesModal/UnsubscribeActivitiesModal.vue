<script lang="ts" setup>
import { useModal } from '@/common/composables'
import { INFINITE_SCROLL_BOTTOM_DISTANCE } from '@/common/constants'
import UnsubscribeActivitiesConfirmModal from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.vue'
import { usePaginatedLibraryActivities } from '@/features/student/buildProject/composables/activities/use-paginated-library-activities/use-paginated-library-activities'
import ActivitiesSelector from '@/features/student/buildProject/views/ProjectActivitiesView/components/overlays/ActivitiesSelector/ActivitiesSelector.vue'
import { AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useInfiniteScroll } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

export interface UnsubscribeActivitiesModalProps {
  show: boolean
}

defineProps<UnsubscribeActivitiesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'unsubscribed'): void
}>()

const { t } = useI18n()
const {
  showModal: showConfirmModal,
  displayModal: displayConfirmModal,
  hideModal: hideConfirmModal
} = useModal()

const {
  activities,
  isFetching,
  hasMoreActivities,
  loadMoreActivities,
} = usePaginatedLibraryActivities()

function onUnsubscribeSuccess () {
  hideConfirmModal()
  emit('unsubscribed')
  resetSelectedActivities()
}

const selectedActivityIds = ref<string[]>([])

function resetSelectedActivities () {
  selectedActivityIds.value = []
}

function onCancel () {
  resetSelectedActivities()
  emit('cancel')
}

const activitiesContainer = ref<HTMLElement | null>(null)

useInfiniteScroll(
  activitiesContainer,
  loadMoreActivities,
  {
    distance: INFINITE_SCROLL_BOTTOM_DISTANCE,
    canLoadMore: () => !isFetching.value && hasMoreActivities.value
  }
)
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.buildProject.views.projectActivitiesView.UnsubscribeActivitiesModal.confirm', { count: selectedActivityIds.length })"
    :confirm-button-icon="MDI_ICONS.TRASH_CAN_OUTLINE"
    :confirm-button-disabled="selectedActivityIds.length === 0"
    @close="onCancel"
    @confirm="displayConfirmModal"
  >
    <template #header>
      <div
        class="av-col av-gap-sm av-w-full"
        data-testid="header"
      >
        <div class="av-row av-justify-center">
          <span class="b2-regular av-text-text1">
            {{ t('student.buildProject.views.projectActivitiesView.UnsubscribeActivitiesModal.title', { count: activities.length }) }}
          </span>
        </div>
        <div class="av-row av-justify-center">
          <span class="b2-light av-text-text1">
            {{ t('student.buildProject.views.projectActivitiesView.UnsubscribeActivitiesModal.description') }}
          </span>
        </div>
      </div>
    </template>

    <div
      ref="activitiesContainer"
      class="av-col av-gap-sm"
      style="max-height: 400px; overflow-y: auto;"
    >
      <ActivitiesSelector
        v-if="activities.length > 0"
        v-model="selectedActivityIds"
        :activities="activities"
      />
    </div>
  </AvModal>

  <UnsubscribeActivitiesConfirmModal
    :show="showConfirmModal"
    :activities="activities.filter(activity => selectedActivityIds.includes(activity.id))"
    @cancel="hideConfirmModal"
    @unsubscribed="onUnsubscribeSuccess"
  />
</template>
