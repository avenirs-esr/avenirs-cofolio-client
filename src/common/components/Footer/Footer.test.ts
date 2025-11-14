import Footer from '@/common/components/Footer/Footer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

export const mockIsMobile = ref(false)
export const mockIsTablet = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    EsupLogo: {
      name: 'EsupLogo',
      template: '<svg class="esup-logo" />'
    },
    PageSizes: {
      FOUR: 4,
      EIGHT: 8,
      TWELVE: 12
    },
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
      isTablet: mockIsTablet,
    })
  }
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

BddTest().given('a footer', () => {
  let wrapper: VueWrapper<InstanceType<typeof Footer>>

  const stubs = { RouterLink: RouterLinkStub }

  BddTest().and('we are in a student route', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mocked(useRoute).mockReturnValue({
        path: '/student/home'
      } as any)
    })

    BddTest().when('the footer is mounted with default props', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof Footer>(Footer, { global: { stubs } })
      })

      BddTest().then('it should render mandatory links', () => {
        const links = wrapper.findAll('.mandatory-link')
        expect(links.length).toBe(4)
        expect(links[0].text()).toContain('Accessibilité : partiellement conforme')
        expect(links[1].text()).toBe('Mentions légales')
        expect(links[2].text()).toBe('Données personnelles')
        expect(links[3].text()).toBe('Gestion des cookies')
      })

      BddTest().then('it should render default ecosystem links', () => {
        const ecosystemLinks = wrapper.findAll('.av-footer__content-link')
        expect(ecosystemLinks.length).toBe(1)
        expect(ecosystemLinks[0].text()).toBe('avenirs-esr.fr')
        expect(ecosystemLinks[0].attributes('href')).toBe('https://avenirs-esr.fr/')
      })

      BddTest().then('it should render copyright', () => {
        const copyright = wrapper.find('.copyright')
        expect(copyright.exists()).toBe(true)
        expect(copyright.text()).toBe('@ESUP-Portail. Tous droits réservés.')
      })

      BddTest().then('it should not render the mobile containers', () => {
        expect(wrapper.find('.main-container--mobile').exists()).toBe(false)
        expect(wrapper.find('.links-container--mobile').exists()).toBe(false)
      })

      BddTest().then('it should not render the tablet containers', () => {
        expect(wrapper.find('.links-container--tablet').exists()).toBe(false)
      })

      BddTest().and('is in tablet view', () => {
        beforeEach(async () => {
          mockIsMobile.value = false
          mockIsTablet.value = true
          wrapper = await mountWithRouter<typeof Footer>(Footer, { global: { stubs } })
        })

        BddTest().then('it should not render the mobile containers', () => {
          expect(wrapper.find('.main-container--mobile').exists()).toBe(false)
          expect(wrapper.find('.links-container--mobile').exists()).toBe(false)
        })

        BddTest().then('it should render the tablet containers', () => {
          expect(wrapper.find('.links-container--tablet').exists()).toBe(true)
        })
      })

      BddTest().and('is in mobile view', () => {
        beforeEach(async () => {
          mockIsMobile.value = true
          mockIsTablet.value = false
          wrapper = await mountWithRouter<typeof Footer>(Footer, { global: { stubs } })
        })

        BddTest().then('it should render the mobile containers', () => {
          expect(wrapper.find('.main-container--mobile').exists()).toBe(true)
          expect(wrapper.find('.links-container--mobile').exists()).toBe(true)
        })

        BddTest().then('it should not render the tablet containers', () => {
          expect(wrapper.find('.links-container--tablet').exists()).toBe(false)
        })
      })
    })

    BddTest().when('the footer is mounted with COMPLIANT compliance', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof Footer>(Footer, {
          props: { a11yCompliance: 'COMPLIANT' },
          global: { stubs }
        })
      })

      BddTest().then('it should render compliant compliance', () => {
        const mandatoryLinks = wrapper.findAll('.mandatory-link')
        expect(mandatoryLinks[0].text()).toBe('Accessibilité : conforme')
      })
    })

    BddTest().when('the footer is mounted with NON_COMPLIANT compliance', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof Footer>(Footer, {
          props: { a11yCompliance: 'NON_COMPLIANT' },
          global: { stubs }
        })
      })

      BddTest().then('it should render non compliant compliance', () => {
        const mandatoryLinks = wrapper.findAll('.mandatory-link')
        expect(mandatoryLinks[0].text()).toBe('Accessibilité : non conforme')
      })
    })

    BddTest().when('the footer is mounted with PARTIALLY_COMPLIANT compliance', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof Footer>(Footer, {
          props: { a11yCompliance: 'PARTIALLY_COMPLIANT' },
          global: { stubs }
        })
      })

      BddTest().then('it should render partially compliant compliance', () => {
        const mandatoryLinks = wrapper.findAll('.mandatory-link')
        expect(mandatoryLinks[0].text()).toBe('Accessibilité : partiellement conforme')
      })
    })

    BddTest().when('the footer is mounted with custom links', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof Footer>(Footer, {
          props: {
            mandatoryLinks: [
              { label: 'Accessibilité : conforme', to: '/a11y-custom' },
              { label: 'Mentions légales', to: '/legal' }
            ],
            ecosystemLinks: [
              { label: 'Mon site', href: 'https://example.com', title: 'Mon titre' }
            ]
          },
          global: { stubs }
        })
      })

      BddTest().then('it should override mandatory links', () => {
        const links = wrapper.findAll('.mandatory-link')
        expect(links.length).toBe(2)
        expect(links[0].text()).toContain('Accessibilité : conforme')
        expect(links[1].text()).toBe('Mentions légales')
      })

      BddTest().then('it should override ecosystem links', () => {
        const links = wrapper.findAll('.av-footer__content-link')
        expect(links.length).toBe(1)
        expect(links[0].text()).toBe('Mon site')
        expect(links[0].attributes('href')).toBe('https://example.com')
      })
    })
  })

  BddTest().and('we are in a teacher route', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mocked(useRoute).mockReturnValue({
        path: '/teacher/home'
      } as any)
    })

    BddTest().when('the footer is mounted with default props', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof Footer>(Footer, { global: { stubs } })
      })

      BddTest().then('it should render mandatory links', () => {
        const links = wrapper.findAll('.mandatory-link')
        expect(links.length).toBe(4)
        expect(links[0].text()).toContain('Accessibilité : partiellement conforme')
        expect(links[1].text()).toBe('Mentions légales')
        expect(links[2].text()).toBe('Données personnelles')
        expect(links[3].text()).toBe('Gestion des cookies')
      })

      BddTest().then('it should render default ecosystem links', () => {
        const ecosystemLinks = wrapper.findAll('.av-footer__content-link')
        expect(ecosystemLinks.length).toBe(1)
        expect(ecosystemLinks[0].text()).toBe('avenirs-esr.fr')
        expect(ecosystemLinks[0].attributes('href')).toBe('https://avenirs-esr.fr/')
      })

      BddTest().then('it should render copyright', () => {
        const copyright = wrapper.find('.copyright')
        expect(copyright.exists()).toBe(true)
        expect(copyright.text()).toBe('@ESUP-Portail. Tous droits réservés.')
      })
    })

    BddTest().when('the footer is mounted with COMPLIANT compliance', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof Footer>(Footer, {
          props: { a11yCompliance: 'COMPLIANT' },
          global: { stubs }
        })
      })

      BddTest().then('it should render compliant compliance', () => {
        const mandatoryLinks = wrapper.findAll('.mandatory-link')
        expect(mandatoryLinks[0].text()).toBe('Accessibilité : conforme')
      })
    })

    BddTest().when('the footer is mounted with NON_COMPLIANT compliance', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof Footer>(Footer, {
          props: { a11yCompliance: 'NON_COMPLIANT' },
          global: { stubs }
        })
      })

      BddTest().then('it should render non compliant compliance', () => {
        const mandatoryLinks = wrapper.findAll('.mandatory-link')
        expect(mandatoryLinks[0].text()).toBe('Accessibilité : non conforme')
      })
    })

    BddTest().when('the footer is mounted with PARTIALLY_COMPLIANT compliance', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof Footer>(Footer, {
          props: { a11yCompliance: 'PARTIALLY_COMPLIANT' },
          global: { stubs }
        })
      })

      BddTest().then('it should render partially compliant compliance', () => {
        const mandatoryLinks = wrapper.findAll('.mandatory-link')
        expect(mandatoryLinks[0].text()).toBe('Accessibilité : partiellement conforme')
      })
    })

    BddTest().when('the footer is mounted with custom links', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter<typeof Footer>(Footer, {
          props: {
            mandatoryLinks: [
              { label: 'Accessibilité : conforme', to: '/a11y-custom' },
              { label: 'Mentions légales', to: '/legal' }
            ],
            ecosystemLinks: [
              { label: 'Mon site', href: 'https://example.com', title: 'Mon titre' }
            ]
          },
          global: { stubs }
        })
      })

      BddTest().then('it should override mandatory links', () => {
        const links = wrapper.findAll('.mandatory-link')
        expect(links.length).toBe(2)
        expect(links[0].text()).toContain('Accessibilité : conforme')
        expect(links[1].text()).toBe('Mentions légales')
      })

      BddTest().then('it should override ecosystem links', () => {
        const links = wrapper.findAll('.av-footer__content-link')
        expect(links.length).toBe(1)
        expect(links[0].text()).toBe('Mon site')
        expect(links[0].attributes('href')).toBe('https://example.com')
      })
    })
  })
})
