import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { useStorageImage } from '@/common/composables/use-storage-image/use-storage-image'

const mockFile = shallowRef<Blob>()
const mockDefaultProfile = shallowRef<Blob>()
const mockDefaultCover = shallowRef<Blob>()
const enabledOf = (mock: ReturnType<typeof vi.fn>) => mock.mock.calls.at(-1)?.[mock.mock.calls.at(-1)!.length - 1].query.enabled.value

const { mockGetFile, mockGetProfile, mockGetCover } = vi.hoisted(() => ({
  mockGetFile: vi.fn(),
  mockGetProfile: vi.fn(),
  mockGetCover: vi.fn(),
}))

vi.mock('@/api/avenir-esr', async importOriginal => ({
  ...await importOriginal<typeof import('@/api/avenir-esr')>(),
  useGetResourceByFileId: (...args: unknown[]) => {
    mockGetFile(...args)
    return { data: mockFile }
  },
  useGetDefaultProfilePicture: (...args: unknown[]) => {
    mockGetProfile(...args)
    return { data: mockDefaultProfile }
  },
  useGetDefaultCoverPicture: (...args: unknown[]) => {
    mockGetCover(...args)
    return { data: mockDefaultCover }
  },
}))

BddTest().given('a useStorageImage composable', () => {
  const createObjectURL = vi.fn((blob: Blob) => `blob:${(blob as Blob & { name?: string }).name ?? 'mock'}`)
  const revokeObjectURL = vi.fn()
  const unmounts: Array<() => void> = []
  const mount = (...args: Parameters<typeof useStorageImage>) => {
    const mounted = mountComposable(() => useStorageImage(...args), {})
    unmounts.push(mounted.unmount)
    return mounted
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockFile.value = undefined
    mockDefaultProfile.value = undefined
    mockDefaultCover.value = undefined
    window.URL.createObjectURL = createObjectURL
    window.URL.revokeObjectURL = revokeObjectURL
  })

  afterEach(() => {
    unmounts.splice(0).forEach(unmount => unmount())
  })

  BddTest().when('a fileId is provided', () => {
    BddTest().then('it should enable the file query only and expose the file url', async () => {
      mockFile.value = new Blob(['file'])
      const { result } = mount('file-id', 'profile')

      expect(enabledOf(mockGetFile)).toBe(true)
      expect(enabledOf(mockGetProfile)).toBe(false)
      expect(enabledOf(mockGetCover)).toBe(false)
      expect(result.url.value).toBe('blob:mock')
    })
  })

  BddTest().when('no fileId is provided with the profile default', () => {
    BddTest().then('it should enable the default profile query and expose its url', () => {
      mockDefaultProfile.value = new Blob(['profile'])
      const { result } = mount(undefined, 'profile')

      expect(enabledOf(mockGetFile)).toBe(false)
      expect(enabledOf(mockGetProfile)).toBe(true)
      expect(enabledOf(mockGetCover)).toBe(false)
      expect(result.url.value).toBe('blob:mock')
    })
  })

  BddTest().when('no fileId is provided with the cover default', () => {
    BddTest().then('it should enable the default cover query and expose its url', () => {
      mockDefaultCover.value = new Blob(['cover'])
      const { result } = mount(undefined, 'cover')

      expect(enabledOf(mockGetCover)).toBe(true)
      expect(enabledOf(mockGetProfile)).toBe(false)
      expect(result.url.value).toBe('blob:mock')
    })
  })

  BddTest().when('no fileId and no default picture are provided', () => {
    BddTest().then('it should not enable any query and expose no url', () => {
      const { result } = mount(undefined)

      expect(enabledOf(mockGetFile)).toBe(false)
      expect(enabledOf(mockGetProfile)).toBe(false)
      expect(enabledOf(mockGetCover)).toBe(false)
      expect(result.url.value).toBeUndefined()
      expect(createObjectURL).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the blob changes', () => {
    BddTest().then('it should revoke the previous url and create a new one', async () => {
      mockFile.value = new Blob(['a'])
      const { result } = mount('file-id')
      expect(createObjectURL).toHaveBeenCalledTimes(1)

      mockFile.value = new Blob(['b'])
      await nextTick()

      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock')
      expect(createObjectURL).toHaveBeenCalledTimes(2)
      expect(result.url.value).toBe('blob:mock')
    })
  })

  BddTest().when('the component is unmounted', () => {
    BddTest().then('it should revoke the current url', () => {
      mockFile.value = new Blob(['a'])
      const { unmount } = mount('file-id')

      unmount()

      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock')
    })
  })
})
