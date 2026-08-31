<script lang="ts" setup>
import type { EActivityThematic } from '@/api/avenir-esr'
import type { Association } from '@/features/global/types/associations.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { ICONS } from '@/common/constants'
import { DeclaredActivityCompactCard } from '@/features/buildProject'
import { ConfirmAssociateModal, useAssociationModal } from '@/features/global'
import SearchAssociationLayout from '@/features/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export type AssociationActivity = Association & {
  thematic: EActivityThematic
}

export interface AssociateActivitiesModalProps {
  show: boolean
  activities: AssociationActivity[]
  isLoading?: boolean
}

const {
  show,
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
  showModal: showCancelConfirmationModal,
  displayModal: displayCancelConfirmationModal,
  hideModal: hideCancelConfirmationModal
} = useModal()

const {
  selectedOptions: selectedActivityOptions,
  showConfirmModal,
  displayConfirmModal,
  hideConfirmModal,
  onDeleteItem: onDeleteActivity,
} = useAssociationModal<AvAutocompleteOption>()

const activityAutocompleteOptions = computed<AvAutocompleteOption[]>(() =>
  activities
    .map(activity => ({
      label: activity.title,
      value: activity.id,
      description: t(`global.activities.badges.thematics.${activity.thematic}`),
      disabled: activity.disabled
    }))
)

const selectedAssociations = computed<AssociationActivity[]>(() =>
  activities.filter(activity => selectedActivityOptions.value.some(option => option.value === activity.id))
)

watch(() => show, (newVal) => {
  if (!newVal) {
    hideConfirmModal()
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
    displayCancelConfirmationModal()
    return
  }

  onCancel()
}

function onConfirmCancelAssociateModal () {
  hideCancelConfirmationModal()
  onCancel()
}
</script>

<template>
  <AvModal
    :opened="show"
    data-testid="associate-activities-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.traces.views.StudentTraceView.AssociateActivitiesModal.confirm', { count: selectedAssociations.length })"
    :confirm-button-disabled="selectedAssociations.length === 0"
    :confirm-button-icon="ICONS.ASSOCIATIONS"
    :is-loading="isLoading"
    @close="onAssociateModalClose"
    @confirm="displayConfirmModal"
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
    :show="showConfirmModal"
    :title="t('student.traces.views.StudentTraceView.ConfirmAssociateActivitiesModal.title')"
    :items="selectedAssociations"
    @cancel="hideConfirmModal"
    @confirm="onConfirm"
  />

  <ConfirmationModal
    :show="showCancelConfirmationModal"
    @close="hideCancelConfirmationModal"
    @confirm="onConfirmCancelAssociateModal"
  />
</template>
