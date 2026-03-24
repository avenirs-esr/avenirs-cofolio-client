<script setup lang="ts">
import type { TraceAssociationsDTO, TraceDetailDTO } from '@/api/avenir-esr'
import TraceAssociations from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import UpdateTraceForm from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/UpdateTraceForm.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface UpdateStepProps {
  trace: TraceDetailDTO
  associations: TraceAssociationsDTO
}

defineProps<UpdateStepProps>()

const { t } = useI18n()

const activeTab = ref(0)
</script>

<template>
  <div class="av-col">
    <AvTabs
      v-model="activeTab"
      compact
    >
      <AvTab
        :title="t('student.traces.views.StudentTraceView.updateTraceModal.steps.update.tabs.update.title')"
        :icon="MDI_ICONS.PENCIL_OUTLINE"
      >
        <UpdateTraceForm
          :trace="trace"
        />
      </AvTab>
      <AvTab
        :title="t('student.traces.views.StudentTraceView.updateTraceModal.steps.update.tabs.associations.title')"
        :icon="MDI_ICONS.LINK"
      >
        <TraceAssociations
          :associations="associations"
          :trace-id="trace.id"
        >
          <template #caption>
            <span class="caption-regular">
              {{ t('student.traces.views.StudentTraceView.updateTraceModal.steps.update.tabs.associations.caption') }}
            </span>
          </template>
        </TraceAssociations>
      </AvTab>
    </AvTabs>
  </div>
</template>
