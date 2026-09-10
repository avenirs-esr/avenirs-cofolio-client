<script lang="ts" setup>
import type { BaseApiException } from '@/common/exceptions'
import { useDownloadMedia } from '@/api/avenir-esr'
import ConfirmationModal from '@/common/components/ConfirmationModal/ConfirmationModal.vue'
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { downloadBlob } from '@/common/utils/download/download'
import { useExportKit } from '@/features/student/kit/composables/use-export-kit/use-export-kit'
import { KIT_NAME_MAX_LENGTH } from '@/features/student/kit/config'
import { canExportKit } from '@/features/student/kit/rules/export-kit.rules'
import {
  ExportKitOptions,
  useExportKitForm,
  type UseExportKitFormData
} from '@/features/student/kit/views/StudentToolsKitView/composables/use-export-kit-form/use-export-kit-form'
import { useToasterStore } from '@/store'
import { AvCheckbox, AvCheckboxesGroup, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ExportKitModalProps {
  opened: boolean
}

defineProps<ExportKitModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { getErrorMessage } = useApiErrors()

const { generateKitDocx, isLoading: isUseExportKitLoading } = useExportKit()

const kitName = ref('')

const { mutate: mutateDownloadMedia } = useDownloadMedia({
  mutation: {
    onError: (error: BaseApiException) => {
      addErrorMessage({
        title: t('student.kit.views.StudentToolsKitView.overlay.ExportKitModal.error'),
        description: getErrorMessage(error),
      })
    },
    onSuccess: (data) => {
      downloadBlob(data, `${kitName.value}.zip`)
      addSuccessMessage(t('student.kit.views.StudentToolsKitView.overlay.ExportKitModal.success.mediaContent'))
    },
  },
})

async function exportKit ({ exportOptions, kitName: newKitName }: UseExportKitFormData) {
  kitName.value = newKitName

  if (exportOptions.includes(ExportKitOptions.TEXT_CONTENT)) {
    await generateKitDocx(kitName.value)
    addSuccessMessage(t('student.kit.views.StudentToolsKitView.overlay.ExportKitModal.success.textContent'))
  }
  if (exportOptions.includes(ExportKitOptions.MEDIA_CONTENT)) {
    mutateDownloadMedia()
  }
  closeModal()
}

const {
  form,
  isFormValid,
  resetForm
} = useExportKitForm(values => exportKit(values))
const FormField = markRaw(form.Field)

const isLoading = computed(() => isUseExportKitLoading.value)

function closeModal () {
  resetForm()
  kitName.value = ''
  emit('close')
}
</script>

<template>
  <ConfirmationModal
    :opened="opened"
    :confirm-button-label="t('global.buttons.export')"
    :confirm-button-disabled="!isFormValid || !canExportKit(form.state.values)"
    :confirm-button-icon="MDI_ICONS.DOWNLOAD_OUTLINE"
    :is-loading="isLoading"
    @close="closeModal"
    @confirm="form.handleSubmit()"
  >
    <template #header>
      <span class="b1-bold">
        {{ t('student.kit.views.StudentToolsKitView.overlay.ExportKitModal.title') }}
      </span>
    </template>

    <form
      id="profile-form"
      @submit.prevent.stop="form.handleSubmit"
    >
      <div class="av-col av-gap-xs">
        <FormField name="exportOptions">
          <template #default="{ field }">
            <AvCheckboxesGroup
              :legend="t('student.kit.views.StudentToolsKitView.overlay.ExportKitModal.exportOptions.label')"
              :error-message="field.state.meta.errors.join(', ')"
            >
              <AvCheckbox
                :model-value="field.state.value"
                name="exportOptions"
                :value="ExportKitOptions.TEXT_CONTENT"
                :label="t('student.kit.views.StudentToolsKitView.overlay.ExportKitModal.exportOptions.textContent')"
                data-testid="text-content-checkbox"
                @update:model-value="(value) => field.handleChange(value as ExportKitOptions[])"
              />
              <AvCheckbox
                :model-value="field.state.value"
                name="exportOptions"
                :value="ExportKitOptions.MEDIA_CONTENT"
                :label="t('student.kit.views.StudentToolsKitView.overlay.ExportKitModal.exportOptions.mediaContent')"
                data-testid="media-content-checkbox"
                @update:model-value="(value) => field.handleChange(value as ExportKitOptions[])"
              />
            </AvCheckboxesGroup>
          </template>
        </FormField>
        <FormField name="kitName">
          <template #default="{ field }">
            <Input
              :model-value="field.state.value"
              :error-message="field.state.meta.errors.join(', ')"
              label-visible
              :label="t('student.kit.views.StudentToolsKitView.overlay.ExportKitModal.kitName.label')"
              :placeholder="t('student.kit.views.StudentToolsKitView.overlay.ExportKitModal.kitName.placeholder')"
              :maxlength="KIT_NAME_MAX_LENGTH"
              data-testid="kit-name-input"
              @update:model-value="(value) => field.handleChange(String(value))"
            />
          </template>
        </FormField>
      </div>
    </form>
  </ConfirmationModal>
</template>
