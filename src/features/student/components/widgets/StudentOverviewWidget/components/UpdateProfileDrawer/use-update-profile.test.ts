import { createPutUpdateProfileCoverHandler, createPutUpdateProfileHandler, createPutUpdateProfilePhotoHandler, putUpdateProfileCoverErrorHandler, putUpdateProfileErrorHandler, putUpdateProfilePhotoErrorHandler } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { server } from '@/__mocks__/msw/server'
import { useUpdateProfile, useUpdateProfileCover, useUpdateProfilePhoto } from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/use-update-profile'
import { mountComposable } from '@/ui/tests/utils'
import { flushPromises } from '@vue/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

describe('given an useUpdateProfile composable', () => {
  const onSuccessSpy = vi.fn()
  let result: ReturnType<typeof useUpdateProfile>

  beforeEach(() => {
    vi.clearAllMocks()
    result = mountComposable(() => useUpdateProfile(onSuccessSpy), {
      useI18n: true,
      usePinia: true,
      useTanstack: true
    }).result
  })

  describe('when update profile succeeds', () => {
    beforeEach(() => {
      const handler = createPutUpdateProfileHandler('test@example.com')
      server.use(handler)
    })

    it('then it should call the onSuccess callback', async () => {
      await result.onUpdateProfile({ email: 'test@example.com' })
      await flushPromises()

      expect(onSuccessSpy).toHaveBeenCalled()
    })
  })

  describe('when update profile fails with server error', () => {
    beforeEach(() => {
      server.use(putUpdateProfileErrorHandler)
    })

    it('then it should show an error message', async () => {
      await result.onUpdateProfile({ email: 'test@example.com' })
      await flushPromises()

      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la mise à jour du profil.',
        description: 'Internal server error'
      })
    })
  })
})

describe('given an useUpdateProfileCover composable', () => {
  const fakeFile = new File(['cover'], 'cover.jpg', { type: 'image/jpeg' })
  const onSuccessSpy = vi.fn()
  let result: ReturnType<typeof useUpdateProfileCover>

  beforeEach(() => {
    vi.clearAllMocks()
    result = mountComposable(() => useUpdateProfileCover(onSuccessSpy), {
      useI18n: true,
      usePinia: true,
      useTanstack: true
    }).result
  })

  describe('when update profile cover succeeds', () => {
    beforeEach(() => {
      const handler = createPutUpdateProfileCoverHandler('new-url.jpeg')
      server.use(handler)
    })

    it('then it should call the onSuccess callback', async () => {
      await result.onUpdateProfileCoverAsync({ file: fakeFile })
      await flushPromises()

      expect(onSuccessSpy).toHaveBeenCalled()
    })
  })

  describe('when update profile cover fails with server error', () => {
    beforeEach(() => {
      server.use(putUpdateProfileCoverErrorHandler)
    })

    it('then it should show an error message', async () => {
      await result.onUpdateProfileCoverAsync({ file: fakeFile }).catch(() => {})
      await flushPromises()

      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la mise à jour du profil.',
        description: 'Internal server error'
      })
    })
  })
})

describe('given an useUpdateProfilePhoto composable', () => {
  const fakeFile = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' })
  const onSuccessSpy = vi.fn()
  let result: ReturnType<typeof useUpdateProfilePhoto>

  beforeEach(() => {
    vi.clearAllMocks()
    result = mountComposable(() => useUpdateProfilePhoto(onSuccessSpy), {
      useI18n: true,
      usePinia: true,
      useTanstack: true
    }).result
  })

  describe('when update profile photo succeeds', () => {
    beforeEach(() => {
      const handler = createPutUpdateProfilePhotoHandler('new-url.jpeg')
      server.use(handler)
    })

    it('then it should call the onSuccess callback', async () => {
      await result.onUpdateProfilePhotoAsync({ file: fakeFile })
      await flushPromises()

      expect(onSuccessSpy).toHaveBeenCalled()
    })
  })

  describe('when update profile cover fails with server error', () => {
    beforeEach(() => {
      server.use(putUpdateProfilePhotoErrorHandler)
    })

    it('then it should show an error message', async () => {
      await result.onUpdateProfilePhotoAsync({ file: fakeFile }).catch(() => {})
      await flushPromises()

      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la mise à jour du profil.',
        description: 'Internal server error'
      })
    })
  })
})
