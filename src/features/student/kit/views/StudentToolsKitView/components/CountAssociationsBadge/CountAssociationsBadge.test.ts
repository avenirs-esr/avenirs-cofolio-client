import type { VueWrapper } from '@vue/test-utils'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import CountAssociationsBadge from '@/features/student/kit/views/StudentToolsKitView/components/CountAssociationsBadge/CountAssociationsBadge.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

const stubs = { AvIconText: AvIconTextStub }

function mountCountAssociationsBadge (type: EAssociationContextType, count: number) {
  return mountComponent(CountAssociationsBadge, {
    props: { type, count },
    global: { stubs }
  })
}

BddTest().given('a count associations badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof CountAssociationsBadge>>

  BddTest().when('the type is a trace with several occurrences', () => {
    beforeEach(() => {
      wrapper = mountCountAssociationsBadge(EAssociationContextType.TRACE, 3)
    })

    BddTest().then('it should render the count with the plural trace label', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe('3 traces')
    })

    BddTest().then('it should render the traces icon', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('icon')).toBe(ICONS.TRACES)
    })
  })

  BddTest().when('the type is a declared skill with a single occurrence', () => {
    beforeEach(() => {
      wrapper = mountCountAssociationsBadge(EAssociationContextType.DECLARED_SKILL, 1)
    })

    BddTest().then('it should render the count with the singular skill label', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe('1 compétence')
    })

    BddTest().then('it should render the skills icon', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('icon')).toBe(ICONS.SKILLS)
    })
  })

  BddTest().when('the type is a declared experience', () => {
    beforeEach(() => {
      wrapper = mountCountAssociationsBadge(EAssociationContextType.DECLARED_EXPERIENCE, 2)
    })

    BddTest().then('it should render the count with the plural experience label', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe('2 expériences')
    })

    BddTest().then('it should render the experiences icon', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('icon')).toBe(ICONS.EXPERIENCES)
    })
  })

  BddTest().when('the type is a declared activity', () => {
    beforeEach(() => {
      wrapper = mountCountAssociationsBadge(EAssociationContextType.DECLARED_ACTIVITY, 4)
    })

    BddTest().then('it should render the count with the plural activity label', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe('4 activités')
    })

    BddTest().then('it should render the activity icon', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('icon')).toBe(ICONS.ACTIVITY)
    })
  })
})
