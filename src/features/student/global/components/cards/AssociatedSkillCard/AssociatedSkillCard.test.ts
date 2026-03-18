import AssociatedSkillCard, { type AssociatedSkillCardProps } from '@/features/student/global/components/cards/AssociatedSkillCard/AssociatedSkillCard.vue'
import { AssociationCardStub } from '@/features/student/global/components/cards/AssociationCard/AssociationCard.stub'
import { ICONS } from '@/features/student/global/icons'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect, vi } from 'vitest'

BddTest().given('an associatied skill card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedSkillCard>>

  const stubs = { AssociationCard: AssociationCardStub }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    const props: AssociatedSkillCardProps = {
      title: 'Skill',
      to: '/test'
    }

    beforeEach(() => {
      wrapper = mount(AssociatedSkillCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the AssociationCard with the correct props', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)
      expect(associationCard.exists()).toBe(true)
      expect(associationCard.props()).toMatchObject({
        title: props.title,
        icon: ICONS.SKILLS,
        color: 'var(--card)',
        backgroundColor: 'var(--dark-background-primary1)',
        to: props.to
      })
    })
  })
})
