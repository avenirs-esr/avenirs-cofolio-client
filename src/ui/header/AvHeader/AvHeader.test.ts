import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AvHeader from './AvHeader.vue'

describe('avHeader', () => {
  it('display default logo and text', () => {
    const wrapper = mount(AvHeader)
    expect(wrapper.get('[data-testid="header-logo"]')).toBeTruthy()
  })

  it('display service title if provided', () => {
    const wrapper = mount(AvHeader, {
      props: {
        serviceTitle: 'Titre test',
      },
    })
    expect(wrapper.text()).toContain('Titre test')
  })

  it('open menu on click', async () => {
    const wrapper = mount(AvHeader, {
      props: {
        quickLinks: [{ text: 'Lien', to: '/' }],
      },
    })

    const menuButton = wrapper.get('[data-testid="open-menu-btn"]')
    await menuButton.trigger('click')
    expect(wrapper.find('.fr-header__menu.fr-modal--opened').exists()).toBe(true)
  })

  it('emits a search event', async () => {
    const wrapper = mount(AvHeader, {
      props: {
        showSearch: true,
        modelValue: '',
      },
    })

    const searchInput = wrapper.find('input')
    await searchInput.setValue('recherche')
    await searchInput.trigger('keydown.enter')

    // On ne peut pas facilement simuler un @search directement, sauf à interagir avec le composant interne
    expect(wrapper.emitted('search')).toBeTruthy()
  })
})
