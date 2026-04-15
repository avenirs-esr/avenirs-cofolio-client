<script lang="ts" setup>
import type { EExternalSkillType } from '@/api/avenir-esr'
import type { IdTitle } from '@/types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import DeclaredSkillCompactCard
  from '@/features/student/declaredSkills/components/cards/DeclaredSkillCompactCard/DeclaredSkillCompactCard.vue'
import { ConfirmAssociateModal, useAssociationModal } from '@/features/student/global'
import SearchAssociationLayout from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import { ICONS } from '@/features/student/global/icons'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export type AssociationDeclaredSkill = IdTitle & { disabled: boolean, type: EExternalSkillType }

export type SelectedSkill = Omit<AssociationDeclaredSkill, 'disabled'>

export type DeclaredSkillAvAutocompleteOption = AvAutocompleteOption & { type: EExternalSkillType }

export interface AssociateDeclaredSkillsModalProps {
  show: boolean
  skills: AssociationDeclaredSkill[]
  isLoading?: boolean
}

const {
  show,
  skills,
  isLoading = false,
} = defineProps<AssociateDeclaredSkillsModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'search', query: string): void
  (e: 'associate', ids: string[]): void
}>()

const { t } = useI18n()

const {
  selectedOptions: selectedSkillOptions,
  showConfirmModal,
  displayConfirmModal,
  hideConfirmModal,
  onDeleteItem: onDeleteSkill,
} = useAssociationModal<DeclaredSkillAvAutocompleteOption>()

const skillAutocompleteOptions = computed<DeclaredSkillAvAutocompleteOption[]>(() =>
  skills.filter(({ disabled }) => !disabled).map(skill => ({
    label: skill.title,
    value: skill.id,
    type: skill.type
  }))
)

const selectedAssociations = computed<SelectedSkill[]>(() =>
  selectedSkillOptions.value.map(option => ({
    id: option.value.toString(),
    title: option.label,
    type: option.type
  }))
)

watch(() => show, (newVal) => {
  if (!newVal) {
    hideConfirmModal()
    selectedSkillOptions.value = []
  }
})

function onSearch (query: string) {
  emit('search', query)
}

function onCancel () {
  selectedSkillOptions.value = []
  emit('cancel')
}

function onConfirm () {
  emit('associate', selectedAssociations.value.map(skill => skill.id))
}
</script>

<template>
  <AvModal
    :opened="show"
    data-testid="associate-declared-skills-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.declaredSkills.overlays.modals.AssociateDeclaredSkillsModal.confirm', { count: selectedAssociations.length })"
    :confirm-button-disabled="selectedAssociations.length === 0"
    :confirm-button-icon="ICONS.ASSOCIATIONS"
    :is-loading="isLoading"
    @close="onCancel"
    @confirm="displayConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center"
        data-testid="header"
      >
        <span class="b2-regular av-text-text1">
          {{ t('student.declaredSkills.overlays.modals.AssociateDeclaredSkillsModal.title') }}
        </span>
      </div>
    </template>

    <SearchAssociationLayout
      v-model="selectedSkillOptions"
      :options="skillAutocompleteOptions"
      :items="selectedAssociations"
      :input-options="{ placeholder: t('student.declaredSkills.overlays.modals.AssociateDeclaredSkillsModal.searchPlaceholder') }"
      :get-option-key="option => option.value"
      :get-option-label="option => option.label"
      :loading="isLoading"
      button-theme="TERTIARY"
      @search="onSearch"
      @delete="onDeleteSkill"
    >
      <template #selectedItem="{ item }">
        <DeclaredSkillCompactCard :declared-skill="item" />
      </template>
    </SearchAssociationLayout>
  </AvModal>

  <ConfirmAssociateModal
    :show="showConfirmModal"
    :title="t('student.declaredSkills.overlays.modals.AssociateDeclaredSkillsModal.confirmTitle', selectedAssociations.length)"
    :items="selectedAssociations"
    @cancel="hideConfirmModal"
    @confirm="onConfirm"
  />
</template>
