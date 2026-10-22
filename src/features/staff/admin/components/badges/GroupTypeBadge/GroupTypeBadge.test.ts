import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'
import { EGroupType } from '@/api/avenir-esr'
import GroupTypeBadge from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.vue'

BddTest().given('a group type badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupTypeBadge>>

  const mountWith = (type: EGroupType) => wrapper = mount(GroupTypeBadge, {
    props: { type },
    global: { stubs: { AvBadge: AvBadgeStub } }
  })

  const PROGRAM_LABEL = 'Formation'
  const PROGRAM_OPTION_LABEL = 'Option de formation'
  const STUDENT_GROUP_LABEL = 'Ensemble d\'apprenant(e)s'

  const getBadge = () => wrapper.findComponent(AvBadgeStub)

  BddTest().when('the component is mounted with PROGRAM type', () => {
    beforeEach(() => {
      mountWith(EGroupType.PROGRAM)
    })

    BddTest().then('it should display the translated program label', () => {
      expect(getBadge().props('label')).toBe(PROGRAM_LABEL)
    })

    BddTest().then('it should display the school icon', () => {
      expect(getBadge().props('icon')).toBe(MDI_ICONS.SCHOOL_OUTLINE)
    })
  })

  BddTest().when('the component is mounted with PROGRAM_OPTION type', () => {
    beforeEach(() => {
      mountWith(EGroupType.PROGRAM_OPTION)
    })

    BddTest().then('it should display the translated program option label', () => {
      expect(getBadge().props('label')).toBe(PROGRAM_OPTION_LABEL)
    })

    BddTest().then('it should display the book icon', () => {
      expect(getBadge().props('icon')).toBe(MDI_ICONS.BOOK_OPEN_BLANK_VARIANT_OUTLINE)
    })
  })

  BddTest().when('the component is mounted with STUDENT_GROUP type', () => {
    beforeEach(() => {
      mountWith(EGroupType.STUDENT_GROUP)
    })

    BddTest().then('it should display the translated student group label', () => {
      expect(getBadge().props('label')).toBe(STUDENT_GROUP_LABEL)
    })

    BddTest().then('it should display the people group icon', () => {
      expect(getBadge().props('icon')).toBe(MDI_ICONS.PEOPLE_GROUP_OUTLINE)
    })
  })

  BddTest().when('the badge is rendered', () => {
    beforeEach(() => {
      mountWith(EGroupType.PROGRAM)
    })

    BddTest().then('it should apply the neutral colors', () => {
      expect(getBadge().props('backgroundColor')).toBe('var(--light-background-neutral)')
      expect(getBadge().props('color')).toBe('var(--light-foreground-neutral)')
    })

    BddTest().then('it should expose the group type badge test identifier', () => {
      expect(wrapper.find('[data-testid="group-type-badge"]').exists()).toBe(true)
    })
  })
})
