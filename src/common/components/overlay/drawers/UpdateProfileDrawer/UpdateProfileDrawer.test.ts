import type { VueWrapper } from '@vue/test-utils'
import type { SetupContext } from 'vue'
import { EFileType, type EUserCategory, type FileDTO, type ProfileOverviewDTO } from '@/api/avenir-esr'
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import UpdateProfileDrawer from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import { useUpdateProfileForm } from '@/common/components/overlay/drawers/UpdateProfileDrawer/use-update-profile-form'
import { AvButtonStub, AvDrawerStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mockAddErrorMessage, mockAddSuccessMessage } from 'tests/mocks'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, type MockedFunction, vi } from 'vitest'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

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

vi.mock('./use-update-profile-form', () => ({
  useUpdateProfileForm: vi.fn(),
}))

const mockCanLeave = vi.fn<() => Promise<boolean>>()
const mockConfirm = vi.fn()
const mockCancel = vi.fn()

vi.mock('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard')
  >()
  return {
    ...actual,
    useUnsavedChangesGuard: () => ({
      canLeave: mockCanLeave,
      confirm: mockConfirm,
      cancel: mockCancel
    })
  }
})

BddTest().given('given an update profile drawer', () => {
  let wrapper: VueWrapper

  const stubs = {
    AvAccordion: {
      name: 'AvAccordion',
      props: ['title', 'icon'],
      template: '<div class="av-accordion"><slot /></div>'
    },
    AvAccordionsGroup: {
      name: 'AvAccordionsGroup',
      props: ['activeAccordion'],
      emits: ['update:activeAccordion'],
      template: '<div class="av-accordion-group"><slot /></div>'
    },
    AvButton: AvButtonStub,
    AvDrawer: AvDrawerStub,
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
    AvIconText: {
      name: 'AvIconText',
      props: ['icon', 'text', 'typographyClass'],
      template: '<div class="av-icon-text">{{ text }}</div>'
    },
    ImageUpload: {
      name: 'ImageUpload',
      props: ['modelValue'],
      emits: ['update:modelValue'],
      template: '<div class="image-upload" />'
    },
    ConfirmationModal: ConfirmationModalStub
  }

  const userSummary = {
    firstname: 'Jeanne',
    lastname: 'Moulin',
    id: 'user-id',
    email: 'j.moulin@example.com',
    hasUnseenNotification: false,
    profilePicture: {
      id: 'profile-picture-id',
      fileName: 'profile-picture.png',
      url: profile_picture_placeholder,
      fileSize: 1000,
      fileType: EFileType.PNG,
      version: 1,
      uploadedAt: '2025-06-13T08:42:17',
    },
    coverPicture: {
      id: 'cover-picture-id',
      fileName: 'cover-picture.png',
      url: profile_banner_placeholder,
      fileSize: 1000,
      fileType: EFileType.PNG,
      version: 1,
      uploadedAt: '2025-06-13T08:42:17',
    },
    bio: 'Je suis étudiante en chimie et écologie. Passionnée par l\'innovation durable, je souhaite utiliser la science pour protéger l\'environnement et bâtir un avenir plus respectueux de la planète.'
  }

  const mockOnClose = vi.fn()

  const defaultProps = {
    ...userSummary,
    show: true,
    onClose: mockOnClose
  }

  const fakeField = (initialValues: ProfileOverviewDTO) => {
    return {
      props: ['name'],
      setup (props: Record<string, string>, context: SetupContext) {
        const { slots } = context

        const store: Record<string, { value: string }> = {
          lastname: ref(initialValues.lastname),
          firstname: ref(initialValues.firstname),
          email: ref(initialValues.email),
          bio: ref(initialValues.bio),
        }

        const value = computed({
          get: () => store[props.name]?.value ?? '',
          set: (newValue) => {
            if (store[props.name]) {
              store[props.name].value = newValue
            }
          }
        })

        const state = reactive({
          meta: { errors: [] }
        })

        Object.defineProperty(state, 'value', {
          get () {
            return value.value
          },
          set (newValue) {
            value.value = newValue
          }
        })

        function handleChange (newValue: string) {
          value.value = newValue
        }

        return () => slots.default?.({
          field: {
            state,
            handleChange
          }
        })
      }
    }
  }

  const store: Record<string, { value: string | FileDTO }> = {
    lastname: ref(userSummary.lastname),
    firstname: ref(userSummary.firstname),
    email: ref(userSummary.email),
    bio: ref(userSummary.bio),
    coverPicture: ref(userSummary.coverPicture),
    profilePicture: ref(userSummary.profilePicture),
  }

  const mockedResetForm = vi.fn()

  const mockedForm = {
    Field: fakeField(userSummary),
    handleSubmit: vi.fn(),
    setFieldValue: vi.fn(),
    store,
    state: {
      isSubmitting: false,
    },
    resetForm: mockedResetForm,
  }

  function createUseUpdateProfileFormMock (overrides?: Partial<ReturnType<typeof useUpdateProfileForm>>) {
    return {
      form: mockedForm as any,
      isPending: computed(() => false),
      isModified: computed(() => false),
      isFormValid: computed(() => false),
      hasIdentityErrors: computed(() => false),
      hasPicturesErrors: computed(() => false),
      hasCoverPictureErrors: computed(() => false),
      hasProfilePictureErrors: computed(() => false),
      resetForm: mockedResetForm,
      onCoverPictureUpdate: vi.fn(),
      onProfilePictureUpdate: vi.fn(),
      onUpdateProfileCoverSuccess: vi.fn(),
      onUpdateProfilePhotoSuccess: vi.fn(),
      coverPictureFile: ref<File | null>(null),
      profilePictureFile: ref<File | null>(null),
      ...overrides,
    }
  }

  const userSummaryWithMissingFields = {
    id: 'user-id',
    firstname: '',
    lastname: '',
    email: '',
    hasUnseenNotification: false,
    bio: '',
    profilePicture: { id: '', fileName: '', url: '', fileSize: 1000, fileType: EFileType.PNG, version: 1, uploadedAt: '2025-06-13T08:42:17' },
    coverPicture: { id: '', fileName: '', url: '', fileSize: 1000, fileType: EFileType.PNG, version: 1, uploadedAt: '2025-06-13T08:42:17' }
  }

  const storeWithMissingFields: Record<string, { value: string | FileDTO }> = {
    lastname: ref(userSummaryWithMissingFields.lastname),
    firstname: ref(userSummaryWithMissingFields.firstname),
    email: ref(userSummaryWithMissingFields.email),
    bio: ref(userSummaryWithMissingFields.bio),
    coverPicture: ref(userSummaryWithMissingFields.coverPicture),
    profilePicture: ref(userSummaryWithMissingFields.profilePicture),
  }

  const mockedFormWithEmptyFields = {
    Field: fakeField(userSummaryWithMissingFields),
    handleSubmit: vi.fn(),
    setFieldValue: vi.fn(),
    store: storeWithMissingFields,
    state: {
      isSubmitting: false,
    },
    resetForm: vi.fn(),
  }

  const mockedUseUpdateProfileForm: MockedFunction<typeof useUpdateProfileForm> = vi.mocked(useUpdateProfileForm)

  beforeEach(() => {
    vi.clearAllMocks()
    mockCanLeave.mockResolvedValue(true)

    vi.mocked(useRoute).mockReturnValue({
      path: '/student/home'
    } as any)

    mockedUseUpdateProfileForm.mockImplementation(() => createUseUpdateProfileFormMock())

    wrapper = mountComponent(UpdateProfileDrawer, {
      props: defaultProps,
      global: {
        stubs
      }
    })
  })

  BddTest().and('initially shown', () => {
    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the accordion group', () => {
        const accordionGroup = wrapper.findComponent({ name: 'AvAccordionsGroup' })
        expect(accordionGroup.exists()).toBe(true)
      })

      BddTest().then('it should render the different inputs', () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(avInputs).toHaveLength(4)
        expect(avInputs[0].attributes('value')).toBe(userSummary.lastname)
        expect(avInputs[0].attributes('data-textarea')).toBe('false')
        expect(avInputs[1].attributes('value')).toBe(userSummary.firstname)
        expect(avInputs[2].attributes('value')).toBe(userSummary.email)
        expect(avInputs[2].attributes('type')).toBe('email')
        expect(avInputs[2].attributes('data-textarea')).toBe('false')
        expect(avInputs[3].attributes('value')).toBe(userSummary.bio)
        expect(avInputs[3].attributes('data-textarea')).toBe('true')
      })

      BddTest().then('it should render the exit button', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        const exitButton = avButtons.find(button => button.props('label') === 'Quitter')
        expect(exitButton?.exists()).toBe(true)
      })

      BddTest().then('it should render the save button in disabled state', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        const saveButton = avButtons.find(button => button.props('label') === 'Enregistrer')
        expect(saveButton?.exists()).toBe(true)
        expect(saveButton?.props('disabled')).toBe(true)
      })
    })

    BddTest().when('userSummary fields are empty', () => {
      beforeEach(() => {
        vi.clearAllMocks()

        mockedUseUpdateProfileForm.mockImplementation(() => createUseUpdateProfileFormMock({
          form: mockedFormWithEmptyFields as any,
          isPending: computed(() => true),
        }))

        wrapper = mountComponent(UpdateProfileDrawer, {
          props: { ...defaultProps, ...userSummaryWithMissingFields },
          global: {
            stubs
          }
        })
      })

      BddTest().then('it should render empty inputs', () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(avInputs[0].attributes('value')).toBe('')
        expect(avInputs[1].attributes('value')).toBe('')
        expect(avInputs[2].attributes('value')).toBe('')
        expect(avInputs[3].attributes('value')).toBe('')
        expect(avInputs[0].element.value).toBe('')
        expect(avInputs[1].element.value).toBe('')
        expect(avInputs[2].element.value).toBe('')
        expect(avInputs[3].element.value).toBe('')
      })
    })

    BddTest().when('the update profile form composable is not pending', () => {
      BddTest().then('the buttons should not be in loading state', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        expect(avButtons).toHaveLength(2)
        avButtons.forEach((avButton) => {
          expect(avButton.props('isLoading')).toBe(false)
        })
      })
    })

    BddTest().when('the update profile form composable is pending', () => {
      beforeEach(() => {
        mockedUseUpdateProfileForm.mockImplementation(() => createUseUpdateProfileFormMock({
          isPending: computed(() => true),
        }))

        wrapper = mountComponent(UpdateProfileDrawer, {
          props: defaultProps,
          global: {
            stubs
          }
        })
      })

      BddTest().then('the buttons should be in loading state', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        expect(avButtons).toHaveLength(2)
        avButtons.forEach((avButton) => {
          expect(avButton.props('isLoading')).toBe(true)
        })
      })
    })

    BddTest().when('inputs are modified', () => {
      beforeEach(() => {
        mockedUseUpdateProfileForm.mockImplementation(() => createUseUpdateProfileFormMock({
          isModified: computed(() => true),
        }))
      })

      BddTest().then('they should have their new value set', async () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(avInputs).toHaveLength(4)
        expect(avInputs[2].element.value).toBe(userSummary.email)
        expect(avInputs[3].element.value).toBe(userSummary.bio)

        await avInputs[2].setValue('supertest@example.com')
        expect(avInputs[2].element.value).toBe('supertest@example.com')

        await avInputs[3].setValue('This is a new bio')
        expect(avInputs[3].element.value).toBe('This is a new bio')
      })

      BddTest().then('they should reset if the drawer is hidden then shown again', async () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(avInputs).toHaveLength(4)

        await wrapper.setProps({ show: false })
        await wrapper.vm.$nextTick()
        await wrapper.setProps({ show: true })
        await wrapper.vm.$nextTick()

        expect(mockedResetForm).toHaveBeenCalled()
      })
    })

    BddTest().when('escape is pressed on drawer', () => {
      BddTest().and('canLeave is true', () => {
        beforeEach(async () => {
          const drawer = wrapper.findComponent({ name: 'AvDrawer' })
          await drawer.vm.$emit('escape-pressed')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call onClose', () => {
          expect(mockOnClose).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().and('canLeave is false', () => {
        beforeEach(async () => {
          mockCanLeave.mockResolvedValue(false)
          mockedUseUpdateProfileForm.mockImplementation(() => createUseUpdateProfileFormMock({
            isModified: computed(() => true),
          }))
          wrapper = mountComponent(UpdateProfileDrawer, {
            props: defaultProps,
            global: { stubs }
          })
          const drawer = wrapper.findComponent({ name: 'AvDrawer' })
          await drawer.vm.$emit('escape-pressed')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should not call onClose', () => {
          expect(mockOnClose).not.toHaveBeenCalled()
        })
      })
    })

    BddTest().when('cancel button is clicked', () => {
      BddTest().and('canLeave is true', () => {
        beforeEach(async () => {
          const cancelButton = wrapper.findAllComponents({ name: 'AvButton' })
            .find(b => b.props('label') === 'Quitter')
          await cancelButton?.trigger('click')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call onClose', () => {
          expect(mockOnClose).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().and('canLeave is false', () => {
        beforeEach(async () => {
          mockCanLeave.mockResolvedValue(false)
          mockedUseUpdateProfileForm.mockImplementation(() => createUseUpdateProfileFormMock({
            isModified: computed(() => true),
          }))
          wrapper = mountComponent(UpdateProfileDrawer, {
            props: defaultProps,
            global: { stubs }
          })
          const cancelButton = wrapper.findAllComponents({ name: 'AvButton' })
            .find(b => b.props('label') === 'Quitter')
          await cancelButton?.trigger('click')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should not call onClose', () => {
          expect(mockOnClose).not.toHaveBeenCalled()
        })

        BddTest().and('confirming the modal', () => {
          beforeEach(async () => {
            const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
            await confirmationModal.vm.$emit('confirm')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should call guard confirm', () => {
            expect(mockConfirm).toHaveBeenCalledTimes(1)
          })
        })

        BddTest().and('closing the modal', () => {
          beforeEach(async () => {
            const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
            await confirmationModal.vm.$emit('close')
            await wrapper.vm.$nextTick()
          })

          BddTest().then('it should call guard cancel', () => {
            expect(mockCancel).toHaveBeenCalledTimes(1)
          })
        })
      })
    })

    BddTest().when('submitting the form', () => {
      BddTest().then('it should call form.handleSubmit', async () => {
        const formElement = wrapper.find('form#profile-form')
        await formElement.trigger('submit.prevent.stop')
        expect(mockedForm.handleSubmit).toHaveBeenCalled()
      })
    })

    BddTest().when('the update is successful', () => {
      let useUpdateProfileFormReturn: any

      beforeEach(() => {
        mockedUseUpdateProfileForm.mockImplementation((_data, _profile: EUserCategory, onSuccess: () => void) => {
          const obj = {
            ...createUseUpdateProfileFormMock({
              isModified: computed(() => true),
            }),
            simulateSuccess: () => {
              onSuccess()
            }
          }
          useUpdateProfileFormReturn = obj
          return obj
        })

        wrapper = mountComponent(UpdateProfileDrawer, {
          props: defaultProps,
          global: {
            stubs
          }
        })

        useUpdateProfileFormReturn.simulateSuccess()
      })

      BddTest().then('it should call addSuccessMessage and onClose', () => {
        expect(mockAddSuccessMessage).toHaveBeenCalled()
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    BddTest().when('cover photo has fileId', () => {
      const userSummaryWithCoverPhotoFileId = {
        ...userSummary,
        coverPicture: {
          id: 'cover-file-id',
          fileName: 'cover.jpg',
          url: 'https://example.com/cover.jpg',
          fileSize: 1000,
          fileType: EFileType.PNG,
          version: 1,
          uploadedAt: '2025-06-13T08:42:17',
        }
      }

      beforeEach(() => {
        wrapper = mountComponent(UpdateProfileDrawer, {
          props: {
            ...defaultProps,
            ...userSummaryWithCoverPhotoFileId
          },
          global: {
            stubs
          }
        })
      })

      BddTest().then('it should render with cover photo', () => {
        const imageUploadComponents = wrapper.findAllComponents({ name: 'ImageUpload' })
        expect(imageUploadComponents).toHaveLength(2)
      })
    })

    BddTest().when('profile photo has fileId', () => {
      const userSummaryWithProfilePhotoFileId = {
        ...userSummary,
        profilePicture: {
          id: 'profile-file-id',
          fileName: 'profile.jpg',
          url: 'https://example.com/profile.jpg',
          fileSize: 1000,
          fileType: EFileType.PNG,
          version: 1,
          uploadedAt: '2025-06-13T08:42:17'
        }
      }

      beforeEach(() => {
        wrapper = mountComponent(UpdateProfileDrawer, {
          props: {
            ...defaultProps,
            ...userSummaryWithProfilePhotoFileId
          },
          global: {
            stubs
          }
        })
      })

      BddTest().then('it should render with profile photo', () => {
        const imageUploadComponents = wrapper.findAllComponents({ name: 'ImageUpload' })
        expect(imageUploadComponents).toHaveLength(2)
      })
    })
  })
})
