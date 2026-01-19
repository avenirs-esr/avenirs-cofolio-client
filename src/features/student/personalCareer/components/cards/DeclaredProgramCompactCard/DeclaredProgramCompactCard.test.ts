import type { VueWrapper } from '@vue/test-utils'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import DeclaredProgramCompactCard
, {
  type DeclaredProgramCompactCardProps
} from '@/features/student/personalCareer/components/cards/DeclaredProgramCompactCard/DeclaredProgramCompactCard.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a declared program compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramCompactCard>>

  const stubs = { FloatingIconCard: FloatingIconCardStub, AvBadge: AvBadgeStub }

  BddTest().and('valorized is true', async () => {
    const props: DeclaredProgramCompactCardProps = {
      title: 'Program Title',
      valorized: true,
      iconName: 'mdi-school'
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mountComponent(DeclaredProgramCompactCard, { props, global: { stubs } })
      })

      BddTest().then('it should render the valorized badge', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.exists()).toBe(true)

        expect(badge.text()).toBe('Valoriser dans mon CV')
      })
    })
  })

  BddTest().and('valorized is false', async () => {
    const props: DeclaredProgramCompactCardProps = {
      title: 'Program Title',
      valorized: false,
      iconName: 'mdi-school'
    }

    BddTest().when('the component is mounted', () => {
      beforeEach(() => {
        wrapper = mountComponent(DeclaredProgramCompactCard, { props, global: { stubs } })
      })

      BddTest().then('it should not render the valorized badge', () => {
        const badge = wrapper.findComponent(AvBadgeStub)
        expect(badge.exists()).toBe(false)
      })
    })
  })
})
