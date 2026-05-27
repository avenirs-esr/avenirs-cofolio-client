<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import CofolioLogoSvg from '@/assets/icons/cofolio-without-baseline.svg'
import { EsupLogo } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface FooterProps {
  accessibilityLink: RouteLocationRaw
  cookiesLink: RouteLocationRaw
  legalLink: RouteLocationRaw
  personalDataLink: RouteLocationRaw
};

const {
  accessibilityLink,
  cookiesLink,
  legalLink,
  personalDataLink,
} = defineProps<FooterProps>()

const { t } = useI18n()

const legalInformationLinks = computed(() => [
  { label: t('global.footer.sections.legalInformation.links.accessibility'), to: accessibilityLink },
  { label: t('global.footer.sections.legalInformation.links.legal'), to: legalLink },
  { label: t('global.footer.sections.legalInformation.links.data'), to: personalDataLink },
  { label: t('global.footer.sections.legalInformation.links.cookies'), to: cookiesLink },
])

const otherSitesLinks = computed(() => [
  { label: 'avenirs-esr.fr', href: 'https://avenirs-esr.fr/', title: t('global.footer.sections.otherSites.links.avenirs') },
])
</script>

<template>
  <footer
    id="footer"
    class="av-footer"
    role="contentinfo"
    data-testid="footer"
  >
    <div class="separator" />
    <div class="anr av-row av-align-center av-gap-md av-py-xs av-px-sm av-justify-center">
      <div class="av-row av-wrap av-nowrap--md av-gap-md av-justify-start">
        <a
          href="https://anr.fr/ProjetIA-21-DMAV-0001"
          :title="t('global.footer.anr.link')"
          data-testid="anr-link"
        >
          <img
            class="long-img av-row"
            src="/assets/images/anr-logo.jpg"
            alt="Logo ANR"
          >
        </a>
        <a
          href="https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de"
          :title="t('global.footer.france2030')"
          data-testid="france2030-link"
        >
          <img
            class="square-img av-row"
            src="/assets/images/france2030-logo.png"
            alt="Logo France 2030"
          >
        </a>
      </div>

      <span
        class="caption-regular av-text-text1 anr-desc"
        data-testid="anr-description"
      >
        {{ t('global.footer.anr.description') }}
      </span>
    </div>

    <div class="av-row av-wrap av-nowrap--md av-justify-start av-justify-between--md av-gap-md av-py-xl av-px-5xl">
      <div class="cofolio-container av-col av-gap-sm av-align-start">
        <CofolioLogoSvg
          role="img"
          aria-label="Logo Cofolio"
          data-testid="cofolio-logo"
        />
        <span
          class="caption-regular av-text-text1"
          data-testid="cofolio-description"
        >
          {{ t('global.footer.instituteInfo') }}
        </span>
      </div>

      <div class="av-row av-wrap av-nowrap--md av-justify-start av-justify-end--md av-gap-5xl av-pt-md av-flex-fill">
        <div class="av-col av-gap-sm av-justify-start">
          <span class="b2-bold">
            {{ t('global.footer.sections.legalInformation.title') }}
          </span>
          <ul class="av-col av-gap-sm av-justify-start av-list-reset">
            <li
              v-for="(link, index) in legalInformationLinks"
              :key="index"
              class="legal-information-link"
              data-testid="legal-information-link"
            >
              <RouterLink
                :to="link.to"
                :title="link.label"
                class="legal-information-router-link"
              >
                <span class="caption-regular av-text-text1">{{ link.label }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="av-col av-gap-sm av-justify-start">
          <span class="b2-bold">
            {{ t('global.footer.sections.otherSites.title') }}
          </span>
          <ul class="av-col av-gap-sm av-justify-start av-list-reset">
            <li
              v-for="({ href, label, title, ...attrs }, index) in otherSitesLinks"
              :key="index"
              class="av-footer__content-item"
              data-testid="other-sites-link"
            >
              <a
                class="av-footer__content-link caption-regular av-text-text1"
                :href="href"
                target="_blank"
                rel="noopener noreferrer"
                :title="title"
                :aria-label="title"
                v-bind="attrs"
              >
                {{ label }}
              </a>
            </li>
          </ul>
        </div>

        <div class="av-col av-gap-sm av-justify-start">
          <span class="b2-bold">
            {{ t('global.footer.sections.partners.title') }}
          </span>
          <div class="av-row av-wrap av-gap-lg av-align-center">
            <a
              href="https://avenirs-esr.fr/"
              :aria-label="t('global.footer.sections.partners.links.avenirs')"
              :title="t('global.footer.sections.partners.links.avenirs')"
              data-testid="avenirs-link"
            >
              <img
                class="long-img"
                src="/assets/images/avenirs-esr-logo.png"
                alt="Logo Avenir(s) ESR"
              >
            </a>
            <a
              href="https://www.esup-portail.org/"
              :aria-label="t('global.footer.sections.partners.links.esup')"
              :title="t('global.footer.sections.partners.links.esup')"
              data-testid="esup-link"
            >
              <EsupLogo height="2rem" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="copyright-container av-col av-align-center av-pt-xs av-px-5xl av-pb-md">
      <a
        class="caption-regular av-text-text1 copyright"
        href="https://www.esup-portail.org/"
        :aria-label="t('global.footer.copyright.aria')"
        data-testid="copyright-link"
      >
        {{ t('global.footer.copyright.link') }}
      </a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
[href] {
  background-image: none;
}

.separator {
  height: var(--dimension-5xl);
  background: var(--dark-background-primary1);
}

.copyright-container {
  border-top: 1px solid var(--stroke);
}

.cofolio-container {
  width: var(--dimension-7xl);
}

.no-content-after {
  --link-blank-content: '';
}

.anr {
  border-bottom: 1px solid var(--stroke);
}

img {
  background-color: var(--other-background-base);
}

.long-img {
  height: var(--dimension-lg);
  width: auto;
}

.square-img {
  height: var(--dimension-xl);
  width: auto;
}

a:focus {
  outline-color: var(--dark-background-primary2);
}

a:hover, a span:hover {
  color: var(--dark-background-primary1) !important;
}

ul {
  padding-inline-start: 0;
}

li::marker {
  content: none;
  margin: 0;
}
</style>
