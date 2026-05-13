<script setup lang="ts">
import Loader from '@/common/components/Loader/Loader.vue'
import { useModal } from '@/common/composables'
import { INFINITE_SCROLL_BOTTOM_DISTANCE } from '@/common/constants'
import DeleteDeclaredProgramConfirmModal from '@/features/student/personalCareer/components/overlays/DeleteDeclaredProgramConfirmModal/DeleteDeclaredProgramConfirmModal.vue'
import { usePaginatedDeclaredPrograms } from '@/features/student/personalCareer/composables/use-paginated-declared-programs/use-paginated-declared-programs'
import DeclaredProgramSelector from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeclaredProgramSelector/DeclaredProgramSelector.vue'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useInfiniteScroll } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

export interface DeleteDeclaredProgramsModalProps {
  show: boolean
}

defineProps<DeleteDeclaredProgramsModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()

const pageSize = ref(9)
const declaredProgramsContainer = ref<HTMLElement | null>(null)

const { declaredPrograms: apiDeclaredPrograms, loadMoreDeclaredPrograms, isFetching } = usePaginatedDeclaredPrograms({ pageSize })

const selectedProgramIds = ref<string[]>([])

useInfiniteScroll(declaredProgramsContainer, () => {
  loadMoreDeclaredPrograms()
}, { distance: INFINITE_SCROLL_BOTTOM_DISTANCE })

const declaredPrograms = computed(() => {
  return apiDeclaredPrograms.value.map(program => ({
    label: program.title,
    value: program.id,
  }))
})

function onClose () {
  selectedProgramIds.value = []
  emit('close')
}

function onconfirm () {
  emit('confirm')
  hideModal()
}
</script>

<template>
  <AvModal
    :opened="show"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-disabled="selectedProgramIds.length === 0"
    :confirm-button-label="t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeleteDeclaredProgramsModal.confirm', { count: selectedProgramIds.length })"
    @close="onClose"
    @confirm="displayModal"
  >
    <template #header>
      <span class="n6">
        {{ t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeleteDeclaredProgramsModal.title') }}
      </span>
    </template>
    <span
      v-if="declaredPrograms.length === 0"
      class="s1-regular"
      data-testid="no-declared-programs-message"
    >
      {{ t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeleteDeclaredProgramsModal.noDeclaredPrograms') }}
    </span>
    <div
      v-else
      ref="declaredProgramsContainer"
      class="av-col av-gap-sm"
      style="max-height: 400px; overflow-y: auto;"
      data-testid="scroll-to-load-more"
    >
      <DeclaredProgramSelector
        v-model="selectedProgramIds"
        :declared-programs="declaredPrograms"
      />
    </div>
    <Loader :is-loading="isFetching" />
  </AvModal>

  <DeleteDeclaredProgramConfirmModal
    :show="showModal"
    :declared-program-ids="selectedProgramIds"
    @close="hideModal"
    @confirm="onconfirm"
  />
</template>
