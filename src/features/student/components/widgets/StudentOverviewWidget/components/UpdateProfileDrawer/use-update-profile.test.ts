import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { useUpdateProfile, useUpdateProfileCover, useUpdateProfilePhoto } from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/use-update-profile'
import { useUpdateProfileCoverMutation, useUpdateProfileMutation, useUpdateProfilePhotoMutation } from '@/features/student/queries'
import { mountComposable } from '@/ui/tests/utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { createMockMutation } from 'tests/mocks/mutation'
import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'

vi.mock('@/features/student/queries/use-student-summary.query/use-student-summary.query', () => ({
  useUpdateProfileMutation: vi.fn(),
  useUpdateProfileCoverMutation: vi.fn(),
  useUpdateProfilePhotoMutation: vi.fn()
}))

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
  const mockUpdateProfile = createMockMutation<ReturnType<typeof useUpdateProfileMutation>>()
  const mockedUseUpdateProfileMutation: MockedFunction<typeof useUpdateProfileMutation> = vi.mocked(useUpdateProfileMutation)
  let result: ReturnType<typeof useUpdateProfile>
  const onSuccessSpy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    mockUpdateProfile.isPending.value = false

    mockedUseUpdateProfileMutation.mockImplementation(({ onError, onSuccess } = {}) => {
      if (onError) {
        mockUpdateProfile.callbacks.onError.mockImplementation(onError)
      }
      if (onSuccess) {
        mockUpdateProfile.callbacks.onSuccess.mockImplementation(onSuccess)
      }
      return mockUpdateProfile.implementation()
    })

    result = mountComposable(() => useUpdateProfile(onSuccessSpy), {
      useI18n: true,
      usePinia: true,
      useTanstack: true
    }).result
  })

  describe('when composable is mounted', () => {
    it('then it should expose isPending from mutation', () => {
      expect(result.iseUpdateProfilePending).toBe(mockUpdateProfile.isPending)
    })
  })

  describe('when onUpdateProfile is called with valid data', () => {
    const profileUpdateRequest = { email: 'test@example.com' }

    beforeEach(() => {
      result.onUpdateProfile(profileUpdateRequest)
    })

    it('then it should call mutate with correct parameters', () => {
      expect(mockUpdateProfile.mutate).toHaveBeenCalledWith({
        profile: 'student',
        profileUpdateRequest
      })
    })
  })

  describe('when the update profile mutation succeeds', () => {
    beforeEach(() => {
      mockUpdateProfile.callbacks.onSuccess()
    })

    it('then it should call the passed onSuccess callback', () => {
      expect(onSuccessSpy).toHaveBeenCalled()
    })
  })

  describe('when the update profile mutation fails', () => {
    const error: BaseApiException = {
      message: 'Failed to update profile',
      name: 'UpdateProfileError',
      status: 500,
      code: BaseApiErrorCode.UNKNOWN
    }

    beforeEach(() => {
      mockUpdateProfile.callbacks.onError(error)
    })

    it('then an error message should be added', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la mise à jour du profil.',
        description: error.message,
      })
    })
  })
})

