<script setup lang="ts">
import type { ActivityDraftUpdateRequest, EActivityThematic } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/activities/types/forms.types'
import ThematicSelect from '@/features/activities/views/ActivitiesView/components/tabs/NationalActivityContentTab/interactions/inputs/ThematicSelect/ThematicSelect.vue'
import { markRaw } from 'vue'

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

function onUpdateThematic (
  value: { itemId: EActivityThematic } | undefined,
) {
  if (value?.itemId) {
    thematicField.api.handleChange(value.itemId)
    emit('autosave', { thematic: value.itemId })
  }
}
</script>

<template>
  <FormField name="thematic">
    <template #default="{ field }">
      <ThematicSelect
        v-bind="$attrs"
        data-testid="thematic-select-form-field"
        :model-value="{
          itemId: field.state.value as EActivityThematic,
        }"
        :error-message="field.state.meta.errors?.join(', ')"
        @blur="field.handleBlur"
        @update:model-value="onUpdateThematic"
      />
    </template>
  </FormField>
</template>
