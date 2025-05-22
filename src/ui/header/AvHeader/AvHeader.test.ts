import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import AvHeader from './AvHeader.vue'

describe('avHeader', () => {
  const serviceTitle = 'Service title'
  const serviceDescription = 'Service description'
  const quickLinks = [{ text: 'Lien', to: '/' }]
  const showSearch = true
  const modelValue = ''
  const currentLanguage = 'fr'
  const languages = [{ codeIso: 'fr', label: 'Français' }, { codeIso: 'en', label: 'English' }]

  it('display default logo and text', () => {
    const wrapper = mount(AvHeader)
    expect(wrapper.get('[data-testid="header-logo"]')).toBeTruthy()
  })

  it('display service title if provided', () => {
    const wrapper = mount(AvHeader, {
      props: {
        serviceTitle,
      },
    })
    expect(wrapper.text()).toContain(serviceTitle)
  })

  it('should render serviceDescription when provided', () => {
    const wrapper = mount(AvHeader, {
      props: {
        serviceTitle,
        serviceDescription
      },
    })

    const el = wrapper.find('p.fr-header__service-tagline')
    expect(el.exists()).toBe(true)
    expect(el.text()).toBe(serviceDescription)
  })

  it('should not render serviceDescription when not provided', () => {
    const wrapper = mount(AvHeader, {
      props: {
        serviceTitle,
      },
    })

    const el = wrapper.find('p.fr-header__service-tagline')
    expect(el.exists()).toBe(false)
  })

  it('open menu on click', async () => {
    const wrapper = mount(AvHeader, {
      props: {
        quickLinks,
      },
    })

    const menuButton = wrapper.get('[data-testid="open-menu-btn"]')
    await menuButton.trigger('click')
    expect(wrapper.find('.fr-header__menu.fr-modal--opened').exists()).toBe(true)
  })

  it('emits a search event', async () => {
    const wrapper = mount(AvHeader, {
      props: {
        showSearch,
        modelValue,
      },
    })

    const searchInput = wrapper.find('input')
    await searchInput.setValue('recherche')
    await searchInput.trigger('keydown.enter')

    expect(wrapper.emitted('search')).toBeTruthy()
  })

  it('should open search modal and close menu when search button is clicked', async () => {
    const wrapper = mount<typeof AvHeader>(AvHeader, {
      props: {
        showSearch,
      },
    })

    const searchButton = wrapper.find('button.fr-btn--search')
    expect(searchButton.exists()).toBe(true)

    await searchButton.trigger('click')

    const headerMenu = wrapper.find('.fr-header__menu')
    const searchBar = headerMenu.find('.fr-search-bar')
    expect(searchBar.exists()).toBe(true)
    const menuLinks = wrapper.find('.fr-header__menu-links')
    const quickLinks = menuLinks.find('[aria-label="Menu secondaire"]')
    expect(quickLinks.exists()).toBe(false)
  })

  it('should close the menu modal when close button is clicked', async () => {
    const wrapper = mount(AvHeader, {
      props: {
        serviceTitle,
        quickLinks,
      },
    })

    const menuModal = wrapper.get('.fr-header__menu.fr-modal')

    const openBtn = wrapper.get('[data-testid="open-menu-btn"]')
    await openBtn.trigger('click')
    expect(menuModal.classes()).toContain('fr-modal--opened')

    const closeBtn = wrapper.get('[data-testid="close-modal-btn"]')
    await closeBtn.trigger('click')
    expect(menuModal.classes()).not.toContain('fr-modal--opened')
  })

  it('should focus #close-button after opening the menu', async () => {
    const focusMock = vi.fn()

    const closeBtn = document.createElement('button')
    closeBtn.setAttribute('id', 'close-button')
    closeBtn.focus = focusMock
    document.body.appendChild(closeBtn)

    const wrapper = mount(AvHeader, {
      props: {
        quickLinks,
      },
    })

    const openBtn = wrapper.get('[data-testid="open-menu-btn"]')
    await openBtn.trigger('click')
    await new Promise(resolve => setTimeout(resolve))

    expect(focusMock).toHaveBeenCalled()

    document.body.removeChild(closeBtn)
  })

  it('should focus #button-menu after closing the menu', async () => {
    const focusMock = vi.fn()

    const menuBtn = document.createElement('button')
    menuBtn.setAttribute('id', 'button-menu')
    menuBtn.focus = focusMock
    document.body.appendChild(menuBtn)

    const wrapper = mount(AvHeader, {
      props: {
        quickLinks,
      },
    })

    await wrapper.get('[data-testid="open-menu-btn"]').trigger('click')
    await wrapper.get('[data-testid="close-modal-btn"]').trigger('click')

    expect(focusMock).toHaveBeenCalled()

    document.body.removeChild(menuBtn)
  })

  it('should trigger hideModal and focus #button-menu when pressing Escape', async () => {
    const focusMock = vi.fn()

    const menuBtn = document.createElement('button')
    menuBtn.setAttribute('id', 'button-menu')
    menuBtn.focus = focusMock
    document.body.appendChild(menuBtn)

    mount(AvHeader, {
      props: {
        quickLinks,
      },
    })

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)
    await nextTick()

    expect(focusMock).toHaveBeenCalled()

    document.body.removeChild(menuBtn)
  })

  it('emits "languageSelect" event when DsfrLanguageSelector emits "select"', async () => {
    const wrapper = mount(AvHeader, {
      props: {
        languageSelector: {
          currentLanguage,
          languages
        }
      }
    })

    const languageSelector = wrapper.findComponent({ name: 'DsfrLanguageSelector' })

    const payload = { codeIso: 'en', label: 'English' }
    await languageSelector.vm.$emit('select', payload)

    expect(wrapper.emitted('languageSelect')).toBeTruthy()
    expect(wrapper.emitted('languageSelect')![0]).toEqual([payload])
  })
})
