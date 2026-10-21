<script setup lang="ts">
import type { AvSelectModelValue, AvSelectOption } from '@avenirs-esr/avenirs-dsav'
import type { AddActivityResourceForm } from '@/features/staff/activities/types/forms.types'
import { AvSelect, getAvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActivityResourceType } from '@/features/staff/activities/types/resource.types'

interface AddActivityResourceTypeSelectFormFieldProps {
  form: AddActivityResourceForm
}

const { form } = defineProps<AddActivityResourceTypeSelectFormFieldProps>()

const emit = defineEmits<{
  change: [type: ActivityResourceType]
}>()

const { t } = useI18n()
const FormField = markRaw(form.Field)

const options = computed<AvSelectOption[]>(() => [
  {
    value: ActivityResourceType.FILE,
    label: t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.typeSelect.document'),
  },
  {
    value: ActivityResourceType.LINK,
    label: t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.typeSelect.link'),
  },
])

function handleChange (option: AvSelectModelValue) {
  const selectedOption = getAvSelectSelectedOption(option)

  if (!selectedOption) {
    return
  }

  emit('change', selectedOption.value as ActivityResourceType)
}
</script>

<template>
  <FormField name="resourceType">
    <template #default="{ field }">
      <AvSelect
        :model-value="options.find(option => option.value === field.state.value) ?? null"
        :label="t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.typeSelect.label')"
        :options="options"
        :placeholder="t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.typeSelect.placeholder')"
        required
        width="var(--dimension-7xl)"
        data-testid="add-activity-resource-type-select"
        @update:model-value="handleChange"
      />
    </template>
  </FormField>
</template>
