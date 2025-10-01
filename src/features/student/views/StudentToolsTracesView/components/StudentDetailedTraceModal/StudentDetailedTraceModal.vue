<script setup lang="ts">
import type { TraceViewDTO } from '@/api/avenir-esr'
import StudentDetailedTraceCardSettingMenu
  from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceCardSettingMenu/StudentDetailedTraceCardSettingMenu.vue'
import { AvButton, AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const {
  trace,
  showModal,
  onClose
} = defineProps<{ trace: TraceViewDTO, showModal: boolean, onClose: () => void }>()

const { t } = useI18n()
const { showSettingsMenu, toggleSettingsMenu, closeSettingsMenu } = useSettingsMenu()

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
    :opened="showModal"
    :close-button-label="t('student.views.studentToolsTracesView.studentDetailedTraceModal.buttons.close').toUpperCase()"
    close-button-variant="OUTLINED"
    size="lg"
    @close="onClose"
  >
    <template #header>
      <div class="header">
        <h5 class="n5">
          {{ t('student.views.studentToolsTracesView.studentDetailedTraceModal.title') }} <span class="s1-regular">{{ trace.title }}</span>
        </h5>
        <AvButton
          class="student-detailed-trace-modal__settings-btn"
          :icon="{ name: MDI_ICONS.DOTS_VERTICAL }"
          variant="OUTLINED"
          size="sm"
          :label="t('student.views.studentToolsTracesView.studentDetailedTraceModal.settings.ariaLabel').toUpperCase()"
          :on-click="toggleSettingsMenu"
        />
        <StudentDetailedTraceCardSettingMenu
          :trace="trace"
          :show="showSettingsMenu"
          @close="closeSettingsMenu"
          @on-trace-delete="onClose"
        />
      </div>
    </template>
    <div class="student-detailed-trace-modal__container">
      <div class="student-detailed-trace-modal__content">
        Placeholder...
      </div>
    </div>
  </AvModal>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.student-detailed-trace-modal__container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.student-detailed-trace-modal__content {
  flex: 1;
  overflow-y: auto;
}
</style>
