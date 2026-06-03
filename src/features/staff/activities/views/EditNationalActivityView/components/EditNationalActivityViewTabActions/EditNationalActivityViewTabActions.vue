<script setup lang="ts">
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { form, isUpdating, cancel } = useEditNationalActivityViewContext()
const isFormDirty = form.useStore(s => s.isDirty)
const isFormValid = form.useStore(s => s.isValid && !s.isValidating && s.isDirty)
</script>

<template>
  <div class="av-row av-gap-sm">
    <AvButton
      small
      data-testid="cancel-button"
      :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
      :label="t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.cancelLabel')"
      :disabled="isUpdating || !isFormDirty"
      @click="cancel()"
    />
    <AvButton
      small
      data-testid="save-button"
      :icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
      :label="t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.saveLabel')"
      :disabled="!isFormValid"
      :is-loading="isUpdating"
      @click="form.handleSubmit()"
    />
  </div>
</template>
