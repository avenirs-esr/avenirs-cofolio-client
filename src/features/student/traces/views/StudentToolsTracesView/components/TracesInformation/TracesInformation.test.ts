import { CardStub } from '@/common/components/cards/Card/Card.stub'
import TracesInformation from '@/features/student/traces/views/StudentToolsTracesView/components/TracesInformation/TracesInformation.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a traces information component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TracesInformation>>

  const stubs = {
    Card: CardStub
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
    BddTest().then('it should render a Card', () => {
      const card = wrapper.findComponent(CardStub)
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
