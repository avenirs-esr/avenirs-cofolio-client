<script setup lang="ts">
import type { FileDTO } from '@/api/avenir-esr'
import type { AnyFieldApi } from '@/common/types'
import { ACTIVITY_BANNER_RATIO } from '@/common/components/ImageUpload/config'
import ImageUpload from '@/common/components/ImageUpload/ImageUpload.vue'
import { type EditActivityForm, type EditActivityFormData, EditActivityFormDataBannerAction } from '@/features/staff/activities/types/forms.types'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface ActivityBannerFormFieldProps {
  form: EditActivityForm
  remoteBanner: FileDTO
}

const { form, remoteBanner } = defineProps<ActivityBannerFormFieldProps>()

const emit = defineEmits<{
  autosave: []
}>()

const bannerFile = defineModel<File | null>()

const { t } = useI18n()
const FormField = markRaw(form.Field)
type BannerField = AnyFieldApi<EditActivityFormData, 'bannerAction'>

function onDelete (field: BannerField) {
  field.setValue(EditActivityFormDataBannerAction.DELETE)
  emit('autosave')
}

function onUpdate (field: BannerField) {
  field.setValue(EditActivityFormDataBannerAction.UPDATE)
  emit('autosave')
}
</script>

<template>
  <FormField name="bannerAction">
    <template #default="{ field }">
      <ImageUpload
        v-model="bannerFile"
        :on-delete-image="() => onDelete(field)"
        :default-image-url="field.state.value === EditActivityFormDataBannerAction.NONE ? remoteBanner.url : undefined"
        :default-image-name="field.state.value === EditActivityFormDataBannerAction.NONE ? remoteBanner.fileName : undefined"
        :image-alt="t('staff.activities.views.EditNationalActivityView.ActivityBannerFormField.bannerAlt')"
        :aspect-ratio="ACTIVITY_BANNER_RATIO"
        :on-update="() => onUpdate(field)"
        data-testid="activity-banner-form-field"
      />
    </template>
  </FormField>
</template>
