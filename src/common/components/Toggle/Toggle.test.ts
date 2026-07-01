import type { VueWrapper } from '@vue/test-utils'
import Toggle, { type ToggleProps } from '@/common/components/Toggle/Toggle.vue'
import { AvToggleStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'

BddTest().given('a Toggle component', () => {
  let wrapper: VueWrapper<InstanceType<typeof Toggle>>

  const stubs = {
    AvToggle: AvToggleStub
  }

  function mountDefault (props: Partial<ToggleProps> = {}) {
    wrapper = mount(Toggle, {
      props: {
        modelValue: true,
        description: 'test',
        ...props
      },
      global: { stubs }
    })
  }

  const getToggle = () => wrapper.findComponent(AvToggleStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render with default props', () => {
      const toggle = getToggle()
      expect(toggle.props('description')).toBe('test')
      expect(toggle.props('activeText')).toBe('Oui')
      expect(toggle.props('inactiveText')).toBe('Non')
    })
  })

  BddTest().when('the component is mounted with custom props', () => {
    beforeEach(() => mountDefault({
      description: 'Some description',
      activeText: 'Activé',
      inactiveText: 'Désactivé'
    }))

    BddTest().then('it should render with custom props', () => {
      const toggle = getToggle()
      expect(toggle.props('description')).toBe('Some description')
      expect(toggle.props('activeText')).toBe('Activé')
      expect(toggle.props('inactiveText')).toBe('Désactivé')
    })
  })
})
