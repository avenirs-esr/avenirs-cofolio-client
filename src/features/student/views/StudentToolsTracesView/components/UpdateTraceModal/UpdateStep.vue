<script setup lang="ts">
import type { TraceViewDTO } from '@/api/avenir-esr'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineProps<{ trace: TraceViewDTO }>()

const { t } = useI18n()

const activeTab = ref(0)
</script>

<template>
  <div class="main-contaier">
    <AvTabs
      v-model="activeTab"
      compact
    >
      <AvTab
        :title="t('student.views.studentToolsTracesView.updateTraceModal.steps.update.tabs.update.title')"
        :icon="MDI_ICONS.PENCIL_OUTLINE"
      >
        <span>Placeholder...</span>
      </AvTab>
      <AvTab
        :title="t('student.views.studentToolsTracesView.updateTraceModal.steps.update.tabs.associations.title')"
        icon="mdi:chat-alert"
      >
        <p>Placeholder...</p>
        <p>Placeholder...</p>
      </AvTab>
    </AvTabs>
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

// TODO: this style prevents weird rendering due to modal in modal
:deep(.fr-tabs__panel) {
  display: block !important;
  visibility: hidden !important;
  height: 0 !important;
  overflow: hidden !important;
}

// TODO: this style prevents weird rendering due to modal in modal
:deep(.fr-tabs__panel--selected) {
  visibility: visible !important;
  height: auto !important;
}
</style>
