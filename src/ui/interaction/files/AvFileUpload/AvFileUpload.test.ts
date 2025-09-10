import AvFileUpload, { type AvFileUploadProps } from '@/ui/interaction/files/AvFileUpload/AvFileUpload.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a file uploader', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvFileUpload>>

  const stubs = {
    AvIconText: {
      name: 'AvIconText',
      template: `<div class="av-icon-text" />`,
      props: ['icon', 'text']
    },
  }

  const mountComponent = (props?: Partial<AvFileUploadProps>) => mount<typeof AvFileUpload>(AvFileUpload, {
    props: {
      title: 'Ajouter un document',
      description: 'ou glisser et déposer ici',
      deleteButtonLabel: 'delete',
      ...props,
      global: { stubs }
    },
    slots: {
      default: '<span>Upload a file</span>',
      hint: '<span>Accepted files: .pdf, .jpg</span>',
    },
  })

  BddTest().and('with default props', () => {
    beforeEach(() => {
      wrapper = mountComponent()
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the slot content', () => {
        expect(wrapper.text()).toContain('Ajouter un document')
        expect(wrapper.text()).toContain('ou glisser et déposer ici')
      })
    })
  })

  BddTest().and('with error and validMessage props', () => {
    beforeEach(() => {
      wrapper = mountComponent({ error: 'Error', validMessage: 'Valid file' })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render only the error message', () => {
        const avIconText = wrapper.findComponent({ name: 'AvIconText' })
        expect(avIconText.exists()).toBe(true)
        expect(avIconText.props('icon')).toBe('mdi:close-circle-outline')
        expect(avIconText.props('text')).toBe('Error')
      })
    })
  })

  BddTest().and('with validMessage but no error', () => {
    beforeEach(() => {
      wrapper = mountComponent({ validMessage: 'Valid message' })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the valid message', () => {
        const avIconText = wrapper.findComponent({ name: 'AvIconText' })
        expect(avIconText.exists()).toBe(true)
        expect(avIconText.props('icon')).toBe('mdi:check-circle-outline')
        expect(avIconText.props('text')).toBe('Valid message')
      })
    })
  })

  BddTest().and('with accept prop as an array', () => {
    beforeEach(() => {
      wrapper = mountComponent({ accept: ['.jpg', '.png', '.webp'] })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should apply correct accept attribute', () => {
        const input = wrapper.find('input[type="file"]')
        expect(input.attributes('accept')).toBe('.jpg,.png,.webp')
      })
    })
  })

  BddTest().and('with change event on input', () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })

    beforeEach(() => {
      wrapper = mountComponent()
    })

    BddTest().when('a file is selected', () => {
      BddTest().then('it should emit update:modelValue and change events', async () => {
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
        expect((wrapper.emitted('update:modelValue')?.[0][0] as File).name).toBe('hello.png')

        expect(wrapper.emitted('change')).toBeTruthy()
        expect(wrapper.emitted('change')?.[0][0]).toEqual(files)
      })
    })
  })

  BddTest().and('with drag & drop', () => {
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

    BddTest().when('a file is dropped', () => {
      BddTest().then('it should emit update:modelValue and change events', async () => {
        const label = wrapper.find('label')
        const dataTransfer = { files: [file] } as unknown as DataTransfer

        const dropEvent = new DragEvent('drop', { dataTransfer })
        await label.element.dispatchEvent(dropEvent)

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect((wrapper.emitted('update:modelValue')?.[0][0] as File).name).toBe('dragged.pdf')

        expect(wrapper.emitted('change')).toBeTruthy()
        expect(wrapper.emitted('change')?.[0][0]).toEqual(dataTransfer.files)
      })
    })

    BddTest().when('a dragover event occurs', () => {
      BddTest().then('it should add drag-over class', async () => {
        const label = wrapper.find('label')
        await label.trigger('dragover')
        expect(label.classes()).toContain('drag-over')
      })
    })

    BddTest().when('a dragleave event occurs', () => {
      BddTest().then('it should remove drag-over class', async () => {
        const label = wrapper.find('label')

        await label.trigger('dragover')
        expect(label.classes()).toContain('drag-over')

        await label.trigger('dragleave')
        expect(label.classes()).not.toContain('drag-over')
      })
    })
  })

  BddTest().and('with drag & drop with strict accept type', () => {
    const filePdf = new File(['drag'], 'dragged.pdf', { type: 'application/pdf' })
    const fileJpeg = new File(['drag'], 'dragged.jpeg', { type: 'image/jpeg' })
    const filePng = new File(['drag'], 'dragged.png', { type: 'image/png' })

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
      wrapper = mountComponent({ accept: ['image/jpeg', '.PNG'] })
    })

    BddTest().when('an accepted file is dropped', () => {
      BddTest().then('it should emit update:modelValue and change events and not emit onDropAcceptTypeError', async () => {
        const label = wrapper.find('label')
        const dataTransfer = { files: [fileJpeg] } as unknown as DataTransfer

        const dropEvent = new DragEvent('drop', { dataTransfer })
        await label.element.dispatchEvent(dropEvent)

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect((wrapper.emitted('update:modelValue')?.[0][0] as File).name).toBe('dragged.jpeg')

        expect(wrapper.emitted('change')).toBeTruthy()
        expect(wrapper.emitted('change')?.[0][0]).toEqual(dataTransfer.files)

        expect(wrapper.emitted('onDropAcceptTypeError')).toBeFalsy()
      })
    })

    BddTest().when('an accepted file is dropped for accepted type starting with "."', () => {
      BddTest().then('it should emit update:modelValue and change events and not emit onDropAcceptTypeError', async () => {
        const label = wrapper.find('label')
        const dataTransfer = { files: [filePng] } as unknown as DataTransfer

        const dropEvent = new DragEvent('drop', { dataTransfer })
        await label.element.dispatchEvent(dropEvent)

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect((wrapper.emitted('update:modelValue')?.[0][0] as File).name).toBe('dragged.png')

        expect(wrapper.emitted('change')).toBeTruthy()
        expect(wrapper.emitted('change')?.[0][0]).toEqual(dataTransfer.files)

        expect(wrapper.emitted('onDropAcceptTypeError')).toBeFalsy()
      })
    })

    BddTest().when('a non accepted file is dropped', () => {
      BddTest().then('it should emit onDropAcceptTypeError and not emit update:modelValue and change events', async () => {
        const label = wrapper.find('label')
        const dataTransfer = { files: [filePdf] } as unknown as DataTransfer

        const dropEvent = new DragEvent('drop', { dataTransfer })
        await label.element.dispatchEvent(dropEvent)

        expect(wrapper.emitted('update:modelValue')).toBeFalsy()
        expect(wrapper.emitted('change')).toBeFalsy()
        expect(wrapper.emitted('onDropAcceptTypeError')).toBeTruthy()
      })
    })
  })

  BddTest().and('with drag & drop with wrong accept type', () => {
    const filePdf = new File(['drag'], 'dragged.pdf', { type: 'application/pdf' })

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
      wrapper = mountComponent({ accept: ['png'] })
    })

    BddTest().when('a file is dropped', () => {
      BddTest().then('it should emit onDropAcceptTypeError and not emit update:modelValue and change events', async () => {
        const label = wrapper.find('label')
        const dataTransfer = { files: [filePdf] } as unknown as DataTransfer

        const dropEvent = new DragEvent('drop', { dataTransfer })
        await label.element.dispatchEvent(dropEvent)

        expect(wrapper.emitted('update:modelValue')).toBeFalsy()
        expect(wrapper.emitted('change')).toBeFalsy()
        expect(wrapper.emitted('onDropAcceptTypeError')).toBeTruthy()
      })
    })
  })

  BddTest().given('a disabled file uploader with drag & drop', () => {
    const filePdf = new File(['drag'], 'dragged.pdf', { type: 'application/pdf' })

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
      wrapper = mountComponent({ disabled: true })
    })

    BddTest().when('a file is dropped', () => {
      BddTest().then('it should not emit onDropAcceptTypeError, update:modelValue and change events', async () => {
        const label = wrapper.find('label')
        const dataTransfer = { files: [filePdf] } as unknown as DataTransfer

        const dropEvent = new DragEvent('drop', { dataTransfer })
        await label.element.dispatchEvent(dropEvent)

        expect(wrapper.emitted('update:modelValue')).toBeFalsy()
        expect(wrapper.emitted('change')).toBeFalsy()
        expect(wrapper.emitted('onDropAcceptTypeError')).toBeFalsy()
      })
    })
  })

  BddTest().and('with onClear button', () => {
    beforeEach(() => {
      wrapper = mountComponent({ modelValue: new File(['test'], 'test.txt') })
    })

    BddTest().when('clicking on onClear button', () => {
      BddTest().then('it should emit update:modelValue, update:validMessage, and update:error with null', async () => {
        const onClearButton = wrapper.find('.av-button')
        expect(onClearButton.exists()).toBe(true)

        await onClearButton.trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toBeNull()

        expect(wrapper.emitted('update:validMessage')).toBeTruthy()
        expect(wrapper.emitted('update:validMessage')?.[0][0]).toBeNull()

        expect(wrapper.emitted('update:error')).toBeTruthy()
        expect(wrapper.emitted('update:error')?.[0][0]).toBeNull()
      })
    })
  })

  BddTest().given('a fileUpload rendering', () => {
    BddTest().when('enableMultiple = false', () => {
      BddTest().and('fileName is set', () => {
        beforeEach(() => {
          wrapper = mountComponent({ fileName: 'file.txt', modelValue: null, enableMultiple: false, deleteButtonLabel: 'delete', title: 'click here', description: 'or drag and drop' })
        })

        BddTest().then('it should render file info template', () => {
          expect(wrapper.html()).toContain('file.txt')
        })
      })

      BddTest().and('modelValue is set (fileName not provided)', () => {
        let file: File

        beforeEach(() => {
          file = new File(['content'], 'file.txt')
          wrapper = mountComponent({ modelValue: file, enableMultiple: false, fileName: undefined })
        })

        BddTest().then('it should render file info template', () => {
          expect(wrapper.html()).toContain('file.txt')
        })

        BddTest().then('it should render the delete button', () => {
          const deleteBtn = wrapper.find('.av-button')
          expect(deleteBtn.exists()).toBe(true)
        })
      })

      BddTest().and('neither fileName nor modelValue is set', () => {
        beforeEach(() => {
          wrapper = mountComponent({ modelValue: null, fileName: undefined, enableMultiple: false })
        })

        BddTest().then('it should render upload input template', () => {
          expect(wrapper.find('input[type="file"]').exists()).toBe(true)
        })
      })
    })

    BddTest().when('enableMultiple = true', () => {
      let file: File

      beforeEach(() => {
        file = new File(['content'], 'file.txt')
        wrapper = mountComponent({ modelValue: file, enableMultiple: true })
      })

      BddTest().then('it should render upload input template even if modelValue is set', () => {
        expect(wrapper.find('input[type="file"]').exists()).toBe(true)
      })
    })
  })
})
