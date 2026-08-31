import type { VueWrapper } from '@vue/test-utils'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { FloatingIconCardStub } from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import SelfKnowledgeElementCompactCard, { type SelfKnowledgeElementCompactCardProps } from '@/features/selfKnowledge/components/cards/SelfKnowledgeElementCompactCard/SelfKnowledgeElementCompactCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a self knowledge element compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementCompactCard>>

  const stubs = { FloatingIconCard: FloatingIconCardStub, ValorizedBadge: ValorizedBadgeStub }

  BddTest().and('valorized is true', async () => {
    const props: SelfKnowledgeElementCompactCardProps = {
      title: 'Element Title',
      valorized: true,
      iconName: 'mdi-book'
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mountComponent(SelfKnowledgeElementCompactCard, { props, global: { stubs } })
      })

      BddTest().then('it should render the valorized badge', () => {
        const badge = wrapper.findComponent(ValorizedBadgeStub)
        expect(badge.exists()).toBe(true)
      })
    })
  })

  BddTest().and('valorized is false', async () => {
    const props: SelfKnowledgeElementCompactCardProps = {
      title: 'Element Title',
      valorized: false,
      iconName: 'mdi-book'
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mountComponent(SelfKnowledgeElementCompactCard, { props, global: { stubs } })
      })

      BddTest().then('it should not render the valorized badge', () => {
        const badge = wrapper.findComponent(ValorizedBadgeStub)

        expect(badge.exists()).toBe(false)
      })
    })
  })
})
