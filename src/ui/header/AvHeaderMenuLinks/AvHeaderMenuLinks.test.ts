import AvHeaderMenuLinks from '@/ui/header/AvHeaderMenuLinks/AvHeaderMenuLinks.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

describe('avHeaderMenuLinks', () => {
  const mockLinks = [
    { label: 'Link 1', icon: 'icon-1', onClick: vi.fn() },
    { label: 'Link 2', icon: 'icon-2' }, // no onClick handler here
  ]

  it('renders one button per link', () => {
    const wrapper = mount(AvHeaderMenuLinks, {
      props: { links: mockLinks },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toContain('Link 1')
    expect(buttons[1].text()).toContain('Link 2')
  })

  it('emits linkClick event on button click', async () => {
    const wrapper = mount(AvHeaderMenuLinks, {
      props: { links: mockLinks },
    })

    const button = wrapper.findAll('button')[0]
    vi.resetAllMocks()
    await button.trigger('click')

    expect(wrapper.emitted('linkClick')).toBeTruthy()
    expect(wrapper.emitted('linkClick')![0][0]).toBeInstanceOf(MouseEvent)
  })

  it('calls the onClick handler if defined', async () => {
    const wrapper = mount(AvHeaderMenuLinks, {
      props: { links: mockLinks },
    })

    const button = wrapper.findAll('button')[0]
    vi.resetAllMocks()
    await button.trigger('click')

    expect(mockLinks[0].onClick).toHaveBeenCalledOnce()
  })

  it('does not throw if onClick is not defined', async () => {
    const wrapper = mount(AvHeaderMenuLinks, {
      props: { links: mockLinks },
    })

    const button = wrapper.findAll('button')[1]
    vi.resetAllMocks()
    await button.trigger('click')

    expect(wrapper.emitted('linkClick')).toBeTruthy()
  })

  it('renders a nav element with proper aria-label', () => {
    const wrapper = mount(AvHeaderMenuLinks, {
      props: {
        links: mockLinks,
        navAriaLabel: 'Custom Navigation',
      },
    })

    const nav = wrapper.find('nav')
    expect(nav.attributes('aria-label')).toBe('Custom Navigation')
  })
})
