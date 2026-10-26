<script setup lang="ts">
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { AnyFieldApi } from '@/common/types'
import type { EditActivityForm, EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import Toggle from '@/common/components/interaction/toggles/Toggle/Toggle.vue'
import { countDecimals, formatOptionalNumber, getStepFromDecimals, parseOptionalNumber, roundToDecimals } from '@/common/utils'
import { useEditNationalActivityFormValidators } from '@/features/staff/activities/composables/use-edit-national-activity-form-validators/use-edit-national-activity-form-validators'
import { ACTIVITY_ASSESSMENT_GRADE_MAX_DECIMALS } from '@/features/staff/activities/config'

interface ActivityAssessmentGradeFormFieldProps extends AvInteractiveProps {
  form: EditActivityForm
}

defineOptions({ inheritAttrs: false })

const {
  form,
  disabled = false,
  disabledTooltip
} = defineProps<ActivityAssessmentGradeFormFieldProps>()

const emit = defineEmits<{
  change: []
  updateGradeEnabled: [value: boolean]
}>()

const FormField = markRaw(form.Field)
type FieldApi = AnyFieldApi<EditActivityFormData, 'assessmentGrade'>
type FieldValue = EditActivityFormData['assessmentGrade']

const { t } = useI18n()
const { validateAssessmentGrade } = useEditNationalActivityFormValidators()

const grade = form.useStore(state => state.values.assessmentGrade)
const isGradeEnabled = ref(grade.value !== undefined)
const withGrade = computed(() => isGradeEnabled.value || grade.value !== undefined)

function getGradeDecimals (value: string | number): number {
  return Math.min(countDecimals(value), ACTIVITY_ASSESSMENT_GRADE_MAX_DECIMALS)
}

const gradeText = ref('')
const isGradeFormatted = ref(true)
const gradeDecimals = ref(getGradeDecimals(grade.value ?? 0))

const gradeStep = computed(() => getStepFromDecimals(gradeDecimals.value))
const gradeDisplay = computed(() => isGradeFormatted.value
  ? formatOptionalNumber(grade.value, gradeDecimals.value)
  : gradeText.value)

const gradeValidators = {
  onChange: ({ value }: { value: FieldValue }) => validateAssessmentGrade(value, withGrade.value)
}

function commit (field: FieldApi, value: FieldValue) {
  field.handleChange(value)
  emit('change')
}

function onGradeToggle (field: FieldApi, value: boolean) {
  isGradeEnabled.value = value
  isGradeFormatted.value = true

  emit('updateGradeEnabled', value)

  if (!value) {
    commit(field, undefined)
  }
}

function onGradeChange (field: FieldApi, value: string | number | null | undefined) {
  gradeText.value = String(value ?? '')

  const parsed = parseOptionalNumber(value)
  const nextGrade = parsed === undefined
    ? undefined
    : roundToDecimals(parsed, ACTIVITY_ASSESSMENT_GRADE_MAX_DECIMALS)

  // A typed trailing zero, for instance, does not change the stored grade.
  if (nextGrade !== grade.value) {
    commit(field, nextGrade)
  }
}

function onGradeInput (event: Event) {
  const { inputType = '' } = event as Partial<InputEvent>

  // Arrows and spinner fire an input event without inputType (Chrome, Safari) or with
  // insertReplacementText (Firefox).
  if (inputType === '' || inputType === 'insertReplacementText') {
    isGradeFormatted.value = true
    return
  }

  isGradeFormatted.value = false
  gradeDecimals.value = getGradeDecimals((event.target as HTMLInputElement).value)
}

function onGradeCommit () {
  isGradeFormatted.value = true
}
</script>

<template>
  <FormField
    name="assessmentGrade"
    :validators="gradeValidators"
  >
    <template #default="{ field }">
      <Toggle
        id="assessment-grade-toggle"
        :model-value="withGrade"
        :description="t('staff.activities.views.EditNationalActivityView.ActivityAssessmentGradeFormField.description')"
        :disabled
        :disabled-tooltip
        @update:model-value="(value: boolean) => onGradeToggle(field, value)"
      />

      <Input
        v-if="withGrade"
        v-bind="$attrs"
        id="assessment-grade-value"
        :model-value="gradeDisplay"
        :label="t('staff.activities.views.EditNationalActivityView.ActivityAssessmentGradeFormField.label')"
        :hint="t('staff.activities.views.EditNationalActivityView.ActivityAssessmentGradeFormField.hint', { maxDecimals: ACTIVITY_ASSESSMENT_GRADE_MAX_DECIMALS })"
        :min="gradeStep"
        :step="gradeStep"
        :error-message="field.state.meta.errors?.join(', ')"
        :disabled
        :disabled-tooltip
        type="number"
        width="fit-content"
        @update:model-value="(value: string | number | null | undefined) => onGradeChange(field, value)"
        @input="onGradeInput"
        @change="onGradeCommit"
      />
    </template>
  </FormField>
</template>
