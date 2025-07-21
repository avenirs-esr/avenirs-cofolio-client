import AvFileUpload, { type AvFileUploadProps } from '@/ui/interaction/files/AvFileUpload/AvFileUpload.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

describe('avFileUpload', () => {
  const mountComponent = (props?: Partial<AvFileUploadProps>) => mount(AvFileUpload, {
    props: {
      ...props,
    },
    slots: {
      default: '<span>Upload a file</span>',
      hint: '<span>Accepted files: .pdf, .jpg</span>',
    },
  })

  describe('given an file uploader with default props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mountComponent()
    })

    describe('when the component is mounted', () => {
      it('then it should render the slot content', () => {
        expect(wrapper.text()).toContain('Upload a file')
      })

      it('then it should render the hint slot', () => {
        expect(wrapper.text()).toContain('Accepted files: .pdf, .jpg')
      })

      it('then it should render hidden file input', () => {
        const input = wrapper.find('input[type="file"]')
        expect(input.exists()).toBe(true)
        expect(input.attributes('style')).toContain('visibility: hidden')
      })
    })
  })

  describe('given a file uploader with error and validMessage props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mountComponent({ error: 'Error', validMessage: 'Valid file' })
    })

    describe('when the component is mounted', () => {
      it('then it should render only the error message', () => {
        const message = wrapper.find('.fr-error-text')
        expect(message.exists()).toBe(true)
        expect(message.text()).toBe('Error')
        expect(wrapper.find('.fr-valid-text').exists()).toBe(false)
      })
    })
  })

  describe('given a file uploader with validMessage but no error', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mountComponent({ validMessage: 'Valid message' })
    })

    describe('when the component is mounted', () => {
      it('then it should render the valid message', () => {
        const message = wrapper.find('.fr-valid-text')
        expect(message.exists()).toBe(true)
        expect(message.text()).toBe('Valid message')
      })
    })
  })

  describe('given a file uploader with accept prop as an array', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mountComponent({ accept: ['.jpg', '.png', '.webp'] })
    })

    describe('when the component is mounted', () => {
      it('then it should apply correct accept attribute', () => {
        const input = wrapper.find('input[type="file"]')
        expect(input.attributes('accept')).toBe('.jpg,.png,.webp')
      })
    })
  })

  describe('given a file uploader with change event on input', () => {
    let wrapper: VueWrapper
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })

    beforeEach(() => {
      wrapper = mountComponent()
    })

    describe('when a file is selected', () => {
      it('then it should emit update:modelValue and change events', async () => {
        const input = wrapper.find('input[type="file"]')
        const files = {
          0: file,
          length: 1,
          item: () => file,
        } as unknown as FileList

        const event = new Event('change')
        Object.defineProperty(event, 'target', {
          value: { value: 'C:\\fakepath\\hello.png', files },
          writable: false,
        })

        await input.element.dispatchEvent(event)

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['C:\\fakepath\\hello.png'])

        expect(wrapper.emitted('change')).toBeTruthy()
        expect(wrapper.emitted('change')?.[0][0]).toEqual(files)
      })
    })
  })

  describe('given a file uploader with drag & drop', () => {
    let wrapper: VueWrapper
    const file = new File(['drag'], 'dragged.pdf', { type: 'application/pdf' })

    beforeAll(() => {
      globalThis.DragEvent = class extends Event {
        dataTransfer: DataTransfer | null

        constructor (type: string, eventInitDict?: { dataTransfer?: DataTransfer }) {
          super(type)
          this.dataTransfer = eventInitDict?.dataTransfer ?? null
        }
      } as unknown as typeof DragEvent
    })

    beforeEach(() => {
      wrapper = mountComponent()
    })

    describe('when a file is dropped', () => {
      it('then it should emit update:modelValue and change events', async () => {
        const label = wrapper.find('label')
        const dataTransfer = { files: [file] } as unknown as DataTransfer

        const dropEvent = new DragEvent('drop', { dataTransfer })
        await label.element.dispatchEvent(dropEvent)

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['dragged.pdf'])

        expect(wrapper.emitted('change')).toBeTruthy()
        expect(wrapper.emitted('change')?.[0][0]).toEqual(dataTransfer.files)
      })
    })

    describe('when a dragover event occurs', () => {
      it('then it should add drag-over class', async () => {
        const label = wrapper.find('label')
        const dragEvent = new DragEvent('dragover')

        await label.element.dispatchEvent(dragEvent)
        expect(wrapper.classes()).toContain('drag-over')
      })
    })

    describe('when a dragleave event occurs', () => {
      it('then it should remove drag-over class', async () => {
        const label = wrapper.find('label')

        await label.trigger('dragover')
        expect(wrapper.classes()).toContain('drag-over')

        await label.trigger('dragleave')
        expect(wrapper.classes()).not.toContain('drag-over')
      })
    })
  })
})
