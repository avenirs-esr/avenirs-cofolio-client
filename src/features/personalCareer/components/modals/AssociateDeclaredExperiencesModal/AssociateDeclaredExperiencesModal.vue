<script lang="ts" setup>
import type { EExperienceType } from '@/api/avenir-esr'
import type { Association } from '@/features/global/types/associations.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { ICONS } from '@/common/constants'
import { ConfirmAssociateModal, useAssociationModal } from '@/features/global'
import SearchAssociationLayout from '@/features/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import DeclaredExperienceCompactCard from '@/features/personalCareer/components/cards/DeclaredExperienceCompactCard/DeclaredExperienceCompactCard.vue'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export type AssociationDeclaredExperiences = Association & {
  experienceType: EExperienceType
}

export interface AssociateDeclaredExperiencesModalProps {
  show: boolean
  experiences: AssociationDeclaredExperiences[]
  isLoading?: boolean
}

const {
  show,
  experiences,
  isLoading = false,
} = defineProps<AssociateDeclaredExperiencesModalProps>()

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
  selectedOptions: selectedExperienceOptions,
  showConfirmModal,
  displayConfirmModal,
  hideConfirmModal,
  onDeleteItem: onDeleteExperience,
} = useAssociationModal<AvAutocompleteOption>()

const experienceAutocompleteOptions = computed<AvAutocompleteOption[]>(() =>
  experiences
    .map(experience => ({
      label: experience.title,
      value: experience.id,
      description: t(`student.personalCareer.declaredExperienceType.${experience.experienceType}`),
      disabled: experience.disabled
    }))
)

const selectedAssociations = computed<AssociationDeclaredExperiences[]>(() =>
  experiences.filter(experience => selectedExperienceOptions.value.some(option => option.value === experience.id))
)

watch(() => show, (newVal) => {
  if (!newVal) {
    hideConfirmModal()
    selectedExperienceOptions.value = []
  }
})

function onSearch (query: string) {
  emit('search', query)
}

function onCancel () {
  selectedExperienceOptions.value = []
  emit('cancel')
}

function onConfirm () {
  emit('associate', selectedAssociations.value.map(experience => experience.id))
}

function onAssociateModalClose () {
  if (selectedExperienceOptions.value.length > 0) {
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
    data-testid="associate-declared-experiences-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.personalCareer.overlays.AssociateDeclaredExperiencesModal.confirm', { count: selectedAssociations.length })"
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
          {{ t('student.personalCareer.overlays.AssociateDeclaredExperiencesModal.title') }}
        </span>
      </div>
    </template>

    <SearchAssociationLayout
      v-model="selectedExperienceOptions"
      :options="experienceAutocompleteOptions"
      :items="selectedAssociations"
      :input-options="{
        placeholder: t('student.personalCareer.overlays.AssociateDeclaredExperiencesModal.searchPlaceholder'),
      }"
      :get-option-key="option => option.value"
      :get-option-label="(option) => option.label"
      :loading="isLoading"
      @update:search="onSearch"
      @delete="onDeleteExperience"
    >
      <template #selectedItem="{ item }">
        <DeclaredExperienceCompactCard
          :experience="item"
          class="av-w-full"
        />
      </template>
    </SearchAssociationLayout>
  </AvModal>

  <ConfirmAssociateModal
    :show="showConfirmModal"
    :title="t('student.personalCareer.overlays.ConfirmAssociateDeclaredExperiencesModal.title')"
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
