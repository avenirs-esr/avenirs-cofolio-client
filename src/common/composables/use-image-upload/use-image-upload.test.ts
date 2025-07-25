import { useImageUpload } from '@/common/composables/use-image-upload/use-image-upload'
import { mountComposable } from '@/ui/tests/utils'
import { beforeEach, describe, expect, it } from 'vitest'

describe('useImageUpload', () => {
  const testFile = new File(['hello'], 'test.png', { type: 'image/png' })
  const largeFile = new File(['a'.repeat(11 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' }) // 11MB

  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
  }
  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = vi.fn()
  }

  describe('given a fresh image upload composable', () => {
    let imageUpload: ReturnType<typeof useImageUpload>

    beforeEach(() => {
      const { result } = mountComposable(useImageUpload, { useI18n: true })
      imageUpload = result
    })

    describe('when initialized', () => {
      it('then all refs should be undefined or null', () => {
        expect(imageUpload.error.value).toBeUndefined()
        expect(imageUpload.valid.value).toBeUndefined()
        expect(imageUpload.name.value).toBeUndefined()
        expect(imageUpload.previewUrl.value).toBeNull()
      })

      it('then all methods should be available', () => {
        expect(typeof imageUpload.update).toBe('function')
        expect(typeof imageUpload.clear).toBe('function')
      })
    })

    describe('when update is called with an oversized file', () => {
      beforeEach(() => {
        const fileList = {
          0: largeFile,
          length: 1,
          item: (index: number) => index === 0 ? largeFile : null,
        } as unknown as FileList

        imageUpload.update(fileList)
      })

      it('then it should set an error and not set previewUrl or name', () => {
        expect(imageUpload.error.value).toBeDefined()
        expect(imageUpload.name.value).toBeUndefined()
        expect(imageUpload.previewUrl.value).toBeNull()
        expect(imageUpload.valid.value).toBeUndefined()
      })
    })

    describe('when update is called with a valid file', () => {
      let fileUrl: string

      beforeEach(() => {
        const fileList = {
          0: testFile,
          length: 1,
          item: (index: number) => index === 0 ? testFile : null,
        } as unknown as FileList

        fileUrl = 'blob:mock-url'
        vi.spyOn(URL, 'createObjectURL').mockReturnValue(fileUrl)

        imageUpload.update(fileList)
      })

      it('then it should set name, valid, and previewUrl, and clear error', () => {
        expect(imageUpload.error.value).toBeUndefined()
        expect(imageUpload.valid.value).toBeDefined()
        expect(imageUpload.name.value).toBe('test.png')
        expect(imageUpload.previewUrl.value).toBe(fileUrl)
      })
    })

    describe('when update is called with an empty FileList', () => {
      beforeEach(() => {
        const emptyFileList = {
          0: undefined,
          length: 0,
          item: () => null
        } as unknown as FileList

        imageUpload.update(emptyFileList)
      })

      it('then it should not set any error, name, valid or previewUrl', () => {
        expect(imageUpload.error.value).toBeUndefined()
        expect(imageUpload.valid.value).toBeUndefined()
        expect(imageUpload.name.value).toBeUndefined()
        expect(imageUpload.previewUrl.value).toBeNull()
      })
    })

    describe('when clear is called', () => {
      beforeEach(() => {
        imageUpload.name.value = 'to-clear.png'
        imageUpload.previewUrl.value = 'blob:some-url'
        imageUpload.valid.value = 'valid'
        imageUpload.error.value = 'some error'

        vi.spyOn(URL, 'revokeObjectURL')
        imageUpload.clear()
      })

      it('then all refs should be reset and URL revoked', () => {
        expect(imageUpload.name.value).toBeUndefined()
        expect(imageUpload.valid.value).toBeUndefined()
        expect(imageUpload.error.value).toBeUndefined()
        expect(imageUpload.previewUrl.value).toBeNull()
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:some-url')
      })
    })
  })
})
