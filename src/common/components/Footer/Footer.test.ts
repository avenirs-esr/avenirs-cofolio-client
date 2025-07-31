import Footer from '@/common/components/Footer/Footer.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/ui', () => ({
  EsupLogo: {
    name: 'EsupLogo',
    template: '<svg class="esup-logo" />'
  }
}))

const stubs = {
  DsfrFooterLinkStub: {
    name: 'DsfrFooterLink',
    props: ['label', 'to', 'title'],
    template: '<li class="dsfr-footer-link">{{ label }}</li>'
  }
}

describe('footer', () => {
  let wrapper: VueWrapper

  describe('given a footer with default props', () => {
    beforeEach(() => {
      wrapper = mount(Footer, {
        global: { stubs }
      })
    })

    describe('when the footer is mounted', () => {
      it('then it should render mandatory links', () => {
        const links = wrapper.findAllComponents({ name: 'DsfrFooterLink' })
        expect(links.length).toBe(4)
        expect(links[0].text()).toContain('Accessibilité : non conforme')
        expect(links[1].text()).toBe('Mentions légales')
        expect(links[2].text()).toBe('Données personnelles')
        expect(links[3].text()).toBe('Gestion des cookies')
      })

      it('then it should render default ecosystem links', () => {
        const ecosystemLinks = wrapper.findAll('.fr-footer__content-link')
        expect(ecosystemLinks.length).toBe(1)
        expect(ecosystemLinks[0].text()).toBe('avenirs-esr.fr')
        expect(ecosystemLinks[0].attributes('href')).toBe('https://avenirs-esr.fr/')
      })

      it('then it should render copyright', () => {
        const copyright = wrapper.find('.copyright a')
        expect(copyright.exists()).toBe(true)
        expect(copyright.text()).toBe('@ESUP-Portail. Tous droits réservés.')
      })
    })
  })

  describe('given a footer with custom links', () => {
    beforeEach(() => {
      wrapper = mount(Footer, {
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

    describe('when the footer is mounted', () => {
      it('then it should override mandatory links', () => {
        const links = wrapper.findAllComponents({ name: 'DsfrFooterLink' })
        expect(links.length).toBe(2)
        expect(links[0].text()).toContain('Accessibilité : conforme')
        expect(links[1].text()).toBe('Mentions légales')
      })

      it('then it should override ecosystem links', () => {
        const links = wrapper.findAll('.fr-footer__content-link')
        expect(links.length).toBe(1)
        expect(links[0].text()).toBe('Mon site')
        expect(links[0].attributes('href')).toBe('https://example.com')
      })
    })
  })
})
