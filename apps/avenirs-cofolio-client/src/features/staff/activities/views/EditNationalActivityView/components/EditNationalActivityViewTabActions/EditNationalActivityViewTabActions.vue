<script setup lang="ts">
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/common/constants'
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'

const { t } = useI18n()

const {
  isSaving,
  isBusy,
  canSave,
  saveNow,
} = useEditNationalActivityViewContext()
</script>

<template>
  <div class="av-row av-gap-sm">
    <AvButton
      data-testid="exit-button"
      :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
      :label="t('global.buttons.exit')"
      :is-loading="isBusy"
      :to="ROUTES.STAFF.ACTIVITIES"
    />
    <AvButton
      data-testid="save-button"
      :icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
      :label="t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.saveLabel')"
      :disabled="!canSave"
      :disabled-tooltip="t('staff.activities.views.EditNationalActivityView.EditNationalActivityViewTabActions.saveDisabledTooltip')"
      :is-loading="isSaving"
      @click="saveNow"
    />
  </div>
</template>
