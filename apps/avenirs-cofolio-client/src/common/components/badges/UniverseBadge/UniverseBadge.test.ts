import type { VueWrapper } from '@vue/test-utils'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { EUniverse } from '@/api/avenir-esr'
import UniverseBadge from '@/common/components/badges/UniverseBadge/UniverseBadge.vue'
import { ICONS } from '@/common/constants'

BddTest().given('a universe badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof UniverseBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  BddTest().when('the universe is STAFF', () => {
    beforeEach(() => {
      wrapper = mountComponent(UniverseBadge, {
        props: {
          universe: EUniverse.STAFF,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should render the staff badge', () => {
      const badge = wrapper.findComponent(AvBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Enseignant(e)')
      expect(badge.props('icon')).toBe(ICONS.STAFF)
    })

    BddTest().then('it should expose the STAFF universe', () => {
      const badge = wrapper.find('[data-testid="universe-badge"]')

      expect(badge.exists()).toBe(true)
      expect(badge.attributes('data-universe')).toBe('STAFF')
    })
  })

  BddTest().when('the universe is STUDENT', () => {
    beforeEach(() => {
      wrapper = mountComponent(UniverseBadge, {
        props: {
          universe: EUniverse.STUDENT,
        },
        global: { stubs },
      })
    })

    BddTest().then('it should render the student badge', () => {
      const badge = wrapper.findComponent(AvBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Apprenant(e)')
      expect(badge.props('icon')).toBe(ICONS.STUDENT)
    })

    BddTest().then('it should expose the STUDENT universe', () => {
      const badge = wrapper.find('[data-testid="universe-badge"]')

      expect(badge.exists()).toBe(true)
      expect(badge.attributes('data-universe')).toBe('STUDENT')
    })
  })
})
