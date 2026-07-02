<script setup lang="ts">
import type { AddActivityResourceForm } from '@/features/staff/activities/types/forms.types'
import { ActivityResourceType } from '@/features/staff/activities/types/resource.types'
import { AvSelect, type AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface AddActivityResourceTypeSelectFormFieldProps {
  form: AddActivityResourceForm
}

const { form } = defineProps<AddActivityResourceTypeSelectFormFieldProps>()

const emit = defineEmits<{
  change: [type: ActivityResourceType]
}>()

const { t } = useI18n()
const FormField = markRaw(form.Field)

const options = computed(() => [
  {
    id: ActivityResourceType.FILE,
    label: t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.typeSelect.document')
  },
  {
    id: ActivityResourceType.LINK,
    label: t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.typeSelect.link')
  }
])

function handleChange (option: AvSelectSelectedOption) {
  const nextType = option.itemId as ActivityResourceType
  emit('change', nextType)
}
</script>

<template>
  <FormField name="resourceType">
    <template #default="{ field }">
      <AvSelect
        :selected-item="{ itemId: field.state.value }"
        :label="t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.typeSelect.label')"
        :options="options"
        :placeholder="t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.typeSelect.placeholder')"
        data-testid="add-activity-resource-type-select"
        @update:selected-item="handleChange"
      />
    </template>
  </FormField>
</template>
