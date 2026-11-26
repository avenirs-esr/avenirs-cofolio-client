<script setup lang="ts">
import type { ActivityPresentationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { Slot } from 'vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ICONS } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import ActivityBannerFormField from '@/features/staff/activities/components/interactions/formFields/ActivityBannerFormField/ActivityBannerFormField.vue'
import ActivityRecommendedCompletionContextsFormField from '@/features/staff/activities/components/interactions/formFields/ActivityRecommendedCompletionContextsFormField/ActivityRecommendedCompletionContextsFormField.vue'
import ActivitySummaryFormField from '@/features/staff/activities/components/interactions/formFields/ActivitySummaryFormField/ActivitySummaryFormField.vue'
import ActivityTargetsFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTargetsFormField/ActivityTargetsFormField.vue'
import ActivityTitleFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.vue'
import { PublicationSectionId } from '@/features/staff/activities/editActivity.constants'
import { useEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'

interface ActivityPublicationTabProps {
  activity: ActivityPresentationDTO
  isSubActivity?: boolean
}

const { activity, isSubActivity = false } = defineProps<ActivityPublicationTabProps>()

const slots = defineSlots<{
  default?: Slot
}>()

const bannerFile = defineModel<File | null>()

const { t } = useI18n()
const { form, queueAutoSave } = useEditNationalActivityViewContext()
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="activity-publication-tab-content"
  >
    <div :id="PublicationSectionId.ACTIVITY_TITLE">
      <IconTitleCardContainer
        :title="
          isSubActivity
            ? t('staff.activities.interactions.inputs.ActivityTitleInput.label.subActivity')
            : t('staff.activities.interactions.inputs.ActivityTitleInput.label.activity')
        "
        :title-icon="ICONS.ACTIVITY"
        required
      >
        <ActivityTitleFormField
          :form="form"
          @autosave="queueAutoSave"
        />
      </IconTitleCardContainer>
    </div>

    <div :id="PublicationSectionId.TARGETS">
      <IconTitleCardContainer
        :title="t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.title')"
        :title-icon="ICONS.TARGETS"
      >
        <ActivityTargetsFormField
          :form="form"
          @autosave="queueAutoSave"
        />
      </IconTitleCardContainer>
    </div>

    <div :id="PublicationSectionId.IMAGE">
      <IconTitleCardContainer
        :title="t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.imageTitle')"
        :title-icon="ICONS.ACTIVITY"
      >
        <ActivityBannerFormField
          v-model="bannerFile"
          :form="form"
          :remote-banner="activity.banner"
          @autosave="queueAutoSave"
        />
      </IconTitleCardContainer>
    </div>

    <div
      :id="PublicationSectionId.SUMMARY_CONTEXT"
      class="av-col av-row--md av-w-full--md av-gap-sm"
    >
      <div class="av-flex-fill--md">
        <IconTitleCardContainer
          :title="t('staff.activities.views.EditNationalActivityView.ActivitySummaryFormField.label')"
          :title-icon="MDI_ICONS.FILE_DOCUMENT_EDIT_OUTLINE"
          required
        >
          <ActivitySummaryFormField
            :form="form"
            @autosave="queueAutoSave"
          />
        </IconTitleCardContainer>
      </div>
      <div class="av-flex-fill--md">
        <IconTitleCardContainer
          :title="t('staff.activities.interactions.formFields.ActivityRecommendedCompletionContextsFormField.label')"
          :title-icon="MDI_ICONS.TEXT_BOX_EDIT_OUTLINE"
          required
        >
          <ActivityRecommendedCompletionContextsFormField
            :form="form"
            @autosave="queueAutoSave"
          />
        </IconTitleCardContainer>
      </div>
    </div>
    <template
      v-if="slots.default"
    >
      <slot />
    </template>
  </div>
</template>

<style lang="scss" scoped>
:deep(textarea) {
  resize: none !important;
}
</style>
