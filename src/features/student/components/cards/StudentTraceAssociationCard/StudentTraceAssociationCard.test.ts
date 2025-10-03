import type { VueWrapper } from '@vue/test-utils'
import { StudentTraceAssociationCard } from '@/features/student/components/cards'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest, mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  AvCard: {
    name: 'AvCard',
    template: `
      <div class="av-card">
        <div class="av-card__title"><slot name="title" /></div>
        <div class="av-card__body"><slot name="body" /></div>
      </div>
    `,
    props: {
      borderColor: String
    }
  },
  AvVIcon: {
    name: 'AvVIcon',
    template: '<div class="av-v-icon" />',
    props: {
      name: String,
      color: String,
      size: Number
    }
  }
}

BddTest().given('a student trace association card', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceAssociationCard>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with default props', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentTraceAssociationCard, {
        props: {
          title: 'Test Association Title'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the card', () => {
      const card = wrapper.findComponent({ name: 'AvCard' })

      expect(card.exists()).toBe(true)
      expect(card.props('borderColor')).toBe('var(--other-border-skill-card)')
    })

    BddTest().then('it should render the title', () => {
      expect(wrapper.text()).toContain('Test Association Title')
    })

    BddTest().then('it should render the default icon', () => {
      const icon = wrapper.findComponent({ name: 'AvVIcon' })

      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe(MDI_ICONS.STAR_SHOOTING_OUTLINE)
      expect(icon.props('color')).toBe('var(--text2)')
    })
  })

  BddTest().when('the component is mounted with custom icon', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentTraceAssociationCard, {
        props: {
          title: 'Custom Icon Title',
          icon: MDI_ICONS.STARS
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the custom icon', () => {
      const icon = wrapper.findComponent({ name: 'AvVIcon' })

      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe(MDI_ICONS.STARS)
    })
  })

  BddTest().when('the component is mounted with title-prepend slot content', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentTraceAssociationCard, {
        props: {
          title: 'Title with Prepend'
        },
        slots: {
          'title-prepend': '<div class="prepend-content">Prepend Content</div>'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the title-prepend slot content', () => {
      expect(wrapper.find('.prepend-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Prepend Content')
    })
  })

  BddTest().when('the component is mounted with body slot content', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentTraceAssociationCard, {
        props: {
          title: 'Title with Body'
        },
        slots: {
          body: '<div class="body-content">Body Content</div>'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the body slot content', () => {
      expect(wrapper.find('.body-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Body Content')
    })
  })

  BddTest().when('the component is mounted with both slots', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentTraceAssociationCard, {
        props: {
          title: 'Complete Card'
        },
        slots: {
          'title-prepend': '<div class="badge-slot">Badge</div>',
          'body': '<div class="body-slot">Body</div>'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render both slot contents', () => {
      expect(wrapper.find('.badge-slot').exists()).toBe(true)
      expect(wrapper.find('.body-slot').exists()).toBe(true)
      expect(wrapper.text()).toContain('Badge')
      expect(wrapper.text()).toContain('Body')
    })

    BddTest().then('it should render the title', () => {
      expect(wrapper.text()).toContain('Complete Card')
    })
  })
})
