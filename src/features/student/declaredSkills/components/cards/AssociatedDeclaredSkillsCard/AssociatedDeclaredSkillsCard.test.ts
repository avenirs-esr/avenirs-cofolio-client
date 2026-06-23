import type {
  AssociatedDeclaredSkillsCardProps
} from '@/features/student/declaredSkills/components/cards/AssociatedDeclaredSkillsCard/AssociatedDeclaredSkillsCard.vue'
import { createMockedDeclaredActivityAssociations } from '@/__mocks__/fixtures/student'
import { AssociatedDeclaredSkillsCard } from '@/features/student/declaredSkills'
import { AssociatedSkillCardStub } from '@/features/student/global/components/cards/AssociatedSkillCard/AssociatedSkillCard.stub'
import { AssociationsCardStub } from '@/features/student/global/components/cards/AssociationsCard/AssociationsCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associated declared skills card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedDeclaredSkillsCard>>

  const stubs = {
    AssociationsCard: AssociationsCardStub,
    AssociatedSkillCard: AssociatedSkillCardStub,
  }

  BddTest().when('the component is mounted with associated declared skills', () => {
    const props: AssociatedDeclaredSkillsCardProps = {
      associatedDeclaredSkills: createMockedDeclaredActivityAssociations(3)
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AssociatedDeclaredSkillsCard, { props, global: { stubs } })
    })

    BddTest().then('it should render a card for each associated declared skill', () => {
      const skillCards = wrapper.findAllComponents(AssociatedSkillCardStub)
      expect(skillCards).toHaveLength(props.associatedDeclaredSkills.length)
    })

    BddTest().then('it should pass the plural title with count', () => {
      expect(wrapper.findComponent(AssociationsCardStub).props('title')).toBe(`Mes compétences associées (${props.associatedDeclaredSkills.length})`)
    })
  })

  BddTest().when('the component is mounted with no associated declared skills', () => {
    const props: AssociatedDeclaredSkillsCardProps = {
      associatedDeclaredSkills: []
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AssociatedDeclaredSkillsCard, { props, global: { stubs } })
    })

    BddTest().then('it should render nothing', () => {
      expect(wrapper.findComponent(AssociationsCardStub).exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with disabled=true', () => {
    const props: AssociatedDeclaredSkillsCardProps = {
      associatedDeclaredSkills: createMockedDeclaredActivityAssociations(3),
      disabled: true
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AssociatedDeclaredSkillsCard, { props, global: { stubs } })
    })

    BddTest().then('it should pass disabled=true to each AssociatedSkillCard', () => {
      const skillCards = wrapper.findAllComponents(AssociatedSkillCardStub)
      expect(skillCards.length).toBeGreaterThan(0)
      skillCards.forEach(card => expect(card.props('disabled')).toBe(true))
    })
  })
})
