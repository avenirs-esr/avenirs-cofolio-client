import { EAssociationContextType } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants/icons'
import AssociatedElementTypeBadge from '@/features/staff/feedbacks/views/FeedbacksView/components/badges/AssociatedElementTypeBadge/AssociatedElementTypeBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const stubs = {
  AvBadge: AvBadgeStub
}

BddTest().given('an AssociatedElementTypeBadge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedElementTypeBadge>>

  const scenario: Array<{
    type: EAssociationContextType
    label: string
    icon: string
  }> = [
    {
      type: EAssociationContextType.TRACE,
      label: 'Trace',
      icon: ICONS.TRACES
    },
    {
      type: EAssociationContextType.DECLARED_SKILL,
      label: 'Compétence',
      icon: ICONS.SKILLS
    },
    {
      type: EAssociationContextType.DECLARED_EXPERIENCE,
      label: 'Expérience',
      icon: ICONS.EXPERIENCES
    },
    {
      type: EAssociationContextType.DECLARED_ACTIVITY,
      label: 'Activité',
      icon: ICONS.ACTIVITY
    },
  ]

  scenario.forEach(({ type, label, icon }) => {
    BddTest().when(`the badge is rendered with type ${type}`, () => {
      beforeEach(() => {
        wrapper = mount(AssociatedElementTypeBadge, {
          props: { associatedElementType: type },
          global: { stubs }
        })
      })

      BddTest().then('it should render AvBadge', () => {
        expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(true)
      })

      BddTest().then('it should render the correct label', () => {
        expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe(label)
      })

      BddTest().then('it should render the correct icon', () => {
        expect(wrapper.findComponent(AvBadgeStub).props('icon')).toBe(icon)
      })
    })
  })
})
