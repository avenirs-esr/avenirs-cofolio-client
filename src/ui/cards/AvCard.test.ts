import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AvCard from './AvCard.vue'

describe('avCard', () => {
  it('renders default slot content', () => {
    const wrapper = mount(AvCard, {
      slots: {
        default: '<p>Contenu principal</p>',
      },
    })
    expect(wrapper.text()).toContain('Contenu principal')
  })

  it('renders title slot with correct class and background', () => {
    const wrapper = mount(AvCard, {
      props: {
        titleBackground: 'red',
      },
      slots: {
        title: '<h2>Titre</h2>',
      },
    })
    const title = wrapper.get('.av-card__title')
    expect(title.text()).toBe('Titre')
    expect(title.attributes('style')).toContain('background: red')
  })

  it('renders body and footer slots when provided', () => {
    const wrapper = mount(AvCard, {
      slots: {
        body: '<div>Corps de la carte</div>',
        footer: '<div>Pied de carte</div>',
      },
    })
    expect(wrapper.get('.av-card__body').text()).toBe('Corps de la carte')
    expect(wrapper.get('.av-card__footer').text()).toBe('Pied de carte')
  })

  it('applies style props correctly', () => {
    const wrapper = mount(AvCard, {
      props: {
        borderColor: 'blue',
        height: '200px',
        width: '300px',
      },
    })

    const card = wrapper.get('.av-card')
    const style = card.attributes('style')

    expect(style).toContain('border-color: blue')
    expect(style).toContain('height: 200px')
    expect(style).toContain('width: 300px')
  })
})
