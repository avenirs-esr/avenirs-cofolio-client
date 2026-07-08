<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE, ACTIVITY_TRACE_SETTING_DISABLED_VALUE } from '@/features/staff/activities/config'
import ToggleParameterCard from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.vue'
import { AvMessage, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'

interface ActivityReflectionFormFieldProps {
  form: EditActivityForm
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const { form } = defineProps<ActivityReflectionFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const { t } = useI18n()

const reflectionField = form.useField({ name: 'enableReflection' })
const isFormDirty = form.useStore(state => state.isDirty)

const debouncedAutosave = debounce((data: ActivityDraftUpdateRequest) => {
  if (isFormDirty.value) {
    emit('autosave', data)
  }
}, ACTIVITY_AUTO_SAVE_DEBOUNCE)

const inputEnabled = computed({
  get: () => reflectionField.state.value.value !== false,
  set: (newValue: boolean) => {
    form.setFieldValue('enableReflection', newValue)
    const autosaveData: ActivityDraftUpdateRequest = { enableReflection: newValue }
    if (!newValue) {
      form.setFieldValue('traceAllowedAssociations', ACTIVITY_TRACE_SETTING_DISABLED_VALUE)
      autosaveData.traceAllowedAssociations = ACTIVITY_TRACE_SETTING_DISABLED_VALUE
    }
    debouncedAutosave(autosaveData)
  },
})
</script>

<template>
  <ToggleParameterCard
    v-model="inputEnabled"
    data-testid="reflection-parameter-toggle"
    :title="t('staff.activities.views.EditNationalActivityView.ActivityReflectionFormField.title')"
    :icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
    :disabled
  >
    <AvMessage
      v-if="disabled"
      type="info"
      :message="t('staff.activities.views.EditNationalActivityView.informations.disabled')"
    />
    <AvMessage
      v-else
      type="info"
      :message="t('staff.activities.views.EditNationalActivityView.informations.willBeDisabled')"
    />
    <span class="b2-regular av-text-text1">{{
      t('staff.activities.views.EditNationalActivityView.ActivityReflectionFormField.description')
    }}</span>
  </ToggleParameterCard>
</template>
