import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import * as stubs from '@avenirs-esr/test-utils/unit/stubs'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

enableAutoUnmount(afterEach)

BddTest().given('the shared PageTitleStub', () => {
  BddTest().then('it is exposed through the public stubs entry', () => {
    expect(stubs).toHaveProperty('PageTitleStub')
  })

  BddTest().when('mounted without props or named slots', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(stubs.PageTitleStub)
    })

    BddTest().then('it preserves its name and optional props without defaults or fallback title', () => {
      expect(stubs.PageTitleStub.name).toBe('PageTitle')
      expect(stubs.PageTitleStub.props).toEqual({ title: { type: String }, trailingLinks: { type: Array } })
      expect(wrapper.props()).toEqual({ title: undefined, trailingLinks: undefined })
      expect(wrapper.element.tagName).toBe('DIV')
      expect(wrapper.attributes('data-testid')).toBe('page-title')
      expect(wrapper.text()).toBe('')
      expect(wrapper.element.children).toHaveLength(0)
    })
  })

  for (const titleProvided of [false, true]) {
    for (const actionsProvided of [false, true]) {
      BddTest().when(`the title slot is ${titleProvided} and the actions slot is ${actionsProvided}`, () => {
        const trailingLinks = [{ text: 'Accueil', to: '/' }, { text: 'Page courante' }]
        let wrapper: VueWrapper

        beforeEach(() => {
          wrapper = mount(stubs.PageTitleStub, {
            props: { title: 'Prop title', trailingLinks },
            slots: {
              default: '<p>Ignored default slot</p>',
              ...(titleProvided ? { title: '<h1>Slot title</h1>' } : {}),
              ...(actionsProvided ? { actions: '<button>Slot action</button>' } : {}),
            },
          })
        })

        BddTest().then('it renders only the supplied named slots in their original order', () => {
          expect(wrapper.props()).toEqual({ title: 'Prop title', trailingLinks })
          expect(wrapper.element.children).toHaveLength(Number(titleProvided) + Number(actionsProvided))
          expect(Array.from(wrapper.element.children, (child: Element) => child.tagName)).toEqual([
            ...(titleProvided ? ['H1'] : []),
            ...(actionsProvided ? ['BUTTON'] : []),
          ])
          expect(wrapper.text()).toBe(`${titleProvided ? 'Slot title' : ''}${actionsProvided ? 'Slot action' : ''}`)
          expect(wrapper.find('p').exists()).toBe(false)
        })
      })
    }
  }

  BddTest().when('the title and trailing links props are updated', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      wrapper = mount(stubs.PageTitleStub, { props: { title: 'Initial title', trailingLinks: [{ text: 'Accueil' }] } })
      await wrapper.setProps({ title: '', trailingLinks: [] })
    })

    BddTest().then('it retains an explicit empty title and empty link array without rendering them', async () => {
      await vi.waitFor(() => {
        expect(wrapper.props()).toEqual({ title: '', trailingLinks: [] })
        expect(wrapper.text()).toBe('')
      })
    })
  })
})

BddTest().given('the shared SkipLinksStub', () => {
  BddTest().then('it is exposed through the public stubs entry', () => {
    expect(stubs).toHaveProperty('SkipLinksStub')
  })

  BddTest().when('mounted with unused slot content', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(stubs.SkipLinksStub, { slots: { default: '<button>Ignored slot</button>' } })
    })

    BddTest().then('it preserves its name and nav list structure without adding props or testids', () => {
      expect(stubs.SkipLinksStub.name).toBe('SkipLinksStub')
      expect(stubs.SkipLinksStub).not.toHaveProperty('props')
      expect(wrapper.props()).toEqual({})
      expect(wrapper.element.tagName).toBe('NAV')
      expect(wrapper.findAll('nav > ul > li')).toHaveLength(2)
      expect(wrapper.find('[data-testid]').exists()).toBe(false)
      expect(wrapper.find('button').exists()).toBe(false)
    })

    BddTest().then('it preserves the labels and destinations of both skip links', () => {
      expect(wrapper.findAll('a').map(link => ({ href: link.attributes('href'), text: link.text() }))).toEqual([
        { href: '#main', text: 'Go to main content' },
        { href: '#footer', text: 'Go to footer' },
      ])
    })
  })
})

