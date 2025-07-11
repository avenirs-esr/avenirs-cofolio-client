import { SkillLevelStatus } from '@/api/avenir-esr'
import StudentDetailedSkillCard, { type StudentDetailedSkillCardProps } from '@/features/student/components/cards/StudentDetailedSkillCard/StudentDetailedSkillCard.vue'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

const props: StudentDetailedSkillCardProps = {
  skill: {
    id: 'skill-2-2',
    name: 'An awesome skill',
    levelCount: 3,
    traceCount: 6,
    activityCount: 3,
    currentSkillLevel: {
      id: 'lvl-2-2-3',
      name: 'Niveau 3',
      status: SkillLevelStatus.TO_BE_EVALUATED,
      shortDescription: 'short description'
    }
  },
  skillColor: 'var(--color-skill-primary)',
  icon: 'mdi:star-shooting',
  color: 'var(--text1)'
}

function createWrapper (slots = {}) {
  return mount(StudentDetailedSkillCard, {
    props,
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
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
        }
      }
    },
    slots
  })
}

describe('given a student detailed skill card with valid props', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('when the component is mounted', () => {
    it('then it should render the skill name', () => {
      expect(wrapper.text()).toContain(props.skill.name)
    })

    it('then it should render the icon', () => {
      const icon = wrapper.findComponent({ name: 'AvVIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe(props.icon)
      expect(icon.props('color')).toBe(props.color)
      expect(icon.props('size')).toBe(2.5625)
    })

    it('then it should render the icon-container with correct background', () => {
      const iconContainer = wrapper.find('.icon-container')
      expect(iconContainer.attributes('style')).toContain(`background: ${props.skillColor}`)
    })

    it('then it should use the correct router-link props', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)
      expect(routerLink.props('to')).toEqual({
        name: 'student-skill',
        params: { id: props.skill.id }
      })
    })
  })
})

describe('given a student detailed skill card with default slot provided', () => {
  it('then it should render the slot content', () => {
    const wrapper = createWrapper({
      default: '<div class="slot-content">Slot Body</div>'
    })

    const slot = wrapper.find('.slot-content')
    expect(slot.exists()).toBe(true)
    expect(wrapper.text()).toContain('Slot Body')
  })
})
