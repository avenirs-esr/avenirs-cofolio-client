<script setup lang="ts">
import type { CreateTraceForm } from '@/features/student/types'
import TraceFileUploadFormField
  from '@/features/student/views/StudentToolsTracesView/components/TraceFileUploadFormField/TraceFileUploadFormField.vue'
import TraceNameInputFormField
  from '@/features/student/views/StudentToolsTracesView/components/TraceNameInputFormField/TraceNameInputFormField.vue'
import TracePersonalNoteTextareaFormField
  from '@/features/student/views/StudentToolsTracesView/components/TracePersonalNoteTextareaFormField/TracePersonalNoteTextareaFormField.vue'

interface CreateTraceFormTraceDefinitionItemsProps {
  form: CreateTraceForm
}

const { form } = defineProps<CreateTraceFormTraceDefinitionItemsProps>()
</script>

<template>
  <div class="create-trace-form-trace-definition-items">
    <div class="create-trace-form-trace-definition-items__fields">
      <div class="create-trace-form-trace-definition-items__field">
        <TraceFileUploadFormField
          :form="form"
        />
      </div>

      <div class="create-trace-form-trace-definition-items__field">
        <TraceNameInputFormField
          :form="form"
        />
      </div>

      <div class="create-trace-form-trace-definition-items__field">
        <TracePersonalNoteTextareaFormField
          :form="form"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.create-trace-form-trace-definition-items {
  padding: var(--spacing-md);
}

.create-trace-form-trace-definition-items__fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.create-trace-form-trace-definition-items__field {
  display: flex;
  flex-direction: column;
}
</style>
