<script setup lang="ts">
import type { TraceViewDTO } from '@/api/avenir-esr'
import StudentDetailedTraceCardSettingMenu
  from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceCardSettingMenu/StudentDetailedTraceCardSettingMenu.vue'
import { AvButton, AvModal, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const {
  trace,
  showModal,
  onClose
} = defineProps<{ trace: TraceViewDTO, showModal: boolean, onClose: () => void }>()

const { t } = useI18n()
const { showSettingsMenu, toggleSettingsMenu, closeSettingsMenu } = useSettingsMenu()

// TODO: Implement the delete trace functionality
// eslint-disable-next-line unused-imports/no-unused-vars
function handleDeleteTrace (trace: TraceViewDTO) {

}

/**
 * composable that manages and organize the settings menu for the trace card
 */
function useSettingsMenu () {
  const showSettingsMenu = ref(false)

  function toggleSettingsMenu (event: Event) {
    event.stopPropagation()
    showSettingsMenu.value = !showSettingsMenu.value
  }

  function closeSettingsMenu () {
    showSettingsMenu.value = false
  }

  onMounted(() => {
    document.addEventListener('click', closeSettingsMenu)
  })

  onUnmounted(() => {
    document.removeEventListener('click', closeSettingsMenu)
  })

  return {
    showSettingsMenu,
    toggleSettingsMenu,
    closeSettingsMenu
  }
}
</script>

<template>
  <AvModal
    title=""
    :opened="showModal"
    :close-button-label="t('student.views.studentToolsTracesView.studentDetailedTraceModal.buttons.close')"
    :close-button-title="t('student.views.studentToolsTracesView.studentDetailedTraceModal.buttons.close')"
    size="lg"
    @close="onClose"
  >
    <div class="student-detailed-trace-modal__container">
      <div class="student-detailed-trace-modal__header">
        <h1 class="student-detailed-trace-modal__title fr-modal__title">
          {{ t('student.views.studentToolsTracesView.studentDetailedTraceModal.title') }}{{ trace.title }}
        </h1>
        <AvButton
          class="student-detailed-trace-modal__settings-btn"
          :icon="{ name: MDI_ICONS.DOTS_VERTICAL }"
          icon-only
          variant="OUTLINED"
          size="sm"
          :aria-label="t('student.views.studentToolsTracesView.studentDetailedTraceModal.settings.ariaLabel')"
          @click="toggleSettingsMenu"
        />
        <StudentDetailedTraceCardSettingMenu
          :trace="trace"
          :show="showSettingsMenu"
          @close="closeSettingsMenu"
          @on-trace-delete="handleDeleteTrace"
        />
      </div>
      <div class="student-detailed-trace-modal__content">
        Placeholder...
      </div>
    </div>
  </AvModal>
</template>

<style lang="scss" scoped>
.student-detailed-trace-modal__container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.student-detailed-trace-modal__content {
  flex: 1;
  overflow-y: auto;
}

.student-detailed-trace-modal__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
