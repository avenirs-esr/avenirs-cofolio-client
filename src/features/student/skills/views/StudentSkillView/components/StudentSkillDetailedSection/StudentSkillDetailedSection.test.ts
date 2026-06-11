import type { VueWrapper } from '@vue/test-utils'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import StudentSkillDetailedSection from '@/features/student/skills/views/StudentSkillView/components/StudentSkillDetailedSection/StudentSkillDetailedSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student skill detailed placeholder section', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentSkillDetailedSection>>

  const stubs = { Card: CardStub }

  beforeEach(() => {
    wrapper = mountComponent(StudentSkillDetailedSection, {
      props: { skillName: 'Réaliser un cahier des charges fonctionnels' },
      global: { stubs },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main container with correct class', () => {
      expect(wrapper.find('.student-skill-detailed-section').exists()).toBe(true)
    })

    BddTest().then('it should render a Card stub with slots', () => {
      const card = wrapper.find('[data-testid="card-stub"]')
      expect(card.exists()).toBe(true)
      expect(card.find('[data-testid="card-stub-title"]').exists()).toBe(true)
      expect(card.find('[data-testid="card-stub-body"]').exists()).toBe(true)
    })

    BddTest().then('it should render the translated title', () => {
      const h3 = wrapper.find('[data-testid="card-stub-title"] h3')
      expect(h3.exists()).toBe(true)
      expect(h3.text()).toBe('Compétence')
    })

    BddTest().then('it should render the skill name in body', () => {
      const name = wrapper.find('[data-testid="card-stub-body"] .student-skill-detailed-name')
      expect(name.exists()).toBe(true)
      expect(name.text()).toBe('Réaliser un cahier des charges fonctionnels')
    })
  })

  BddTest().when('the skillName prop changes', () => {
    BddTest().then('it should update the displayed name', async () => {
      const NEW_NAME = 'Concevoir une architecture logicielle'
      await wrapper.setProps({ skillName: NEW_NAME })

      const name = wrapper.find('[data-testid="card-stub-body"] .student-skill-detailed-name')
      expect(name.exists()).toBe(true)
      expect(name.text()).toBe(NEW_NAME)
    })
  })
})
