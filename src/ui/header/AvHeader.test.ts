import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AvHeader from './AvHeader.vue'

describe('avHeader', () => {
  it('affiche le logo avec texte par défaut', () => {
    const wrapper = mount(AvHeader)
    expect(wrapper.get('[data-testid="header-logo"]')).toBeTruthy()
  })

  it('affiche le titre de service s’il est fourni', () => {
    const wrapper = mount(AvHeader, {
      props: {
        serviceTitle: 'Titre test',
      },
    })
    expect(wrapper.text()).toContain('Titre test')
  })

  it('ouvre le menu au clic', async () => {
    const wrapper = mount(AvHeader, {
      props: {
        quickLinks: [{ text: 'Lien', to: '/' }],
      },
    })

    const menuButton = wrapper.get('[data-testid="open-menu-btn"]')
    await menuButton.trigger('click')
    expect(wrapper.find('.fr-header__menu.fr-modal--opened').exists()).toBe(true)
  })

  it('émet un événement de recherche', async () => {
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
