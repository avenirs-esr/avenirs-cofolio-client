import Footer from '@/common/components/Footer/Footer.vue'
import { mountWithRouter } from '@/ui/tests/utils'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

vi.mock('@/ui', () => ({
  EsupLogo: {
    name: 'EsupLogo',
    template: '<svg class="esup-logo" />'
  }
}))

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
        const ecosystemLinks = wrapper.findAll('.fr-footer__content-link')
        expect(ecosystemLinks.length).toBe(1)
        expect(ecosystemLinks[0].text()).toBe('avenirs-esr.fr')
        expect(ecosystemLinks[0].attributes('href')).toBe('https://avenirs-esr.fr/')
      })

      BddTest().then('it should render copyright', () => {
        const copyright = wrapper.find('.copyright a')
        expect(copyright.exists()).toBe(true)
        expect(copyright.text()).toBe('@ESUP-Portail. Tous droits réservés.')
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
        const links = wrapper.findAll('.fr-footer__content-link')
        expect(links.length).toBe(1)
        expect(links[0].text()).toBe('Mon site')
        expect(links[0].attributes('href')).toBe('https://example.com')
      })
    })
  })
})
