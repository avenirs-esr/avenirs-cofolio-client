import AvHeaderMenuLinks from '@/ui/header/AvHeaderMenuLinks/AvHeaderMenuLinks.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { expect, vi } from 'vitest'

BddTest().given('an AvHeaderMenuLinks', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvHeaderMenuLinks>>

  const mockLinks = [
    { label: 'Link 1', icon: 'icon-1', onClick: vi.fn() },
    { label: 'Link 2', icon: 'icon-2' }, // no onClick handler here
  ]

  BddTest().when('the component is mounted', () => {
    wrapper = mount(AvHeaderMenuLinks, {
      props: { links: mockLinks },
    })

    BddTest().then('it should render one button per link', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons).toHaveLength(2)
      expect(buttons[0].text()).toContain('Link 1')
      expect(buttons[1].text()).toContain('Link 2')
    })

    BddTest().and('the button is clicked', () => {
      BddTest().then('it should emit linkClick event', async () => {
        const button = wrapper.findAll('button')[0]
        vi.resetAllMocks()
        await button.trigger('click')

        expect(wrapper.emitted('linkClick')).toBeTruthy()
        expect(wrapper.emitted('linkClick')![0][0]).toBeInstanceOf(MouseEvent)
      })
    })

    BddTest().and('the onClick handler is defined', () => {
      BddTest().then('it should call the onClick handler', async () => {
        const button = wrapper.findAll('button')[0]
        vi.resetAllMocks()
        await button.trigger('click')

        expect(mockLinks[0].onClick).toHaveBeenCalledOnce()
      })
    })

    BddTest().and('onClick is not defined', () => {
      BddTest().then('it should not throw if onClick is not defined', async () => {
        const button = wrapper.findAll('button')[1]
        vi.resetAllMocks()
        await button.trigger('click')

        expect(wrapper.emitted('linkClick')).toBeTruthy()
      })
    })
  })

  BddTest().when('a navAriaLabel is provided', () => {
    BddTest().then('it should render a nav element with proper aria-label', () => {
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
})
