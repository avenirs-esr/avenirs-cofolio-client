<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/activities/types/forms.types'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import Toggle from '@/common/components/Toggle/Toggle.vue'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { ICONS } from '@/common/constants'
import { ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN } from '@/features/activities/config'
import ToggleParameterCard from '@/features/global/components/cards/ToggleParameterCard/ToggleParameterCard.vue'
import { AvMessage } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface ActivityFeedbackFormFieldProps {
  form: EditActivityForm
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const { form } = defineProps<ActivityFeedbackFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const FormField = markRaw(form.Field)

const { validateMin, validateRequired } = useFormValidators()

const feedbackAllowedIterationsValidators = {
  onChange: ({ value }: { value: number | null | undefined }) => {
    const checkArray = [
      ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
      ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY
    ]

    if (!!value && checkArray.includes(value)) {
      return undefined
    }

    return validateRequired(value?.toString()) || validateMin(value, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN)
  },
}

const feedbackAllowedIterations = form.useField({ name: 'feedbackAllowedIterations' })
const { t } = useI18n()

function parseFeedbackAllowedIterations (value: number | string | null | undefined): number | undefined {
  const parsed = Number(value)
  return (value !== null && value !== '' && Number.isFinite(parsed)) ? parsed : undefined
}

const infinityAllowed = computed({
  get: () => feedbackAllowedIterations.state.value.value === ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
  set: (newValue: boolean) => {
    const value = newValue ? ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY : ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT
    form.setFieldValue('feedbackAllowedIterations', value)
    form.validateField('feedbackAllowedIterations', 'change')
    emit('autosave', { feedbackAllowedIterations: value })
  },
})

const inputEnabled = computed({
  get: () => feedbackAllowedIterations.state.value.value !== ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
  set: (newValue: boolean) => {
    const value = newValue ? ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DEFAULT : ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED
    form.setFieldValue('feedbackAllowedIterations', value)
    form.validateField('feedbackAllowedIterations', 'change')
    emit('autosave', { feedbackAllowedIterations: value })
  },
})
</script>

<template>
  <FormField
    name="feedbackAllowedIterations"
    :validators="feedbackAllowedIterationsValidators"
  >
    <template #default="{ field }">
      <ToggleParameterCard
        v-model="inputEnabled"
        data-testid="feedback-parameter-toggle"
        :disabled
        toggle-id="feedback-main-toggle"
        :title="t('staff.activities.views.EditNationalActivityView.ActivityFeedbackFormField.title')"
        :icon="ICONS.FEEDBACK"
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
            t('staff.activities.views.EditNationalActivityView.ActivityFeedbackFormField.description')
          }}</span>
          <Toggle
            v-if="inputEnabled"
            id="feedback-infinity-toggle"
            v-model="infinityAllowed"
            :description="t('staff.activities.views.EditNationalActivityView.ActivityFeedbackFormField.infinityToggleLabel')"
            :disabled
          />
          <Input
            v-if="!infinityAllowed && inputEnabled"
            v-bind="$attrs"
            data-testid="feedback-allowed-iterations-input"
            :disabled
            type="number"
            :label="t('staff.activities.views.EditNationalActivityView.ActivityFeedbackFormField.label')"
            label-visible
            :min="ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN"
            width="fit-content"
            :model-value="field.state.value"
            :error-message="field.state.meta.errors?.join(', ')"
            @update:model-value="(value) => {
              const parsedValue = parseFeedbackAllowedIterations(value)
              field.handleChange(parsedValue)
              if (!field.state.meta.errors.length && parsedValue !== null && parsedValue !== undefined) {
                emit('autosave', { feedbackAllowedIterations: parsedValue })
              }
            }"
          />
        </div>
      </ToggleParameterCard>
    </template>
  </FormField>
</template>
