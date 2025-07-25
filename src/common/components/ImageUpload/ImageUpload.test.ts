import ImageUpload from '@/common/components/ImageUpload/ImageUpload.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it, type Mock, vi } from 'vitest'

const error = ref('')
const valid = ref(true)

vi.mock('@/common/composables', () => ({
  useImageUpload: () => ({
    update: vi.fn(),
    error,
    valid,
    name: { value: 'test.jpg' },
    previewUrl: { value: undefined }
  })
}))

function createWrapper (props = {}) {
  return mount<typeof ImageUpload>(ImageUpload, {
    props: {
      defaultImage: 'default.jpg',
      imageAlt: 'alt text',
      onUpdate: vi.fn(),
      ...props
    },
    global: {
      stubs: {
        AvFileUpload: {
          name: 'AvFileUpload',
          props: ['error', 'validMessage', 'accept'],
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

describe('imageUpload', () => {
  let onUpdateMock: Mock

  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
  }
  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = vi.fn()
  }

  beforeEach(() => {
    onUpdateMock = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('given an image upload with valid props', () => {
    let wrapper: VueWrapper<InstanceType<typeof ImageUpload>>

    beforeEach(() => {
      onUpdateMock = vi.fn()
      wrapper = createWrapper({ onUpdate: onUpdateMock })
    })

    describe('when the component is mounted', () => {
      it('then it should render the default image with correct alt', () => {
        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)
        expect(img.attributes('src')).toBe('default.jpg')
        expect(img.attributes('alt')).toBe('alt text')
      })
    })

    describe('when a valid file is selected', () => {
      it('then it should call onUpdate', async () => {
        const file = new File(['example'], 'test.jpg', { type: 'image/jpeg' })
        const avFileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

        avFileUpload.vm.$emit('change', [file])
        await wrapper.vm.$nextTick()

        expect(onUpdateMock).toHaveBeenCalledWith(file)
      })
    })

    describe('when an invalid file is dropped', () => {
      beforeEach(() => {
        valid.value = false
        error.value = 'Le fichier ne respecte pas le format attendu.'
      })

      it('then it should set error message when on-drop-accept-type-error event is emitted', async () => {
        const errorBtn = wrapper.find('button.error-trigger')

        await errorBtn.trigger('click')
        await wrapper.vm.$nextTick()

        const avFileUpload = wrapper.findComponent({ name: 'AvFileUpload' })
        expect(avFileUpload.props('error')).toBe(error.value)
      })
    })
  })
})
