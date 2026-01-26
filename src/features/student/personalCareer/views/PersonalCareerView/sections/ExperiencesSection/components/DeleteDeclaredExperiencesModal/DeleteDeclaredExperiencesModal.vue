<script setup lang="ts">
import Loader from '@/common/components/Loader/Loader.vue'
import { useModal } from '@/common/composables'
import DeleteDeclaredExperienceConfirmModal from '@/features/student/personalCareer/components/overlays/DeleteDeclaredExperienceConfirmModal/DeleteDeclaredExperienceConfirmModal.vue'
import { usePaginatedDeclaredExperiences } from '@/features/student/personalCareer/composables/use-paginated-declared-experiences/use-paginated-declared-experiences'
import DeclaredExperienceSelector from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperienceSelector/DeclaredExperienceSelector.vue'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useInfiniteScroll } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredExperiencesModalProps {
  show: boolean
}

defineProps<DeleteDeclaredExperiencesModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()

const declaredExperiencesContainer = ref<HTMLElement | null>(null)

const { declaredExperiences: apiDeclaredExperiences, loadMoreDeclaredExperiences, isFetching } = usePaginatedDeclaredExperiences()

const selectedExperienceIds = ref<string[]>([])

useInfiniteScroll(declaredExperiencesContainer, () => {
  loadMoreDeclaredExperiences()
}, { distance: 10 })

const declaredExperiences = computed(() => {
  return apiDeclaredExperiences.value.map(experience => ({
    label: experience.title,
    value: experience.id,
  }))
})

function onConfirm () {
  emit('confirm')
  hideModal()
}
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.close')"
    :confirm-button-disabled="selectedExperienceIds.length === 0"
    :confirm-button-label="t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeleteDeclaredExperiencesModal.confirm', { count: selectedExperienceIds.length })"
    @close="emit('close')"
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
      ref="declaredExperiencesContainer"
      class="av-col av-gap-sm"
      style="max-height: 400px; overflow-y: auto;"
      data-testid="scroll-to-load-more"
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
