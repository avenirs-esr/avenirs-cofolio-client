import type { TraceFormData } from '@/features/traces'
import { ETraceAuthorType } from '@/api/avenir-esr'
import { TraceAiJustificationTextareaStub } from '@/features/traces/components/interactions/inputs/TraceAiJustificationTextarea/TraceAiJustificationTextarea.stub'
import { TraceAuthorTypeRadioSetStub } from '@/features/traces/components/interactions/radios/TraceAuthorTypeRadioSet/TraceAuthorTypeRadioSet.stub'
import { isTraceFileType } from '@/features/traces/utils/trace.types-guard'
import CreateTraceFormDeclarationItems from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormDeclarationItems/CreateTraceFormDeclarationItems.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: { CreateTraceFormDeclarationItems },
  setup () {
    const form = useForm({
      defaultValues: {
        file: null as unknown as File,
        traceName: '',
        personalNote: '',
        authorType: null,
        useIA: false,
        iaJustification: ''
      } as TraceFormData,
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              file: isTraceFileType(value) && !value.file ? 'Required field' : undefined,
              traceName: !value.traceName.trim() ? 'Required field' : undefined,
              authorType: !value.authorType ? 'Required field' : undefined,
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

  const getIaJustificationInput = () => wrapper.findComponent(TraceAiJustificationTextareaStub)
  const getRadioSet = () => wrapper.findComponent({ name: 'TraceAuthorTypeRadioSet' })

  const stubs = {
    TraceAiJustificationTextarea: TraceAiJustificationTextareaStub,
    TraceAuthorTypeRadioSet: TraceAuthorTypeRadioSetStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the form fields container', () => {
      expect(wrapper.find('[data-testid="declaration-items__content"]').exists()).toBe(true)
    })

    BddTest().then('it should render production nature section', () => {
      expect(wrapper.find('[data-testid="nature-section"]').exists()).toBe(true)
    })

    BddTest().then('it should render the TraceAuthorTypeRadioSet', () => {
      expect(getRadioSet().exists()).toBe(true)
    })

    BddTest().then('it should have null initial authorType', () => {
      expect(getRadioSet().props('modelValue')).toBeNull()
    })

    BddTest().then('it should render IA usage section', () => {
      expect(wrapper.find('[data-testid="ia-usage-section"]').exists()).toBe(true)
    })

    BddTest().then('it should not render IA justification textarea initially', () => {
      expect(getIaJustificationInput().exists()).toBe(false)
    })
  })

  BddTest().when('the author type is selected', () => {
    BddTest().then('it should update the form field value', async () => {
      await getRadioSet().vm.$emit('update:modelValue', ETraceAuthorType.PERSONAL)
      await wrapper.vm.$nextTick()
      expect(getRadioSet().props('modelValue')).toBe(ETraceAuthorType.PERSONAL)
    })
  })

  BddTest().when('the IA usage toggle is changed to true', () => {
    BddTest().then('it should show IA justification textarea', async () => {
      const iaToggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })
      await iaToggle.vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()
      expect(getIaJustificationInput().exists()).toBe(true)
    })
  })

  BddTest().when('the IA usage is enabled and justification is empty', () => {
    BddTest().then('it should show error message on form validation', async () => {
      const iaToggle = wrapper.findComponent({ name: 'TraceAiUsageToggle' })
      await iaToggle.vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
      await vi.waitFor(() => {
        expect(getIaJustificationInput().props('errorMessage')).toBe('Required field')
      })
    })
  })

  BddTest().when('authorType is null and form is submitted', () => {
    BddTest().then('it should show error on authorType field', async () => {
      await wrapper.find('form').trigger('submit')
      await vi.waitFor(() => {
        const radioSet = getRadioSet()
        expect(radioSet.props('errorMessage')).toBe('Required field')
      })
    })
  })
})
