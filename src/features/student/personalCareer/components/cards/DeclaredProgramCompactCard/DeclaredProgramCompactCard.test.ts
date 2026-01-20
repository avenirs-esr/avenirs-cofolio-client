import type { VueWrapper } from '@vue/test-utils'
import { ValorizedBadgeStub } from '@/common/components/ValorizedBadge/ValorizedBadge.stub'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import DeclaredProgramCompactCard
, {
  type DeclaredProgramCompactCardProps
} from '@/features/student/personalCareer/components/cards/DeclaredProgramCompactCard/DeclaredProgramCompactCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a declared program compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramCompactCard>>
  const stubs = { FloatingIconCard: FloatingIconCardStub, ValorizedBadge: ValorizedBadgeStub }

  BddTest().and('valorized is true', async () => {
    const props: DeclaredProgramCompactCardProps = {
      title: 'Program Title',
      valorized: true
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mountComponent(DeclaredProgramCompactCard, { props, global: { stubs } })
      })

      BddTest().then('it should render the valorized badge', () => {
        const badge = wrapper.findComponent(ValorizedBadgeStub)
        expect(badge.exists()).toBe(true)
      })
    })
  })

  BddTest().and('valorized is false', async () => {
    const props: DeclaredProgramCompactCardProps = {
      title: 'Program Title',
      valorized: false
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mountComponent(DeclaredProgramCompactCard, { props, global: { stubs } })
      })

      BddTest().then('it should not render the valorized badge', () => {
        const badge = wrapper.findComponent(ValorizedBadgeStub)
        expect(badge.exists()).toBe(false)
      })
    })
  })
})
