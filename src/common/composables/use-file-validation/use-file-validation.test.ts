import { useFileValidation, type UseFileValidationOptions } from '@/common/composables/use-file-validation/use-file-validation'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { expect } from 'vitest'

BddTest().given('a useFileValidation composabled', () => {
  const ONE_MB = 1024 * 1024
  const TWO_MB = 2 * ONE_MB
  const THREE_MB = 3 * ONE_MB
  const FIVE_MB = 5 * ONE_MB
  const EIGHT_MB = 8 * ONE_MB
  const TEN_MB = 10 * ONE_MB
  const FIFTEEN_MB = 15 * ONE_MB

  const createMockFile = (name: string, type: string, size: number): File => {
    const file = new File([''], name, { type })
    Object.defineProperty(file, 'size', { value: size, writable: false })
    return file
  }

  const defaultOptions: UseFileValidationOptions = {
    acceptedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSizeConfig: {
      'image/*': FIVE_MB,
      'application/*': TEN_MB,
      '*': TWO_MB
    },
    isRequired: false
  }

  const mountValidationComposable = (options: UseFileValidationOptions) => {
    const { result } = mountComposable(
      () => useFileValidation(options),
      { useI18n: true }
    )
    return result
  }

  BddTest().and('a file validation composable', () => {
    BddTest().when('testing isFileTypeAccepted function', () => {
      BddTest().then('it should accept valid file types', () => {
        const { isFileTypeAccepted } = mountValidationComposable(defaultOptions)

        const jpegFile = createMockFile('test.jpg', 'image/jpeg', 1000)
        const pngFile = createMockFile('test.png', 'image/png', 1000)
        const pdfFile = createMockFile('test.pdf', 'application/pdf', 1000)

        expect(isFileTypeAccepted(jpegFile)).toBe(true)
        expect(isFileTypeAccepted(pngFile)).toBe(true)
        expect(isFileTypeAccepted(pdfFile)).toBe(true)
      })

      BddTest().then('it should reject invalid file types', () => {
        const { isFileTypeAccepted } = mountValidationComposable(defaultOptions)

        const txtFile = createMockFile('test.txt', 'text/plain', 1000)
        const docFile = createMockFile('test.doc', 'application/msword', 1000)

        expect(isFileTypeAccepted(txtFile)).toBe(false)
        expect(isFileTypeAccepted(docFile)).toBe(false)
      })

      BddTest().then('it should handle case insensitive file types', () => {
        const options = {
          ...defaultOptions,
          acceptedFileTypes: ['IMAGE/JPEG', 'APPLICATION/PDF']
        }
        const { isFileTypeAccepted } = mountValidationComposable(options)

        const jpegFile = createMockFile('test.jpg', 'image/jpeg', 1000)
        const pdfFile = createMockFile('test.pdf', 'application/pdf', 1000)

        expect(isFileTypeAccepted(jpegFile)).toBe(true)
        expect(isFileTypeAccepted(pdfFile)).toBe(true)
      })
    })

    BddTest().when('testing getMaxSizeForFile function', () => {
      BddTest().then('it should return correct size for specific mime types', () => {
        const { getMaxSizeForFile } = mountValidationComposable(defaultOptions)

        const jpegFile = createMockFile('test.jpg', 'image/jpeg', 1000)
        const pdfFile = createMockFile('test.pdf', 'application/pdf', 1000)

        expect(getMaxSizeForFile(jpegFile)).toBe(FIVE_MB)
        expect(getMaxSizeForFile(pdfFile)).toBe(TEN_MB)
      })

      BddTest().then('it should return default size for unspecified types', () => {
        const { getMaxSizeForFile } = mountValidationComposable(defaultOptions)

        const txtFile = createMockFile('test.txt', 'text/plain', 1000)

        expect(getMaxSizeForFile(txtFile)).toBe(TWO_MB)
      })

      BddTest().then('it should handle file extensions', () => {
        const options = {
          ...defaultOptions,
          maxSizeConfig: {
            '.pdf': FIFTEEN_MB,
            '.jpg': THREE_MB,
            '*': ONE_MB
          }
        }
        const { getMaxSizeForFile } = mountValidationComposable(options)

        const pdfFile = createMockFile('test.pdf', 'application/pdf', 1000)
        const jpgFile = createMockFile('test.jpg', 'image/jpeg', 1000)

        expect(getMaxSizeForFile(pdfFile)).toBe(FIFTEEN_MB)
        expect(getMaxSizeForFile(jpgFile)).toBe(THREE_MB)
      })

      BddTest().then('it should return single size when maxSizeConfig is number', () => {
        const options = {
          ...defaultOptions,
          maxSizeConfig: EIGHT_MB
        }
        const { getMaxSizeForFile } = mountValidationComposable(options)

        const jpegFile = createMockFile('test.jpg', 'image/jpeg', 1000)
        const pdfFile = createMockFile('test.pdf', 'application/pdf', 1000)

        expect(getMaxSizeForFile(jpegFile)).toBe(EIGHT_MB)
        expect(getMaxSizeForFile(pdfFile)).toBe(EIGHT_MB)
      })
    })

    BddTest().when('testing validateFile function with required files', () => {
      const requiredOptions = {
        ...defaultOptions,
        isRequired: true
      }

      BddTest().then('it should return error for null file when required', () => {
        const { validateFile } = mountValidationComposable(requiredOptions)

        expect(validateFile(null)).toContain('requis')
      })

      BddTest().then('it should return custom required message when provided', () => {
        const options = {
          ...requiredOptions,
          customMessages: {
            required: 'Please select a file'
          }
        }
        const { validateFile } = mountValidationComposable(options)

        expect(validateFile(null)).toBe('Please select a file')
      })

      BddTest().then('it should validate valid required file', () => {
        const { validateFile } = mountValidationComposable(requiredOptions)

        const validFile = createMockFile('test.jpg', 'image/jpeg', ONE_MB)
        expect(validateFile(validFile)).toBeUndefined()
      })
    })

    BddTest().when('testing validateFile function with optional files', () => {
      BddTest().then('it should allow null file when not required', () => {
        const { validateFile } = mountValidationComposable(defaultOptions)

        expect(validateFile(null)).toBeUndefined()
      })

      BddTest().then('it should return error for invalid file type', () => {
        const { validateFile } = mountValidationComposable(defaultOptions)

        const invalidFile = createMockFile('test.txt', 'text/plain', 1000)
        expect(validateFile(invalidFile)).toContain('Le fichier ne respecte pas le format attendu.')
      })

      BddTest().then('it should return custom invalid type message when provided', () => {
        const options = {
          ...defaultOptions,
          customMessages: {
            invalidType: 'Only images and PDFs allowed'
          }
        }
        const { validateFile } = mountValidationComposable(options)

        const invalidFile = createMockFile('test.txt', 'text/plain', 1000)
        expect(validateFile(invalidFile)).toBe('Only images and PDFs allowed')
      })

      BddTest().then('it should return error for file exceeding size limit', () => {
        const { validateFile } = mountValidationComposable(defaultOptions)

        const oversizedFile = createMockFile('test.jpg', 'image/jpeg', TEN_MB)
        expect(validateFile(oversizedFile)).toContain('taille')
      })

      BddTest().then('it should return custom size exceeded message when provided', () => {
        const options = {
          ...defaultOptions,
          customMessages: {
            sizeExceeded: (fileName: string, maxSize: string) =>
              `File "${fileName}" exceeds the ${maxSize} limit`
          }
        }
        const { validateFile } = mountValidationComposable(options)

        const oversizedFile = createMockFile('large-image.jpg', 'image/jpeg', TEN_MB)
        expect(validateFile(oversizedFile)).toBe('File "large-image.jpg" exceeds the 5Mo limit')
      })

      BddTest().then('it should validate file within size limit', () => {
        const { validateFile } = mountValidationComposable(defaultOptions)

        const validFile = createMockFile('test.jpg', 'image/jpeg', TWO_MB)
        expect(validateFile(validFile)).toBeUndefined()
      })
    })

    BddTest().when('testing edge cases', () => {
      BddTest().then('it should handle wildcard mime types', () => {
        const options = {
          acceptedFileTypes: ['image/*', 'application/*'],
          maxSizeConfig: {
            'image/*': THREE_MB,
            'application/*': EIGHT_MB
          }
        }
        const { isFileTypeAccepted, getMaxSizeForFile } = mountValidationComposable(options)

        const webpFile = createMockFile('test.webp', 'image/webp', 1000)
        const docxFile = createMockFile('test.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1000)

        expect(isFileTypeAccepted(webpFile)).toBe(true)
        expect(isFileTypeAccepted(docxFile)).toBe(true)
        expect(getMaxSizeForFile(webpFile)).toBe(THREE_MB)
        expect(getMaxSizeForFile(docxFile)).toBe(EIGHT_MB)
      })

      BddTest().then('it should handle files with no matching size config', () => {
        const options = {
          acceptedFileTypes: ['image/jpeg'],
          maxSizeConfig: {
            'application/*': FIVE_MB
          } as Record<string, number>
        }
        const { getMaxSizeForFile } = mountValidationComposable(options)

        const jpegFile = createMockFile('test.jpg', 'image/jpeg', 1000)
        expect(getMaxSizeForFile(jpegFile)).toBeUndefined()
      })

      BddTest().then('it should handle empty file name with extension matching', () => {
        const options = {
          acceptedFileTypes: ['image/jpeg'],
          maxSizeConfig: {
            '.jpg': FIVE_MB,
            '*': ONE_MB
          }
        }
        const { getMaxSizeForFile } = mountValidationComposable(options)

        const jpegFile = createMockFile('', 'image/jpeg', 1000)
        expect(getMaxSizeForFile(jpegFile)).toBe(ONE_MB)
      })
    })

    BddTest().when('testing complete validation workflow', () => {
      BddTest().then('it should validate a complete valid file upload scenario', () => {
        const options = {
          acceptedFileTypes: ['image/jpeg', 'image/png'],
          maxSizeConfig: { 'image/*': FIVE_MB },
          isRequired: true,
          customMessages: {
            required: 'Image is required',
            invalidType: 'Only JPEG and PNG images allowed',
            sizeExceeded: (fileName: string, maxSize: string) =>
              `Image ${fileName} must be smaller than ${maxSize}`
          }
        }
        const { validateFile } = mountValidationComposable(options)

        expect(validateFile(null)).toBe('Image is required')

        const txtFile = createMockFile('doc.txt', 'text/plain', 1000)
        expect(validateFile(txtFile)).toBe('Only JPEG and PNG images allowed')

        const largeImage = createMockFile('huge.jpg', 'image/jpeg', TEN_MB)
        expect(validateFile(largeImage)).toBe('Image huge.jpg must be smaller than 5Mo')

        const validImage = createMockFile('photo.jpg', 'image/jpeg', TWO_MB)
        expect(validateFile(validImage)).toBeUndefined()
      })
    })
  })
})
