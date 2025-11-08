import StudentDetailedSkillCard, { type StudentDetailedSkillCardProps } from '@/features/student/components/skills/cards/StudentDetailedSkillCard/StudentDetailedSkillCard.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { expect } from 'vitest'

const props: StudentDetailedSkillCardProps = {
  id: 'skill-2-2',
  name: 'An awesome skill',
  skillColor: 'var(--color-skill-primary)',
  icon: 'mdi:star-shooting',
  color: 'var(--text1)'
}

function createWrapper (slots = {}, customProps = {}) {
  return mount(StudentDetailedSkillCard, {
    props: {
      ...props,
      ...customProps
    },
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
        AvIcon: AvIconStub
      }
    },
    slots
  })
}

BddTest().given('a student detailed skill card with valid props', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the skill name', () => {
      expect(wrapper.text()).toContain(props.name)
    })

    BddTest().then('it should render the icon', () => {
      const icon = wrapper.findComponent({ name: 'AvIcon' })
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe(props.icon)
      expect(icon.props('color')).toBe(props.color)
      expect(icon.props('size')).toBe(2.5625)
    })

    BddTest().then('it should render the icon-container with correct background', () => {
      const iconContainer = wrapper.find('.icon-container')
      expect(iconContainer.attributes('style')).toContain(`background: ${props.skillColor}`)
    })

    BddTest().then('it should use the default student-skill route when to prop is not provided', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)
      expect(routerLink.props('to')).toEqual({
        name: 'student-skill',
        params: { id: props.id }
      })
    })
  })
})

BddTest().given('a student detailed skill card with default slot provided', () => {
  BddTest().then('it should render the slot content', () => {
    const wrapper = createWrapper({
      default: '<div class="slot-content">Slot Body</div>'
    })

    const slot = wrapper.find('.slot-content')
    expect(slot.exists()).toBe(true)
    expect(wrapper.text()).toContain('Slot Body')
  })
})

BddTest().given('a student detailed skill card with custom to prop', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    wrapper = createWrapper({}, { to: 'custom-route' })
  })

  BddTest().when('the component is mounted with custom route', () => {
    BddTest().then('it should use the custom route name', () => {
      const routerLink = wrapper.findComponent(RouterLinkStub)
      expect(routerLink.props('to')).toEqual({
        name: 'custom-route',
        params: { id: 'skill-2-2' }
      })
    })
  })
})
