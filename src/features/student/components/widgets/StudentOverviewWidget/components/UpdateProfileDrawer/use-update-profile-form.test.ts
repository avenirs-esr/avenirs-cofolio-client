import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { useUpdateProfile, useUpdateProfileCover, useUpdateProfilePhoto } from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/use-update-profile'
import { useUpdateProfileForm } from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/use-update-profile-form'
import { mountComposable } from '@/ui/tests/utils'
import { flushPromises } from '@vue/test-utils'
import { Exception } from 'sass-embedded'
import { mockAddErrorMessage } from 'tests/mocks'
import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'
import { nextTick } from 'vue'

vi.mock('@/ui/utils', () => ({
  isValidEmail: (email: string) => email.includes('@'),
}))

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

vi.mock('@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/use-update-profile', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/use-update-profile')>()

  return {
    ...actual,
    useUpdateProfile: vi.fn(),
    useUpdateProfileCover: vi.fn(),
    useUpdateProfilePhoto: vi.fn(),
  }
})

describe('given a useUpdateProfileForm composable', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  const mockedUseUpdateProfile: MockedFunction<typeof useUpdateProfile> = vi.mocked(useUpdateProfile)
  mockedUseUpdateProfile.mockImplementation((onSuccess: () => void) => ({
    onUpdateProfile: vi.fn().mockImplementation(() => {
      onSuccess()
    }),
    iseUpdateProfilePending: ref(false),
  }))

  const mockedUseUpdateProfileCover: MockedFunction<typeof useUpdateProfileCover> = vi.mocked(useUpdateProfileCover)
  mockedUseUpdateProfileCover.mockImplementation(() => ({
    onUpdateProfileCoverAsync: vi.fn().mockResolvedValue('cover-url'),
    iseUpdateProfileCoverPending: ref(false),
  }))

  const mockedUseUpdateProfilePhoto: MockedFunction<typeof useUpdateProfilePhoto> = vi.mocked(useUpdateProfilePhoto)
  mockedUseUpdateProfilePhoto.mockImplementation(() => ({
    onUpdateProfilePhotoAsync: vi.fn().mockResolvedValue('photo-url'),
    iseUpdateProfilePhotoPending: ref(false),
  }))

  const initialData = {
    lastname: 'Moulin',
    firstname: 'Jeanne',
    email: 'j.moulin@example.com',
    bio: 'Bio',
    coverPicture: {
      id: 'random-id',
      name: 'initialCover.jpg',
      url: 'initialCover.jpg',
    },
    profilePicture: {
      id: 'random-id-2',
      name: 'initialProfile.jpg',
      url: 'initialProfile.jpg',
    }
  }

  const onSuccess = vi.fn()

  let result: ReturnType<typeof useUpdateProfileForm>

  beforeEach(() => {
    vi.clearAllMocks()

    result = mountComposable(() => useUpdateProfileForm(initialData, onSuccess), {
      useI18n: true,
      usePinia: true,
      useTanstack: true,
    }).result
  })

  describe('when the composable is mounted', () => {
    it('then it should expose initial form values', () => {
      expect(result.form.state.values).toEqual(initialData)
    })

    it('then isModified should be false', () => {
      expect(result.isModified.value).toBe(false)
    })
  })

  describe('when calling onCoverPictureUpdate', () => {
    it('then it should update coverPictureFile and isModified', () => {
      const file = new File(['cover'], 'cover.jpg', { type: 'image/jpeg' })
      result.onCoverPictureUpdate(file)
      expect(result.isModified.value).toBe(true)

      const newCoverUrl = 'https://example.com/new-cover.jpg'
      result.onUpdateProfileCoverSuccess(newCoverUrl)
      expect(result.form.state.values.coverPicture).toStrictEqual({ id: 'random-id', name: 'initialCover.jpg', url: newCoverUrl })
    })
  })

  describe('when calling onProfilePictureUpdate', () => {
    it('then it should update profilePictureFile and isModified', () => {
      const file = new File(['profile'], 'profile.jpg', { type: 'image/jpeg' })
      result.onProfilePictureUpdate(file)
      expect(result.isModified.value).toBe(true)

      const newPhotoUrl = 'https://example.com/new-photo.jpg'
      result.onUpdateProfilePhotoSuccess(newPhotoUrl)
      expect(result.form.state.values.profilePicture).toStrictEqual({
        id: 'random-id-2',
        name: 'initialProfile.jpg',
        url: newPhotoUrl
      })
    })
  })

  describe('when calling resetForm', () => {
    it('then it should reset values and files', () => {
      result.onCoverPictureUpdate(new File(['a'], 'a.jpg'))
      result.onProfilePictureUpdate(new File(['b'], 'b.jpg'))
      result.resetForm()
      expect(result.form.state.values).toEqual(initialData)
      expect(result.isModified.value).toBe(false)
    })
  })

  describe('when submitting invalid values', () => {
    it('then it should return validation errors', async () => {
      result.form.setFieldValue('firstname', '')
      result.form.setFieldValue('lastname', '')
      result.form.setFieldValue('email', 'invalid')

      const errors = await result.form.validate('submit')

      expect(errors.firstname!.onSubmit).toBe('Ce champ est requis.')
      expect(errors.lastname!.onSubmit).toBe('Ce champ est requis.')
      expect(errors.email!.onSubmit).toBe('Veuillez renseigner une adresse email valide (ex. : nom@exemple.com)')
    })
  })

  describe('when submitting valid values with images', () => {
    it('then it should call all mutations and onSuccess', async () => {
      const cover = new File(['cover'], 'cover.jpg')
      const profile = new File(['profile'], 'profile.jpg')
      result.onCoverPictureUpdate(cover)
      result.onProfilePictureUpdate(profile)

      await result.form.handleSubmit()
      await flushPromises()

      expect(onSuccess).toHaveBeenCalled()
    })
  })

  describe('when the update profile mutation fails', () => {
    const error: BaseApiException = {
      message: 'Failed to update profile',
      name: 'UpdateProfileError',
      status: 500,
      code: BaseApiErrorCode.UNKNOWN
    }

    let errorForm: ReturnType<typeof useUpdateProfileForm>

    beforeEach(async () => {
      vi.clearAllMocks()

      mockedUseUpdateProfile.mockImplementation(() => ({
        onUpdateProfile: vi.fn().mockImplementation(() => {
          throw error
        }),
        iseUpdateProfilePending: ref(false),
      }))

      errorForm = mountComposable(() => useUpdateProfileForm(initialData, vi.fn()), {
        useI18n: true,
        usePinia: true,
        useTanstack: true
      }).result
    })

    it('then it should show error toast', async () => {
      await errorForm.form.handleSubmit()
      await nextTick()

      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Une erreur est survenue lors de la mise à jour du profil.',
          description: error.message,
        }),
      )
    })
  })

  describe('when the update profile cover mutation fails', () => {
    const error: BaseApiException = {
      message: 'Failed to update profile cover',
      name: 'UpdateProfileCoverError',
      status: 500,
      code: BaseApiErrorCode.UNKNOWN
    }

    let errorForm: ReturnType<typeof useUpdateProfileForm>

    beforeEach(async () => {
      vi.clearAllMocks()

      mockedUseUpdateProfileCover.mockImplementation(() => ({
        onUpdateProfileCoverAsync: vi.fn().mockRejectedValue(error),
        iseUpdateProfileCoverPending: ref(false),
      }))

      errorForm = mountComposable(() => useUpdateProfileForm(initialData, vi.fn()), {
        useI18n: true,
        usePinia: true,
        useTanstack: true
      }).result

      errorForm.onCoverPictureUpdate(new File(['cover'], 'cover.jpg'))
    })

    it('then it should show error toast', async () => {
      await errorForm.form.handleSubmit()
      await nextTick()

      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Une erreur est survenue lors de la mise à jour du profil.',
          description: error.message,
        }),
      )
    })
  })

  describe('when the update profile photo mutation fails', () => {
    const error: BaseApiException = {
      message: 'Failed to update profile photo',
      name: 'UpdateProfilePhotoError',
      status: 500,
      code: BaseApiErrorCode.UNKNOWN
    }

    let errorForm: ReturnType<typeof useUpdateProfileForm>

    beforeEach(async () => {
      vi.clearAllMocks()

      mockedUseUpdateProfilePhoto.mockImplementation(() => ({
        onUpdateProfilePhotoAsync: vi.fn().mockRejectedValue(error),
        iseUpdateProfilePhotoPending: ref(false),
      }))

      errorForm = mountComposable(() => useUpdateProfileForm(initialData, vi.fn()), {
        useI18n: true,
        usePinia: true,
        useTanstack: true
      }).result

      errorForm.onProfilePictureUpdate(new File(['photo'], 'photo.jpg'))
    })

    it('then it should show error toast', async () => {
      await errorForm.form.handleSubmit()
      await nextTick()

      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Une erreur est survenue lors de la mise à jour du profil.',
          description: error.message,
        }),
      )
    })
  })

  describe('when a mutation fails without BaseApiException error', () => {
    let errorForm: ReturnType<typeof useUpdateProfileForm>

    beforeEach(async () => {
      vi.clearAllMocks()

      mockedUseUpdateProfile.mockImplementation(() => ({
        onUpdateProfile: vi.fn().mockImplementation(() => {
          throw Exception
        }),
        iseUpdateProfilePending: ref(false),
      }))

      errorForm = mountComposable(() => useUpdateProfileForm(initialData, vi.fn()), {
        useI18n: true,
        usePinia: true,
        useTanstack: true
      }).result
    })

    it('then it should show generic error toast', async () => {
      await errorForm.form.handleSubmit()
      await nextTick()

      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Une erreur est survenue lors de la mise à jour du profil.',
          description: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
        }),
      )
    })
  })

  describe('when no mutation is pending', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      result = mountComposable(() => useUpdateProfileForm(initialData, onSuccess), {
        useI18n: true,
        usePinia: true,
        useTanstack: true,
      }).result
    })

    it('then isPending should be false', () => {
      expect(result.isPending.value).toBe(false)
    })
  })

  describe('when the update profile mutation is pending', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      mockedUseUpdateProfile.mockImplementation(() => ({
        onUpdateProfile: vi.fn(),
        iseUpdateProfilePending: ref(true),
      }))

      result = mountComposable(() => useUpdateProfileForm(initialData, onSuccess), {
        useI18n: true,
        usePinia: true,
        useTanstack: true,
      }).result
    })

    it('then isPending should be true', () => {
      expect(result.isPending.value).toBe(true)
    })
  })

  describe('when the update profile cover mutation is pending', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      mockedUseUpdateProfileCover.mockImplementation(() => ({
        onUpdateProfileCoverAsync: vi.fn(),
        iseUpdateProfileCoverPending: ref(true),
      }))

      result = mountComposable(() => useUpdateProfileForm(initialData, onSuccess), {
        useI18n: true,
        usePinia: true,
        useTanstack: true,
      }).result
    })

    it('then isPending should be true', () => {
      expect(result.isPending.value).toBe(true)
    })
  })

  describe('when the update profile photo mutation is pending', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      mockedUseUpdateProfilePhoto.mockImplementation(() => ({
        onUpdateProfilePhotoAsync: vi.fn(),
        iseUpdateProfilePhotoPending: ref(true),
      }))

      result = mountComposable(() => useUpdateProfileForm(initialData, onSuccess), {
        useI18n: true,
        usePinia: true,
        useTanstack: true,
      }).result
    })

    it('then isPending should be true', () => {
      expect(result.isPending.value).toBe(true)
    })
  })
})
