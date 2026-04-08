import type {
  AssociatedDeclaredSkillsCardProps
} from '@/features/student/declaredSkills/components/cards/AssociatedDeclaredSkillsCard/AssociatedDeclaredSkillsCard.vue'
import { createMockedDeclaredActivityAssociations } from '@/__mocks__/fixtures/student'
import { AssociatedDeclaredSkillsCard } from '@/features/student/declaredSkills'
import { AssociatedSkillCardStub } from '@/features/student/global/components/cards/AssociatedSkillCard/AssociatedSkillCard.stub'
import { AvCardStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associated declared skills card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedDeclaredSkillsCard>>

  const stubs = {
    AvCard: AvCardStub,
    AvIconText: AvIconTextStub,
    AssociatedSkillCard: AssociatedSkillCardStub,
  }

  BddTest().when('the component is mounted with associated declared skills', () => {
    const props: AssociatedDeclaredSkillsCardProps = {
      associatedDeclaredSkills: createMockedDeclaredActivityAssociations(3)
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredSkillsCard, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the av card', () => {
      const card = wrapper.findComponent(AvCardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should render a card for each associated declared skill', () => {
      const skillCards = wrapper.findAllComponents(AssociatedSkillCardStub)
      expect(skillCards).toHaveLength(props.associatedDeclaredSkills.length)
    })
  })

  BddTest().when('the component is mounted with no associated declared skills', () => {
    const props: AssociatedDeclaredSkillsCardProps = {
      associatedDeclaredSkills: []
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredSkillsCard, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render nothing', () => {
      const card = wrapper.findComponent(AvCardStub)
      expect(card.exists()).toBe(false)
    })
  })
})
