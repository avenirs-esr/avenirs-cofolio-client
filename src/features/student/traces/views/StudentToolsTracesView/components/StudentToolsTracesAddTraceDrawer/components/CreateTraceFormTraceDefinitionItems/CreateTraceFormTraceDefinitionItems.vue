<script setup lang="ts">
import type { CreateTraceForm } from '@/features/student/traces/types/forms.types'
import TraceFileUploadFormField from '@/features/student/traces/components/interactions/formFields/TraceFileUploadFormField/TraceFileUploadFormField.vue'
import TraceNameInputFormField from '@/features/student/traces/components/interactions/formFields/TraceNameInputFormField/TraceNameInputFormField.vue'
import TracePersonalNoteTextareaFormField from '@/features/student/traces/components/interactions/formFields/TracePersonalNoteTextareaFormField/TracePersonalNoteTextareaFormField.vue'
import TraceTypeSelectorContainer from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/TraceTypeSelector/TraceTypeSelector.vue'
import { TraceType } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/types/trace-type.types'

interface CreateTraceFormTraceDefinitionItemsProps {
  form: CreateTraceForm
}

const { form } = defineProps<CreateTraceFormTraceDefinitionItemsProps>()

const selectedTraceType = ref({ itemId: TraceType.FILE })
</script>

<template>
  <div class="create-trace-form-trace-definition-items av-col av-p-md">
    <div
      class="av-col av-gap-lg"
      data-testid="form-fields-container"
    >
      <TraceTypeSelectorContainer v-model:trace-type="selectedTraceType" />

      <div
        v-if="selectedTraceType.itemId === TraceType.FILE"
        class="av-col"
      >
        <TraceFileUploadFormField :form="form" />
      </div>

      <div
        v-else-if="selectedTraceType.itemId === TraceType.LINK"
        class="av-col"
      >
        <h5>Link Trace Task #1390</h5>
      </div>

      <div class="av-col">
        <TraceNameInputFormField
          :form="form"
        />
      </div>

      <div class="av-col">
        <TracePersonalNoteTextareaFormField
          :form="form"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.trace-type-selector-container {
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--divider);
}
</style>
