import { EFileType, EUserCategory } from '@/api/avenir-esr'
import { BIOGRAPHY_MAX_LENGTH } from '@/common/components/overlay/drawers/UpdateProfileDrawer/config'
import { useUpdateProfile, useUpdateProfileCover, useUpdateProfilePhoto } from '@/common/components/overlay/drawers/UpdateProfileDrawer/use-update-profile'
import { useUpdateProfileForm } from '@/common/components/overlay/drawers/UpdateProfileDrawer/use-update-profile-form'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { Exception } from 'sass-embedded'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, type MockedFunction, vi } from 'vitest'
import { nextTick } from 'vue'

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    isValidEmail: (email: string) => email.includes('@'),
    PageSizes: {
      FOUR: 4,
      EIGHT: 8,
      TWELVE: 12
    }
  }
})

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

vi.mock('@/common/components/overlay/drawers/UpdateProfileDrawer/use-update-profile', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/components/overlay/drawers/UpdateProfileDrawer/use-update-profile')>()

  return {
    ...actual,
    useUpdateProfile: vi.fn(),
    useUpdateProfileCover: vi.fn(),
    useUpdateProfilePhoto: vi.fn(),
  }
})

BddTest().given('a useUpdateProfileForm composable', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  const mockedUseUpdateProfile: MockedFunction<typeof useUpdateProfile> = vi.mocked(useUpdateProfile)
  mockedUseUpdateProfile.mockImplementation((_profile: EUserCategory, onSuccess: () => void) => ({
    onUpdateProfile: vi.fn().mockImplementation(() => {
      onSuccess()
    }),
    isUpdateProfilePending: ref(false),
  }))

  const mockedUseUpdateProfileCover: MockedFunction<typeof useUpdateProfileCover> = vi.mocked(useUpdateProfileCover)
  mockedUseUpdateProfileCover.mockImplementation(() => ({
    onUpdateProfileCoverAsync: vi.fn().mockResolvedValue('cover-url'),
    isUpdateProfileCoverPending: ref(false),
  }))

  const mockedUseUpdateProfilePhoto: MockedFunction<typeof useUpdateProfilePhoto> = vi.mocked(useUpdateProfilePhoto)
  mockedUseUpdateProfilePhoto.mockImplementation(() => ({
    onUpdateProfilePhotoAsync: vi.fn().mockResolvedValue('photo-url'),
    isUpdateProfilePhotoPending: ref(false),
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
      fileSize: 1000,
      fileType: EFileType.PNG,
      version: 1,
      uploadedAt: '2025-06-13T08:42:17',
      fileName: 'profile-picture.png'
    },
    profilePicture: {
      id: 'random-id-2',
      name: 'initialProfile.jpg',
      url: 'initialProfile.jpg',
      fileSize: 1000,
      fileType: EFileType.PNG,
      version: 1,
      uploadedAt: '2025-06-13T08:42:17',
      fileName: 'profile-picture.png'
    }
  }

  const onSuccess = vi.fn()

  let result: ReturnType<typeof useUpdateProfileForm>

  beforeEach(() => {
    vi.clearAllMocks()

    result = mountComposable(() => useUpdateProfileForm(initialData, EUserCategory.STUDENT, onSuccess), {
      useI18n: true,
      usePinia: true,
      useTanstack: true,
    }).result
  })

  BddTest().when('the composable is mounted', () => {
    BddTest().then('it should expose initial form values', () => {
      expect(result.form.state.values).toEqual({
        ...initialData,
        hasPicturesChanged: false,
      })
    })

    BddTest().then('isModified should be false', () => {
      expect(result.isModified.value).toBe(false)
    })
  })

  BddTest().when('calling onCoverPictureUpdate', () => {
    BddTest().then('it should update coverPictureFile and isModified', () => {
      const file = new File(['cover'], 'cover.jpg', { type: 'image/jpeg' })
      result.onCoverPictureUpdate(file)
      expect(result.isModified.value).toBe(true)
      expect(result.form.state.values.hasPicturesChanged).toBe(true)

      const newCoverUrl = 'https://example.com/new-cover.jpg'
      result.onUpdateProfileCoverSuccess(newCoverUrl)
      expect(result.form.state.values.coverPicture).toStrictEqual({ id: 'random-id', name: 'initialCover.jpg', url: newCoverUrl, fileName: 'profile-picture.png', fileSize: 1000, fileType: 'PNG', uploadedAt: '2025-06-13T08:42:17', version: 1 })
    })
  })

  BddTest().when('calling onProfilePictureUpdate', () => {
    BddTest().then('it should update profilePictureFile and isModified', () => {
      const file = new File(['profile'], 'profile.jpg', { type: 'image/jpeg' })
      result.onProfilePictureUpdate(file)
      expect(result.isModified.value).toBe(true)
      expect(result.form.state.values.hasPicturesChanged).toBe(true)

      const newPhotoUrl = 'https://example.com/new-photo.jpg'
      result.onUpdateProfilePhotoSuccess(newPhotoUrl)
      expect(result.form.state.values.profilePicture).toStrictEqual({
        id: 'random-id-2',
        name: 'initialProfile.jpg',
        url: newPhotoUrl,
        fileName: 'profile-picture.png',
        fileSize: 1000,
        fileType: 'PNG',
        uploadedAt: '2025-06-13T08:42:17',
        version: 1,
      })
    })
  })

  BddTest().when('calling resetForm', () => {
    BddTest().then('it should reset values and files', () => {
      result.onCoverPictureUpdate(new File(['a'], 'a.jpg'))
      result.onProfilePictureUpdate(new File(['b'], 'b.jpg'))
      result.resetForm()
      expect(result.form.state.values).toEqual({
        ...initialData,
        hasPicturesChanged: false,
      })
      expect(result.isModified.value).toBe(false)
    })
  })

  BddTest().when('submitting invalid values', () => {
    BddTest().then('it should return validation errors', async () => {
      result.form.setFieldValue('bio', Array.from({ length: BIOGRAPHY_MAX_LENGTH + 1 }).fill('a').join(''))
      result.form.setFieldValue('email', 'invalid')

      const errors = await result.form.validate('submit')

      expect(errors.email!.onSubmit).toBe('Veuillez renseigner une adresse email valide (ex. : nom@exemple.com)')
      expect(errors.bio!.onSubmit).toBe('La biographie ne doit pas dépasser les 400 charactères')
    })
  })

  BddTest().when('submitting valid values with images', () => {
    BddTest().then('it should call all mutations and onSuccess', async () => {
      const cover = new File(['cover'], 'cover.jpg')
      const profile = new File(['profile'], 'profile.jpg')
      result.onCoverPictureUpdate(cover)
      result.onProfilePictureUpdate(profile)

      await result.form.handleSubmit()
      await flushPromises()

      expect(onSuccess).toHaveBeenCalled()
    })
  })

  BddTest().when('the update profile mutation fails', () => {
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
        isUpdateProfilePending: ref(false),
      }))

      errorForm = mountComposable(() => useUpdateProfileForm(initialData, EUserCategory.STUDENT, vi.fn()), {
        useI18n: true,
        usePinia: true,
        useTanstack: true
      }).result
    })

    BddTest().then('it should show error toast', async () => {
      await errorForm.form.handleSubmit()
      await nextTick()

      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Une erreur est survenue lors de la mise à jour du profil.',
          description: expect.any(String),
        }),
      )
    })
  })

  BddTest().when('the update profile cover mutation fails', () => {
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
        isUpdateProfileCoverPending: ref(false),
      }))

      errorForm = mountComposable(() => useUpdateProfileForm(initialData, EUserCategory.STUDENT, vi.fn()), {
        useI18n: true,
        usePinia: true,
        useTanstack: true
      }).result

      errorForm.onCoverPictureUpdate(new File(['cover'], 'cover.jpg'))
    })

    BddTest().then('it should show error toast', async () => {
      await errorForm.form.handleSubmit()
      await nextTick()

      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Une erreur est survenue lors de la mise à jour du profil.',
          description: expect.any(String),
        }),
      )
    })
  })

  BddTest().when('the update profile photo mutation fails', () => {
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
        isUpdateProfilePhotoPending: ref(false),
      }))

      errorForm = mountComposable(() => useUpdateProfileForm(initialData, EUserCategory.STUDENT, vi.fn()), {
        useI18n: true,
        usePinia: true,
        useTanstack: true
      }).result

      errorForm.onProfilePictureUpdate(new File(['photo'], 'photo.jpg'))
    })

    BddTest().then('it should show error toast', async () => {
      await errorForm.form.handleSubmit()
      await nextTick()

      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Une erreur est survenue lors de la mise à jour du profil.',
          description: expect.any(String),
        }),
      )
    })
  })

  BddTest().when('a mutation fails without BaseApiException error', () => {
    let errorForm: ReturnType<typeof useUpdateProfileForm>

    beforeEach(async () => {
      vi.clearAllMocks()

      mockedUseUpdateProfile.mockImplementation(() => ({
        onUpdateProfile: vi.fn().mockImplementation(() => {
          throw Exception
        }),
        isUpdateProfilePending: ref(false),
      }))

      errorForm = mountComposable(() => useUpdateProfileForm(initialData, EUserCategory.STUDENT, vi.fn()), {
        useI18n: true,
        usePinia: true,
        useTanstack: true
      }).result
    })

    BddTest().then('it should show generic error toast', async () => {
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

  BddTest().when('no mutation is pending', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      result = mountComposable(() => useUpdateProfileForm(initialData, EUserCategory.STUDENT, onSuccess), {
        useI18n: true,
        usePinia: true,
        useTanstack: true,
      }).result
    })

    BddTest().then('isPending should be false', () => {
      expect(result.isPending.value).toBe(false)
    })
  })

  BddTest().when('the update profile mutation is pending', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      mockedUseUpdateProfile.mockImplementation(() => ({
        onUpdateProfile: vi.fn(),
        isUpdateProfilePending: ref(true),
      }))

      result = mountComposable(() => useUpdateProfileForm(initialData, EUserCategory.STUDENT, onSuccess), {
        useI18n: true,
        usePinia: true,
        useTanstack: true,
      }).result
    })

    BddTest().then('isPending should be true', () => {
      expect(result.isPending.value).toBe(true)
    })
  })

  BddTest().when('the update profile cover mutation is pending', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      mockedUseUpdateProfileCover.mockImplementation(() => ({
        onUpdateProfileCoverAsync: vi.fn(),
        isUpdateProfileCoverPending: ref(true),
      }))

      result = mountComposable(() => useUpdateProfileForm(initialData, EUserCategory.STUDENT, onSuccess), {
        useI18n: true,
        usePinia: true,
        useTanstack: true,
      }).result
    })

    BddTest().then('isPending should be true', () => {
      expect(result.isPending.value).toBe(true)
    })
  })

  BddTest().when('the update profile photo mutation is pending', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      mockedUseUpdateProfilePhoto.mockImplementation(() => ({
        onUpdateProfilePhotoAsync: vi.fn(),
        isUpdateProfilePhotoPending: ref(true),
      }))

      result = mountComposable(() => useUpdateProfileForm(initialData, EUserCategory.STUDENT, onSuccess), {
        useI18n: true,
        usePinia: true,
        useTanstack: true,
      }).result
    })

    BddTest().then('isPending should be true', () => {
      expect(result.isPending.value).toBe(true)
    })
  })
})
