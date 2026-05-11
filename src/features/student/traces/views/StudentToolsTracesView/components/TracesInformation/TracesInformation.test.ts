import TracesInformation from '@/features/student/traces/views/StudentToolsTracesView/components/TracesInformation/TracesInformation.vue'
import { AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a traces information component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TracesInformation>>

  const stubs = {
    AvCard: AvCardStub
  }

  beforeEach(() => {
    wrapper = mount(TracesInformation, {
      global: {
        stubs,
        plugins: []
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render an AvCard', () => {
      const card = wrapper.findComponent({ name: 'AvCard' })
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should display the title', () => {
      expect(wrapper.text()).toContain('Mes traces')
    })

    BddTest().then('it should display the description', () => {
      expect(wrapper.text()).toContain('Vous pouvez associer vos traces')
    })
  })
})
