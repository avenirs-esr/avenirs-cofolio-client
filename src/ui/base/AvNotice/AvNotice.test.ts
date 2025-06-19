import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AvNotice from './AvNotice.vue'

describe('avNotice', () => {
  it('displays title correctly', () => {
    const wrapper = mount(AvNotice, {
      props: {
        title: 'Titre test',
        text: 'Texte sans mise en forme',
        type: 'info'
      }
    })
    expect(wrapper.text()).toContain('Titre test')
  })

  it('manages the type of notice', () => {
    const wrapper = mount(AvNotice, {
      props: {
        title: 'Test',
        text: 'Contenu',
        type: 'warning'
      }
    })
    expect(wrapper.find('.fr-notice--warning').exists()).toBe(true)
  })

  it('formats text between ** in span.text-underline', () => {
    const wrapper = mount(AvNotice, {
      props: {
        title: 'Test',
        text: 'Voici un texte avec **partie soulignée** ici.',
        type: 'info'
      }
    })

    const span = wrapper.find('.text-underline')
    expect(span.exists()).toBe(true)
    expect(span.text()).toBe('partie soulignée')
  })

  it('doesn\'t create span.text-underline if there\'s no ** in the text', () => {
    const wrapper = mount(AvNotice, {
      props: {
        title: 'Test',
        text: 'Aucune mise en forme ici.',
        type: 'alert'
      }
    })

    expect(wrapper.find('.text-underline').exists()).toBe(false)
  })
})
