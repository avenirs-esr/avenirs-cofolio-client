import { EProgramStatus } from '@/api/avenir-esr'
import DeclaredProgramStatusBadge
  from '@/features/personalCareer/components/badges/DeclaredProgramStatusBadge/DeclaredProgramStatusBadge.vue'
import { ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared program status badge', () => {
  let wrapper: VueWrapper
  let badge: VueWrapper<InstanceType<typeof AvBadgeStub>>

  const stubs = { AvBadge: AvBadgeStub }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with NOT_STARTED status', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredProgramStatusBadge, {
        props: { status: EProgramStatus.NOT_STARTED },
        global: { stubs }
      })
      badge = wrapper.findComponent(AvBadgeStub) as VueWrapper<InstanceType<typeof AvBadgeStub>>
    })

    BddTest().then('it should display the not started label', () => {
      expect(badge.props('label')).toBe('Non démarrée')
    })

    BddTest().then('it should apply the light neutral background color', () => {
      expect(badge.props('backgroundColor')).toBe('var(--light-background-neutral)')
    })

    BddTest().then('it should apply the text1 color', () => {
      expect(badge.props('color')).toBe('var(--text1)')
    })

    BddTest().then('it should use the hourglass icon', () => {
      expect(badge.props('icon')).toBe(ICONS_DATA_URL.MDI_HOURGLASS)
    })
  })

  BddTest().when('the component is mounted with IN_PROGRESS status', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredProgramStatusBadge, {
        props: { status: EProgramStatus.IN_PROGRESS },
        global: { stubs }
      })
      badge = wrapper.findComponent(AvBadgeStub) as VueWrapper<InstanceType<typeof AvBadgeStub>>
    })

    BddTest().then('it should display the in progress label', () => {
      expect(badge.props('label')).toBe('En cours')
    })

    BddTest().then('it should apply the light primary2 background color', () => {
      expect(badge.props('backgroundColor')).toBe('var(--light-background-primary2)')
    })

    BddTest().then('it should apply the light foreground primary1 color', () => {
      expect(badge.props('color')).toBe('var(--light-foreground-primary1)')
    })

    BddTest().then('it should use the hourglass icon', () => {
      expect(badge.props('icon')).toBe(ICONS_DATA_URL.MDI_HOURGLASS)
    })
  })

  BddTest().when('the component is mounted with COMPLETED status', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredProgramStatusBadge, {
        props: { status: EProgramStatus.COMPLETED },
        global: { stubs }
      })
      badge = wrapper.findComponent(AvBadgeStub) as VueWrapper<InstanceType<typeof AvBadgeStub>>
    })

    BddTest().then('it should display the completed label', () => {
      expect(badge.props('label')).toBe('Terminée')
    })

    BddTest().then('it should apply the light neutral background color', () => {
      expect(badge.props('backgroundColor')).toBe('var(--light-background-neutral)')
    })

    BddTest().then('it should apply the text1 color', () => {
      expect(badge.props('color')).toBe('var(--text1)')
    })

    BddTest().then('it should use the check circle icon', () => {
      expect(badge.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE)
    })
  })
})
