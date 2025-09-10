import type { VueWrapper } from '@vue/test-utils'
import AvHeader from '@/ui/header/AvHeader/AvHeader.vue'
import { mountWithRouter } from '@/ui/tests/utils'
import { BddTest } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

BddTest().given('an AvHeader', () => {
  let wrapper: VueWrapper

  const serviceTitle = 'Service title'
  const quickLinks = [{ text: 'Lien', to: '/' }]
  const showSearch = true
  const modelValue = ''
  const currentLanguage = 'fr'
  const languages = [{ codeIso: 'fr', label: 'Français' }, { codeIso: 'en', label: 'English' }]

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(AvHeader)
    })

    BddTest().then('ot should display default logo and text', async () => {
      expect(wrapper.get('[data-testid="header-logo"]')).toBeTruthy()
    })

    BddTest().and('service title is provided', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter(AvHeader, {
          props: { serviceTitle },
        })
      })

      BddTest().then('it should display service title', async () => {
        expect(wrapper.text()).toContain(serviceTitle)
      })
    })
  })

  BddTest().when('the menu button is clicked', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(AvHeader, {
        props: {
          quickLinks,
        },
      })
    })

    BddTest().then('it should open menu', async () => {
      const menuButton = wrapper.get('[data-testid="open-menu-btn"]')
      await menuButton.trigger('click')
      expect(wrapper.find('.fr-header__menu.fr-modal--opened').exists()).toBe(true)
    })
  })

  BddTest().when('using the search bar', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(AvHeader, {
        props: {
          showSearch,
          modelValue,
        },
      })
    })

    BddTest().then('it should emit a search event', async () => {
      const searchInput = wrapper.find('input')
      await searchInput.setValue('recherche')
      await searchInput.trigger('keydown.enter')

      expect(wrapper.emitted('search')).toBeTruthy()
    })
  })

  BddTest().when('the menu modal is opened', () => {
    BddTest().and('the search button is clicked', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof AvHeader>(AvHeader, {
          props: {
            showSearch,
          },
        })
      })

      BddTest().then('it should open search modal and close menu modal', async () => {
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
    })

    BddTest().and('the close button is clicked', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter(AvHeader, {
          props: {
            serviceTitle,
            quickLinks,
          },
        })
      })

      BddTest().then('it should close the menu modal when close button is clicked', async () => {
        const menuModal = wrapper.get('.fr-header__menu.fr-modal')

        const openBtn = wrapper.get('[data-testid="open-menu-btn"]')
        await openBtn.trigger('click')
        expect(menuModal.classes()).toContain('fr-modal--opened')

        const closeBtn = wrapper.get('[data-testid="close-modal-btn"]')
        await closeBtn.trigger('click')
        expect(menuModal.classes()).not.toContain('fr-modal--opened')
      })
    })

    BddTest().and('has a focus', () => {
      const focusMock = vi.fn()

      let menuBtn: HTMLButtonElement

      beforeEach(async () => {
        vi.clearAllMocks()

        menuBtn = document.createElement('button')
        menuBtn.setAttribute('id', 'button-menu')
        menuBtn.focus = focusMock
        document.body.appendChild(menuBtn)

        wrapper = await mountWithRouter(AvHeader, {
          props: {
            quickLinks,
          },
        })
      })

      afterEach(() => {
        document.body.removeChild(menuBtn)
      })

      BddTest().and('clicking the close button', () => {
        BddTest().then('it should focus #button-menu', async () => {
          await wrapper.get('[data-testid="open-menu-btn"]').trigger('click')
          await wrapper.get('[data-testid="close-modal-btn"]').trigger('click')

          expect(focusMock).toHaveBeenCalled()
        })
      })

      BddTest().and('pressing Escape', () => {
        BddTest().then('it should trigger hideModal and focus #button-menu', async () => {
          const event = new KeyboardEvent('keydown', { key: 'Escape' })
          document.dispatchEvent(event)
          await nextTick()

          expect(focusMock).toHaveBeenCalled()
        })
      })
    })

    BddTest().when('opening the menu', () => {
      const focusMock = vi.fn()

      let closeBtn: HTMLButtonElement

      beforeEach(async () => {
        vi.clearAllMocks()

        closeBtn = document.createElement('button')
        closeBtn.setAttribute('id', 'close-button')
        closeBtn.focus = focusMock
        document.body.appendChild(closeBtn)

        wrapper = await mountWithRouter(AvHeader, {
          props: {
            quickLinks,
          },
        })
      })

      afterEach(() => {
        document.body.removeChild(closeBtn)
      })

      BddTest().then('it should focus #close-button', async () => {
        const openBtn = wrapper.get('[data-testid="open-menu-btn"]')
        await openBtn.trigger('click')
        await new Promise(resolve => setTimeout(resolve))

        expect(focusMock).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('DsfrLanguageSelector emits "select"', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(AvHeader, {
        props: {
          languageSelector: {
            currentLanguage,
            languages
          }
        }
      })
    })

    BddTest().then('it should emit "languageSelect" event', async () => {
      const languageSelector = wrapper.findComponent({ name: 'DsfrLanguageSelector' })

      const payload = { codeIso: 'en', label: 'English' }
      await languageSelector.vm.$emit('select', payload)

      expect(wrapper.emitted('languageSelect')).toBeTruthy()
      expect(wrapper.emitted('languageSelect')![0]).toEqual([payload])
    })
  })
})
