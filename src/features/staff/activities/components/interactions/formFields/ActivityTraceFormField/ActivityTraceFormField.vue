<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import {
  ACTIVITY_AUTO_SAVE_DEBOUNCE,
  ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
  ACTIVITY_TRACE_SETTING_INFINITY_VALUE
} from '@/features/staff/activities/config'
import ToggleParameterCard from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'

interface ActivityTraceFormFieldProps {
  form: EditActivityForm
}

defineOptions({ inheritAttrs: false })

const { form } = defineProps<ActivityTraceFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const { t } = useI18n()

const traceField = form.useField({ name: 'traceAllowedAssociations' })
const reflectionField = form.useField({ name: 'enableReflection' })
const isFormDirty = form.useStore(state => state.isDirty)

const isDisabled = computed(() => reflectionField.state.value.value === false)

const debouncedAutosave = debounce((value: number | undefined) => {
  if (isFormDirty.value) {
    emit('autosave', { traceAllowedAssociations: value })
  }
}, ACTIVITY_AUTO_SAVE_DEBOUNCE)

const inputEnabled = computed({
  get: () => traceField.state.value.value !== ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
  set: (newValue: boolean) => {
    const value = newValue ? ACTIVITY_TRACE_SETTING_INFINITY_VALUE : ACTIVITY_TRACE_SETTING_DISABLED_VALUE
    form.setFieldValue('traceAllowedAssociations', value)
    debouncedAutosave(value)
  },
})
</script>

<template>
  <ToggleParameterCard
    v-model="inputEnabled"
    data-testid="trace-allowed-associations-toggle"
    :title="t('staff.activities.views.EditNationalActivityView.ActivityTraceFormField.title')"
    :icon="MDI_ICONS.ATTACH_FILE"
    :disabled="isDisabled"
  >
    <span class="b2-regular av-text-text1">{{ t('staff.activities.views.EditNationalActivityView.ActivityTraceFormField.description') }}</span>
  </ToggleParameterCard>
</template>
