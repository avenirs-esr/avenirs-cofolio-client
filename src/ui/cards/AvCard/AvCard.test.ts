import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { RouterLink } from 'vue-router'
import AvCard from './AvCard.vue'

describe('avCard', () => {
  it('renders default slot content', () => {
    const wrapper = mount(AvCard, {
      slots: {
        default: '<p>Main content</p>',
      },
    })
    expect(wrapper.text()).toContain('Main content')
  })

  it('renders title slot with correct class and background', () => {
    const wrapper = mount(AvCard, {
      props: {
        titleBackground: 'red',
      },
      slots: {
        title: '<h2>Card Title</h2>',
      },
    })
    const title = wrapper.get('.av-card__title')
    expect(title.text()).toBe('Card Title')
    expect(title.attributes('style')).toContain('background: var(red)')
  })

  it('renders body and footer slots when provided', () => {
    const wrapper = mount(AvCard, {
      slots: {
        body: '<div>Card body</div>',
        footer: '<div>Card footer</div>',
      },
    })
    expect(wrapper.get('.av-card__body').text()).toBe('Card body')
    expect(wrapper.get('.av-card__footer').text()).toBe('Card footer')
  })

  it('applies style props correctly', () => {
    const wrapper = mount(AvCard, {
      props: {
        borderColor: 'blue',
        backgroundColor: 'white',
      },
    })

    const card = wrapper.get('.av-card')
    const style = card.attributes('style')

    expect(style).toContain('border-color: var(blue)')
    expect(style).toContain('background: var(white)')
  })

  it('uses RouterLink when "to" prop is provided', () => {
    const wrapper = mount(AvCard, {
      props: {
        to: '/test-route',
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
      slots: {
        default: '<span>With RouterLink</span>',
      },
    })

    expect(wrapper.findComponent(RouterLink).exists()).toBe(true)
  })

  it('uses div when "to" prop is not provided', () => {
    const wrapper = mount(AvCard, {
      slots: {
        default: '<span>No RouterLink</span>',
      },
    })

    expect(wrapper.element.tagName).toBe('DIV')
  })
})
