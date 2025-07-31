<!-- This code is an adaptation of the source code of DsfrFooter available at:
 https://vue-ds.fr/composants/DsfrFooter -->

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { EsupLogo } from '@/ui'
import { useI18n } from 'vue-i18n'

interface FooterProps {
  a11yCompliance?: string
  a11yComplianceLink?: RouteLocationRaw
  legalLink?: string
  personalDataLink?: string
  cookiesLink?: string
  mandatoryLinks?: {
    label: string
    to: RouteLocationRaw | undefined
    title?: string
  }[]
  ecosystemLinks?: {
    label: string
    href: string
    title: string
    [key: string]: string
  }[]
};

const props = defineProps<FooterProps>()

const { t } = useI18n()

const a11yCompliance = computed(() => props.a11yCompliance ?? 'non conforme')
const a11yComplianceLink = computed(() => props.a11yComplianceLink ?? '/a11y')
const legalLink = computed(() => props.legalLink ?? '/mentions-legales')
const personalDataLink = computed(() => props.personalDataLink ?? '/donnees-personnelles')
const cookiesLink = computed(() => props.cookiesLink ?? '/cookies')
const mandatoryLinks = computed(() => props.mandatoryLinks ?? [
  {
    label: t('global.footer.links.accessibility', { compliance: a11yCompliance.value }),
    to: a11yComplianceLink.value,
  },
  {
    'label': t('global.footer.links.legal'),
    'to': legalLink.value,
    'data-testid': '/mentions-legales',
  },
  {
    label: t('global.footer.links.data'),
    to: personalDataLink.value,
  },
  {
    label: t('global.footer.links.cookies'),
    to: cookiesLink.value,
  },
])
const ecosystemLinks = computed(() => props.ecosystemLinks ?? [
  {
    label: 'avenirs-esr.fr',
    href: 'https://avenirs-esr.fr/',
    title: t('global.footer.links.avenirs'),
  },
]
)
</script>

<template>
  <footer
    id="footer"
    class="fr-footer"
    role="contentinfo"
  >
    <div class="line-container anr">
      <a
        href="https://anr.fr/ProjetIA-21-DMAV-0001"
        :title="t('global.footer.links.anr')"
      >
        <img
          class="long-img"
          src="/assets/images/anr-logo.jpg"
          alt="Logo ANR"
        >
      </a>
      <a
        href="https://www.info.gouv.fr/actualite/france-2030-attractivite-de-l-excellence-universitaire-francaise-le-gouvernement-investit-pres-de"
        :title="t('global.footer.links.france2030')"
      >
        <img
          class="square-img"
          src="/assets/images/france2030-logo.png"
          alt="Logo France 2030"
        >
      </a>
      <span class="caption-regular anr-desc">
        {{ t('global.footer.anr') }}
      </span>
    </div>
    <div class="line-container institute">
      <div class="institute-logo">
        <a
          href="https://avenirs-esr.fr/"
          :title="t('global.footer.links.avenirs')"
        >
          <img
            class="long-img"
            src="/assets/images/avenirs-esr-logo.png"
            alt="Logo Avenir(s) ESR"
          >
        </a>
        <a
          href="https://www.esup-portail.org/"
          :title="t('global.footer.links.esup')"
        >
          <EsupLogo height="2rem" />
        </a>
      </div>
      <div class="institute-info">
        <span class="caption-regular">
          {{ t('global.footer.instituteInfo') }}
        </span>
        <ul class="fr-footer__content-list">
          <li
            v-for="({ href, label, title, ...attrs }, index) in ecosystemLinks"
            :key="index"
            class="fr-footer__content-item"
          >
            <a
              class="fr-footer__content-link"
              :href="href"
              target="_blank"
              rel="noopener noreferrer"
              :title="title"
              v-bind="attrs"
            >
              {{ label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="line-container mandatory-links">
      <ul class="fr-footer__bottom-list">
        <li
          v-for="(link, index) in mandatoryLinks"
          :key="index"
          class="fr-footer__bottom-item"
        >
          <DsfrFooterLink
            v-bind="link"
          />
        </li>
      </ul>
    </div>
    <div class="line-container copyright">
      <a
        class="caption-regular"
        href="https://www.esup-portail.org/"
      >
        {{ t('global.footer.links.copyright') }}
      </a>
    </div>
  </footer>
</template>

<style scoped>
.fr-footer {
  color: var(--text-default-grey);
  padding-top: var(--spacing-none);
}
.no-content-after {
  --link-blank-content: '';
}
.ov-icon {
  margin-bottom: 0;
}

.line-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  width: 100%;
  background-color: var(--dark-background-primary2);
  border-bottom: 1px solid var(--stroke);
  justify-content: center;
}

.anr {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--dark-background-primary3);
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

.institute {
  justify-content: space-between;
}

.institute-logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-md);
}

.institute-info {
  display: flex;
  flex-direction: column;
}

.caption-regular, a {
  color: var(--other-background-base);
}

ul {
  text-align: center;
}

a img {
  display: flex;
}

a:focus {
  outline-color: var(--base);
}
</style>
