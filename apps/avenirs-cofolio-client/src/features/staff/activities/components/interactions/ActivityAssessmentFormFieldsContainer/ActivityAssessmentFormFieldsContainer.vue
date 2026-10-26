<script setup lang="ts">
import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import { AvMessage, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import ActivityAssessmentCommentFormField from '@/features/staff/activities/components/interactions/formFields/ActivityAssessmentCommentFormField/ActivityAssessmentCommentFormField.vue'
import ActivityAssessmentGradeFormField from '@/features/staff/activities/components/interactions/formFields/ActivityAssessmentGradeFormField/ActivityAssessmentGradeFormField.vue'
import ActivityAssessmentValidationFormField from '@/features/staff/activities/components/interactions/formFields/ActivityAssessmentValidationFormField/ActivityAssessmentValidationFormField.vue'
import { useEditNationalActivityFormValidators } from '@/features/staff/activities/composables/use-edit-national-activity-form-validators/use-edit-national-activity-form-validators'
import { toActivityAssessmentRequest } from '@/features/staff/activities/utils/activity-assessment'
import ToggleParameterCard from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.vue'

interface ActivityAssessmentFormFieldsContainerProps extends AvInteractiveProps {
  form: EditActivityForm
}

const {
  form,
  disabled = false,
  disabledTooltip
} = defineProps<ActivityAssessmentFormFieldsContainerProps>()

const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
  updateAssessmentEnabled: [value: boolean]
  updateGradeEnabled: [value: boolean]
}>()

const { t } = useI18n()
const { validateAssessmentGrade, validateAssessmentOptions } = useEditNationalActivityFormValidators()

const comment = form.useStore(state => state.values.assessmentComment)
const grade = form.useStore(state => state.values.assessmentGrade)
const validation = form.useStore(state => state.values.assessmentValidation)
const optionsErrors = form.useStore(state => state.fieldMeta.assessmentValidation?.errors ?? [])

const hasOption = computed(() => comment.value || validation.value || grade.value !== undefined)

const isEnabled = ref(hasOption.value)
const isGradeEnabled = ref(grade.value !== undefined)

const enabled = computed(() => isEnabled.value || hasOption.value)
const withGrade = computed(() => isGradeEnabled.value || grade.value !== undefined)

const infoMessage = computed(() => disabled
  ? t('staff.activities.views.EditNationalActivityView.informations.disabled')
  : t('staff.activities.views.EditNationalActivityView.informations.willBeDisabled'))

function clearOptionsError () {
  form.setFieldMeta('assessmentValidation', prev => ({
    ...prev,
    errorMap: {}
  }))
}

function clearErrors () {
  clearOptionsError()
  form.setFieldMeta('assessmentGrade', prev => ({
    ...prev,
    errorMap: {}
  }))
}

function onEnabledToggle (value: boolean) {
  isEnabled.value = value

  if (value) {
    return
  }

  isGradeEnabled.value = false
  form.setFieldValue('assessmentComment', false)
  form.setFieldValue('assessmentGrade', undefined)
  form.setFieldValue('assessmentValidation', false)

  clearErrors()
  emit('autosave', {
    assessment: {}
  })
}

function onOptionChange () {
  clearOptionsError()

  const values = form.state.values
  if (validateAssessmentOptions(values, withGrade.value) || validateAssessmentGrade(values.assessmentGrade, withGrade.value)) {
    return
  }

  emit('autosave', {
    assessment: toActivityAssessmentRequest(values)
  })
}

function onUpdateGradeEnabled (value: boolean) {
  isGradeEnabled.value = value
  clearErrors()
}

watch(enabled, value => emit('updateAssessmentEnabled', value), { immediate: true })
watch(withGrade, value => emit('updateGradeEnabled', value), { immediate: true })
</script>

<template>
  <ToggleParameterCard
    toggle-id="assessment-main-toggle"
    :model-value="enabled"
    :title="t('staff.activities.views.EditNationalActivityView.ActivityAssessmentFormFieldsContainer.title')"
    :icon="MDI_ICONS.TEXT_BOX_CHECK_OUTLINE"
    :disabled
    :disabled-tooltip
    data-testid="assessment-parameter-toggle"
    @update:model-value="onEnabledToggle"
  >
    <div class="av-col av-gap-sm">
      <AvMessage
        type="info"
        :message="infoMessage"
        data-testid="assessment-parameter-information"
      />

      <span
        class="b2-regular av-text-text1"
        data-testid="assessment-parameter-description"
      >
        {{ t('staff.activities.views.EditNationalActivityView.ActivityAssessmentFormFieldsContainer.description') }}
      </span>

      <template v-if="enabled">
        <ActivityAssessmentCommentFormField
          :form
          :disabled
          :disabled-tooltip
          @change="onOptionChange"
        />

        <ActivityAssessmentValidationFormField
          v-if="!withGrade"
          :form
          :disabled
          :disabled-tooltip
          @change="onOptionChange"
        />

        <ActivityAssessmentGradeFormField
          v-if="!validation"
          :form
          :disabled
          :disabled-tooltip
          @change="onOptionChange"
          @update-grade-enabled="onUpdateGradeEnabled"
        />

        <AvMessage
          v-if="optionsErrors.length"
          type="error"
          :message="optionsErrors.join(', ')"
          data-testid="assessment-options-error"
        />
      </template>
    </div>
  </ToggleParameterCard>
</template>
