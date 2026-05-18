<script setup lang="ts">
import Loader from '@/common/components/Loader/Loader.vue'
import { useModal } from '@/common/composables'
import DeleteDeclaredExperienceConfirmModal from '@/features/student/personalCareer/components/overlays/DeleteDeclaredExperienceConfirmModal/DeleteDeclaredExperienceConfirmModal.vue'
import { usePaginatedDeclaredExperiences } from '@/features/student/personalCareer/composables/use-paginated-declared-experiences/use-paginated-declared-experiences'
import DeclaredExperienceSelector from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperienceSelector/DeclaredExperienceSelector.vue'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredExperiencesModalProps {
  show: boolean
  totalCount: number
}

const props = defineProps<DeleteDeclaredExperiencesModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const { totalCount } = toRefs(props)

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()

const {
  declaredExperiences: apiDeclaredExperiences,
  isFetching
} = usePaginatedDeclaredExperiences({ pageSize: totalCount })

const selectedExperienceIds = ref<string[]>([])

const declaredExperiences = computed(() => {
  return apiDeclaredExperiences.value.map(experience => ({
    label: experience.title,
    value: experience.id,
  }))
})

function onCancel () {
  emit('close')
  selectedExperienceIds.value = []
}

function onConfirm () {
  emit('confirm')
  hideModal()
  selectedExperienceIds.value = []
}
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-disabled="selectedExperienceIds.length === 0"
    :confirm-button-label="t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeleteDeclaredExperiencesModal.confirm', { count: selectedExperienceIds.length })"
    @close="onCancel"
    @confirm="displayModal"
  >
    <template #header>
      <span class="n6">
        {{ t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeleteDeclaredExperiencesModal.title') }}
      </span>
    </template>
    <span
      v-if="declaredExperiences.length === 0"
      class="s1-regular"
      data-testid="no-declared-experiences-message"
    >
      {{ t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeleteDeclaredExperiencesModal.noDeclaredExperiences') }}
    </span>
    <div
      v-else
      class="av-col av-gap-sm"
      style="max-height: 400px; overflow-y: auto;"
      data-testid="declared-experiences-list"
    >
      <DeclaredExperienceSelector
        v-model="selectedExperienceIds"
        :declared-experiences="declaredExperiences"
      />
    </div>
    <Loader :is-loading="isFetching" />
  </AvModal>

  <DeleteDeclaredExperienceConfirmModal
    :show="showModal"
    :declared-experience-ids="selectedExperienceIds"
    @close="hideModal"
    @confirm="onConfirm"
  />
</template>
