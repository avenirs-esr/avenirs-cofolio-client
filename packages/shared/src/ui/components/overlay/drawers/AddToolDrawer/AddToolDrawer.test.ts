import type { AddToolDrawerProps } from '#shared/ui/components/overlay/drawers/AddToolDrawer/AddToolDrawer.vue'
import type { VueWrapper } from '@vue/test-utils'
import { CREATED_TOOL_ID } from '#shared/__mocks__/fixtures/tools.fixtures'
import { server } from '#shared/__mocks__/msw/server'
import { getCreateLocalToolUrl, getCreateNationalToolUrl, getUploadNationalToolBannerUrl } from '#shared/api/avenir-esr'
import { FormCancelConfirmButtonsStub } from '#shared/ui/components/interactions/buttons/FormCancelConfirmButtons/FormCancelConfirmButtons.stub'
import { ImageUploadStub } from '#shared/ui/components/interactions/files/ImageUpload/ImageUpload.stub'
import { InputStub } from '#shared/ui/components/interactions/inputs/Input/Input.stub'
import { ToolDescriptionTextareaStub } from '#shared/ui/components/interactions/inputs/ToolDescriptionTextarea/ToolDescriptionTextarea.stub'
import { ToolNameInputStub } from '#shared/ui/components/interactions/inputs/ToolNameInput/ToolNameInput.stub'
import AddToolDrawer from '#shared/ui/components/overlay/drawers/AddToolDrawer/AddToolDrawer.vue'
import { DrawerStub } from '#shared/ui/components/overlay/drawers/Drawer/Drawer.stub'
import { ConfirmationModalStub } from '#shared/ui/components/overlay/modals/ConfirmationModal/ConfirmationModal.stub'
import { BANNER_RATIO } from '#shared/utils/image.config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const { mockAddErrorMessage, mockAddSuccessMessage, mockCanLeave, mockConfirm, mockCancel } = vi.hoisted(() => ({
  mockAddErrorMessage: vi.fn(),
  mockAddSuccessMessage: vi.fn(),
  mockCanLeave: vi.fn<() => Promise<boolean>>(),
  mockConfirm: vi.fn(),
  mockCancel: vi.fn(),
}))

vi.mock('#shared/stores/toaster/toaster', () => ({
  useToasterStore: () => ({
    addErrorMessage: mockAddErrorMessage,
    addSuccessMessage: mockAddSuccessMessage,
  }),
}))

vi.mock('#shared/composables/use-unsaved-changes-guard/use-unsaved-changes-guard', () => ({
  useUnsavedChangesGuard: () => ({
    canLeave: mockCanLeave,
    confirm: mockConfirm,
    cancel: mockCancel,
  }),
}))

const REQUIRED_ERROR = 'Ce champ est requis.'
const BANNER = new File(['banner'], 'banner.png', { type: 'image/png' })

const requestedPaths: string[] = []

afterEach(() => {
  server.events.removeAllListeners()
})

