import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import ImageUpload from '@/common/components/ImageUpload/ImageUpload.vue'
import { AvButtonStub, AvFileUploadStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const ACCEPT_TYPE_ERROR_MESSAGE = 'Le fichier ne respecte pas le format attendu.'
const FILE_SIZE_ERROR_MESSAGE = 'La taille du fichier dépasse la limite autorisée.'
const VALID_MESSAGE = 'Le document a été chargé avec succès.'

type ComponentProps = ComponentMountingOptions<typeof ImageUpload>['props']

const error = ref('')
const valid = ref(VALID_MESSAGE)
const mockModalOpened = ref(false)

const {
  onUpdateMock,
  mockCanvasFile,
  mockCanvasToFile,
  mockOpenModal,
  mockCloseModal,
  mockOnDeleteImage,
  mockUpdateImage,
} = vi.hoisted(() => ({
  onUpdateMock: vi.fn(),
  mockCanvasFile: new File(['cropped'], 'test.jpg', { type: 'image/jpeg' }),
  mockCanvasToFile: vi.fn(),
  mockOpenModal: vi.fn(() => {
    mockModalOpened.value = true
  }),
  mockCloseModal: vi.fn(() => {
    mockModalOpened.value = false
  }),
  mockOnDeleteImage: vi.fn(),
  mockUpdateImage: vi.fn(),
}))

const defaultProps: ComponentProps = {
  modelValue: new File(['existing'], 'existing.jpg', { type: 'image/jpeg' }),
  imageAlt: 'alt text',
  onUpdate: onUpdateMock,
  onDeleteImage: mockOnDeleteImage,
}

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()

  return {
    ...actual,
    useModal: () => ({
      modalOpened: mockModalOpened,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    }),
    useImageUpload: () => ({
      update: mockUpdateImage,
      clear: vi.fn(),
      error,
      valid,
      name: { value: 'test.jpg' },
      previewUrl: { value: 'exemple.com/image.png' },
    }),
  }
})

vi.mock('@/common/utils/file/file', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/utils/file/file')>()

  return {
    ...actual,
    canvasToFile: mockCanvasToFile,
  }
})

const CropperStub = defineComponent({
  name: 'Cropper',
  emits: ['change'],
  template: '<div data-testid="cropper-stub" />',
})

