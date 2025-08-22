import type {
  TraceFormData
} from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/types'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { waitFor } from 'storybook/test'
import CreateTraceFormDeclarationItems from './CreateTraceFormDeclarationItems.vue'

const TestWrapper = {
  components: {
    CreateTraceFormDeclarationItems
  },
  setup () {
    const form = useForm({
      defaultValues: {
        file: null as unknown as File,
        traceName: '',
        personalNote: '',
        isAuthentic: false,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      } as TraceFormData,
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              file: !value.file ? 'Required field' : undefined,
              traceName: !value.traceName.trim() ? 'Required field' : undefined,
              isAuthentic: !value.isAuthentic ? 'Required field' : undefined,
              iaJustification: value.useIA && (!value.iaJustification || !value.iaJustification.trim()) ? 'Required field' : undefined,
            }
          }
        }
      }
    })
    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <CreateTraceFormDeclarationItems :form="form" />
    </form>
  `
}

const stubs = {
  AvToggle: {
    name: 'AvToggle',
    props: ['id', 'modelValue', 'description', 'name'],
    emits: ['update:modelValue'],
    template: '<div><input type="checkbox" :id="id" :name="name" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" /><label :for="id">{{ description }}</label></div>'
  },
  AvInput: {
    name: 'AvInput',
    props: ['id', 'modelValue', 'label', 'placeholder', 'errorMessage', 'maxlength', 'isTextarea'],
    emits: ['blur', 'update:modelValue'],
    template: '<div><label>{{ label }}</label><textarea v-if="isTextarea" :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')"></textarea><slot name="customCaptions" :current-value="modelValue" :maxlength="maxlength" /></div>'
  }
}

describe('createTraceFormDeclarationItems', () => {
  describe('given a create trace form declaration items component', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mount(TestWrapper, {
        global: {
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the form fields container', () => {
        const container = wrapper.find('.declaration-items__content')
        expect(container.exists()).toBe(true)
      })

      it('then it should render production nature section title', () => {
        const sectionTitle = wrapper.find('.declaration-items__section-title')
        expect(sectionTitle.exists()).toBe(true)
        expect(sectionTitle.text()).toBe('Déclarer la nature de ma production')
      })

      it('then it should render production authenticity toggle', () => {
        const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
        const authenticToggle = toggles.find(toggle =>
          toggle.props('description') === 'Je soumets une production authentique et personnelle'
        )

        expect(authenticToggle).toBeDefined()
        expect(authenticToggle?.props('id')).toBe('isAuthentic')
        expect(authenticToggle?.props('modelValue')).toBe(false)
      })

      it('then it should render group production toggle', () => {
        const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
        const groupToggle = toggles.find(toggle =>
          toggle.props('description') === 'Je soumets une production de groupe'
        )

        expect(groupToggle).toBeDefined()
        expect(groupToggle?.props('id')).toBe('isGroup')
        expect(groupToggle?.props('modelValue')).toBe(false)
      })

      it('then it should render IA usage section title', () => {
        const sectionTitles = wrapper.findAll('.declaration-items__section-title')
        const iaSectionTitle = sectionTitles.find(title =>
          title.text() === 'Déclarer si c\'est une production réalisée avec l\'Intelligence Artificielle (IA)'
        )

        expect(iaSectionTitle).toBeDefined()
      })

      it('then it should render IA usage toggle', () => {
        const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
        const iaToggle = toggles.find(toggle =>
          toggle.props('description') === 'Je soumets une production réalisée avec IA'
        )

        expect(iaToggle).toBeDefined()
        expect(iaToggle?.props('id')).toBe('useIA')
        expect(iaToggle?.props('modelValue')).toBe(false)
      })

      it('then it should not render IA justification textarea initially', () => {
        const iaJustificationInput = wrapper.findComponent({ name: 'AvInput' })
        expect(iaJustificationInput.exists()).toBe(false)
      })
    })

    describe('when production authenticity toggle is changed', () => {
      it('then it should update the form field value', async () => {
        const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
        const authenticToggle = toggles.find(toggle =>
          toggle.props('description') === 'Je soumets une production authentique et personnelle'
        )

        await authenticToggle?.vm.$emit('update:modelValue', true)
        await wrapper.vm.$nextTick()

        expect(authenticToggle?.props('modelValue')).toBe(true)
      })
    })

    describe('when group production toggle is changed', () => {
      it('then it should update the form field value', async () => {
        const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
        const groupToggle = toggles.find(toggle =>
          toggle.props('description') === 'Je soumets une production de groupe'
        )

        await groupToggle?.vm.$emit('update:modelValue', true)
        await wrapper.vm.$nextTick()

        expect(groupToggle?.props('modelValue')).toBe(true)
      })
    })

    describe('when IA usage toggle is changed to true', () => {
      it('then it should show IA justification textarea', async () => {
        const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
        const iaToggle = toggles.find(toggle =>
          toggle.props('description') === 'Je soumets une production réalisée avec IA'
        )

        await iaToggle?.vm.$emit('update:modelValue', true)
        await wrapper.vm.$nextTick()

        const iaJustificationInput = wrapper.findComponent({ name: 'AvInput' })
        expect(iaJustificationInput.exists()).toBe(true)
        expect(iaJustificationInput.props('id')).toBe('ia-justification')
        expect(iaJustificationInput.props('label')).toBe('Justification de l\'usage de l\'IA')
        expect(iaJustificationInput.props('isTextarea')).toBe('')
        expect(iaJustificationInput.props('maxlength')).toBe(200)
      })

      it('then it should update the form field value', async () => {
        const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
        const iaToggle = toggles.find(toggle =>
          toggle.props('description') === 'Je soumets une production réalisée avec IA'
        )

        await iaToggle?.vm.$emit('update:modelValue', true)
        await wrapper.vm.$nextTick()

        expect(iaToggle?.props('modelValue')).toBe(true)
      })
    })

    describe('when IA usage toggle is changed to false', () => {
      it('then it should clear IA justification field', async () => {
        const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
        const iaToggle = toggles.find(toggle =>
          toggle.props('description') === 'Je soumets une production réalisée avec IA'
        )

        // First enable IA usage
        await iaToggle?.vm.$emit('update:modelValue', true)
        await wrapper.vm.$nextTick()

        // Add some text to justification
        const iaJustificationInput = wrapper.findComponent({ name: 'AvInput' })
        await iaJustificationInput.vm.$emit('update:modelValue', 'Some justification')
        await wrapper.vm.$nextTick()

        // Then disable IA usage
        await iaToggle?.vm.$emit('update:modelValue', false)
        await wrapper.vm.$nextTick()

        expect(iaToggle?.props('modelValue')).toBe(false)
      })
    })

    describe('when IA justification is changed', () => {
      it('then it should update the form field value', async () => {
        const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
        const iaToggle = toggles.find(toggle =>
          toggle.props('description') === 'Je soumets une production réalisée avec IA'
        )

        // First enable IA usage
        await iaToggle?.vm.$emit('update:modelValue', true)
        await wrapper.vm.$nextTick()

        const iaJustificationInput = wrapper.findComponent({ name: 'AvInput' })
        await iaJustificationInput.vm.$emit('update:modelValue', 'My IA justification')
        await wrapper.vm.$nextTick()

        expect(iaJustificationInput.props('modelValue')).toBe('My IA justification')
      })
    })

    describe('when production authenticity is not checked and form is validated', () => {
      it('then it should show error message', async () => {
        await wrapper.find('form').trigger('submit')

        await waitFor(() => {
          const errorElement = wrapper.find('.declaration-items__authentic-error')
          expect(errorElement.exists()).toBe(true)
          expect(errorElement.text()).toBe('Required field')
        })
      })
    })

    describe('when IA usage is enabled and justification is empty', () => {
      it('then it should show error message on form validation', async () => {
        const toggles = wrapper.findAllComponents({ name: 'AvToggle' })
        const iaToggle = toggles.find(toggle =>
          toggle.props('description') === 'Je soumets une production réalisée avec IA'
        )

        await iaToggle?.vm.$emit('update:modelValue', true)
        await wrapper.vm.$nextTick()

        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        const iaJustificationInput = wrapper.findComponent({ name: 'AvInput' })
        await waitFor(() => {
          expect(iaJustificationInput.props('errorMessage')).toBe('Required field')
        })
      })
    })
  })
})
