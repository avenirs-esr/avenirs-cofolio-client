import TraceFileUpload from '@/features/student/components/traces/interactions/inputs/TraceFileUpload/TraceFileUpload.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const AvFileUploadStub = {
  name: 'AvFileUpload',
  props: ['modelValue', 'title', 'description', 'accept', 'deleteButtonLabel', 'disabled'],
  emits: ['update:modelValue'],
  template: `
    <div>
      <input
        type="file"
        :accept="accept?.join(',')"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.files[0])"
      />
      <div v-if="modelValue">{{ modelValue.name }}</div>
    </div>
  `
}

const stubs = {
  AvFileUpload: AvFileUploadStub
}

BddTest().given('a trace file upload component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceFileUpload>>

  beforeEach(() => {
    wrapper = mount(TraceFileUpload, {
      global: {
        stubs,
      },
      props: {
        modelValue: null
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render AvFileUpload with default props', () => {
      const fileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

      expect(fileUpload.exists()).toBe(true)
      expect(fileUpload.props('title')).toBe('Ajouter un fichier')
      expect(fileUpload.attributes('aria-label')).toBe('Ajouter un fichier')
      expect(fileUpload.props('description')).toBe('ou glisser et déposer ici')
    })

    BddTest().then('it should render file types and sizes information', () => {
      const captions = wrapper.findAll('.caption-light')

      expect(captions.length).toBeGreaterThan(0)
      expect(captions[0].text()).toContain('Images')
      expect(captions[0].text()).toContain('5Mo')
    })

    BddTest().then('it should display all file type categories', () => {
      const text = wrapper.text()

      expect(text).toContain('Images')
      expect(text).toContain('5Mo')
      expect(text).toContain('Texte')
      expect(text).toContain('Audio')
      expect(text).toContain('Vidéo')
      expect(text).toContain('10Mo')
      expect(text).toContain('Application')
    })

    BddTest().then('it should render separators between file types', () => {
      const text = wrapper.text()

      expect(text).toMatch(/•/)
    })
  })

  BddTest().when('custom title is provided', () => {
    BddTest().then('it should use the custom title', () => {
      wrapper = mount(TraceFileUpload, {
        props: {
          title: 'Custom Upload Title',
          modelValue: null
        },
        global: {
          stubs
        }
      })

      const fileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

      expect(fileUpload.props('title')).toBe('Custom Upload Title')
    })
  })

  BddTest().when('custom label is provided as prop', () => {
    BddTest().then('it should display the label before component', () => {
      wrapper = mount(TraceFileUpload, {
        props: {
          title: 'Custom Upload Title',
          label: 'Choose your file',
          modelValue: null
        },
        global: {
          stubs
        }
      })

      const label = wrapper.find('.trace-file-upload__label')
      expect(label.text()).toContain('Choose your file')
    })
  })

  BddTest().when('custom description is provided', () => {
    BddTest().then('it should use the custom description', () => {
      wrapper = mount(TraceFileUpload, {
        props: {
          description: 'Custom description text',
          modelValue: null
        },
        global: {
          stubs
        }
      })

      const fileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

      expect(fileUpload.props('description')).toBe('Custom description text')
    })
  })

  BddTest().when('custom accept types are provided', () => {
    BddTest().then('it should use the custom accept types', () => {
      wrapper = mount(TraceFileUpload, {
        props: {
          accept: ['.pdf', '.doc'],
          modelValue: null
        },
        global: {
          stubs
        }
      })

      const fileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

      expect(fileUpload.props('accept')).toEqual(['.pdf', '.doc'])
    })
  })

  BddTest().when('the component is disabled', () => {
    BddTest().then('it should pass disabled state to AvFileUpload', () => {
      wrapper = mount(TraceFileUpload, {
        props: {
          disabled: true,
          modelValue: null
        },
        global: {
          stubs
        }
      })

      const fileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

      expect(fileUpload.props('disabled')).toBe(true)
    })
  })

  BddTest().when('a file is selected', () => {
    BddTest().then('it should update the model value', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })

      const fileUpload = wrapper.findComponent({ name: 'AvFileUpload' })
      await fileUpload.vm.$emit('update:modelValue', file)
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([file])
    })
  })

  BddTest().when('a file is provided via v-model', () => {
    BddTest().then('it should pass the file to AvFileUpload', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' })

      wrapper = mount(TraceFileUpload, {
        props: {
          modelValue: file
        },
        global: {
          stubs
        }
      })

      const fileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

      expect(fileUpload.props('modelValue')).toBe(file)
    })
  })

  BddTest().when('deleteButtonLabel is provided', () => {
    BddTest().then('it should pass the label to AvFileUpload', () => {
      wrapper = mount(TraceFileUpload, {
        props: {
          deleteButtonLabel: 'Remove file',
          modelValue: null
        },
        global: {
          stubs
        }
      })

      const fileUpload = wrapper.findComponent({ name: 'AvFileUpload' })

      expect(fileUpload.props('deleteButtonLabel')).toBe('Remove file')
    })
  })

  BddTest().when('the file size is displayed', () => {
    BddTest().then('it should show bold formatting for file sizes', () => {
      const boldSizes = wrapper.findAll('.caption-bold')

      expect(boldSizes.length).toBe(5)
      expect(boldSizes[0].text()).toBe('5Mo')
      expect(boldSizes[1].text()).toBe('5Mo')
      expect(boldSizes[2].text()).toBe('5Mo')
      expect(boldSizes[3].text()).toBe('10Mo')
      expect(boldSizes[4].text()).toBe('10Mo')
    })
  })
})
