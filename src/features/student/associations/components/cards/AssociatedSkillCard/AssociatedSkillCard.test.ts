import {
  createMockedDeclaredSkillProgressDTO
} from '@/__mocks__/fixtures/student/skills.fixtures'
import { ICONS, ROUTES } from '@/common/constants'
import AssociatedSkillCard, { type AssociatedSkillCardProps } from '@/features/student/associations/components/cards/AssociatedSkillCard/AssociatedSkillCard.vue'
import { AssociationCardStub } from '@/features/student/associations/components/cards/AssociationCard/AssociationCard.stub'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect, vi } from 'vitest'

BddTest().given('an associatied skill card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedSkillCard>>

  const stubs = { AvBadge: AvBadgeStub, AssociationCard: AssociationCardStub }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    const props: AssociatedSkillCardProps = {
      declaredSkill: createMockedDeclaredSkillProgressDTO(),
    }

    beforeEach(() => {
      wrapper = mount(AssociatedSkillCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the AssociationCard with the correct props', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)
      expect(associationCard.exists()).toBe(true)
      expect(associationCard.props()).toMatchObject({
        title: props.declaredSkill.title,
        icon: ICONS.SKILLS,
        color: 'var(--card)',
        backgroundColor: 'var(--dark-background-primary1)',
        to: { name: ROUTES.STUDENT.DECLARED_SKILL.name, params: { id: props.declaredSkill.id } }
      })
    })

    BddTest().then('it should pass disabled as false to the AssociationCard by default', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)
      expect(associationCard.props('disabled')).toBe(false)
    })

    BddTest().then('it should render the translated type badge and the last path segment badge', () => {
      const badges = wrapper.findAllComponents(AvBadgeStub)

      expect(badges).toHaveLength(2)
      expect(badges[0].props()).toMatchObject({ label: 'Rome 4.0', icon: MDI_ICONS.BOOKMARK_CHECK, small: true, ellipsis: true })
      expect(badges[1].props()).toMatchObject({ label: 'Sous-catégorie', icon: ICONS.SKILLS, small: true, ellipsis: true })
    })
  })

  BddTest().when('the component is mounted with a declared skill without path segment', () => {
    const props: AssociatedSkillCardProps = {
      declaredSkill: { ...createMockedDeclaredSkillProgressDTO(), pathSegments: [] },
    }

    beforeEach(() => {
      wrapper = mount(AssociatedSkillCard, { props, global: { stubs } })
    })

    BddTest().then('it should only render the type badge', () => {
      const badges = wrapper.findAllComponents(AvBadgeStub)

      expect(badges).toHaveLength(1)
      expect(badges[0].props('label')).toBe('Rome 4.0')
    })
  })

  BddTest().when('the component is mounted with disabled=true', () => {
    const props: AssociatedSkillCardProps = {
      declaredSkill: createMockedDeclaredSkillProgressDTO(),
      disabled: true
    }

    beforeEach(() => {
      wrapper = mount(AssociatedSkillCard, { props, global: { stubs } })
    })

    BddTest().then('it should pass disabled=true to the AssociationCard', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)
      expect(associationCard.props('disabled')).toBe(true)
    })
  })
})
