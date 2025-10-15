<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/types'
import { TraceAuthenticDeclarationToggle } from '@/features/student/components/toggles'

interface TraceAuthenticDeclarationToggleFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

const { form } = defineProps<TraceAuthenticDeclarationToggleFormFieldProps>()

const isAuthenticField = form.useField({ name: 'isAuthentic' })
const authenticErrors = computed(() => isAuthenticField.state.value.meta.errors)
</script>

<template>
  <div>
    <form.Field name="isAuthentic">
      <template #default="{ field }">
        <TraceAuthenticDeclarationToggle
          v-bind="$attrs"
          id="isAuthentic"
          name="isAuthentic"
          :model-value="field.state.value"
          @update:model-value="(value) => field.handleChange(value)"
        />
      </template>
    </form.Field>
    <div
      v-if="authenticErrors.length > 0"
      class="trace-form__authentic-error"
    >
      {{ authenticErrors.join(', ') }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.trace-form__authentic-error {
  font-size: var(--font-size-xs);
  color: var(--dark-background-error);
  padding-bottom: var(--spacing-sm);
}
</style>
