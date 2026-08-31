import type { VueWrapper } from '@vue/test-utils'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import FloatingIconCard from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

const stubs = {
  Card: CardStub,
  AvIcon: AvIconStub
}

BddTest().given('a floating icon card', () => {
  let wrapper: VueWrapper<InstanceType<typeof FloatingIconCard>>

  BddTest().when('the component is mounted with required props', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Test Card Title',
          iconOptions: {
            name: 'mdi:test-icon'
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the card wrapper', () => {
      const cardWrapper = wrapper.find('.floating-icon-card')
      expect(cardWrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.find('[data-testid="floating-icon-card-title"]')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Test Card Title')
    })

    BddTest().then('it should render the floating icon container', () => {
      const iconContainer = wrapper.find('.floating-icon-card__icon')
      expect(iconContainer.exists()).toBe(true)
    })

    BddTest().then('it should render the AvIcon component with correct name', () => {
      const icon = wrapper.findComponent(AvIconStub)
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe('mdi:test-icon')
    })

    BddTest().then('it should use default icon color', () => {
      const icon = wrapper.findComponent(AvIconStub)
      expect(icon.props('color')).toBe('var(--card2)')
    })

    BddTest().then('it should apply default color to icon background', () => {
      const iconContainer = wrapper.find('.floating-icon-card__icon')
      expect(iconContainer.attributes('style')).toContain('background: var(--light-foreground-primary1)')
    })

    BddTest().then('it should pass default props to Card', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.props('borderColor')).toBe('var(--other-border-skill-card)')
      expect(card.props('titleBackground')).toBe('var(--light-foreground-primary1)')
      expect(card.props('titleHeight')).toBe('6.5625rem')
    })
  })

  BddTest().when('the component is mounted with custom props', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Custom Title',
          iconOptions: {
            name: 'mdi:custom-icon',
            color: 'var(--custom-icon-color)'
          },
          color: 'var(--custom-color)',
          customTitleHeight: '8rem',
          borderColor: 'var(--custom-border)'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should apply the custom color to icon background', () => {
      const iconContainer = wrapper.find('.floating-icon-card__icon')
      expect(iconContainer.attributes('style')).toContain('background: var(--custom-color)')
    })

    BddTest().then('it should pass custom props to Card', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.props('borderColor')).toBe('var(--custom-border)')
      expect(card.props('titleBackground')).toBe('var(--custom-color)')
      expect(card.props('titleHeight')).toBe('8rem')
    })

    BddTest().then('it should pass custom icon color to AvIcon', () => {
      const icon = wrapper.findComponent(AvIconStub)
      expect(icon.props('color')).toBe('var(--custom-icon-color)')
      expect(icon.props('size')).toBe(2.0625)
    })
  })

  BddTest().when('the body slot is provided', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Test Card',
          iconOptions: {
            name: 'mdi:test'
          }
        },
        slots: {
          body: '<div class="custom-body">Body Content</div>'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the body slot content', () => {
      const bodySlot = wrapper.find('.custom-body')
      expect(bodySlot.exists()).toBe(true)
      expect(bodySlot.text()).toBe('Body Content')
    })

    BddTest().then('it should render the body wrapper', () => {
      const bodyWrapper = wrapper.find('.floating-icon-card__body')
      expect(bodyWrapper.exists()).toBe(true)
    })
  })

  BddTest().when('the footer slot is provided', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Test Card',
          iconOptions: {
            name: 'mdi:test'
          }
        },
        slots: {
          footer: '<div class="custom-footer">Footer Content</div>'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the footer slot content', () => {
      const footerSlot = wrapper.find('.custom-footer')
      expect(footerSlot.exists()).toBe(true)
      expect(footerSlot.text()).toBe('Footer Content')
    })

    BddTest().then('it should render the footer wrapper', () => {
      const footerWrapper = wrapper.find('.floating-icon-card__footer')
      expect(footerWrapper.exists()).toBe(true)
    })
  })

  BddTest().when('the footer slot is not provided', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Test Card',
          iconOptions: {
            name: 'mdi:test'
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should not render the footer wrapper', () => {
      const footerWrapper = wrapper.find('.floating-icon-card__footer')
      expect(footerWrapper.exists()).toBe(false)
    })
  })

  BddTest().when('both body and footer slots are provided', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Complete Card',
          iconOptions: {
            name: 'mdi:complete'
          }
        },
        slots: {
          body: '<p>Card body text</p>',
          footer: '<button>Action</button>'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render both slot contents', () => {
      const body = wrapper.find('.floating-icon-card__body')
      const footer = wrapper.find('.floating-icon-card__footer')
      expect(body.exists()).toBe(true)
      expect(footer.exists()).toBe(true)
      expect(body.text()).toContain('Card body text')
      expect(footer.html()).toContain('<button>Action</button>')
    })
  })

  BddTest().when('the title contains long text', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'This is a very long title that should be truncated with line clamp after three lines of text to maintain card layout consistency',
          iconOptions: {
            name: 'mdi:test'
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use default headerRows value of 3', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.props('titleHeight')).toBe('6.5625rem')
    })
  })

  BddTest().when('the component is mounted with headerRows set to 1', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Single Line',
          iconOptions: {
            name: 'mdi:test'
          },
          headerRows: 1
        },
        global: { stubs }
      })
    })

    BddTest().then('it should set auto height for single line', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.props('titleHeight')).toBe('auto')
    })
  })

  BddTest().when('the component is mounted with headerRows set to 2', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Two Line Title',
          iconOptions: {
            name: 'mdi:test'
          },
          headerRows: 2
        },
        global: { stubs }
      })
    })

    BddTest().then('it should set height for two lines', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.props('titleHeight')).toBe('4.6875rem')
    })
  })

  BddTest().when('the component is mounted with headerRows set to 3', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Three Line Title',
          iconOptions: {
            name: 'mdi:test'
          },
          headerRows: 3
        },
        global: { stubs }
      })
    })

    BddTest().then('it should set height for three lines', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.props('titleHeight')).toBe('6.5625rem')
    })
  })

  BddTest().when('the component is mounted with custom icon color', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Test Card',
          iconOptions: {
            name: 'mdi:test',
            color: 'var(--custom-icon-color)'
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass custom icon color to AvIcon', () => {
      const icon = wrapper.findComponent(AvIconStub)
      expect(icon.props('color')).toBe('var(--custom-icon-color)')
    })
  })

  BddTest().when('the component is mounted with custom icon positioning', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Test Card',
          iconOptions: {
            name: 'mdi:test',
            bottom: '-3rem',
            right: '1rem'
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should apply custom icon positioning', () => {
      const iconContainer = wrapper.find('.floating-icon-card__icon')
      expect(iconContainer.exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with custom title typography classes', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Test Card',
          iconOptions: {
            name: 'mdi:test'
          },
          titleTypographyClasses: 'custom-class another-class'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should apply custom typography classes to title', () => {
      const title = wrapper.find('span')
      expect(title.classes()).toContain('custom-class')
      expect(title.classes()).toContain('another-class')
    })
  })

  BddTest().when('the component is mounted with custom height', () => {
    beforeEach(() => {
      wrapper = mountComponent(FloatingIconCard, {
        props: {
          title: 'Test Card',
          iconOptions: {
            name: 'mdi:test'
          },
          height: '20rem'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should apply custom height to card wrapper', () => {
      const cardWrapper = wrapper.find('.floating-icon-card')
      expect(cardWrapper.exists()).toBe(true)
    })
  })
})
