import type { UpdateProfileDrawerForm } from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/types'
import type { SetupContext } from 'vue'
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import UpdateProfileDrawer from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import { useUpdateProfileForm } from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/use-update-profile-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { mockAddErrorMessage, mockAddSuccessMessage } from 'tests/mocks'
import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'

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

vi.mock('@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/use-update-profile-form', () => ({
  useUpdateProfileForm: vi.fn(),
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
    firstname: 'Jeanne',
    lastname: 'Moulin',
    email: 'j.moulin@example.com',
    profilePicture: profile_picture_placeholder,
    coverPicture: profile_banner_placeholder,
    bio: 'Je suis étudiante en chimie et écologie. Passionnée par l’innovation durable, je souhaite utiliser la science pour protéger l’environnement et bâtir un avenir plus respectueux de la planète.'
  }

  const mockOnClose = vi.fn()

  const defaultProps = {
    studentSummary,
    show: true,
    onClose: mockOnClose
  }

  const fakeField = (initialValues: UpdateProfileDrawerForm) => {
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

  const store: Record<string, { value: string }> = {
    lastname: ref(studentSummary.lastname),
    firstname: ref(studentSummary.firstname),
    email: ref(studentSummary.email),
    bio: ref(studentSummary.bio),
    coverPicture: ref(studentSummary.coverPicture),
    profilePicture: ref(studentSummary.profilePicture),
  }

  const mockedResetForm = vi.fn()

  const mockedForm = {
    Field: fakeField(studentSummary),
    handleSubmit: vi.fn(),
    setFieldValue: vi.fn(),
    store,
    state: {
      isSubmitting: false,
    },
    resetForm: mockedResetForm,
  }

  const studentSummaryWithMissingFields = {
    firstname: '',
    lastname: '',
    email: '',
    bio: '',
    profilePicture: '',
    coverPicture: ''
  }

  const storeWithMissingFields: Record<string, { value: string }> = {
    lastname: ref(studentSummaryWithMissingFields.lastname),
    firstname: ref(studentSummaryWithMissingFields.firstname),
    email: ref(studentSummaryWithMissingFields.email),
    bio: ref(studentSummaryWithMissingFields.bio),
    coverPicture: ref(studentSummaryWithMissingFields.coverPicture),
    profilePicture: ref(studentSummaryWithMissingFields.profilePicture),
  }

  const mockedFormWithEmptyFields = {
    Field: fakeField(studentSummaryWithMissingFields),
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

    mockedUseUpdateProfileForm.mockImplementation(() => ({
      form: mockedForm as any,
      isPending: computed(() => false),
      isModified: computed(() => false),
      resetForm: mockedResetForm,
      onCoverPictureUpdate: vi.fn(),
      onProfilePictureUpdate: vi.fn(),
      onUpdateProfileCoverSuccess: vi.fn(),
      onUpdateProfilePhotoSuccess: vi.fn(),
    }))

    wrapper = mount(UpdateProfileDrawer, {
      props: defaultProps,
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
        expect(avInputs[2].attributes('value')).toBe(studentSummary.email)
        expect(avInputs[2].attributes('type')).toBe('email')
        expect(avInputs[2].attributes('data-textarea')).toBe('false')
        expect(avInputs[3].attributes('value')).toBe(studentSummary.bio)
        expect(avInputs[3].attributes('data-textarea')).toBe('true')
      })

      it('then it should render the exit button', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        const exitButton = avButtons.find(button => button.props('label') === 'Quitter')
        expect(exitButton?.exists()).toBe(true)
      })

      it('then it should render the save button in disabled state', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        const saveButton = avButtons.find(button => button.props('label') === 'Enregistrer')
        expect(saveButton?.exists()).toBe(true)
        expect(saveButton?.props('disabled')).toBe(true)
        expect(saveButton?.attributes('type')).toBe('submit')
      })
    })

    describe('when studentSummary fields are empty', () => {
      beforeEach(() => {
        vi.clearAllMocks()

        mockedUseUpdateProfileForm.mockImplementation(() => ({
          form: mockedFormWithEmptyFields as any,
          isPending: computed(() => true),
          isModified: computed(() => false),
          resetForm: mockedResetForm,
          onCoverPictureUpdate: vi.fn(),
          onProfilePictureUpdate: vi.fn(),
          onUpdateProfileCoverSuccess: vi.fn(),
          onUpdateProfilePhotoSuccess: vi.fn(),
        }))

        wrapper = mount(UpdateProfileDrawer, {
          props: { ...defaultProps, studentSummary: studentSummaryWithMissingFields },
          global: { stubs, plugins: [createPinia()] }
        })
      })

      it('then it should render empty inputs', () => {
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

    describe('when the update profile form composable is not pending', () => {
      it('then the buttons should not be in loading state', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        expect(avButtons).toHaveLength(2)
        avButtons.forEach((avButton) => {
          expect(avButton.props('isLoading')).toBe(false)
        })
      })
    })

    describe('when the update profile form composable is pending', () => {
      beforeEach(() => {
        mockedUseUpdateProfileForm.mockImplementation(() => ({
          form: mockedForm as any,
          isPending: computed(() => true),
          isModified: computed(() => false),
          resetForm: mockedResetForm,
          onCoverPictureUpdate: vi.fn(),
          onProfilePictureUpdate: vi.fn(),
          onUpdateProfileCoverSuccess: vi.fn(),
          onUpdateProfilePhotoSuccess: vi.fn(),
        }))

        wrapper = mount(UpdateProfileDrawer, {
          props: defaultProps,
          global: {
            stubs,
            plugins: [createPinia()],
          },
        })
      })

      it('then the buttons should be in loading state', () => {
        const avButtons = wrapper.findAllComponents({ name: 'AvButton' })
        expect(avButtons).toHaveLength(2)
        avButtons.forEach((avButton) => {
          expect(avButton.props('isLoading')).toBe(true)
        })
      })
    })

    describe('when inputs are modified', () => {
      beforeEach(() => {
        mockedUseUpdateProfileForm.mockImplementation(() => ({
          form: mockedForm as any,
          isPending: computed(() => false),
          isModified: computed(() => true),
          resetForm: mockedResetForm,
          onCoverPictureUpdate: vi.fn(),
          onProfilePictureUpdate: vi.fn(),
          onUpdateProfileCoverSuccess: vi.fn(),
          onUpdateProfilePhotoSuccess: vi.fn(),
        }))
      })

      it('then they should have their new value set', async () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(avInputs).toHaveLength(4)
        expect(avInputs[0].element.value).toBe(studentSummary.lastname)
        expect(avInputs[1].element.value).toBe(studentSummary.firstname)
        expect(avInputs[2].element.value).toBe(studentSummary.email)
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

      it('then they should reset if the drawer is hidden then shown again', async () => {
        const avInputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(avInputs).toHaveLength(4)
        expect(avInputs[0].element.value).toBe(studentSummary.lastname)
        await avInputs[0].setValue('This is a new lastname')

        await wrapper.setProps({ show: false })
        await wrapper.vm.$nextTick()
        await wrapper.setProps({ show: true })
        await wrapper.vm.$nextTick()

        expect(mockedResetForm).toHaveBeenCalled()
      })
    })

    describe('when the confirmation modal emits confirm', () => {
      it('then it should call hideModal and onClose', async () => {
        const modal = wrapper.findComponent({ name: 'UpdateExitConfirmationModal' })
        await modal.find('.confirm-button').trigger('click')

        expect(defaultProps.onClose).toHaveBeenCalled()
      })
    })

    describe('when submitting the form', () => {
      it('then it should call form.handleSubmit', async () => {
        const formElement = wrapper.find('form#profile-form')
        await formElement.trigger('submit.prevent.stop')
        expect(mockedForm.handleSubmit).toHaveBeenCalled()
      })
    })

    describe('when the update is successful', () => {
      let useUpdateProfileFormReturn: any

      beforeEach(() => {
        mockedUseUpdateProfileForm.mockImplementation((_data, onSuccess: () => void) => {
          const obj = {
            form: mockedForm as any,
            isPending: computed(() => false),
            isModified: computed(() => true),
            resetForm: mockedResetForm,
            onCoverPictureUpdate: vi.fn(),
            onProfilePictureUpdate: vi.fn(),
            onUpdateProfileCoverSuccess: vi.fn(),
            onUpdateProfilePhotoSuccess: vi.fn(),
            simulateSuccess: () => {
              onSuccess()
            }
          }
          useUpdateProfileFormReturn = obj
          return obj
        })

        wrapper = mount(UpdateProfileDrawer, {
          props: defaultProps,
          global: {
            stubs,
            plugins: [createPinia()],
          },
        })

        useUpdateProfileFormReturn.simulateSuccess()
      })

      it('then it should call addSuccessMessage and onClose', () => {
        expect(mockAddSuccessMessage).toHaveBeenCalled()
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })
})