BddTest().given('an image upload with valid props', () => {
  let wrapper: VueWrapper<InstanceType<typeof ImageUpload>>

  const stubs = {
    AvButton: AvButtonStub,
    AvFileUpload: AvFileUploadStub,
    ConfirmationModal: ConfirmationModalStub,
    Cropper: CropperStub,
  }

  const mountWith = (
    props: Partial<ComponentProps> = {},
    validMsg = VALID_MESSAGE,
    errorMsg = '',
  ) => {
    valid.value = validMsg
    error.value = errorMsg

    vi.clearAllMocks()

    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
    URL.revokeObjectURL = vi.fn()

    mockCanvasToFile.mockResolvedValue(mockCanvasFile)

    wrapper = mountComponent(ImageUpload, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: { stubs },
    })
  }

  const getImage = () => wrapper.find('img')
  const getAvFileUpload = () => wrapper.findComponent(AvFileUploadStub)
  const getCropperModal = () => wrapper.findComponent('[data-testid="image-upload-cropper-modal"]') as VueWrapper<InstanceType<typeof ConfirmationModalStub>>
  const getDeleteModal = () => wrapper.findComponent('[data-testid="image-upload-confirm-modal"]') as VueWrapper<InstanceType<typeof ConfirmationModalStub>>
  const getCropper = () => wrapper.findComponent(CropperStub)
  const getDeleteButton = () => wrapper.find('[data-testid="delete-file-button"]')
  const getErrorSpan = () => wrapper.find('#image-upload-error')

  const expectFileUploadError = (expectedError: string) => {
    expect(getAvFileUpload().props('error')).toBe(expectedError)
  }

  const expectNoModelValueUpdate = () => {
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  }

  const expectModelValueUpdate = (expectedValue: File | null) => {
    expect(wrapper.emitted('update:modelValue')).toEqual([[expectedValue]])
  }

  const expectNoOnUpdate = () => {
    expect(onUpdateMock).not.toHaveBeenCalled()
  }

  const expectImage = (src: string, alt: string) => {
    const image = getImage()
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe(src)
    expect(image.attributes('alt')).toBe(alt)
  }

  const expectModalOpened = () => {
    expect(mockOpenModal).toHaveBeenCalled()
  }

  const expectModalClosed = () => {
    expect(mockCloseModal).toHaveBeenCalled()
  }

  const expectObjectUrlCreated = (file: File) => {
    expect(URL.createObjectURL).toHaveBeenCalledWith(file)
  }

  const expectObjectUrlRevoked = () => {
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  }

  const expectErrorDisplayed = (expectedError: string) => {
    const errorSpan = getErrorSpan()
    expect(errorSpan.exists()).toBe(true)
    expect(errorSpan.text()).toBe(expectedError)
    expect(errorSpan.classes()).toContain('av-sr-only')
  }

  const expectDescribedBy = (expectedValue: string) => {
    expect(getAvFileUpload().attributes('aria-describedby')).toBe(expectedValue)
  }

  const createCanvas = () => document.createElement('canvas')

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the default image with correct alt', () => {
      expectImage('exemple.com/image.png', defaultProps.imageAlt)
    })
  })

  BddTest().when('a valid file is selected', () => {
    const file = new File(['example'], 'test.jpg', { type: 'image/jpeg' })

    beforeEach(async () => {
      mountWith()

      getAvFileUpload().vm.$emit('change', [file])
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should open the cropper modal', () => {
      expectModalOpened()
    })

    BddTest().then('it should not update the model value', () => {
      expectNoModelValueUpdate()
    })

    BddTest().then('it should not call onUpdate', () => {
      expectNoOnUpdate()
    })

    BddTest().then('it should create an object URL for the selected file', () => {
      expectObjectUrlCreated(file)
    })
  })

  BddTest().when('a valid file is selected and the crop is confirmed', () => {
    beforeEach(async () => {
      mountWith()

      getAvFileUpload().vm.$emit('change', [
        new File(['example'], 'test.jpg', { type: 'image/jpeg' })
      ])
      await wrapper.vm.$nextTick()

      getCropper().vm.$emit('change', { canvas: createCanvas() })
      await wrapper.vm.$nextTick()

      getCropperModal().vm.$emit('confirm')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should convert the crop canvas to a file', () => {
      expect(mockCanvasToFile).toHaveBeenCalled()
    })

    BddTest().then('it should validate the cropped file', () => {
      expect(mockUpdateImage).toHaveBeenCalledWith([mockCanvasFile])
    })

    BddTest().then('it should call onUpdate with the cropped file', () => {
      expect(onUpdateMock).toHaveBeenCalledWith(mockCanvasFile)
    })

    BddTest().then('it should update the model value with the cropped file', () => {
      expectModelValueUpdate(mockCanvasFile)
    })

    BddTest().then('it should close the cropper modal', () => {
      expectModalClosed()
    })
  })

  BddTest().when('a valid file is selected and the crop is cancelled', () => {
    beforeEach(async () => {
      mountWith()

      getAvFileUpload().vm.$emit('change', [
        new File(['example'], 'new.jpg', { type: 'image/jpeg' })
      ])
      await wrapper.vm.$nextTick()

      getCropperModal().vm.$emit('close')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not update the model value', () => {
      expectNoModelValueUpdate()
    })

    BddTest().then('it should not call onUpdate', () => {
      expectNoOnUpdate()
    })

    BddTest().then('it should revoke the temporary object URL', () => {
      expectObjectUrlRevoked()
    })

    BddTest().then('it should close the cropper modal', () => {
      expectModalClosed()
    })
  })

  BddTest().when('a valid file is selected but the crop validation fails', () => {
    beforeEach(async () => {
      mountWith({}, '')

      getAvFileUpload().vm.$emit('change', [
        new File(['example'], 'test.jpg', { type: 'image/jpeg' }),
      ])
      await wrapper.vm.$nextTick()

      getCropper().vm.$emit('change', { canvas: createCanvas() })
      await wrapper.vm.$nextTick()

      getCropperModal().vm.$emit('confirm')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not update the model value', () => {
      expectNoModelValueUpdate()
    })

    BddTest().then('it should not call onUpdate', () => {
      expectNoOnUpdate()
    })
  })

  BddTest().when('an invalid file is dropped', () => {
    beforeEach(() => {
      mountWith({}, '', '')
    })

    BddTest().then('it should display an accepted type error', async () => {
      await getAvFileUpload().vm.$emit('acceptTypeError')
      await wrapper.vm.$nextTick()

      expectFileUploadError(ACCEPT_TYPE_ERROR_MESSAGE)
    })

    BddTest().then('it should display a size error', async () => {
      await getAvFileUpload().vm.$emit('fileSizeError')
      await wrapper.vm.$nextTick()

      expectFileUploadError(FILE_SIZE_ERROR_MESSAGE)
    })

    BddTest().then('it should not call onUpdate when file is invalid', async () => {
      getAvFileUpload().vm.$emit('change', [
        new File(['example'], 'test.jpg', { type: 'image/jpeg' }),
      ])
      await wrapper.vm.$nextTick()

      expectNoOnUpdate()
    })
  })

  BddTest().when('defaultImageUrl is provided', () => {
    const props: Partial<ComponentProps> = {
      defaultImageUrl: 'https://example.com/custom.jpg',
    }

    beforeEach(() => {
      mountWith(props)
    })

    BddTest().then('it should use defaultImageUrl for image src', () => {
      expect(getImage().attributes('src')).toBe(props.defaultImageUrl)
    })
  })

  BddTest().when('error is displayed', () => {
    beforeEach(() => {
      mountWith({}, '', ACCEPT_TYPE_ERROR_MESSAGE)
    })

    BddTest().then('it should render error message with correct aria attributes', async () => {
      await wrapper.vm.$nextTick()

      expectErrorDisplayed(ACCEPT_TYPE_ERROR_MESSAGE)
    })

    BddTest().then('it should update describedBy to include error id', async () => {
      await wrapper.vm.$nextTick()

      expectDescribedBy('image-upload-hint image-upload-error')
    })
  })

  BddTest().when('no error is present', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should use only hint id for describedBy', async () => {
      await wrapper.vm.$nextTick()

      expectDescribedBy('image-upload-hint')
    })

    BddTest().then('it should not render error span', async () => {
      await wrapper.vm.$nextTick()

      expect(getErrorSpan().exists()).toBe(false)
    })
  })

  BddTest().when('delete file button is clicked', () => {
    beforeEach(async () => {
      mountWith()

      await getDeleteButton().trigger('click')
    })

    BddTest().then('it should display the confirmation modal', () => {
      expectModalOpened()
    })
  })

  BddTest().when('confirming file deletion in modal', () => {
    beforeEach(async () => {
      mountWith()

      getDeleteModal().vm.$emit('confirm')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should hide the modal', () => {
      expectModalClosed()
    })

    BddTest().then('it should clear the image upload', () => {
      expectModelValueUpdate(null)
    })

    BddTest().then('it should call delete image function', () => {
      expect(mockOnDeleteImage).toHaveBeenCalled()
    })
  })
})