BddTest().given('an add tool drawer', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddToolDrawer>>

  const stubs = {
    Drawer: DrawerStub,
    Input: InputStub,
    ToolNameInput: ToolNameInputStub,
    ToolDescriptionTextarea: ToolDescriptionTextareaStub,
    ImageUpload: ImageUploadStub,
    FormCancelConfirmButtons: FormCancelConfirmButtonsStub,
    ConfirmationModal: ConfirmationModalStub,
  }

  const mountWith = (props: Partial<AddToolDrawerProps> = {}) => {
    wrapper = mountComponent(AddToolDrawer, {
      props: { show: true, isNational: true, ...props },
      global: { stubs },
    }, { usePinia: false })
  }

  const getDrawer = () => wrapper.findComponent(DrawerStub)
  const getNameInput = () => wrapper.findComponent(ToolNameInputStub)
  const getDescriptionInput = () => wrapper.findComponent(ToolDescriptionTextareaStub)
  const getUrlInput = () => wrapper.findComponent(InputStub)
  const getBannerUpload = () => wrapper.findComponent(ImageUploadStub)
  const getButtons = () => wrapper.findComponent(FormCancelConfirmButtonsStub)
  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)

  const fillRequiredFields = async () => {
    await getNameInput().vm.$emit('update:modelValue', 'Outil')
    await getDescriptionInput().vm.$emit('update:modelValue', 'Une description')
    await getUrlInput().vm.$emit('update:modelValue', 'https://www.example.com')
  }

  const submit = async () => {
    await getButtons().vm.$emit('submit')
    await vi.waitFor(() => expect(wrapper.emitted('close')).toHaveLength(1))
  }

  beforeEach(() => {
    vi.clearAllMocks()
    requestedPaths.splice(0)
    server.events.on('request:start', ({ request }) => {
      requestedPaths.push(new URL(request.url).pathname)
    })
  })

  BddTest().when('the drawer is mounted for a national tool', () => {
    beforeEach(() => mountWith())

    BddTest().then('it should pass the show state and the national title to the drawer', () => {
      expect(getDrawer().props('show')).toBe(true)
      expect(getDrawer().props('ariaLabel')).toBe('Ajouter un outil national')
      expect(wrapper.text()).toContain('Ajouter un outil national')
    })

    BddTest().then('it should render a required tool name input', () => {
      expect(getNameInput().props('required')).toBe(true)
      expect(getNameInput().props('modelValue')).toBe('')
    })

    BddTest().then('it should render an optional banner upload with the banner ratio', () => {
      expect(wrapper.text()).toContain('Bannière')
      expect(getBannerUpload().props('modelValue')).toBeNull()
      expect(getBannerUpload().attributes('aspect-ratio')).toBe(String(BANNER_RATIO))
    })

    BddTest().then('it should render a required tool description textarea', () => {
      expect(getDescriptionInput().props('required')).toBe(true)
      expect(getDescriptionInput().props('modelValue')).toBe('')
    })

    BddTest().then('it should render a required url input', () => {
      expect(getUrlInput().props('label')).toBe('URL de l\'outil')
      expect(getUrlInput().props('required')).toBe(true)
      expect(getUrlInput().attributes('type')).toBe('url')
    })

    BddTest().then('it should render the add button disabled until the form is filled in', () => {
      expect(getButtons().props('confirmLabel')).toBe('Ajouter')
      expect(getButtons().props('isFormValid')).toBe(false)
      expect(getButtons().props('isSubmitting')).toBe(false)
    })
  })

  BddTest().when('the drawer is mounted for a local tool', () => {
    beforeEach(() => mountWith({ isNational: false }))

    BddTest().then('it should display the local title', () => {
      expect(getDrawer().props('ariaLabel')).toBe('Ajouter un outil local')
    })

    BddTest().and('a valid tool is submitted', () => {
      beforeEach(async () => {
        await fillRequiredFields()
        await submit()
      })

      BddTest().then('it should create a local tool', () => {
        expect(requestedPaths).toContain(getCreateLocalToolUrl())
        expect(requestedPaths).not.toContain(getCreateNationalToolUrl())
      })
    })
  })

  BddTest().when('the required fields are filled in', () => {
    beforeEach(async () => {
      mountWith()
      await fillRequiredFields()
    })

    BddTest().then('it should enable the add button', () => {
      expect(getButtons().props('isFormValid')).toBe(true)
    })

    BddTest().and('the form is submitted', () => {
      beforeEach(submit)

      BddTest().then('it should create the national tool without uploading a banner', () => {
        expect(requestedPaths).toContain(getCreateNationalToolUrl())
        expect(requestedPaths.some(path => path.endsWith('/banner'))).toBe(false)
      })

      BddTest().then('it should notify the success, reset the form and close the drawer', () => {
        expect(mockAddSuccessMessage).toHaveBeenCalledOnce()
        expect(getNameInput().props('modelValue')).toBe('')
        expect(getButtons().props('isFormValid')).toBe(false)
        expect(wrapper.emitted('close')).toHaveLength(1)
      })
    })

    BddTest().and('a banner is added before submitting', () => {
      beforeEach(async () => {
        const onUpdate = getBannerUpload().props('onUpdate') as (file: File) => void
        onUpdate(BANNER)
        await flushPromises()
        await submit()
      })

      BddTest().then('it should upload the banner of the created tool', () => {
        expect(requestedPaths).toContain(getUploadNationalToolBannerUrl(CREATED_TOOL_ID))
      })
    })

    BddTest().and('the banner is added then deleted before submitting', () => {
      beforeEach(async () => {
        const onUpdate = getBannerUpload().props('onUpdate') as (file: File) => void
        const onDeleteImage = getBannerUpload().props('onDeleteImage') as () => void
        onUpdate(BANNER)
        await flushPromises()
        expect(getBannerUpload().props('modelValue')).toStrictEqual(BANNER)
        onDeleteImage()
        await flushPromises()
        await submit()
      })

      BddTest().then('it should not upload any banner', () => {
        expect(requestedPaths).toContain(getCreateNationalToolUrl())
        expect(requestedPaths.some(path => path.endsWith('/banner'))).toBe(false)
      })
    })
  })

  BddTest().when('only the name is filled in and the form is submitted', () => {
    beforeEach(async () => {
      mountWith()
      await getNameInput().vm.$emit('update:modelValue', 'Outil')
      await getButtons().vm.$emit('submit')
      await flushPromises()
    })

    BddTest().then('it should flag the missing required fields once', () => {
      expect(getNameInput().props('errorMessage')).toBe('')
      expect(getDescriptionInput().props('errorMessage')).toBe(REQUIRED_ERROR)
      expect(getUrlInput().props('errorMessage')).toBe(REQUIRED_ERROR)
    })

    BddTest().then('it should neither call the API nor close the drawer', () => {
      expect(requestedPaths).toEqual([])
      expect(wrapper.emitted('close')).toBeUndefined()
    })
  })

  BddTest().when('the user cancels', () => {
    beforeEach(async () => {
      mountWith()
      await getNameInput().vm.$emit('update:modelValue', 'Outil')
    })

    BddTest().and('leaving is confirmed', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(true)
        await getButtons().vm.$emit('cancel')
        await flushPromises()
      })

      BddTest().then('it should reset the form, close the drawer and not create any tool', () => {
        expect(getNameInput().props('modelValue')).toBe('')
        expect(wrapper.emitted('close')).toHaveLength(1)
        expect(requestedPaths).toEqual([])
      })
    })

    BddTest().and('leaving is refused', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        await getDrawer().vm.$emit('close')
        await flushPromises()
      })

      BddTest().then('it should keep the drawer open with the filled in values', () => {
        expect(getNameInput().props('modelValue')).toBe('Outil')
        expect(wrapper.emitted('close')).toBeUndefined()
      })
    })
  })

  BddTest().when('the unsaved changes confirmation modal is answered', () => {
    beforeEach(() => mountWith())

    BddTest().then('it should forward the confirmation to the unsaved changes guard', async () => {
      await getConfirmationModal().vm.$emit('confirm')
      expect(mockConfirm).toHaveBeenCalledOnce()
    })

    BddTest().then('it should forward the cancellation to the unsaved changes guard', async () => {
      await getConfirmationModal().vm.$emit('close')
      expect(mockCancel).toHaveBeenCalledOnce()
    })

    BddTest().then('it should describe that the entered information will not be saved', () => {
      expect(getConfirmationModal().props('description')).toBe('Les informations renseignées ne seront pas enregistrées.')
    })
  })
})
