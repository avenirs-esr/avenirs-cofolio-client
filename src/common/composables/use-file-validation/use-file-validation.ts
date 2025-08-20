import { useI18n } from 'vue-i18n'

export type FileSizeConfig = number | Record<string, number>

export interface UseFileValidationOptions {
  acceptedFileTypes: string[]
  maxSizeConfig: FileSizeConfig
  isRequired?: boolean
  customMessages?: {
    required?: string
    invalidType?: string
    sizeExceeded?: (fileName: string, maxSize: string) => string
  }
}

export function useFileValidation (options: UseFileValidationOptions) {
  const { t } = useI18n()
  const { acceptedFileTypes, maxSizeConfig, isRequired = false, customMessages } = options

  function isFileTypeAccepted (file: File): boolean {
    const fileType = file.type.toLowerCase()

    return acceptedFileTypes.some((acceptedType) => {
      const normalizedAcceptedType = acceptedType.toLowerCase()

      if (normalizedAcceptedType === fileType) {
        return true
      }

      if (normalizedAcceptedType.endsWith('/*')) {
        const baseType = normalizedAcceptedType.slice(0, -2)
        return fileType.startsWith(`${baseType}/`)
      }

      return false
    })
  }

  function getMaxSizeForFile (file: File): number | undefined {
    if (typeof maxSizeConfig === 'number') {
      return maxSizeConfig
    }

    for (const [type, size] of Object.entries(maxSizeConfig)) {
      if (type.startsWith('.')) {
        if (file.name.toLowerCase().endsWith(type)) {
          return size
        }
      }
      else if (type.includes('/')) {
        if (file.type === type || file.type.startsWith(`${type.split('/')[0]}/`)) {
          return size
        }
      }
    }

    return maxSizeConfig['*'] || undefined
  }

  function validateFile (file: File | null): string | undefined {
    if (!file) {
      if (isRequired) {
        return customMessages?.required || t('global.error.form.requiredFiled')
      }
      return undefined
    }

    if (!isFileTypeAccepted(file)) {
      return customMessages?.invalidType || t('global.error.file.acceptType')
    }

    const maxSize = getMaxSizeForFile(file)

    if (maxSize && file.size > maxSize) {
      const maxSizeInMB = Math.round(maxSize / (1024 * 1024))
      const maxSizeText = `${maxSizeInMB}Mo`

      if (customMessages?.sizeExceeded) {
        return customMessages.sizeExceeded(file.name, maxSizeText)
      }

      return t('global.error.file.size')
    }

    return undefined
  }

  return {
    isFileTypeAccepted,
    getMaxSizeForFile,
    validateFile
  }
}