describe('given an useUpdateProfileCover composable', () => {
  const mockUpdateProfileCover = createMockMutation<ReturnType<typeof useUpdateProfileCoverMutation>>()
  const mockedUseUpdateProfileCoverMutation: MockedFunction<typeof useUpdateProfileCoverMutation> = vi.mocked(useUpdateProfileCoverMutation)
  let result: ReturnType<typeof useUpdateProfileCover>
  const onSuccessSpy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    mockUpdateProfileCover.isPending.value = false

    mockedUseUpdateProfileCoverMutation.mockImplementation(({ onError, onSuccess } = {}) => {
      if (onError) {
        mockUpdateProfileCover.callbacks.onError.mockImplementation(onError)
      }
      if (onSuccess) {
        mockUpdateProfileCover.callbacks.onSuccess.mockImplementation(onSuccess)
      }
      return mockUpdateProfileCover.implementation()
    })

    result = mountComposable(() => useUpdateProfileCover(onSuccessSpy), {
      useI18n: true,
      usePinia: true,
      useTanstack: true
    }).result
  })

  describe('when composable is mounted', () => {
    it('then it should expose isPending from mutation', () => {
      expect(result.iseUpdateProfileCoverPending).toBe(mockUpdateProfileCover.isPending)
    })
  })

  describe('when onUpdateProfileCover is called with valid data', () => {
    const fakeFile = new File(['cover'], 'cover.jpg', { type: 'image/jpeg' })

    beforeEach(async () => {
      await result.onUpdateProfileCoverAsync({ file: fakeFile })
    })

    it('then it should call mutate async with correct parameters', () => {
      expect(mockUpdateProfileCover.mutateAsync).toHaveBeenCalledWith({
        profile: 'student',
        updateProfileCoverBody: { file: fakeFile }
      })
    })
  })

  describe('when the update profile mutation succeeds', () => {
    beforeEach(() => {
      mockUpdateProfileCover.callbacks.onSuccess()
    })

    it('then it should call the passed onSuccess callback', () => {
      expect(onSuccessSpy).toHaveBeenCalled()
    })
  })

  describe('when the update profile cover mutation fails', () => {
    const error: BaseApiException = {
      message: 'Failed to update profile cover',
      name: 'UpdateProfileCoverError',
      status: 500,
      code: BaseApiErrorCode.UNKNOWN
    }

    beforeEach(() => {
      mockUpdateProfileCover.callbacks.onError(error)
    })

    it('then an error message should be added', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la mise à jour du profil.',
        description: error.message,
      })
    })
  })
})

describe('given an useUpdateProfilePhoto composable', () => {
  const mockUpdateProfilePhoto = createMockMutation<ReturnType<typeof useUpdateProfilePhotoMutation>>()
  const mockedUseUpdateProfilePhotoMutation: MockedFunction<typeof useUpdateProfilePhotoMutation> = vi.mocked(useUpdateProfilePhotoMutation)
  let result: ReturnType<typeof useUpdateProfilePhoto>
  const onSuccessSpy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    mockUpdateProfilePhoto.isPending.value = false

    mockedUseUpdateProfilePhotoMutation.mockImplementation(({ onError, onSuccess } = {}) => {
      if (onError) {
        mockUpdateProfilePhoto.callbacks.onError.mockImplementation(onError)
      }
      if (onSuccess) {
        mockUpdateProfilePhoto.callbacks.onSuccess.mockImplementation(onSuccess)
      }
      return mockUpdateProfilePhoto.implementation()
    })

    result = mountComposable(() => useUpdateProfilePhoto(onSuccessSpy), {
      useI18n: true,
      usePinia: true,
      useTanstack: true
    }).result
  })

  describe('when composable is mounted', () => {
    it('then it should expose isPending from mutation', () => {
      expect(result.iseUpdateProfilePhotoPending).toBe(mockUpdateProfilePhoto.isPending)
    })
  })

  describe('when onUpdateProfilePhoto is called with valid data', () => {
    const fakeFile = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' })

    beforeEach(async () => {
      await result.onUpdateProfilePhotoAsync({ file: fakeFile })
    })

    it('then it should call mutate async with correct parameters', () => {
      expect(mockUpdateProfilePhoto.mutateAsync).toHaveBeenCalledWith({
        profile: 'student',
        updateProfilePhotoBody: { file: fakeFile }
      })
    })
  })

  describe('when the update profile mutation succeeds', () => {
    beforeEach(() => {
      mockUpdateProfilePhoto.callbacks.onSuccess()
    })

    it('then it should call the passed onSuccess callback', () => {
      expect(onSuccessSpy).toHaveBeenCalled()
    })
  })

  describe('when the update profile photo mutation fails', () => {
    const error: BaseApiException = {
      message: 'Failed to update profile photo',
      name: 'UpdateProfilePhotoError',
      status: 500,
      code: BaseApiErrorCode.UNKNOWN
    }

    beforeEach(() => {
      mockUpdateProfilePhoto.callbacks.onError(error)
    })

    it('then an error message should be added', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors de la mise à jour du profil.',
        description: error.message,
      })
    })
  })
})
