<script setup lang="ts">
import type { ActivityDraftUpdateRequest, EActivityThematic } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import ActivityThematicSelect from '@/common/activities/inputs/ActivityThematicSelect/ActivityThematicSelect.vue'

interface ThematicSelectFormFieldProps {
  form: EditActivityForm
}

defineOptions({
  inheritAttrs: false,
})

const { form } = defineProps<ThematicSelectFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const FormField = markRaw(form.Field)
const thematicField = form.useField({
  name: 'thematic',
})

function onUpdateThematic (value?: EActivityThematic | EActivityThematic[]) {
  const thematic = Array.isArray(value) ? value[0] : value
  if (!thematic) {
    return
  }

  thematicField.api.handleChange(thematic)
  emit('autosave', { thematic })
}
</script>

<template>
  <FormField name="thematic">
    <template #default="{ field }">
      <ActivityThematicSelect
        v-bind="$attrs"
        :model-value="field.state.value"
        :error-message="field.state.meta.errors?.join(', ')"
        :prefix-icon="MDI_ICONS.BOOK_OPEN_VARIANT"
        data-testid="thematic-select-form-field"
        required
        @blur="field.handleBlur"
        @update:model-value="onUpdateThematic"
      />
    </template>
  </FormField>
</template>
