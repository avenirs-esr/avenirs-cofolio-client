import type { VueWrapper } from '@vue/test-utils'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import SelfKnowledgeElementCompactCard, { type SelfKnowledgeElementCompactCardProps } from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeElementCompactCard/SelfKnowledgeElementCompactCard.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a self knowledge element compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementCompactCard>>

  const stubs = { FloatingIconCard: FloatingIconCardStub, AvBadge: AvBadgeStub }

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
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.exists()).toBe(true)
        expect(badge.text()).toBe('Valoriser dans mes CV')
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
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.exists()).toBe(false)
      })
    })
  })
})
