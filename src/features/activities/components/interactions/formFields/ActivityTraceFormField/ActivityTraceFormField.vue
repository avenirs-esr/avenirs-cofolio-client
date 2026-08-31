<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/activities/types/forms.types'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import Toggle from '@/common/components/Toggle/Toggle.vue'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import {
  ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN,
  ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
  ACTIVITY_TRACE_SETTING_INFINITY_VALUE
} from '@/features/activities/config'
import ToggleParameterCard from '@/features/global/components/cards/ToggleParameterCard/ToggleParameterCard.vue'
import { AvMessage, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface ActivityTraceFormFieldProps {
  form: EditActivityForm
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const { form, disabled = false } = defineProps<ActivityTraceFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const FormField = markRaw(form.Field)

const { t } = useI18n()

const { validateMin, validateRequired } = useFormValidators()

const traceAllowedAssociationsValidators = {
  onChange: ({ value }: { value: number | null | undefined }) => {
    const checkArray = [
      ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
      ACTIVITY_TRACE_SETTING_INFINITY_VALUE
    ]

    if (!!value && checkArray.includes(value)) {
      return undefined
    }

    return validateRequired(value?.toString()) || validateMin(value, ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN)
  },
}

const traceAllowedAssociations = form.useField({ name: 'traceAllowedAssociations' })
const reflectionField = form.useField({ name: 'enableReflection' })

const isDisabled = computed(() => reflectionField.state.value.value === false || disabled)

function parseTraceAllowedAssociations (value: number | string | null | undefined): number | undefined {
  const parsed = Number(value)
  return (value !== null && value !== '' && Number.isFinite(parsed)) ? parsed : undefined
}

const infinityAllowed = computed({
  get: () => traceAllowedAssociations.state.value.value === ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
  set: (newValue: boolean) => {
    const value = newValue ? ACTIVITY_TRACE_SETTING_INFINITY_VALUE : ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN
    form.setFieldValue('traceAllowedAssociations', value)
    form.validateField('traceAllowedAssociations', 'change')
    emit('autosave', { traceAllowedAssociations: value })
  },
})

const inputEnabled = computed({
  get: () => traceAllowedAssociations.state.value.value !== ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
  set: (newValue: boolean) => {
    const value = newValue ? ACTIVITY_TRACE_SETTING_INFINITY_VALUE : ACTIVITY_TRACE_SETTING_DISABLED_VALUE
    form.setFieldValue('traceAllowedAssociations', value)
    form.validateField('traceAllowedAssociations', 'change')
    emit('autosave', { traceAllowedAssociations: value })
  },
})
</script>

<template>
  <FormField
    name="traceAllowedAssociations"
    :validators="traceAllowedAssociationsValidators"
  >
    <template #default="{ field }">
      <ToggleParameterCard
        v-model="inputEnabled"
        data-testid="trace-allowed-associations-toggle"
        toggle-id="trace-allowed-associations-main-toggle"
        :disabled="isDisabled"
        :title="t('staff.activities.views.EditNationalActivityView.ActivityTraceFormField.title')"
        :icon="MDI_ICONS.ATTACH_FILE"
      >
        <div class="av-col av-gap-sm">
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
            t('staff.activities.views.EditNationalActivityView.ActivityTraceFormField.description')
          }}</span>
          <Toggle
            v-if="inputEnabled"
            id="trace-infinity-toggle-input"
            v-model="infinityAllowed"
            :description="t('staff.activities.views.EditNationalActivityView.ActivityTraceFormField.infinityToggleLabel')"
            :disabled
          />
          <Input
            v-if="!infinityAllowed && inputEnabled"
            v-bind="$attrs"
            :disabled
            data-testid="trace-allowed-associations-input"
            type="number"
            :label="t('staff.activities.views.EditNationalActivityView.ActivityTraceFormField.label')"
            label-visible
            :min="ACTIVITY_TRACE_ALLOWED_ASSOCIATIONS_MIN"
            width="fit-content"
            :model-value="field.state.value"
            :error-message="field.state.meta.errors?.join(', ')"
            @update:model-value="(value) => {
              const parsedValue = parseTraceAllowedAssociations(value)
              field.handleChange(parsedValue)
              if (!field.state.meta.errors.length && parsedValue !== null && parsedValue !== undefined) {
                emit('autosave', { traceAllowedAssociations: parsedValue })
              }
            }"
          />
        </div>
      </ToggleParameterCard>
    </template>
  </FormField>
</template>
