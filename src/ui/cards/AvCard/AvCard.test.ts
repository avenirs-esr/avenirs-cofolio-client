import type { VueWrapper } from '@vue/test-utils'
import AvCard from '@/ui/cards/AvCard/AvCard.vue'
import { mountWithRouter } from '@/ui/tests/utils'
import { BddTest } from 'tests/utils'
import { expect } from 'vitest'

BddTest().given('an AvCard', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvCard>>

  BddTest().when('the component is mounted', () => {
    BddTest().and('with a default slot content', () => {
      BddTest().then('it should render the default slot content', async () => {
        wrapper = await mountWithRouter<typeof AvCard>(AvCard, {
          slots: {
            default: '<p>Contenu principal</p>',
          },
        })
        expect(wrapper.text()).toContain('Contenu principal')
      })
    })

    BddTest().and('with title and titleBackground', () => {
      BddTest().then('it should renduer title slot with correct class and background', async () => {
        wrapper = await mountWithRouter<typeof AvCard>(AvCard, {
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
    })

    BddTest().and('with body and footer slots', () => {
      BddTest().then('it should render body and footer slots', async () => {
        wrapper = await mountWithRouter<typeof AvCard>(AvCard, {
          slots: {
            body: '<div>Corps de la carte</div>',
            footer: '<div>Pied de carte</div>',
          },
        })
        expect(wrapper.get('.av-card__body').text()).toBe('Corps de la carte')
        expect(wrapper.get('.av-card__footer').text()).toBe('Pied de carte')
      })
    })

    BddTest().and('with custom style props', () => {
      BddTest().then('it should apply style', async () => {
        wrapper = await mountWithRouter<typeof AvCard>(AvCard, {
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
  })
})
