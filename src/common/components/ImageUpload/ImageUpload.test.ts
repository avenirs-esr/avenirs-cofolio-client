import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import ImageUpload from '@/common/components/ImageUpload/ImageUpload.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect, type Mock, vi } from 'vitest'

const error = ref('')
const valid = ref(true)

const mockShowModal = ref(false)
const mockDisplayModal = vi.fn()
const mockHideModal = vi.fn()
const mockOnDeleteImage = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useModal: () => ({
      showModal: mockShowModal,
      displayModal: mockDisplayModal,
      hideModal: mockHideModal
    }),
    useImageUpload: () => ({
      update: vi.fn(),
      error,
      valid,
      name: { value: 'test.jpg' },
      previewUrl: { value: 'exemple.com/image.png' }
    })
  }
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
        AvFileUpload: {
          name: 'AvFileUpload',
          props: ['error', 'validMessage', 'accept', 'onDeleteFile'],
          emits: ['change', 'accept-type-error'],
          template: `
            <div>
              <slot name="left"></slot>
              <input
                class="file-input"
                type="file"
                @change="e => $emit('change', e.target.files)"
              />
              <button
                class="error-trigger"
                @click="$emit('accept-type-error')"
              >
                Trigger Error
              </button>
              <button data-testid="delete-file-button" @click="onDeleteFile && onDeleteFile()">Delete File</button>
            </div>
          `
        },
        ConfirmationModal: ConfirmationModalStub
      },
    },
  })
}

BddTest().given('and image upload with valid props', () => {
  let wrapper: VueWrapper<InstanceType<typeof ImageUpload>>

  let onUpdateMock: Mock

  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
  }
  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = vi.fn()
  }

  beforeEach(() => {
    onUpdateMock = vi.fn()
    wrapper = createWrapper({ onUpdate: onUpdateMock, onDeleteImage: mockOnDeleteImage })
  })

  afterEach(() => {
    vi.restoreAllMocks()
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
    BddTest().then('it should call onUpdate', async () => {
      const file = new File(['example'], 'test.jpg', { type: 'image/jpeg' })
      const avFileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

      avFileUpload.vm.$emit('change', [file])
      await wrapper.vm.$nextTick()

      expect(onUpdateMock).toHaveBeenCalledWith(file)
    })
  })

  BddTest().when('an invalid file is dropped', () => {
    beforeEach(() => {
      valid.value = false
      error.value = 'Le fichier ne respecte pas le format attendu.'
    })

    BddTest().then('it should set error message when accept-type-error event is emitted', async () => {
      const errorBtn = wrapper.find('button.error-trigger')

      await errorBtn.trigger('click')
      await wrapper.vm.$nextTick()

      const avFileUpload = wrapper.findComponent({ name: 'AvFileUpload' })
      expect(avFileUpload.props('error')).toBe(error.value)
    })

    BddTest().then('it should not call onUpdate when file is invalid', async () => {
      const file = new File(['example'], 'test.jpg', { type: 'image/jpeg' })
      const avFileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

      avFileUpload.vm.$emit('change', [file])
      await wrapper.vm.$nextTick()

      expect(onUpdateMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('defaultImageUrl is provided', () => {
    BddTest().then('it should use defaultImageUrl for image src', () => {
      const wrapperWithUrl = createWrapper({ defaultImageUrl: 'https://example.com/custom.jpg' })

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
      expect(errorSpan.text()).toBe('Le fichier ne respecte pas le format attendu.')
      expect(errorSpan.classes()).toContain('av-sr-only')
    })

    BddTest().then('it should update describedBy to include error id', async () => {
      await wrapper.vm.$nextTick()

      const avFileUpload = wrapper.findComponent({ name: 'AvFileUpload' })
      expect(avFileUpload.attributes('aria-describedby')).toBe('image-upload-hint image-upload-error')
    })
  })

  BddTest().when('no error is present', () => {
    beforeEach(() => {
      error.value = ''
    })

    BddTest().then('it should use only hint id for describedBy', async () => {
      await wrapper.vm.$nextTick()

      const avFileUpload = wrapper.findComponent({ name: 'AvFileUpload' })
      expect(avFileUpload.attributes('aria-describedby')).toBe('image-upload-hint')
    })

    BddTest().then('it should not render error span', async () => {
      await wrapper.vm.$nextTick()

      const errorSpan = wrapper.find('#image-upload-error')
      expect(errorSpan.exists()).toBe(false)
    })
  })

  BddTest().when('delete file button is clicked', () => {
    beforeEach(async () => {
      const deleteButton = wrapper.find('[data-testid="delete-file-button"]')
      await deleteButton.trigger('click')
    })

    BddTest().then('it should display the confirmation modal', () => {
      expect(mockDisplayModal).toHaveBeenCalled()
    })
  })

  BddTest().when('confirming file deletion in modal', () => {
    beforeEach(() => {
      wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
    })

    BddTest().then('it should hide the modal', () => {
      expect(mockHideModal).toHaveBeenCalled()
    })

    BddTest().then('it should call delete image function', () => {
      expect(mockOnDeleteImage).toHaveBeenCalled()
    })
  })
})
