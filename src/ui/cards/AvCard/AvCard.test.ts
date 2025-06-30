import AvCard from '@/ui/cards/AvCard/AvCard.vue'
import { mountWithRouter } from 'tests/utils'
import { describe, expect, it } from 'vitest'

describe('avCard', () => {
  it('renders default slot content', async () => {
    const wrapper = await mountWithRouter(AvCard, {
      slots: {
        default: '<p>Contenu principal</p>',
      },
    })
    expect(wrapper.text()).toContain('Contenu principal')
  })

  it('renders title slot with correct class and background', async () => {
    const wrapper = await mountWithRouter(AvCard, {
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

  it('renders body and footer slots when provided', async () => {
    const wrapper = await mountWithRouter(AvCard, {
      slots: {
        body: '<div>Corps de la carte</div>',
        footer: '<div>Pied de carte</div>',
      },
    })
    expect(wrapper.get('.av-card__body').text()).toBe('Corps de la carte')
    expect(wrapper.get('.av-card__footer').text()).toBe('Pied de carte')
  })

  it('applies style props correctly', async () => {
    const wrapper = await mountWithRouter(AvCard, {
      props: {
        borderColor: 'blue',
        height: '200px',
        width: '300px',
      },
    })

    const card = wrapper.get('.av-card')
    const style = card.attributes('style')

    expect(style).toContain('border-color: blue')
  })
})
