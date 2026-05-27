import Footer from '@/common/components/Footer/Footer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const defaultProps = {
  accessibilityLink: '/accessibilite',
  cookiesLink: '/gestion-des-cookies',
  legalLink: '/mentions-legales',
  personalDataLink: '/donnees-personnelles',
}

BddTest().given('a footer', () => {
  let wrapper: VueWrapper<InstanceType<typeof Footer>>

  const stubs = { RouterLink: RouterLinkStub }

  BddTest().when('the footer is mounted with default props', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter<typeof Footer>(Footer, {
        props: defaultProps,
        global: { stubs },
      })
    })

    BddTest().then('it should render top information links', () => {
      const anrLink = wrapper.find('[data-testid="anr-link"]')
      const france2030Link = wrapper.find('[data-testid="france2030-link"]')

      expect(anrLink.exists()).toBe(true)
      expect(anrLink.attributes('href')).toBe('https://anr.fr/ProjetIA-21-DMAV-0001')
      expect(france2030Link.exists()).toBe(true)
      expect(france2030Link.attributes('href')).toBe('https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de')
    })

    BddTest().then('it should render legal information links', () => {
      const links = wrapper.findAll('[data-testid="legal-information-link"]')

      expect(links.length).toBe(4)
      expect(links[0].text()).toContain('Accessibilité : partiellement conforme')
      expect(links[1].text()).toBe('Mentions légales')
      expect(links[2].text()).toBe('Données personnelles')
      expect(links[3].text()).toBe('Gestion des cookies')
    })

    BddTest().then('it should use the provided legal information routes', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)

      expect(links.length).toBe(4)
      expect(links[0].props('to')).toBe(defaultProps.accessibilityLink)
      expect(links[1].props('to')).toBe(defaultProps.legalLink)
      expect(links[2].props('to')).toBe(defaultProps.personalDataLink)
      expect(links[3].props('to')).toBe(defaultProps.cookiesLink)
    })

    BddTest().then('it should render other sites links', () => {
      const otherSitesLinks = wrapper.findAll('[data-testid="other-sites-link"] a')

      expect(otherSitesLinks.length).toBe(1)
      expect(otherSitesLinks[0].text()).toBe('avenirs-esr.fr')
      expect(otherSitesLinks[0].attributes('href')).toBe('https://avenirs-esr.fr/')
    })

    BddTest().then('it should render partners links', () => {
      const avenirsLink = wrapper.find('[data-testid="avenirs-link"]')
      const esupLink = wrapper.find('[data-testid="esup-link"]')

      expect(avenirsLink.exists()).toBe(true)
      expect(avenirsLink.attributes('href')).toBe('https://avenirs-esr.fr/')
      expect(esupLink.exists()).toBe(true)
      expect(esupLink.attributes('href')).toBe('https://www.esup-portail.org/')
    })

    BddTest().then('it should render copyright link', () => {
      const copyright = wrapper.find('[data-testid="copyright-link"]')

      expect(copyright.exists()).toBe(true)
      expect(copyright.text()).toBe('@ESUP-Portail. Tous droits réservés.')
      expect(copyright.attributes('href')).toBe('https://www.esup-portail.org/')
    })
  })
})
