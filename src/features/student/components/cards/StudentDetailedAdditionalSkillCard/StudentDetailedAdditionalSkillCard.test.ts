import type { AdditionalSkillDTO } from '@/api/avenir-esr'
import StudentDetailedAdditionalSkillCard
  from '@/features/student/components/cards/StudentDetailedAdditionalSkillCard/StudentDetailedAdditionalSkillCard.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

const mockSkill: AdditionalSkillDTO = {
  id: 'add-skill-1',
  title: 'Accueillir des enfants',
  type: 'ROME4.0',
  pathSegments: ['Relation client', 'Accueillir et orienter']
}

function createWrapper () {
  return mount(StudentDetailedAdditionalSkillCard, {
    props: {
      additionalSkill: mockSkill
    },
    global: {
      stubs: {
        AvCard: {
          name: 'AvCard',
          props: ['borderColor', 'titleBackground'],
          template: `
            <div class="av-card">
              <header class="card-title"><slot name="title" /></header>
              <section class="card-body"><slot name="body" /></section>
            </div>
          `
        },
        AvVIcon: {
          name: 'AvVIcon',
          props: ['name', 'color', 'size'],
          template: `<i class="mock-icon" />`
        },
        AvBadge: {
          name: 'AvBadge',
          props: ['label', 'color', 'borderColor', 'backgroundColor', 'iconPath', 'small', 'ellipsis'],
          template: `<span class="mock-badge">{{ label }}</span>`
        }
      }
    }
  })
}

describe('studentDetailedAdditionalSkillCard.vue', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('when the component is mounted', () => {
    it('should render the skill title', () => {
      expect(wrapper.text()).toContain(mockSkill.title)
    })

    it('should render the icon', () => {
      const icon = wrapper.findComponent({ name: 'AvVIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe('mdi:stars')
      expect(icon.props('color')).toBe('var(--other-background-base)')
      expect(icon.props('size')).toBe(2.5625)
    })

    it('should render the icon-container with correct background', () => {
      const iconContainer = wrapper.find('.icon-container')
      expect(iconContainer.attributes('style')).toContain('background: var(--dark-background-primary1)')
    })

    it('should render the type badge with correct label', () => {
      const typeBadge = wrapper.findAllComponents({ name: 'AvBadge' })[0]
      expect(typeBadge.exists()).toBe(true)
      expect(typeBadge.text()).toBe(mockSkill.type)
    })

    it('should render the path badge with joined pathSegments', () => {
      const pathBadge = wrapper.findAllComponents({ name: 'AvBadge' })[1]
      expect(pathBadge.exists()).toBe(true)
      expect(pathBadge.text()).toBe(mockSkill.pathSegments.join(', '))
    })
  })
})
