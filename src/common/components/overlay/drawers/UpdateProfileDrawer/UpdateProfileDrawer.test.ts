import type { SetupContext } from 'vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { EFileType, type EUserCategory, type FileDTO, type ProfileOverviewDTO } from '@/api/avenir-esr'
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { ImageUploadStub } from '@/common/components/ImageUpload/ImageUpload.stub'
import UpdateProfileDrawer from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import { useUpdateProfileForm } from '@/common/components/overlay/drawers/UpdateProfileDrawer/use-update-profile-form'
import {
  AvAccordionsGroupStub,
  AvAccordionStub,
  AvCancelConfirmButtonsStub,
  AvDrawerStub,
  AvIconTextStub,
  AvInputStub,
  BddTest
} from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
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

const INVALID_FORM_TOOLTIP = 'Le formulaire n\'est pas valide'

BddTest().given('given an update profile drawer', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateProfileDrawer>>

  const stubs = {
    AvAccordion: AvAccordionStub,
    AvAccordionsGroup: AvAccordionsGroupStub,
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
    AvDrawer: AvDrawerStub,
    AvInput: AvInputStub,
    AvIconText: AvIconTextStub,
    ImageUpload: ImageUploadStub,
    ConfirmationModal: ConfirmationModalStub
  }

  const userSummary = {
    firstname: 'Jeanne',
    lastname: 'Moulin',
    id: 'user-id',
    email: 'j.moulin@example.com',
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

  const mockUpdateProfileForm = (overrides?: Partial<ReturnType<typeof useUpdateProfileForm>>) =>
    mockedUseUpdateProfileForm.mockImplementation(() => createUseUpdateProfileFormMock(overrides))

  const mountDrawer = (props: Partial<typeof defaultProps> = {}) => mountComponent(UpdateProfileDrawer, {
    props: { ...defaultProps, ...props },
    global: { stubs }
  })

  const getAccordionsGroup = () => wrapper.findComponent(AvAccordionsGroupStub)
  const getAvInputs = () => wrapper.findAllComponents(AvInputStub)
  const getAvDrawer = () => wrapper.findComponent(AvDrawerStub)
  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)
  const getCancelButton = () => getCancelConfirmButtons().find('button.cancel')
  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)
  const getImageUploads = () => wrapper.findAllComponents(ImageUploadStub)
  const getProfileForm = () => wrapper.find('form#profile-form')

  beforeEach(() => {
    vi.clearAllMocks()
    mockCanLeave.mockResolvedValue(true)

    vi.mocked(useRoute).mockReturnValue({
      path: '/student/home'
    } as RouteLocationNormalizedLoadedGeneric)

    mockUpdateProfileForm()
    wrapper = mountDrawer()
  })

  BddTest().and('initially shown', () => {
    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the accordion group', () => {
        expect(getAccordionsGroup().exists()).toBe(true)
      })

      BddTest().then('it should render the different inputs', () => {
        const avInputs = getAvInputs()
        expect(avInputs).toHaveLength(4)
        expect(avInputs[0].find('input').attributes('value')).toBe(userSummary.lastname)
        expect(avInputs[0].props('isTextarea')).toBe(false)
        expect(avInputs[1].find('input').attributes('value')).toBe(userSummary.firstname)
        expect(avInputs[2].find('input').attributes('value')).toBe(userSummary.email)
        expect(avInputs[2].props('type')).toBe('email')
        expect(avInputs[2].props('isTextarea')).toBe(false)
        expect(avInputs[3].find('input').attributes('value')).toBe(userSummary.bio)
        expect(avInputs[3].props('isTextarea')).toBe(true)
      })

      BddTest().then('it should render the exit button', () => {
        expect(getCancelConfirmButtons().props('cancelLabel')).toBe('Quitter')
      })

      BddTest().then('it should render the save button in disabled state', () => {
        expect(getCancelConfirmButtons().props('confirmLabel')).toBe('Enregistrer')
        expect(getCancelConfirmButtons().props('confirmDisabled')).toBe(true)
      })

      BddTest().then('the buttons should be linked to the profile form', () => {
        expect(getCancelConfirmButtons().props('form')).toBe('profile-form')
      })
    })

    BddTest().when('userSummary fields are empty', () => {
      beforeEach(() => {
        mockUpdateProfileForm({ form: mockedFormWithEmptyFields as any })
        wrapper = mountDrawer(userSummaryWithMissingFields)
      })

      BddTest().then('it should render empty inputs', () => {
        const avInputs = getAvInputs()
        expect(avInputs).toHaveLength(4)
        avInputs.forEach((avInput) => {
          expect(avInput.find('input').attributes('value')).toBe('')
          expect(avInput.find('input').element.value).toBe('')
        })
      })
    })

    BddTest().when('the update profile form composable is not pending', () => {
      BddTest().then('the buttons should not be in loading state', () => {
        expect(getCancelConfirmButtons().props('cancelIsLoading')).toBe(false)
        expect(getCancelConfirmButtons().props('confirmIsLoading')).toBe(false)
      })
    })

    BddTest().when('the update profile form composable is pending', () => {
      beforeEach(() => {
        mockUpdateProfileForm({ isPending: computed(() => true) })
        wrapper = mountDrawer()
      })

      BddTest().then('the buttons should be in loading state', () => {
        expect(getCancelConfirmButtons().props('cancelIsLoading')).toBe(true)
        expect(getCancelConfirmButtons().props('confirmIsLoading')).toBe(true)
      })
    })

    BddTest().when('the form is modified but invalid', () => {
      beforeEach(() => {
        mockUpdateProfileForm({
          isModified: computed(() => true),
          isFormValid: computed(() => false),
        })
        wrapper = mountDrawer()
      })

      BddTest().then('the save button should be disabled', () => {
        expect(getCancelConfirmButtons().props('confirmDisabled')).toBe(true)
      })

      BddTest().then('the save button should display the invalid form tooltip', () => {
        expect(getCancelConfirmButtons().props('confirmDisabledTooltip')).toBe(INVALID_FORM_TOOLTIP)
      })
    })

    BddTest().when('the form is valid but not modified', () => {
      beforeEach(() => {
        mockUpdateProfileForm({
          isModified: computed(() => false),
          isFormValid: computed(() => true),
        })
        wrapper = mountDrawer()
      })

      BddTest().then('the save button should be disabled', () => {
        expect(getCancelConfirmButtons().props('confirmDisabled')).toBe(true)
      })

      BddTest().then('the save button should not display any tooltip', () => {
        expect(getCancelConfirmButtons().props('confirmDisabledTooltip')).toBeUndefined()
      })
    })

    BddTest().when('the form is modified and valid', () => {
      beforeEach(() => {
        mockUpdateProfileForm({
          isModified: computed(() => true),
          isFormValid: computed(() => true),
        })
        wrapper = mountDrawer()
      })

      BddTest().then('the save button should be enabled', () => {
        expect(getCancelConfirmButtons().props('confirmDisabled')).toBe(false)
      })

      BddTest().then('the save button should not display any tooltip', () => {
        expect(getCancelConfirmButtons().props('confirmDisabledTooltip')).toBeUndefined()
      })
    })

    BddTest().when('inputs are modified', () => {
      beforeEach(() => {
        mockUpdateProfileForm({ isModified: computed(() => true) })
        wrapper = mountDrawer()
      })

      BddTest().then('they should have their new value set', async () => {
        const avInputs = getAvInputs()
        expect(avInputs).toHaveLength(4)
        expect(avInputs[2].find('input').element.value).toBe(userSummary.email)
        expect(avInputs[3].find('input').element.value).toBe(userSummary.bio)

        await avInputs[2].setValue('supertest@example.com')
        expect(avInputs[2].find('input').element.value).toBe('supertest@example.com')

        await avInputs[3].setValue('This is a new bio')
        expect(avInputs[3].find('input').element.value).toBe('This is a new bio')
      })

      BddTest().then('they should reset if the drawer is hidden then shown again', async () => {
        await wrapper.setProps({ show: false })
        await wrapper.setProps({ show: true })

        expect(mockedResetForm).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().when('escape is pressed on drawer', () => {
      BddTest().and('canLeave is true', () => {
        beforeEach(async () => {
          getAvDrawer().vm.$emit('escape-pressed')
          await flushPromises()
        })

        BddTest().then('it should call onClose', () => {
          expect(mockOnClose).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().and('canLeave is false', () => {
        beforeEach(async () => {
          mockCanLeave.mockResolvedValue(false)
          mockUpdateProfileForm({ isModified: computed(() => true) })
          wrapper = mountDrawer()

          getAvDrawer().vm.$emit('escape-pressed')
          await flushPromises()
        })

        BddTest().then('it should not call onClose', () => {
          expect(mockOnClose).not.toHaveBeenCalled()
        })
      })
    })

    BddTest().when('cancel button is clicked', () => {
      BddTest().and('canLeave is true', () => {
        beforeEach(async () => {
          await getCancelButton().trigger('click')
          await flushPromises()
        })

        BddTest().then('it should call onClose', () => {
          expect(mockOnClose).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().and('canLeave is false', () => {
        beforeEach(async () => {
          mockCanLeave.mockResolvedValue(false)
          mockUpdateProfileForm({ isModified: computed(() => true) })
          wrapper = mountDrawer()

          await getCancelButton().trigger('click')
          await flushPromises()
        })

        BddTest().then('it should not call onClose', () => {
          expect(mockOnClose).not.toHaveBeenCalled()
        })

        BddTest().and('confirming the modal', () => {
          beforeEach(async () => {
            getConfirmationModal().vm.$emit('confirm')
            await flushPromises()
          })

          BddTest().then('it should call guard confirm', () => {
            expect(mockConfirm).toHaveBeenCalledTimes(1)
          })
        })

        BddTest().and('closing the modal', () => {
          beforeEach(async () => {
            getConfirmationModal().vm.$emit('close')
            await flushPromises()
          })

          BddTest().then('it should call guard cancel', () => {
            expect(mockCancel).toHaveBeenCalledTimes(1)
          })
        })
      })
    })

    BddTest().when('submitting the form', () => {
      beforeEach(async () => {
        await getProfileForm().trigger('submit')
      })

      BddTest().then('it should call form.handleSubmit', () => {
        expect(mockedForm.handleSubmit).toHaveBeenCalledTimes(1)
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

        wrapper = mountDrawer()

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
        wrapper = mountDrawer(userSummaryWithCoverPhotoFileId)
      })

      BddTest().then('it should render with cover photo', () => {
        expect(getImageUploads()).toHaveLength(2)
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
        wrapper = mountDrawer(userSummaryWithProfilePhotoFileId)
      })

      BddTest().then('it should render with profile photo', () => {
        expect(getImageUploads()).toHaveLength(2)
      })
    })
  })
})
