import { useI18n } from 'vue-i18n'

export function useImageUpload () {
  const { t } = useI18n()

  const MAX_FILE_SIZE = 10 * 1024 * 1024

  const error = ref<string | undefined>()
  const valid = ref<string | undefined>()
  const name = ref<string | undefined>()
  const previewUrl = ref<string | null>(null)

  function clear () {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
    }
    valid.value = undefined
    error.value = undefined
    name.value = undefined
  }

  /**
   * Update the ImageUpload current file
   * @param files
   */
  function update (files: FileList) {
    const file = files[0]
    if (!file) {
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      error.value = t('global.error.file.size')
      return
    }

    clear()

    error.value = undefined
    name.value = file.name
    valid.value = t('global.success.file.loaded')
    previewUrl.value = URL.createObjectURL(file)
  }

  return {
    error,
    valid,
    name,
    previewUrl,
    update,
    clear,
  }
}
