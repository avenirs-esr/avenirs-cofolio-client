<script lang="ts" setup>
import type { AssociationSearchResultDTO, EActivityThematic } from '@/api/avenir-esr'
import type { Association } from '@/features/student/global/types/associations.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { ICONS } from '@/common/constants'
import { ConfirmAssociateModal, useAssociationModal } from '@/features/student/global'
import DeclaredActivityCompactCard from '@/features/student/global/components/cards/DeclaredActivityCompactCard/DeclaredActivityCompactCard.vue'
import SearchAssociationLayout from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export type AssociationActivity = Association & {
  thematic?: EActivityThematic
}

export interface AssociateActivitiesModalProps {
  opened: boolean
  activities: AssociationSearchResultDTO[]
  isLoading?: boolean
}

const {
  opened,
  activities,
  isLoading = false,
} = defineProps<AssociateActivitiesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'search', query: string): void
  (e: 'associate', ids: string[]): void
}>()

const { t } = useI18n()

const {
  modalOpened: cancelConfirmationModalOpened,
  openModal: openCancelConfirmationModal,
  closeModal: closeCancelConfirmationModal
} = useModal()

const {
  selectedOptions: selectedActivityOptions,
  confirmModalOpened,
  openConfirmModal,
  closeConfirmModal,
  onDeleteItem: onDeleteActivity,
} = useAssociationModal<AvAutocompleteOption>()

const associationActivities = computed<AssociationActivity[]>(() =>
  activities.map(activity => ({
    id: activity.id,
    title: activity.title,
    disabled: activity.disabled,
    thematic: activity.category as EActivityThematic | undefined
  }))
)

const activityAutocompleteOptions = computed<AvAutocompleteOption[]>(() =>
  associationActivities.value
    .map(activity => ({
      label: activity.title,
      value: activity.id,
      description: activity.thematic
        ? t(`global.activities.badges.thematics.${activity.thematic}`)
        : undefined,
      disabled: activity.disabled
    }))
)

const selectedAssociations = computed<AssociationActivity[]>(() =>
  associationActivities.value.filter(activity => selectedActivityOptions.value.some(option => option.value === activity.id))
)

watch(() => opened, (newVal) => {
  if (!newVal) {
    closeConfirmModal()
    selectedActivityOptions.value = []
  }
})

function onSearch (query: string) {
  emit('search', query)
}

function onCancel () {
  selectedActivityOptions.value = []
  emit('cancel')
}

function onConfirm () {
  emit('associate', selectedAssociations.value.map(activity => activity.id))
  selectedActivityOptions.value = []
}

function onAssociateModalClose () {
  if (selectedActivityOptions.value.length > 0) {
    openCancelConfirmationModal()
    return
  }

  onCancel()
}

function onConfirmCancelAssociateModal () {
  closeCancelConfirmationModal()
  onCancel()
}
</script>

<template>
  <AvModal
    :opened="opened"
    data-testid="associate-activities-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.traces.views.StudentTraceView.AssociateActivitiesModal.confirm', { count: selectedAssociations.length })"
    :confirm-button-disabled="selectedAssociations.length === 0"
    :confirm-button-icon="ICONS.ASSOCIATIONS"
    :is-loading="isLoading"
    @close="onAssociateModalClose"
    @confirm="openConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center"
        data-testid="header"
      >
        <span class="b2-regular av-text-text1">
          {{ t('student.traces.views.StudentTraceView.AssociateActivitiesModal.title') }}
        </span>
      </div>
    </template>

    <SearchAssociationLayout
      v-model="selectedActivityOptions"
      :options="activityAutocompleteOptions"
      :items="selectedAssociations"
      :input-options="{
        placeholder: t('student.traces.views.StudentTraceView.AssociateActivitiesModal.searchPlaceholder'),
      }"
      :get-option-key="option => option.value"
      :get-option-label="(option) => option.label"
      :loading="isLoading"
      @update:search="onSearch"
      @delete="onDeleteActivity"
    >
      <template #selectedItem="{ item }">
        <DeclaredActivityCompactCard
          :activity="item"
          class="av-w-full"
        />
      </template>
    </SearchAssociationLayout>
  </AvModal>

  <ConfirmAssociateModal
    :opened="confirmModalOpened"
    :title="t('student.traces.views.StudentTraceView.ConfirmAssociateActivitiesModal.title')"
    :items="selectedAssociations"
    @cancel="closeConfirmModal"
    @confirm="onConfirm"
  />

  <ConfirmationModal
    :opened="cancelConfirmationModalOpened"
    @close="closeCancelConfirmationModal"
    @confirm="onConfirmCancelAssociateModal"
  />
</template>
