import { EFileType, type FileDTO } from '@/api/avenir-esr'
import { useTraceAttachmentFile, useTraceFileValidation } from '@/features/student/traces/composables/use-trace-file/use-trace-file'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'

BddTest().given('a use-trace-file-validation composable', () => {
  BddTest().when('validating files with required flag true', () => {
    BddTest().then('it should return validation function', () => {
      const result = mountComposable(() => useTraceFileValidation(true), {
        useI18n: true
      })

      expect(result.result.validateFile).toBeDefined()
      expect(typeof result.result.validateFile).toBe('function')
    })
  })

  BddTest().when('validating files with required flag false', () => {
    BddTest().then('it should return validation function', () => {
      const result = mountComposable(() => useTraceFileValidation(false), {
        useI18n: true
      })

      expect(result.result.validateFile).toBeDefined()
      expect(typeof result.result.validateFile).toBe('function')
    })
  })

  BddTest().when('validating files with default required flag', () => {
    BddTest().then('it should return validation function with required true', () => {
      const result = mountComposable(() => useTraceFileValidation(), {
        useI18n: true
      })

      expect(result.result.validateFile).toBeDefined()
      expect(typeof result.result.validateFile).toBe('function')
    })
  })
})

BddTest().given('a use-trace-attachment-file composable', () => {
  const mockAttachment: FileDTO = {
    id: 'mock-attachment-1',
    fileName: 'test-file.pdf',
    fileType: EFileType.PDF,
    fileSize: 1024,
    url: 'exemple.com/image',
    uploadedAt: '2024-01-15T14:30:00'
  }

  BddTest().when('processing attachment DTO', () => {
    BddTest().then('it should convert DTO to File', () => {
      const result = mountComposable(() => useTraceAttachmentFile(mockAttachment), {
        useI18n: true
      })

      const file = result.result.attachmentFile.value

      expect(file).toBeInstanceOf(File)
      expect(file!.name).toBe('test-file.pdf')
      expect(file!.lastModified).toBe(new Date('2024-01-15T14:30:00').getTime())
    })

    BddTest().then('it should format upload date', () => {
      const result = mountComposable(() => useTraceAttachmentFile(mockAttachment), {
        useI18n: true
      })

      const uploadDate = result.result.uploadDate.value

      expect(uploadDate).toBeDefined()
      expect(typeof uploadDate).toBe('string')
      expect(uploadDate).toContain('15')
      expect(uploadDate).toContain('janvier')
      expect(uploadDate).toContain('2024')
      expect(uploadDate).toContain('à')
    })
  })

  BddTest().when('processing different file types', () => {
    BddTest().then('it should handle image file type', () => {
      const imageAttachment: FileDTO = {
        id: 'mock-attachment-2',
        fileName: 'image.jpg',
        fileType: EFileType.JPEG,
        fileSize: 2048,
        url: 'exemple.com/image',
        uploadedAt: '2023-06-10T10:00:00'
      }

      const result = mountComposable(() => useTraceAttachmentFile(imageAttachment), {
        useI18n: true
      })

      const file = result.result.attachmentFile.value
      const uploadDate = result.result.uploadDate.value

      expect(file!.name).toBe('image.jpg')
      expect(file!.lastModified).toBe(new Date('2023-06-10T10:00:00').getTime())
      expect(uploadDate).toContain('juin')
    })
  })

  BddTest().when('processing an undefined attachment', () => {
    BddTest().then('it should return an empty file state', () => {
      const result = mountComposable(() => useTraceAttachmentFile(undefined), {
        useI18n: true
      })

      expect(result.result.attachmentFile.value).toBeNull()
      expect(result.result.uploadDate.value).toBe('')
    })
  })
})