BddTest().given('the shared InformationTooltipStub', () => {
  BddTest().then('it is exposed through the public stubs entry', () => {
    expect(stubs).toHaveProperty('InformationTooltipStub')
  })

  BddTest().when('mounted with the required content and no size', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(stubs.InformationTooltipStub, { props: { content: 'Informations' } })
    })

    BddTest().then('it preserves the name and required content and optional numeric size declarations', () => {
      expect(stubs.InformationTooltipStub.name).toBe('InformationTooltip')
      expect(stubs.InformationTooltipStub.props).toEqual({
        content: { type: String, required: true },
        size: { type: Number, required: false },
      })
      expect(wrapper.props()).toEqual({ content: 'Informations', size: undefined })
      expect(wrapper.element.tagName).toBe('DIV')
      expect(wrapper.attributes('data-testid')).toBe('information-tooltip-stub')
      expect(wrapper.text()).toBe('')
    })
  })

  BddTest().when('mounted with an explicit size and unused slot content', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(stubs.InformationTooltipStub, {
        props: { content: 'Informations', size: 24 },
        slots: { default: '<button>Ignored slot</button>' },
      })
    })

    BddTest().then('it exposes the supplied props without rendering content or slots', () => {
      expect(wrapper.props()).toEqual({ content: 'Informations', size: 24 })
      expect(wrapper.html()).toBe('<div data-testid="information-tooltip-stub"></div>')
    })

    BddTest().and('the content and size change', () => {
      beforeEach(async () => {
        await wrapper.setProps({ content: '', size: 0 })
      })

      BddTest().then('it retains explicit empty content and zero size instead of defaults', async () => {
        await vi.waitFor(() => {
          expect(wrapper.props()).toEqual({ content: '', size: 0 })
          expect(wrapper.text()).toBe('')
        })
      })
    })
  })
})

BddTest().given('the shared EmptyStateStub', () => {
  BddTest().then('it is exposed through the public stubs entry', () => {
    expect(stubs).toHaveProperty('EmptyStateStub')
  })

  BddTest().when('mounted without props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(stubs.EmptyStateStub)
    })

    BddTest().then('it preserves its name and optional string props without defaults', () => {
      expect(stubs.EmptyStateStub.name).toBe('EmptyState')
      expect(stubs.EmptyStateStub.props).toEqual({ title: { type: String }, icon: { type: String } })
      expect(wrapper.props()).toEqual({ title: undefined, icon: undefined })
      expect(wrapper.attributes('data-testid')).toBe('empty-state-stub')
      expect(wrapper.element.tagName).toBe('DIV')
      expect(wrapper.text()).toBe('')
    })
  })

  BddTest().when('mounted with title and icon props and slot content', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(stubs.EmptyStateStub, {
        props: { title: 'Aucun résultat', icon: 'search' },
        slots: { default: '<button>Ignored slot</button>' },
      })
    })

    BddTest().then('it exposes the props without rendering their values or slot content', () => {
      expect(wrapper.props()).toEqual({ title: 'Aucun résultat', icon: 'search' })
      expect(wrapper.html()).toBe('<div data-testid="empty-state-stub"></div>')
    })

    BddTest().and('the optional props are cleared', () => {
      beforeEach(async () => {
        await wrapper.setProps({ title: undefined, icon: undefined })
      })

      BddTest().then('it keeps both props undefined without adding defaults', async () => {
        await vi.waitFor(() => {
          expect(wrapper.props()).toEqual({ title: undefined, icon: undefined })
          expect(wrapper.html()).toBe('<div data-testid="empty-state-stub"></div>')
        })
      })
    })
  })
})

BddTest().given('the shared ErrorMessageStub', () => {
  BddTest().then('it is exposed through the public stubs entry', () => {
    expect(stubs).toHaveProperty('ErrorMessageStub')
  })

  BddTest().when('mounted without props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(stubs.ErrorMessageStub)
    })

    BddTest().then('it preserves its name and untyped optional prop declarations', () => {
      expect(stubs.ErrorMessageStub.name).toBe('ErrorMessage')
      expect(stubs.ErrorMessageStub.props).toEqual(['title', 'description'])
      expect(wrapper.props()).toEqual({ title: undefined, description: undefined })
    })

    BddTest().then('it renders the original root and empty title and description elements', () => {
      expect(wrapper.element.tagName).toBe('DIV')
      expect(wrapper.attributes('data-testid')).toBe('error-message')
      expect(wrapper.get('h3[data-testid="error-message-title"]').text()).toBe('')
      expect(wrapper.get('p[data-testid="error-message-description"]').text()).toBe('')
    })
  })

  BddTest().when('mounted with title and description props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(stubs.ErrorMessageStub, {
        props: { title: 'Erreur <strong>réseau</strong>', description: 'Réessayer' },
        slots: { default: '<button>Ignored slot</button>' },
      })
    })

    BddTest().then('it renders escaped text from the props without introducing a slot', () => {
      expect(wrapper.props()).toEqual({ title: 'Erreur <strong>réseau</strong>', description: 'Réessayer' })
      expect(wrapper.get('[data-testid="error-message-title"]').text()).toBe('Erreur <strong>réseau</strong>')
      expect(wrapper.get('[data-testid="error-message-description"]').text()).toBe('Réessayer')
      expect(wrapper.find('strong').exists()).toBe(false)
      expect(wrapper.find('button').exists()).toBe(false)
    })

    BddTest().and('the untyped props are changed', () => {
      beforeEach(async () => {
        await wrapper.setProps({ title: 42, description: undefined })
      })

      BddTest().then('it updates the text while retaining untyped prop support', async () => {
        await vi.waitFor(() => {
          expect(wrapper.get('[data-testid="error-message-title"]').text()).toBe('42')
          expect(wrapper.get('[data-testid="error-message-description"]').text()).toBe('')
          expect(wrapper.props()).toEqual({ title: 42, description: undefined })
        })
      })
    })
  })
})
