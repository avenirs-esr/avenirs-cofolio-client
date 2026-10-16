<script setup lang="ts">
import type { AvFileUploadProps } from '@avenirs-esr/avenirs-dsav'
import type { ComputedRef, Slot } from 'vue'
import type { AvLocale } from '@/types'
import { AvFileUpload } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatFileSizeInMegabytes } from '@/common/utils/file/file'

export interface FileUploadProps extends Omit<
  AvFileUploadProps,
  'deleteButtonLabel'
  | 'countLabel'
  | 'filePillDownloadPrefixLabel'
  | 'filePillDeletePrefixLabel'
  | 'confirmDeleteModalTitle'
  | 'confirmDeleteModalConfirmLabel'
  | 'confirmDeleteModalCancelLabel'
> { }

defineOptions({
  inheritAttrs: false
})

const props = defineProps<FileUploadProps>()

defineSlots<{
  default?: Slot<{ active: boolean }>
}>()

const modelValue = defineModel<File[] | null>()

const { t, locale } = useI18n()
const attrs = useAttrs()

const avFileUpload = ref<InstanceType<typeof AvFileUpload> | null>(null)
const acceptTypeError = ref<string | null>(null)
const fileSizeError = ref<string | null>(null)
const maxFilesError = ref<string | null>(null)

const errors = computed(() => {
  return [
    props.error,
    acceptTypeError.value,
    fileSizeError.value,
    maxFilesError.value
  ].filter(Boolean).join(' ')
})

const pendingDeleteFileCount = computed(() => avFileUpload.value?.pendingDeleteFilesCount ?? 0)

const hasLoadedFiles = computed(() => (modelValue.value ?? []).length > 0)
const totalFileSize = computed(() => (modelValue.value ?? []).reduce((total, file) => total + file.size, 0))
const validMessage = computed(() => {
  if (hasLoadedFiles.value && !props.disabled) {
    return totalFileSize.value > 0
      ? t('global.success.file.loadedWithSize', {
          size: formatFileSizeInMegabytes(totalFileSize.value, locale.value as AvLocale),
          unit: t('global.megabyteUnit')
        })
      : t('global.success.file.loaded')
  }

  return undefined
})

const avFileUploadProps: ComputedRef<AvFileUploadProps> = computed(() => ({
  ...attrs,
  ...props,
  deleteButtonLabel: (modelValue.value ?? []).length > 1 ? t('global.buttons.deleteAll') : t('global.buttons.delete'),
  countLabel: t('global.information.FileUpload.countLabel', { count: (modelValue.value ?? []).length }),
  filePillDownloadPrefixLabel: t('global.buttons.download'),
  filePillDeletePrefixLabel: t('global.buttons.delete'),
  validMessage: validMessage.value,
  error: errors.value,
  confirmDeleteModalTitle: t('global.information.FileUpload.deleteConfirmationModal', { count: pendingDeleteFileCount.value }),
  confirmDeleteModalConfirmLabel: pendingDeleteFileCount.value > 1 ? t('global.buttons.deleteAll') : t('global.buttons.delete'),
  confirmDeleteModalCancelLabel: t('global.buttons.cancel'),
}))

function resetErrors () {
  acceptTypeError.value = null
  fileSizeError.value = null
  maxFilesError.value = null
}

function onFilesUpdate (newFiles: File[] | null) {
  resetErrors()

  modelValue.value = newFiles ?? []
}

function handleAcceptTypeError () {
  acceptTypeError.value = t('global.error.file.acceptType')
}

function handleFileSizeError () {
  fileSizeError.value = t('global.error.file.size')
}

function handleMaxFilesError () {
  maxFilesError.value = t('global.error.file.maxFiles')
}
</script>

<template>
  <AvFileUpload
    ref="avFileUpload"
    v-bind="avFileUploadProps"
    :model-value="modelValue"
    @update:model-value="onFilesUpdate"
    @accept-type-error="handleAcceptTypeError"
    @file-size-error="handleFileSizeError"
    @max-files-error="handleMaxFilesError"
  />
</template>
