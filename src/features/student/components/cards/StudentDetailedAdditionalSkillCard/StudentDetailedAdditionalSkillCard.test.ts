import { type AdditionalSkillDTO, EAdditionalSkillType } from '@/api/avenir-esr'
import StudentDetailedAdditionalSkillCard
  from '@/features/student/components/cards/StudentDetailedAdditionalSkillCard/StudentDetailedAdditionalSkillCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const mockSkill: AdditionalSkillDTO = {
  id: 'add-skill-1',
  title: 'Accueillir des enfants',
  type: EAdditionalSkillType.ROME4,
  pathSegments: ['Relation client', 'Accueillir et orienter']
}

function createWrapper () {
  return mount(StudentDetailedAdditionalSkillCard, {
    props: {
      additionalSkill: mockSkill
    },
    global: {
      stubs: {
        StudentDetailedSkillCard: {
          name: 'StudentDetailedSkillCard',
          props: ['id', 'name', 'skillColor', 'icon', 'color'],
          template: `<div class="student-detailed-skill-card"><slot /></div>`
        },
        AvBadge: {
          name: 'AvBadge',
          props: ['label'],
          template: `<span class="mock-badge">{{ label }}</span>`
        }
      }
    }
  })
}

BddTest().given('a student detailed additional skill card', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDetailedAdditionalSkillCard>>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should pass the correct props to StudentDetailedSkillCard', () => {
      const card = wrapper.findComponent({ name: 'StudentDetailedSkillCard' })
      expect(card.exists()).toBe(true)
      expect(card.props('id')).toBe(mockSkill.id)
      expect(card.props('name')).toBe(mockSkill.title)
      expect(card.props('icon')).toBe('mdi:stars')
      expect(card.props('skillColor')).toBe('var(--dark-background-primary1)')
      expect(card.props('color')).toBe('var(--card2)')
    })

    BddTest().then('it should render the type badge with correct label', () => {
      const typeBadge = wrapper.findAllComponents({ name: 'AvBadge' })[0]
      expect(typeBadge.exists()).toBe(true)
      expect(typeBadge.text()).toBe('Rome 4.0')
    })

    BddTest().then('it should render the path badge with joined pathSegments', () => {
      const pathBadge = wrapper.findAllComponents({ name: 'AvBadge' })[1]
      expect(pathBadge.exists()).toBe(true)
      expect(pathBadge.text()).toBe(mockSkill.pathSegments.join(' > '))
    })
  })
})
