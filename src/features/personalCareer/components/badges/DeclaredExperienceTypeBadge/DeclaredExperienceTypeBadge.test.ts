import { EExperienceType } from '@/api/avenir-esr'
import DeclaredExperienceTypeBadge
  from '@/features/personalCareer/components/badges/DeclaredExperienceTypeBadge/DeclaredExperienceTypeBadge.vue'
import { RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experience type badge', () => {
  let wrapper: VueWrapper
  let badge: VueWrapper<InstanceType<typeof AvBadgeStub>>

  const stubs = { AvBadge: AvBadgeStub }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with a professional experience type', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredExperienceTypeBadge, {
        props: { experienceType: EExperienceType.PROFESSIONAL },
        global: { stubs }
      })
      badge = wrapper.findComponent(AvBadgeStub) as VueWrapper<InstanceType<typeof AvBadgeStub>>
    })

    BddTest().then('it should display the professional label', () => {
      expect(badge.props('label')).toBe('Expérience professionnelle')
    })

    BddTest().then('it should apply the dark primary3 background color', () => {
      expect(badge.props('backgroundColor')).toBe('var(--dark-background-primary3)')
    })

    BddTest().then('it should use the honour line icon', () => {
      expect(badge.props('icon')).toBe(RI_ICONS.HONOUR_LINE)
    })

    BddTest().then('it should use the card2 text color', () => {
      expect(badge.props('color')).toBe('var(--card2)')
    })

    BddTest().then('it should enable ellipsis', () => {
      expect(badge.props('ellipsis')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with a personal experience type', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredExperienceTypeBadge, {
        props: { experienceType: EExperienceType.PERSONAL },
        global: { stubs }
      })
      badge = wrapper.findComponent(AvBadgeStub) as VueWrapper<InstanceType<typeof AvBadgeStub>>
    })

    BddTest().then('it should display the personal label', () => {
      expect(badge.props('label')).toBe('Expérience personnelle')
    })

    BddTest().then('it should apply the dark success background color', () => {
      expect(badge.props('backgroundColor')).toBe('var(--dark-background-success)')
    })
  })
})
