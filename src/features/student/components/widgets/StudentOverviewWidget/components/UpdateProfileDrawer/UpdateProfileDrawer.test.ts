import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import UpdateProfileDrawer, { type UpdateProfileDrawerForm } from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import { useUpdateProfileCoverMutation, useUpdateProfileMutation, useUpdateProfilePhotoMutation } from '@/features/student/queries'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { mockAddErrorMessage, mockAddSuccessMessage } from 'tests/mocks'
import { createMockMutation } from 'tests/mocks/mutation'
import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'

interface UpdateProfileDrawerVm {
  coverPictureFile: File | null
  profilePictureFile: File | null
  form: UpdateProfileDrawerForm
  formErrors: UpdateProfileDrawerForm
}

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    })
  }
})

vi.mock('@/features/student/queries', () => ({
  useUpdateProfileMutation: vi.fn(),
  useUpdateProfileCoverMutation: vi.fn(),
  useUpdateProfilePhotoMutation: vi.fn()
}))

describe('updateProfileDrawer', () => {
  let wrapper: VueWrapper

  const stubs = {
    AvAccordion: {
      name: 'AvAccordion',
      template: '<div class="av-accordion"><slot /></div>'
    },
    AvAccordionsGroup: {
      name: 'AvAccordionsGroup',
      template: '<div class="av-accordion-group"><slot /></div>'
    },
    AvButton: {
      name: 'AvButton',
      props: ['label', 'isLoading', 'disabled'],
      template: '<button class="av-button">{{ label }}</button>'
    },
    AvDrawer: {
      name: 'AvDrawer',
      props: ['show'],
      template: `
        <div class="av-drawer">
          <slot></slot>
          <slot name="footer"></slot>
        </div>
      `
    },
    AvInput: {
      name: 'AvInput',
      props: {
        modelValue: String,
        type: String,
        isTextarea: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['update:modelValue'],
      template: `
        <input
          class="av-input"
          :value="modelValue"
          :type="type"
          :data-textarea="isTextarea"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      `
    },
    ImageUpload: {
      name: 'ImageUpload',
      props: ['modelValue'],
      template: '<div class="image-upload" />'
    },
    UpdateExitConfirmationModal: {
      name: 'UpdateExitConfirmationModal',
      props: ['showModal', 'onConfirm', 'onCancel', 'isLoading'],
      template: `
      <div class="update-exit-confirmation-modal">
        <button class="confirm-button" @click="onConfirm">Confirm</button>
      </div>
      `
    },
  }

  const studentSummary = {
    id: '123456789',
    firstname: 'Jeanne',
    lastname: 'Moulin',
    profilePicture: profile_picture_placeholder,
    coverPicture: profile_banner_placeholder,
    bio: 'Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète.'
  }

  const props = {
    studentSummary,
    show: true,
    onClose: vi.fn()
  }

  const mockUpdateProfile = createMockMutation<ReturnType<typeof useUpdateProfileMutation>>()
  const mockUpdateProfileCover = createMockMutation<ReturnType<typeof useUpdateProfileCoverMutation>>()
  const mockUpdateProfilePhoto = createMockMutation<ReturnType<typeof useUpdateProfilePhotoMutation>>()

  const mockedUseUpdateProfileMutation: MockedFunction<typeof useUpdateProfileMutation> = vi.mocked(useUpdateProfileMutation)
  const mockedUseUpdateProfileCoverMutation: MockedFunction<typeof useUpdateProfileCoverMutation> = vi.mocked(useUpdateProfileCoverMutation)
  const mockedUseUpdateProfilePhotoMutation: MockedFunction<typeof useUpdateProfilePhotoMutation> = vi.mocked(useUpdateProfilePhotoMutation)

  beforeEach(() => {
    vi.clearAllMocks()

    mockUpdateProfile.isPending.value = false
    mockUpdateProfileCover.isPending.value = false
    mockUpdateProfilePhoto.isPending.value = false

    mockedUseUpdateProfileMutation.mockImplementation(({ onError, onSuccess } = {}) => {
      if (onError) {
        mockUpdateProfile.callbacks.onError.mockImplementation(onError)
      }
      if (onSuccess) {
        mockUpdateProfile.callbacks.onSuccess.mockImplementation(onSuccess)
      }
      return mockUpdateProfile.implementation()
    })

    mockedUseUpdateProfileCoverMutation.mockImplementation(({ onError, onSuccess } = {}) => {
      if (onError) {
        mockUpdateProfileCover.callbacks.onError.mockImplementation(onError)
      }
      if (onSuccess) {
        mockUpdateProfileCover.callbacks.onSuccess.mockImplementation(onSuccess)
      }
      return mockUpdateProfileCover.implementation()
    })

    mockedUseUpdateProfilePhotoMutation.mockImplementation(({ onError, onSuccess } = {}) => {
      if (onError) {
        mockUpdateProfilePhoto.callbacks.onError.mockImplementation(onError)
      }
      if (onSuccess) {
        mockUpdateProfilePhoto.callbacks.onSuccess.mockImplementation(onSuccess)
      }
      return mockUpdateProfilePhoto.implementation()
    })

    wrapper = mount(UpdateProfileDrawer, {
      props,
      global: {
        stubs,
        plugins: [createPinia()],
      },
    })
  })

  describe('given an update profile drawer initially shown', () => {
    describe('when the component is mounted', () => {
      it('then it should render the accordion group', () => {
        const accordionGroup = wrapper.findComponent({ name: 'AvAccordionsGroup' })
        expect(accordionGroup.exists()).toBe(true)
      })

      it('then it should render the different inputs', () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(avInputs).toHaveLength(4)
        expect(avInputs[0].attributes('value')).toBe(studentSummary.lastname)
        expect(avInputs[0].attributes('data-textarea')).toBe('false')
        expect(avInputs[1].attributes('value')).toBe(studentSummary.firstname)
        expect(avInputs[2].attributes('value')).toBe('test@test.com')
        expect(avInputs[2].attributes('type')).toBe('email')
        expect(avInputs[2].attributes('data-textarea')).toBe('false')
        expect(avInputs[3].attributes('value')).toBe(studentSummary.bio)
        expect(avInputs[3].attributes('data-textarea')).toBe('true')
      })

      it('then it should render the save button in disabled state', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        const saveButton = avButtons.find(button => button.props('label') === 'Enregistrer')
        expect(saveButton?.exists()).toBe(true)
        expect(saveButton?.props('disabled')).toBe(true)
      })
    })

    describe('when the update profile mutation is pending', () => {
      beforeEach(() => {
        mockUpdateProfile.isPending.value = true
      })

      it('then the buttons should be in loading state', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        expect(avButtons).toHaveLength(2)
        avButtons.forEach((avButton) => {
          expect(avButton.props('isLoading')).toBe(true)
        })
      })
    })

    describe('when the update profile cover mutation is pending', () => {
      beforeEach(() => {
        mockUpdateProfileCover.isPending.value = true
      })

      it('then the buttons should be in loading state', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        expect(avButtons).toHaveLength(2)
        avButtons.forEach((avButton) => {
          expect(avButton.props('isLoading')).toBe(true)
        })
      })
    })

    describe('when the update profile photo mutation is pending', () => {
      beforeEach(() => {
        mockUpdateProfilePhoto.isPending.value = true
      })

      it('then the buttons should be in loading state', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        expect(avButtons).toHaveLength(2)
        avButtons.forEach((avButton) => {
          expect(avButton.props('isLoading')).toBe(true)
        })
      })
    })

    describe('when no mutation is pending', () => {
      it('then the buttons should not be in loading state', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        expect(avButtons).toHaveLength(2)
        avButtons.forEach((avButton) => {
          expect(avButton.props('isLoading')).toBe(false)
        })
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

    describe('when inputs are modified', () => {
      it('then they should have their new value set', async () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(avInputs).toHaveLength(4)
        expect(avInputs[0].element.value).toBe(studentSummary.lastname)
        expect(avInputs[1].element.value).toBe(studentSummary.firstname)
        expect(avInputs[2].element.value).toBe('test@test.com')
        expect(avInputs[3].element.value).toBe(studentSummary.bio)

        await avInputs[0].setValue('This is a new lastname')
        expect(avInputs[0].element.value).toBe('This is a new lastname')

        await avInputs[1].setValue('This is a new firstname')
        expect(avInputs[1].element.value).toBe('This is a new firstname')

        await avInputs[2].setValue('supertest@example.com')
        expect(avInputs[2].element.value).toBe('supertest@example.com')

        await avInputs[3].setValue('This is a new bio')
        expect(avInputs[3].element.value).toBe('This is a new bio')
      })

      it('then the save button should not stay in disabled state', async () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        const saveButton = avButtons.find(button => button.props('label') === 'Enregistrer')
        expect(saveButton?.exists()).toBe(true)
        expect(saveButton?.props('disabled')).toBe(true)

        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(avInputs).toHaveLength(4)
        expect(avInputs[0].element.value).toBe(studentSummary.lastname)
        await avInputs[0].setValue('This is a new lastname')

        expect(saveButton?.props('disabled')).toBe(false)
      })

      it('then they should reset if the drawer is hidden then shown again', async () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(avInputs).toHaveLength(4)
        expect(avInputs[0].element.value).toBe(studentSummary.lastname)
        await avInputs[0].setValue('This is a new lastname')

        await wrapper.setProps({ show: false })
        await wrapper.setProps({ show: true })

        expect(avInputs[0].element.value).toBe(studentSummary.lastname)
      })
    })

    describe('when the update profile mutation succeeds', () => {
      beforeEach(() => {
        mockUpdateProfile.callbacks.onSuccess()
      })

      it('then a success message should be shown and onClose should be called', () => {
        expect(mockAddSuccessMessage).toHaveBeenCalledWith('Votre profil a été mis à jour.')
        expect(props.onClose).toHaveBeenCalled()
        expect(mockAddErrorMessage).not.toHaveBeenCalled()
      })
    })

    describe('when submitting a valid form', () => {
      const lastname = 'This is a new lastname'
      const firstname = 'This is a new firstname'
      const email = 'new@example.com'
      const bio = 'This is a new bio'

      it('then it should call updateProfileMutation with form data', async () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        await avInputs[0].setValue(lastname)
        await avInputs[1].setValue(firstname)
        await avInputs[2].setValue(email)
        await avInputs[3].setValue(bio)

        const form = wrapper.find('form#profile-form')
        await form.trigger('submit')

        expect(mockUpdateProfile.mutate).toHaveBeenCalledWith({
          profile: 'student',
          profileUpdateRequest: {
            firstname,
            lastname,
            email,
            bio,
            coverPicture: studentSummary.coverPicture,
            profilePicture: studentSummary.profilePicture
          }
        })
      })
    })

    describe('when a cover picture is uploaded and updateProfileCover succeeds', () => {
      const uploadedUrl = 'https://example.com/new-cover.jpg'
      const fakeFile = new File(['cover'], 'cover.jpg', { type: 'image/jpeg' })

      beforeEach(async () => {
        (wrapper.vm as unknown as UpdateProfileDrawerVm).coverPictureFile = fakeFile

        const form = wrapper.find('form#profile-form')
        await form.trigger('submit')

        await mockUpdateProfileCover.callbacks.onSuccess(uploadedUrl)
      })

      it('then the coverPicture form field should be updated', () => {
        expect((wrapper.vm as unknown as UpdateProfileDrawerVm).form.coverPicture).toBe(uploadedUrl)

        expect(mockUpdateProfileCover.mutateAsync).toHaveBeenCalledWith({
          profile: 'student',
          updateProfileCoverBody: { file: fakeFile }
        })
      })
    })

    describe('when no cover picture is uploaded', () => {
      it('then it should not call the updateProfileCover mutation', async () => {
        (wrapper.vm as unknown as UpdateProfileDrawerVm).coverPictureFile = null

        const form = wrapper.find('form#profile-form')
        await form.trigger('submit')

        expect(mockUpdateProfileCover.mutateAsync).not.toHaveBeenCalled()
      })
    })

    describe('when a photo picture is uploaded and updateProfilePhoto succeeds', () => {
      const uploadedUrl = 'https://example.com/new-photo.jpg'
      const fakeFile = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' })

      beforeEach(async () => {
        (wrapper.vm as unknown as UpdateProfileDrawerVm).profilePictureFile = fakeFile

        const form = wrapper.find('form#profile-form')
        await form.trigger('submit')

        await mockUpdateProfilePhoto.callbacks.onSuccess(uploadedUrl)
      })

      it('then the profilePictureFile form field should be updated', () => {
        expect((wrapper.vm as unknown as UpdateProfileDrawerVm).form.profilePicture).toBe(uploadedUrl)

        expect(mockUpdateProfilePhoto.mutateAsync).toHaveBeenCalledWith({
          profile: 'student',
          updateProfilePhotoBody: { file: fakeFile }
        })
      })
    })

    describe('when no profile picture is uploaded', () => {
      it('then it should not call the updateProfilePhoto mutation', async () => {
        (wrapper.vm as unknown as UpdateProfileDrawerVm).profilePictureFile = null

        const form = wrapper.find('form#profile-form')
        await form.trigger('submit')

        expect(mockUpdateProfilePhoto.mutateAsync).not.toHaveBeenCalled()
      })
    })

    describe('when submitting an invalid form', () => {
      it('then it should show validation errors for required fields and invalid email', async () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        await avInputs[0].setValue('')
        await avInputs[1].setValue('')
        await avInputs[2].setValue('not-an-email')

        const form = wrapper.find('form#profile-form')
        await form.trigger('submit')

        const vm = wrapper.vm as unknown as UpdateProfileDrawerVm

        expect(vm.formErrors.lastname).toBe('Ce champ est requis.')
        expect(vm.formErrors.firstname).toBe('Ce champ est requis.')
        expect(vm.formErrors.email).toBe('Veuillez renseigner une adresse email valide (ex. : nom@exemple.com)')
        expect(mockUpdateProfile.mutate).not.toHaveBeenCalled()
      })
    })

    describe('when handleSubmit throws a BaseApiException error', () => {
      it('should call addErrorMessage with the error message', async () => {
        const error: BaseApiException = {
          message: 'Failed to update profile photo',
          name: 'UpdateProfilePhotoError',
          status: 500,
          code: BaseApiErrorCode.UNKNOWN
        }

        mockUpdateProfileCover.mutateAsync.mockRejectedValue(error)

        const vm = wrapper.vm as unknown as UpdateProfileDrawerVm

        vm.coverPictureFile = new File([''], 'cover.jpg')

        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        await avInputs[0].setValue('This is a new firstname')
        await avInputs[1].setValue('This is a new lastname')
        await avInputs[2].setValue('newtest@example.com')

        await wrapper.find('form#profile-form').trigger('submit.prevent')
        await wrapper.vm.$nextTick()

        expect(mockAddErrorMessage).toHaveBeenCalledWith({
          title: 'Une erreur est survenue lors de la mise à jour du profil.',
          description: error.message,
        })
      })
    })

    describe('when handleSubmit throws a non BaseApiException error', () => {
      it('should call addErrorMessage with the generic error message', async () => {
        const error = 'This is an error'

        mockUpdateProfileCover.mutateAsync.mockRejectedValue(error)

        const vm = wrapper.vm as unknown as UpdateProfileDrawerVm

        vm.coverPictureFile = new File([''], 'cover.jpg')

        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        await avInputs[0].setValue('This is a new firstname')
        await avInputs[1].setValue('This is a new lastname')
        await avInputs[2].setValue('newtest@example.com')

        await wrapper.find('form#profile-form').trigger('submit.prevent')
        await wrapper.vm.$nextTick()

        expect(mockAddErrorMessage).toHaveBeenCalledWith({
          title: 'Une erreur est survenue lors de la mise à jour du profil.',
          description: 'Une erreur est survenue. Veuillez réessayer ultérieurement.',
        })
      })
    })

    describe('when the confirmation modal emits confirm', () => {
      it('then it should call hideModal and onClose', async () => {
        const modal = wrapper.findComponent({ name: 'UpdateExitConfirmationModal' })
        await modal.find('.confirm-button').trigger('click')

        expect(props.onClose).toHaveBeenCalled()
      })
    })
  })
})
