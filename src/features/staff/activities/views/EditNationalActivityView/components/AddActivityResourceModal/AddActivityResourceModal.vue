<script setup lang="ts">
import type { AddActivityResourceFormData } from '@/features/staff/activities/types/forms.types'
import { useFileValidation } from '@/common/composables/use-file-validation/use-file-validation'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { getFileExtension, renameFile, stripExtension } from '@/common/utils/file/file'
import {
  ACTIVITY_RESOURCE_ACCEPTED_FILE_TYPES,
  ACTIVITY_RESOURCE_LINK_MAX_LENGTH,
  ACTIVITY_RESOURCE_MAX_FILE_SIZE,
  ACTIVITY_RESOURCE_NAME_MAX_LENGTH
} from '@/features/staff/activities/config'
import { ActivityResourceType } from '@/features/staff/activities/types/resource.types'
import AddActivityResourceFileUploadFormField from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/components/AddActivityResourceFileUploadFormField/AddActivityResourceFileUploadFormField.vue'
import AddActivityResourceLinkInputFormField from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/components/AddActivityResourceLinkInputFormField/AddActivityResourceLinkInputFormField.vue'
import AddActivityResourceNameInputFormField from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/components/AddActivityResourceNameInputFormField/AddActivityResourceNameInputFormField.vue'
import AddActivityResourceTypeSelectFormField from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/components/AddActivityResourceTypeSelectFormField/AddActivityResourceTypeSelectFormField.vue'
import { isActivityResourceFileType, isActivityResourceLinkType } from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/utils/resource-form.types-guard'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

interface AddActivityResourceModalProps {
  opened: boolean
}

const { opened } = defineProps<AddActivityResourceModalProps>()

const emit = defineEmits<{
  close: []
  added: [payload: AddActivityResourceFormData]
}>()

const { t } = useI18n()
const { validateRequired, validateMaxLength, validateLink } = useFormValidators()
const { validateFile } = useFileValidation({
  acceptedFileTypes: [...ACTIVITY_RESOURCE_ACCEPTED_FILE_TYPES],
  maxSizeConfig: ACTIVITY_RESOURCE_MAX_FILE_SIZE,
  isRequired: true
})

function getDefaultValues (resourceType: ActivityResourceType = ActivityResourceType.FILE): AddActivityResourceFormData {
  return resourceType === ActivityResourceType.FILE
    ? { resourceType: ActivityResourceType.FILE, file: null, resourceName: '' }
    : { resourceType: ActivityResourceType.LINK, link: '' }
}

function buildValidators (value: AddActivityResourceFormData) {
  return {
    fields: {
      file: isActivityResourceFileType(value) ? validateFile(value.file) : undefined,
      link: isActivityResourceLinkType(value)
        ? validateLink(value.link, true) ?? validateMaxLength(value.link, ACTIVITY_RESOURCE_LINK_MAX_LENGTH)
        : undefined,
      resourceName: isActivityResourceFileType(value)
        ? validateRequired(value.resourceName) ?? validateMaxLength(value.resourceName, ACTIVITY_RESOURCE_NAME_MAX_LENGTH)
        : undefined
    }
  }
}

function applyResourceName (value: AddActivityResourceFormData): AddActivityResourceFormData {
  if (!isActivityResourceFileType(value) || !value.file) {
    return value
  }

  const customName = `${value.resourceName}${getFileExtension(value.file.name)}`
  if (customName === value.file.name) {
    return value
  }

  return { ...value, file: renameFile(value.file, customName) }
}

const form = useForm({
  defaultValues: getDefaultValues(),
  validators: {
    onChange: ({ value }: { value: AddActivityResourceFormData }) => buildValidators(value),
    onSubmit: ({ value }: { value: AddActivityResourceFormData }) => buildValidators(value)
  },
  onSubmit: ({ value }: { value: AddActivityResourceFormData }) => {
    emit('added', applyResourceName(value))
    onClose()
  }
})

const isFormValid = computed(() => form.useStore(s => s.isValid && !s.isValidating && s.isDirty).value)

const resourceTypeField = form.useField({ name: 'resourceType' })
const selectedType = computed(() => resourceTypeField.state.value.value)

function onTypeChange (nextType: ActivityResourceType) {
  form.reset(getDefaultValues(nextType))
}

function onFileSelected (file: File) {
  if (!form.getFieldValue('resourceName')) {
    form.setFieldValue('resourceName', stripExtension(file.name))
  }
}

function onFileDeleted (fileName: string) {
  if (form.getFieldValue('resourceName') === stripExtension(fileName)) {
    form.setFieldValue('resourceName', '')
  }
}

function onClose () {
  form.reset(getDefaultValues())
  emit('close')
}
</script>

<template>
  <AvModal
    :opened="opened"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('global.buttons.add')"
    :confirm-button-disabled="!isFormValid"
    data-testid="add-activity-resource-modal"
    @close="onClose"
    @confirm="form.handleSubmit()"
  >
    <template #header>
      <span class="b2-bold av-pt-md">
        {{ t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.title') }}
      </span>
    </template>

    <form
      class="add-activity-resource-modal__form av-col av-gap-lg"
      novalidate
      @submit.prevent="form.handleSubmit()"
    >
      <AddActivityResourceTypeSelectFormField
        :form="form"
        @change="onTypeChange"
      />

      <template v-if="selectedType === ActivityResourceType.FILE">
        <AddActivityResourceFileUploadFormField
          :form="form"
          @file-selected="onFileSelected"
          @file-deleted="onFileDeleted"
        />
        <AddActivityResourceNameInputFormField :form="form" />
      </template>

      <AddActivityResourceLinkInputFormField
        v-else
        :form="form"
      />
    </form>
  </AvModal>
</template>
