<script setup lang="ts">
import type { WriteAssessmentForm } from '@/features/staff/assessments/types/forms.types'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { parseOptionalNumber } from '@/common/utils'
import { ASSESSMENT_MIN_GRADE } from '@/features/staff/assessments/config'

interface AssessmentGradeFormFieldProps {
  form: WriteAssessmentForm
  maxGrade: number
  readonly?: boolean
}

const { form, maxGrade, readonly } = defineProps<AssessmentGradeFormFieldProps>()

const { t } = useI18n()
const FormField = markRaw(form.Field)

const grade = form.useStore(state => state.values.grade)

const gradeRatio = computed(() => {
  if (grade.value === null || maxGrade <= 0) {
    return 0
  }
  return Math.min(Math.max(grade.value / maxGrade, 0), 1)
})
const isPassingGrade = computed(() => gradeRatio.value >= 0.5)
</script>

<template>
  <FormField name="grade">
    <template #default="{ field }">
      <div
        class="av-col av-gap-xs grade-field"
        data-testid="assessment-grade-form-field"
      >
        <Input
          id="assessment-grade"
          type="number"
          inputmode="numeric"
          :label="t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.formFields.AssessmentGradeFormField.label')"
          label-visible
          required
          :min="ASSESSMENT_MIN_GRADE"
          :max="maxGrade"
          step="1"
          width="100%"
          :disabled="readonly"
          :model-value="field.state.value"
          :error-message="field.state.meta.errors?.join(', ')"
          data-testid="assessment-grade-input"
          @blur="field.handleBlur"
          @update:model-value="(value) => field.handleChange(parseOptionalNumber(value) ?? null)"
        >
          <template #suffix>
            <span
              class="n5 av-text-text2 av-pr-sm"
              data-testid="assessment-grade-scale"
            >{{ t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.formFields.AssessmentGradeFormField.scale', { maxGrade }) }}</span>
          </template>
        </Input>
        <div
          class="grade-gauge"
          aria-hidden="true"
          data-testid="assessment-grade-gauge"
        >
          <div
            class="grade-gauge__fill"
            :class="{ 'grade-gauge__fill--passing': isPassingGrade }"
            :style="{ width: `${gradeRatio * 100}%` }"
            data-testid="assessment-grade-gauge-fill"
          />
        </div>
      </div>
    </template>
  </FormField>
</template>

<style lang="scss" scoped>
.grade-field :deep(input[type='number']) {
  font-size: var(--font-size-n5);
  font-weight: var(--font-weight-semi-bold);
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }
}

.grade-gauge {
  width: 100%;
  height: var(--dimension-xs);
  border-radius: var(--radius-full);
  background-color: var(--light-background-neutral);
  overflow: hidden;
}

.grade-gauge__fill {
  height: 100%;
  border-radius: inherit;
  background-color: var(--dark-background-error);
  transition: width 0.3s ease, background-color 0.3s ease;

  &--passing {
    background-color: var(--dark-background-success);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
</style>
