<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import TraceAssociations from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import UpdateTraceForm from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/UpdateTraceForm.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface UpdateStepProps {
  trace: TraceDetailDTO
}

defineProps<UpdateStepProps>()

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
        :title="t('student.views.studentTraceView.updateTraceModal.steps.update.tabs.update.title')"
        :icon="MDI_ICONS.PENCIL_OUTLINE"
      >
        <UpdateTraceForm
          :trace="trace"
        />
      </AvTab>
      <AvTab
        :title="t('student.views.studentTraceView.updateTraceModal.steps.update.tabs.associations.title')"
        :icon="MDI_ICONS.LINK"
      >
        <TraceAssociations :associations="trace.traceAssociations">
          <template #caption>
            <span class="caption-regular">
              {{ t('student.views.studentTraceView.updateTraceModal.steps.update.tabs.associations.caption') }}
            </span>
          </template>
        </TraceAssociations>
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

// // TODO: this style prevents weird rendering due to modal in modal
// :deep(.fr-tabs__panel) {
//   display: block !important;
//   visibility: hidden !important;
//   height: 0 !important;
//   overflow: hidden !important;
// }

// // TODO: this style prevents weird rendering due to modal in modal
// :deep(.fr-tabs__panel--selected) {
//   visibility: visible !important;
//   height: auto !important;
// }
</style>
