<script setup lang="ts">
import type { ActivityDraftUpdateRequest, EActivityThematic } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE } from '@/features/staff/activities/config'
import ThematicSelect from '@/features/staff/activities/views/ActivitiesView/components/tabs/NationalActivityContentTab/interactions/inputs/ThematicSelect/ThematicSelect.vue'
import { debounce } from 'lodash-es'
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

const isFormDirty = form.useStore(state => state.isDirty)

const debouncedAutosave = debounce((value: EActivityThematic) => {
  if (isFormDirty.value) {
    emit('autosave', { thematic: value })
  }
}, ACTIVITY_AUTO_SAVE_DEBOUNCE)

function onUpdateThematic (
  value: { itemId: EActivityThematic } | undefined,
) {
  if (value?.itemId) {
    thematicField.api.handleChange(value.itemId)
    debouncedAutosave(value.itemId)
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
