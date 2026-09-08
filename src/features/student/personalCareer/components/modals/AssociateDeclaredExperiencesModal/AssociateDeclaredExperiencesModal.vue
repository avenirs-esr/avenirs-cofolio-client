<script lang="ts" setup>
import type { EExperienceType } from '@/api/avenir-esr'
import type { Association } from '@/features/student/global/types/associations.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import { useModal } from '@/common/composables'
import { ICONS } from '@/common/constants'
import { ConfirmAssociateModal, useAssociationModal } from '@/features/student/global'
import SearchAssociationLayout from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import DeclaredExperienceCompactCard from '@/features/student/personalCareer/components/cards/DeclaredExperienceCompactCard/DeclaredExperienceCompactCard.vue'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export type AssociationDeclaredExperiences = Association & {
  experienceType?: EExperienceType
}

export interface AssociateDeclaredExperiencesModalProps {
  opened: boolean
  experiences: AssociationDeclaredExperiences[]
  isLoading?: boolean
}

const {
  opened,
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
  modalOpened: cancelConfirmationModalOpened,
  openModal: openCancelConfirmationModal,
  closeModal: closeCancelConfirmationModal
} = useModal()

const {
  selectedOptions: selectedExperienceOptions,
  confirmModalOpened,
  openConfirmModal,
  closeConfirmModal,
  onDeleteItem: onDeleteExperience,
} = useAssociationModal<AvAutocompleteOption>()

const experienceAutocompleteOptions = computed<AvAutocompleteOption[]>(() =>
  experiences
    .map(experience => ({
      label: experience.title,
      value: experience.id,
      description: experience.experienceType
        ? t(`student.personalCareer.declaredExperienceType.${experience.experienceType}`)
        : undefined,
      disabled: experience.disabled
    }))
)

const selectedAssociations = computed<AssociationDeclaredExperiences[]>(() =>
  experiences.filter(experience => selectedExperienceOptions.value.some(option => option.value === experience.id))
)

watch(() => opened, (newVal) => {
  if (!newVal) {
    closeConfirmModal()
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
    data-testid="associate-declared-experiences-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.personalCareer.overlays.AssociateDeclaredExperiencesModal.confirm', { count: selectedAssociations.length })"
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
    :opened="confirmModalOpened"
    :title="t('student.personalCareer.overlays.ConfirmAssociateDeclaredExperiencesModal.title')"
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
