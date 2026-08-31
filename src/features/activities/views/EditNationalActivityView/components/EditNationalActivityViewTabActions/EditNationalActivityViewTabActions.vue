<script setup lang="ts">
import { ROUTES } from '@/common/constants'
import { useEditNationalActivityViewContext } from '@/features/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { form, isUpdating } = useEditNationalActivityViewContext()
const isFormDirty = form.useStore(s => s.isDirty)
const isFormValid = form.useStore(s => s.isValid && !s.isValidating && s.isDirty)
</script>

<template>
  <div class="av-row av-gap-sm">
    <AvButton
      small
      data-testid="exit-button"
      :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
      :label="t('global.buttons.exit')"
      :is-loading="isUpdating || isFormDirty"
      :to="ROUTES.STAFF.ACTIVITIES"
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
