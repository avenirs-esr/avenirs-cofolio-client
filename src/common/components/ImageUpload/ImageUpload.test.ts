import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import ImageUpload from '@/common/components/ImageUpload/ImageUpload.vue'
import { AvButtonStub, AvFileUploadStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect, type Mock, vi } from 'vitest'

const error = ref('')
const valid = ref('Le document a été chargé avec succès.')
const mockModalOpened = ref(false)

const {
  mockCanvasFile,
  mockOpenModal,
  mockCloseModal,
  mockOnDeleteImage,
  mockUpdateImage,
} = vi.hoisted(() => ({
  mockCanvasFile: new File(['cropped'], 'test.jpg', { type: 'image/jpeg' }),
  mockOpenModal: vi.fn(() => {
    mockModalOpened.value = true
  }),
  mockCloseModal: vi.fn(() => {
    mockModalOpened.value = false
  }),
  mockOnDeleteImage: vi.fn(),
  mockUpdateImage: vi.fn(),
}))

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()

  return {
    ...actual,
    useModal: () => ({
      modalOpened: mockModalOpened,
      openModal: mockOpenModal,
      closeModal: mockCloseModal
    }),
    useImageUpload: () => ({
      update: mockUpdateImage,
      clear: vi.fn(),
      error,
      valid,
      name: { value: 'test.jpg' },
      previewUrl: { value: 'exemple.com/image.png' }
    })
  }
})

vi.mock('@/common/utils/file/file', () => ({
  canvasToFile: vi.fn().mockResolvedValue(mockCanvasFile)
}))

const CropperStub = defineComponent({
  name: 'Cropper',
  emits: ['change'],
  template: '<div data-testid="cropper-stub" />'
})

function createWrapper (props = {}) {
  return mount<typeof ImageUpload>(ImageUpload, {
    props: {
      defaultImageName: 'default.jpg',
      imageAlt: 'alt text',
      onUpdate: vi.fn(),
      ...props
    },
    global: {
      stubs: {
        AvButton: AvButtonStub,
        AvFileUpload: AvFileUploadStub,
        ConfirmationModal: ConfirmationModalStub,
        Cropper: CropperStub
      }
    }
  })
}

