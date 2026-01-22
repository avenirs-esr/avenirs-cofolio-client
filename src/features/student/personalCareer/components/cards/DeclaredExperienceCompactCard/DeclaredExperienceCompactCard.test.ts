import type { VueWrapper } from '@vue/test-utils'
import { ValorizedBadgeStub } from '@/common/components/ValorizedBadge/ValorizedBadge.stub'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import DeclaredExperienceCompactCard, { type DeclaredExperienceCompactCardProps } from
  '@/features/student/personalCareer/components/cards/DeclaredExperienceCompactCard/DeclaredExperienceCompactCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a declared experience compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceCompactCard>>
  const stubs = { FloatingIconCard: FloatingIconCardStub, ValorizedBadge: ValorizedBadgeStub }

  BddTest().and('valorized is true', async () => {
    const props: DeclaredExperienceCompactCardProps = {
      title: 'Experience Title',
      valorized: true,
      iconName: 'mdi-briefcase',
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mountComponent(DeclaredExperienceCompactCard, { props, global: { stubs } })
      })

      BddTest().then('it should render the valorized badge', () => {
        const badge = wrapper.findComponent(ValorizedBadgeStub)
        expect(badge.exists()).toBe(true)
      })
    })
  })

  BddTest().and('valorized is false', () => {
    const props: DeclaredExperienceCompactCardProps = {
      title: 'Experience Title',
      valorized: false,
      iconName: 'mdi-briefcase',
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mountComponent(DeclaredExperienceCompactCard, { props, global: { stubs } })
      })

      BddTest().then('it should not render the valorized badge', () => {
        const badge = wrapper.findComponent(ValorizedBadgeStub)
        expect(badge.exists()).toBe(false)
      })
    })
  })
})
