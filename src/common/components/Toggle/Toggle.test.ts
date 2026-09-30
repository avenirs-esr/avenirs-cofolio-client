import type { VueWrapper } from '@vue/test-utils'
import Toggle, { type ToggleProps } from '@/common/components/Toggle/Toggle.vue'
import { AvToggleStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { h, type VNode } from 'vue'

const ACTIVE_TEXT = 'Oui'
const INACTIVE_TEXT = 'Non'

BddTest().given('a Toggle component', () => {
  let wrapper: VueWrapper<InstanceType<typeof Toggle>>

  const stubs = {
    AvToggle: AvToggleStub,
  }

  const mountWith = (
    props: Partial<ToggleProps> = {},
    options: {
      attrs?: Record<string, unknown>
      slots?: {
        default?: (props: { active: boolean }) => VNode
      }
    } = {},
  ) => {
    wrapper = mount(Toggle, {
      props: {
        modelValue: true,
        ...props,
      },
      ...options,
      global: {
        stubs,
      },
    })
  }

  const getToggle = () => wrapper.findComponent(AvToggleStub)
  const getActiveText = () => wrapper.find('[data-testid="toggle-active"]')
  const getInactiveText = () => wrapper.find('[data-testid="toggle-inactive"]')

  const setModelValue = async (value: boolean) => await wrapper.setProps({ modelValue: value })

  BddTest().when('the component is mounted with modelValue true', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should display the default active text', () => {
      expect(getActiveText().text()).toBe(ACTIVE_TEXT)
    })
  })

  BddTest().when('the component is mounted with modelValue false', () => {
    beforeEach(() => {
      mountWith({ modelValue: false })
    })

    BddTest().then('it should display the default inactive text', () => {
      expect(getInactiveText().text()).toBe(INACTIVE_TEXT)
    })
  })

  BddTest().when('the component has custom texts', () => {
    const activeText = 'Activé'
    const inactiveText = 'Désactivé'

    beforeEach(() => {
      mountWith({ activeText, inactiveText })
    })

    BddTest().then('it should display the custom active text', () => {
      expect(getActiveText().text()).toBe(activeText)
    })

    BddTest().then('it should display the custom inactive text when modelValue changes', async () => {
      await setModelValue(false)

      expect(getInactiveText().text()).toBe(inactiveText)
    })
  })

  BddTest().when('the component receives a custom slot', () => {
    beforeEach(() => {
      mountWith({}, {
        slots: {
          default: ({ active }) => h('span', { class: 'custom-status' }, `Custom ${active}`)
        }
      })
    })

    BddTest().then('it should render the slot content with the active state', () => {
      expect(wrapper.text()).toContain('Custom true')
      expect(getActiveText().exists()).toBe(false)
    })

    BddTest().then('it should render the slot content with the inactive state when modelValue changes', async () => {
      await setModelValue(false)
      expect(wrapper.text()).toContain('Custom false')
      expect(getInactiveText().exists()).toBe(false)
    })
  })

  BddTest().when('the component forwards props to AvToggle', () => {
    const props = {
      description: 'Description',
      disabled: true,
    }

    beforeEach(() => {
      mountWith(props)
    })

    BddTest().then('it should forward AvToggle props', () => {
      expect(getToggle().props()).toMatchObject(props)
    })
  })

  BddTest().when('the AvToggle emits a value change', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should emit update:modelValue', async () => {
      await getToggle().vm.$emit('update:modelValue', false)
      expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    })
  })
})
