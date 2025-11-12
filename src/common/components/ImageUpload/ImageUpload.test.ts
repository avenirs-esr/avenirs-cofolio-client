import ImageUpload from '@/common/components/ImageUpload/ImageUpload.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect, type Mock, vi } from 'vitest'

const error = ref('')
const valid = ref(true)

vi.mock('@/common/composables', () => ({
  useImageUpload: () => ({
    update: vi.fn(),
    error,
    valid,
    name: { value: 'test.jpg' },
    previewUrl: { value: 'exemple.com/image.png' }
  })
}))

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
          emits: ['change', 'on-drop-accept-type-error'],
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
                @click="$emit('on-drop-accept-type-error')"
              >
                Trigger Error
              </button>
            </div>
          `
        }
      }
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
    wrapper = createWrapper({ onUpdate: onUpdateMock })
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

    BddTest().then('it should set error message when on-drop-accept-type-error event is emitted', async () => {
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

  BddTest().when('onDeleteImage prop is provided', () => {
    BddTest().then('it should pass onDeleteImage to AvFileUpload', () => {
      const onDeleteImageMock = vi.fn()
      const wrapperWithDelete = createWrapper({ onDeleteImage: onDeleteImageMock })

      const avFileUpload = wrapperWithDelete.findComponent({ name: 'AvFileUpload' })
      expect(avFileUpload.props('onDeleteFile')).toBe(onDeleteImageMock)
    })
  })

  BddTest().when('onDeleteImage prop is not provided', () => {
    BddTest().then('it should render without onDeleteFile prop', () => {
      const wrapperWithoutDelete = createWrapper()

      const avFileUpload = wrapperWithoutDelete.findComponent({ name: 'AvFileUpload' })
      expect(avFileUpload.props('onDeleteFile')).toBeUndefined()
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
      expect(errorSpan.classes()).toContain('fr-sr-only')
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
})
