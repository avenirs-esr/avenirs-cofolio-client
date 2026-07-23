import type { VueWrapper } from '@vue/test-utils'
import AssociationBadge from '@/common/components/badges/AssociationBadge/AssociationBadge.vue'
import { ICONS } from '@/common/constants'
import { AssociationBadgeType } from '@/common/types'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('an association badge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociationBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  const mountWith = (count: number, type: AssociationBadgeType) => {
    wrapper = mountComponent(AssociationBadge, {
      props: { count, type },
      global: { stubs }
    })
  }

  const findBadge = () => wrapper.findComponent(AvBadgeStub)

  BddTest().when('the type is skill and count is 1', () => {
    beforeEach(() => {
      mountWith(1, AssociationBadgeType.SKILL)
    })

    BddTest().then('it should display a singular skill badge', () => {
      const badge = findBadge()

      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('1 compétence')
      expect(badge.props('icon')).toBe(ICONS.SKILLS)
    })
  })

  BddTest().when('the type is skill and count is greater than 1', () => {
    beforeEach(() => {
      mountWith(3, AssociationBadgeType.SKILL)
    })

    BddTest().then('it should display a plural skill badge', () => {
      const badge = findBadge()

      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('3 compétences')
      expect(badge.props('icon')).toBe(ICONS.SKILLS)
    })
  })

  BddTest().when('the type is experience', () => {
    beforeEach(() => {
      mountWith(2, AssociationBadgeType.EXPERIENCE)
    })

    BddTest().then('it should display an experience badge', () => {
      const badge = findBadge()

      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('2 expériences')
      expect(badge.props('icon')).toBe(ICONS.EXPERIENCES)
    })
  })

  BddTest().when('the type is activity', () => {
    beforeEach(() => {
      mountWith(1, AssociationBadgeType.ACTIVITY)
    })

    BddTest().then('it should display an activity badge', () => {
      const badge = findBadge()

      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('1 activité')
      expect(badge.props('icon')).toBe(ICONS.ACTIVITY)
    })
  })

  BddTest().when('the type is trace', () => {
    beforeEach(() => {
      mountWith(4, AssociationBadgeType.TRACE)
    })

    BddTest().then('it should display a trace badge', () => {
      const badge = findBadge()

      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('4 traces')
      expect(badge.props('icon')).toBe(ICONS.TRACES)
    })
  })
})
