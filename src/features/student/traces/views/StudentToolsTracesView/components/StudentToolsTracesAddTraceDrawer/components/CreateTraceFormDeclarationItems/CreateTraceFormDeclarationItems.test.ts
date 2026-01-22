import type { TraceFormData } from '@/features/student/traces'
import { ToggleStub } from '@/common/components'
import CreateTraceFormDeclarationItems from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormDeclarationItems/CreateTraceFormDeclarationItems.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

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

BddTest().given('a create trace form declaration items component', () => {
  let wrapper: VueWrapper

  const stubs = {
    Toggle: ToggleStub,
    TraceIaJustificationTextarea: {
      name: 'TraceIaJustificationTextarea',
      props: ['id', 'modelValue', 'errorMessage', 'required'],
      emits: ['blur', 'update:modelValue'],
      template: '<div><textarea :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')"></textarea></div>'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the form fields container', () => {
      const container = wrapper.find('[data-testid="declaration-items__content"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render production nature section title', () => {
      const natureSection = wrapper.find('[data-testid="nature-section"]')
      expect(natureSection.exists()).toBe(true)
    })

    BddTest().then('it should render production authenticity toggle', () => {
      const toggles = wrapper.findAllComponents({ name: 'Toggle' })
      const authenticToggle = toggles.find(toggle =>
        toggle.props('description') === 'Je soumets une production authentique et personnelle'
      )

      expect(authenticToggle).toBeDefined()
      expect(authenticToggle?.props('id')).toBe('is-authentic')
      expect(authenticToggle?.props('modelValue')).toBe(false)
    })

    BddTest().then('it should render group production toggle', () => {
      const toggles = wrapper.findAllComponents({ name: 'Toggle' })
      const groupToggle = toggles.find(toggle =>
        toggle.props('description') === 'Je soumets une production de groupe'
      )

      expect(groupToggle).toBeDefined()
      expect(groupToggle?.props('id')).toBe('is-group')
      expect(groupToggle?.props('modelValue')).toBe(false)
    })

    BddTest().then('it should render IA usage section title', () => {
      const iaUsageSection = wrapper.find('[data-testid="ia-usage-section"]')
      expect(iaUsageSection.exists()).toBe(true)

      const iaUsageSectionTitle = iaUsageSection.find('.caption-regular')
      expect(iaUsageSectionTitle.text()).toBe('Déclarer si c\'est une production réalisée avec l\'Intelligence Artificielle (IA)')
    })

    BddTest().then('it should render IA usage toggle', () => {
      const toggles = wrapper.findAllComponents({ name: 'Toggle' })
      const iaToggle = toggles.find(toggle =>
        toggle.props('description') === 'Je soumets une production réalisée avec IA'
      )

      expect(iaToggle).toBeDefined()
      expect(iaToggle?.props('id')).toBe('use-ia')
      expect(iaToggle?.props('modelValue')).toBe(false)
    })

    BddTest().then('it should not render IA justification textarea initially', () => {
      const iaJustificationInput = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      expect(iaJustificationInput.exists()).toBe(false)
    })
  })

  BddTest().when('the production authenticity toggle is changed', () => {
    BddTest().then('it should update the form field value', async () => {
      const toggles = wrapper.findAllComponents({ name: 'Toggle' })
      const authenticToggle = toggles.find(toggle =>
        toggle.props('description') === 'Je soumets une production authentique et personnelle'
      )

      await authenticToggle?.vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()

      expect(authenticToggle?.props('modelValue')).toBe(true)
    })
  })

  BddTest().when('the group production toggle is changed', () => {
    BddTest().then('it should update the form field value', async () => {
      const toggles = wrapper.findAllComponents({ name: 'Toggle' })
      const groupToggle = toggles.find(toggle =>
        toggle.props('description') === 'Je soumets une production de groupe'
      )

      await groupToggle?.vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()

      expect(groupToggle?.props('modelValue')).toBe(true)
    })
  })

  BddTest().when('the IA usage toggle is changed to true', () => {
    BddTest().then('it should show IA justification textarea', async () => {
      const toggles = wrapper.findAllComponents({ name: 'Toggle' })
      const iaToggle = toggles.find(toggle =>
        toggle.props('description') === 'Je soumets une production réalisée avec IA'
      )

      await iaToggle?.vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()

      const iaJustificationInput = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      expect(iaJustificationInput.exists()).toBe(true)
      expect(iaJustificationInput.props('id')).toBe('ia-justification')
      expect(iaJustificationInput.props('required')).toBe(true)
    })

    BddTest().then('it should update the form field value', async () => {
      const toggles = wrapper.findAllComponents({ name: 'Toggle' })
      const iaToggle = toggles.find(toggle =>
        toggle.props('description') === 'Je soumets une production réalisée avec IA'
      )

      await iaToggle?.vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()

      expect(iaToggle?.props('modelValue')).toBe(true)
    })
  })

  BddTest().when('the IA usage toggle is changed to false', () => {
    BddTest().then('it should clear IA justification field', async () => {
      const toggles = wrapper.findAllComponents({ name: 'Toggle' })
      const iaToggle = toggles.find(toggle =>
        toggle.props('description') === 'Je soumets une production réalisée avec IA'
      )

      await iaToggle?.vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()

      const iaJustificationInput = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      await iaJustificationInput.vm.$emit('update:modelValue', 'Some justification')
      await wrapper.vm.$nextTick()

      await iaToggle?.vm.$emit('update:modelValue', false)
      await wrapper.vm.$nextTick()

      expect(iaToggle?.props('modelValue')).toBe(false)
    })
  })

  BddTest().when('the IA justification is changed', () => {
    BddTest().then('it should update the form field value', async () => {
      const toggles = wrapper.findAllComponents({ name: 'Toggle' })
      const iaToggle = toggles.find(toggle =>
        toggle.props('description') === 'Je soumets une production réalisée avec IA'
      )

      await iaToggle?.vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()

      const iaJustificationInput = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      const textarea = iaJustificationInput.find('textarea')

      textarea.element.value = 'My IA justification'
      await textarea.trigger('input')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedInput = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
        expect(updatedInput.props('modelValue')).toBe('My IA justification')
      })
    })
  })

  BddTest().when('the production authenticity is not checked and form is validated', () => {
    BddTest().then('it should show error message', async () => {
      await wrapper.find('form').trigger('submit')

      await vi.waitFor(() => {
        const errorElement = wrapper.find('[data-testid="trace-form__authentic-error"]')
        expect(errorElement.exists()).toBe(true)
        expect(errorElement.text()).toBe('Required field')
      })
    })
  })

  BddTest().when('the IA usage is enabled and justification is empty', () => {
    BddTest().then('it should show error message on form validation', async () => {
      const toggles = wrapper.findAllComponents({ name: 'Toggle' })
      const iaToggle = toggles.find(toggle =>
        toggle.props('description') === 'Je soumets une production réalisée avec IA'
      )

      await iaToggle?.vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()

      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      const iaJustificationInput = wrapper.findComponent({ name: 'TraceIaJustificationTextarea' })
      await vi.waitFor(() => {
        expect(iaJustificationInput.props('errorMessage')).toBe('Required field')
      })
    })
  })
})
