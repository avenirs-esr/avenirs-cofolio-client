import type { UpdateDeclaredSkillForm } from '@/features/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'
import KitValorizationToggleFormField from '@/features/global/components/interaction/formFields/KitValorizationToggleFormField/KitValorizationToggleFormField.vue'
import { ValorizeToggleStub } from '@/features/global/components/interaction/toggles/ValorizeToggle/ValorizeToggle.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: {
    KitValorizationToggleFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        valorized: false
      }
    }) as unknown as UpdateDeclaredSkillForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <KitValorizationToggleFormField :form="form" />
    </form>
  `
}

BddTest().given('a kit valorization toggle form field component', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(TestWrapper, {
      global: {
        stubs: {
          ValorizeToggle: ValorizeToggleStub
        }
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the valorize toggle', () => {
      const toggle = wrapper.findComponent({ name: 'ValorizeToggle' })
      expect(toggle.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const toggle = wrapper.findComponent({ name: 'ValorizeToggle' })
      expect(toggle.props('id')).toBe('kit-valorization')
    })

    BddTest().then('it should have the correct name', () => {
      const toggle = wrapper.findComponent({ name: 'ValorizeToggle' })
      expect(toggle.props('name')).toBe('valorized')
    })

    BddTest().then('it should have false initial value', () => {
      const toggle = wrapper.findComponent({ name: 'ValorizeToggle' })
      expect(toggle.props('modelValue')).toBe(false)
    })
  })

  BddTest().when('the user toggles the checkbox', () => {
    BddTest().then('it should update the form field value', async () => {
      const toggle = wrapper.findComponent({ name: 'ValorizeToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updatedToggle = wrapper.findComponent({ name: 'ValorizeToggle' })
        expect(updatedToggle.props('modelValue')).toBe(true)
      })
    })

    BddTest().then('it should emit change event', async () => {
      const formField = wrapper.findComponent({ name: 'KitValorizationToggleFormField' })
      const toggle = wrapper.findComponent({ name: 'ValorizeToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const emitted = formField.emitted('change')
        expect(emitted).toBeTruthy()
        expect(emitted?.[0]).toEqual([true])
      })
    })
  })

  BddTest().when('the toggle is changed to false', () => {
    BddTest().then('it should emit change event with false', async () => {
      const formField = wrapper.findComponent({ name: 'KitValorizationToggleFormField' })
      const toggle = wrapper.findComponent({ name: 'ValorizeToggle' })
      const checkbox = toggle.find('input[type="checkbox"]')

      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      await checkbox.setValue(false)
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const emitted = formField.emitted('change')
        expect(emitted).toBeTruthy()
        expect(emitted?.[emitted.length - 1]).toEqual([false])
      })
    })
  })
})
