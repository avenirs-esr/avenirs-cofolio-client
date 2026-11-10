<script setup lang="ts">
import type { CguDTO } from '@/api/avenir-esr'
import { AvButton, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { RichTextEditor } from '@avenirs-esr/shared'
import { markRaw, useId } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUpdateTermsOfServicesForm } from '@/features/terms-of-service/views/TermsOfServiceView/composables/use-update-terms-of-services-form/use-update-terms-of-services-form'

export interface TermsOfServiceUpdateFormProps {
  cgu?: CguDTO
}

const {
  cgu,
} = defineProps<TermsOfServiceUpdateFormProps>()

const emit = defineEmits<{
  dirtyChange: [value: boolean]
  termsOfServiceUpdated: []
}>()

const { t } = useI18n()
const formId = useId()
const {
  form,
  isFormValid,
  isSubmitting,
} = useUpdateTermsOfServicesForm(cgu, () => emit('termsOfServiceUpdated'))

const FormField = markRaw(form.Field)
const isDirty = form.useStore(state => state.isDirty)

function handleSubmit () {
  form.handleSubmit()
}

watch(isDirty, value => emit('dirtyChange', value), { immediate: true })
</script>

<template>
  <div class="av-col av-gap-md">
    <form
      :id="formId"
      data-testid="terms-of-service-update-form__content"
      @submit.prevent="handleSubmit"
    >
      <FormField name="description">
        <template #default="{ field }">
          <RichTextEditor
            id="description"
            :model-value="field.state.value"
            :error-message="field.state.meta.errors?.join(', ')"
            @update:model-value="(value?: string) => field.handleChange(value !== '<p></p>' ? (value ?? '') : '')"
          />
        </template>
      </FormField>
    </form>

    <div
      class="av-row av-justify-end"
      data-testid="terms-of-service-update-form__actions"
    >
      <AvButton
        data-testid="publish-button"
        variant="FLAT"
        :icon="RI_ICONS.SEND_PLANE_LINE"
        :form="formId"
        type="submit"
        :is-loading="isSubmitting"
        :disabled="!isFormValid"
        :label="t('terms-of-service.views.TermsOfServiceView.components.forms.TermsOfServiceUpdateForm.publish')"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>
