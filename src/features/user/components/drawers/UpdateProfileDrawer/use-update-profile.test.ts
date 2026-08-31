import {
  createPutUpdateProfileCoverHandler,
  createPutUpdateProfileHandler,
  createPutUpdateProfilePhotoHandler,
  putUpdateProfileCoverErrorHandler,
  putUpdateProfileErrorHandler,
  putUpdateProfilePhotoErrorHandler
} from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { server } from '@/__mocks__/msw/server'
import { EUserCategory } from '@/api/avenir-esr'
import {
  useUpdateProfile,
  useUpdateProfileCover,
  useUpdateProfilePhoto
} from '@/common/components/overlay/drawers/UpdateProfileDrawer/use-update-profile'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

BddTest().given('an useUpdateProfile composable with a STAFF user', () => {
  const onSuccessSpy = vi.fn()
  let result: ReturnType<typeof useUpdateProfile>

  beforeEach(() => {
    vi.clearAllMocks()
    result = mountComposable(() => useUpdateProfile(EUserCategory.STAFF, onSuccessSpy), {
      useI18n: true,
      usePinia: true,
      useTanstack: true
    }).result
  })

  BddTest().when('update profile succeeds', () => {
    beforeEach(() => {
      const handler = createPutUpdateProfileHandler('test@example.com')
      server.use(handler)
    })

    BddTest().then('it should call the onSuccess callback', async () => {
      await result.onUpdateProfile({ email: 'test@example.com' })
      await flushPromises()

      expect(onSuccessSpy).toHaveBeenCalled()
    })
  })

  BddTest().when('update profile fails with server error', () => {
    beforeEach(() => {
      server.use(putUpdateProfileErrorHandler)
    })

    BddTest().then('it should show an error message', async () => {
      await result.onUpdateProfile({ email: 'test@example.com' })
      await flushPromises()

      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la mise à jour du profil.',
        description: expect.any(String)
      })
    })
  })
})

BddTest().given('an useUpdateProfileCover composable with a STAFF user', () => {
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

  BddTest().when('update profile cover succeeds', () => {
    beforeEach(() => {
      const handler = createPutUpdateProfileCoverHandler('new-url.jpeg')
      server.use(handler)
    })

    BddTest().then('it should call the onSuccess callback', async () => {
      await result.onUpdateProfileCoverAsync(EUserCategory.STAFF, { file: fakeFile })
      await flushPromises()

      expect(onSuccessSpy).toHaveBeenCalled()
    })
  })

  BddTest().when('update profile cover fails with server error', () => {
    beforeEach(() => {
      server.use(putUpdateProfileCoverErrorHandler)
    })

    BddTest().then('it should show an error message', async () => {
      await result.onUpdateProfileCoverAsync(EUserCategory.STAFF, { file: fakeFile }).catch(() => {})
      await flushPromises()

      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la mise à jour du profil.',
        description: expect.any(String)
      })
    })
  })
})

BddTest().given('an useUpdateProfilePhoto composable with a STAFF user', () => {
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

  BddTest().when('update profile photo succeeds', () => {
    beforeEach(() => {
      const handler = createPutUpdateProfilePhotoHandler('new-url.jpeg')
      server.use(handler)
    })

    BddTest().then('it should call the onSuccess callback', async () => {
      await result.onUpdateProfilePhotoAsync(EUserCategory.STAFF, { file: fakeFile })
      await flushPromises()

      expect(onSuccessSpy).toHaveBeenCalled()
    })
  })

  BddTest().when('update profile photo fails with server error', () => {
    beforeEach(() => {
      server.use(putUpdateProfilePhotoErrorHandler)
    })

    BddTest().then('it should show an error message', async () => {
      await result.onUpdateProfilePhotoAsync(EUserCategory.STAFF, { file: fakeFile }).catch(() => {})
      await flushPromises()

      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la mise à jour du profil.',
        description: expect.any(String)
      })
    })
  })
})