BddTest().given('an image upload with valid props', () => {
  let wrapper: VueWrapper<InstanceType<typeof ImageUpload>>
  let onUpdateMock: Mock

  const getAvFileUpload = () => wrapper.findComponent(AvFileUploadStub)
  const getCropperModal = () => wrapper.findAllComponents(ConfirmationModalStub)[0]
  const getDeleteModal = () => wrapper.findAllComponents(ConfirmationModalStub)[1]
  const getCropper = () => wrapper.findComponent(CropperStub)

  const createCanvas = () => document.createElement('canvas')

  const existingFile = new File(['existing'], 'existing.jpg', {
    type: 'image/jpeg'
  })

  beforeEach(() => {
    error.value = ''
    valid.value = 'Le document a été chargé avec succès.'
    mockModalOpened.value = false

    vi.clearAllMocks()

    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
    URL.revokeObjectURL = vi.fn()

    onUpdateMock = vi.fn()

    wrapper = createWrapper({
      modelValue: existingFile,
      onUpdate: onUpdateMock,
      onDeleteImage: mockOnDeleteImage
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the default image with correct alt', () => {
      const img = wrapper.find('img')

      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe('exemple.com/image.png')
      expect(img.attributes('alt')).toBe('alt text')
    })
  })

  BddTest().when('a valid file is selected', () => {
    let file: File

    beforeEach(async () => {
      file = new File(['example'], 'test.jpg', {
        type: 'image/jpeg'
      })

      getAvFileUpload().vm.$emit('change', [file])
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should open the cropper modal', () => {
      expect(mockOpenModal).toHaveBeenCalled()
    })

    BddTest().then('it should not update the model value', () => {
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    BddTest().then('it should not call onUpdate', () => {
      expect(onUpdateMock).not.toHaveBeenCalled()
    })

    BddTest().then('it should create an object URL for the selected file', () => {
      expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    })
  })

  BddTest().when('a valid file is selected and the crop is confirmed', () => {
    beforeEach(async () => {
      const file = new File(['example'], 'test.jpg', {
        type: 'image/jpeg'
      })

      getAvFileUpload().vm.$emit('change', [file])
      await wrapper.vm.$nextTick()

      const cropperModal = getCropperModal()

      getCropper().vm.$emit('change', { canvas: createCanvas() })
      await wrapper.vm.$nextTick()

      cropperModal.vm.$emit('confirm')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should convert the crop canvas to a file', async () => {
      const { canvasToFile } = await import('@/common/utils/file/file')

      expect(canvasToFile).toHaveBeenCalled()
    })

    BddTest().then('it should validate the cropped file', () => {
      expect(mockUpdateImage).toHaveBeenCalledWith([mockCanvasFile])
    })

    BddTest().then('it should call onUpdate with the cropped file', () => {
      expect(onUpdateMock).toHaveBeenCalledWith(mockCanvasFile)
    })

    BddTest().then('it should update the model value with the cropped file', () => {
      expect(wrapper.emitted('update:modelValue')).toEqual([
        [mockCanvasFile]
      ])
    })

    BddTest().then('it should close the cropper modal', () => {
      expect(mockCloseModal).toHaveBeenCalled()
    })
  })

  BddTest().when('a valid file is selected and the crop is cancelled', () => {
    beforeEach(async () => {
      const file = new File(['example'], 'new.jpg', {
        type: 'image/jpeg'
      })

      getAvFileUpload().vm.$emit('change', [file])
      await wrapper.vm.$nextTick()

      getCropperModal().vm.$emit('close')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not update the model value', () => {
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    BddTest().then('it should not call onUpdate', () => {
      expect(onUpdateMock).not.toHaveBeenCalled()
    })

    BddTest().then('it should revoke the temporary object URL', () => {
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })

    BddTest().then('it should close the cropper modal', () => {
      expect(mockCloseModal).toHaveBeenCalled()
    })
  })

  BddTest().when('a valid file is selected but the crop validation fails', () => {
    beforeEach(async () => {
      valid.value = ''

      const file = new File(['example'], 'test.jpg', {
        type: 'image/jpeg'
      })

      getAvFileUpload().vm.$emit('change', [file])
      await wrapper.vm.$nextTick()

      getCropper().vm.$emit('change', { canvas: createCanvas() })
      await wrapper.vm.$nextTick()

      getCropperModal().vm.$emit('confirm')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not update the model value', () => {
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    BddTest().then('it should not call onUpdate', () => {
      expect(onUpdateMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('an invalid file is dropped', () => {
    beforeEach(() => {
      valid.value = ''
      error.value = 'Le fichier ne respecte pas le format attendu.'
    })

    BddTest().then('it should set error message when accept-type-error event is emitted', async () => {
      const errorBtn = wrapper.find('button.error-trigger')

      await errorBtn.trigger('click')
      await wrapper.vm.$nextTick()

      expect(getAvFileUpload().props('error')).toBe(error.value)
    })

    BddTest().then('it should not call onUpdate when file is invalid', async () => {
      const file = new File(['example'], 'test.jpg', {
        type: 'image/jpeg'
      })

      getAvFileUpload().vm.$emit('change', [file])
      await wrapper.vm.$nextTick()

      expect(onUpdateMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('defaultImageUrl is provided', () => {
    BddTest().then('it should use defaultImageUrl for image src', () => {
      const wrapperWithUrl = createWrapper({
        defaultImageUrl: 'https://example.com/custom.jpg'
      })

      const img = wrapperWithUrl.find('img')

      expect(img.attributes('src')).toBe('https://example.com/custom.jpg')
    })
  })

  BddTest().when('error is displayed', () => {
    beforeEach(() => {
      error.value = 'Le fichier ne respecte pas le format attendu.'
    })

    BddTest().then('it should render error message with correct aria attributes', async () => {
      await wrapper.vm.$nextTick()

      const errorSpan = wrapper.find('#image-upload-error')

      expect(errorSpan.exists()).toBe(true)
      expect(errorSpan.text()).toBe(
        'Le fichier ne respecte pas le format attendu.'
      )
      expect(errorSpan.classes()).toContain('av-sr-only')
    })

    BddTest().then('it should update describedBy to include error id', async () => {
      await wrapper.vm.$nextTick()

      expect(getAvFileUpload().attributes('aria-describedby')).toBe('image-upload-hint image-upload-error')
    })
  })

  BddTest().when('no error is present', () => {
    beforeEach(() => {
      error.value = ''
    })

    BddTest().then('it should use only hint id for describedBy', async () => {
      await wrapper.vm.$nextTick()

      expect(getAvFileUpload().attributes('aria-describedby')).toBe('image-upload-hint')
    })

    BddTest().then('it should not render error span', async () => {
      await wrapper.vm.$nextTick()

      const errorSpan = wrapper.find('#image-upload-error')

      expect(errorSpan.exists()).toBe(false)
    })
  })

  BddTest().when('delete file button is clicked', () => {
    beforeEach(async () => {
      const deleteButton = wrapper.find(
        '[data-testid="delete-file-button"]'
      )

      await deleteButton.trigger('click')
    })

    BddTest().then('it should display the confirmation modal', () => {
      expect(mockOpenModal).toHaveBeenCalled()
    })
  })

  BddTest().when('confirming file deletion in modal', () => {
    beforeEach(async () => {
      getDeleteModal().vm.$emit('confirm')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should hide the modal', () => {
      expect(mockCloseModal).toHaveBeenCalled()
    })

    BddTest().then('it should clear the image upload', () => {
      expect(wrapper.emitted('update:modelValue')).toEqual([
        [null]
      ])
    })

    BddTest().then('it should call delete image function', () => {
      expect(mockOnDeleteImage).toHaveBeenCalled()
    })
  })
})
