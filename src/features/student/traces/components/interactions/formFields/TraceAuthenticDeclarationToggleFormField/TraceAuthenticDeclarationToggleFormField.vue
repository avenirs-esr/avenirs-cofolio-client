<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/traces/types/forms.types'
import TraceAuthenticDeclarationToggle from '@/features/student/traces/components/interactions/toggles/TraceAuthenticDeclarationToggle/TraceAuthenticDeclarationToggle.vue'
import { markRaw } from 'vue'

interface TraceAuthenticDeclarationToggleFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

const { form } = defineProps<TraceAuthenticDeclarationToggleFormFieldProps>()
const FormField = markRaw(form.Field)

const isAuthenticField = form.useField({ name: 'isAuthentic' })
const authenticErrors = computed(() => isAuthenticField.state.value.meta.errors)
</script>

<template>
  <div>
    <FormField name="isAuthentic">
      <template #default="{ field }">
        <TraceAuthenticDeclarationToggle
          v-bind="$attrs"
          id="is-authentic"
          name="isAuthentic"
          :model-value="field.state.value"
          @update:model-value="(value) => field.handleChange(value)"
        />
      </template>
    </FormField>
    <div
      v-if="authenticErrors.length > 0"
      class="av-pb-sm"
      data-testid="trace-form__authentic-error"
    >
      <span class="caption-regular trace-form__authentic-error-message">
        {{ authenticErrors.join(', ') }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.trace-form__authentic-error-message {
  color: var(--dark-background-error);
}
</style>
