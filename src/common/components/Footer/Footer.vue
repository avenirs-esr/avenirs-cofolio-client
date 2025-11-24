<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import CofolioLogoSvg from '@/assets/icons/cofolio-without-baseline.svg'
import { ROUTE_NAMES } from '@/common/constants'
import { EsupLogo, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface FooterProps {
  a11yCompliance?: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT'
  a11yComplianceLink?: RouteLocationRaw
  legalLink?: string
  personalDataLink?: string
  cookiesLink?: string
  mandatoryLinks?: {
    label: string
    to: RouteLocationRaw
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
const route = useRoute()
const { isMobile, isTablet } = useAvBreakpoints()

const isStudentRoute = computed(() => route.path.startsWith('/student'))

const a11yCompliance = computed(() => {
  if (props.a11yCompliance === 'COMPLIANT') {
    return t('global.footer.links.accessibility.compliant')
  }
  if (props.a11yCompliance === 'NON_COMPLIANT') {
    return t('global.footer.links.accessibility.nonCompliant')
  }
  return t('global.footer.links.accessibility.partiallyCompliant')
})

const mandatoryLinks = computed(() => props.mandatoryLinks ?? [
  {
    label: a11yCompliance.value,
    to: isStudentRoute.value ? ROUTE_NAMES.STUDENT.ACCESSIBILITY : ROUTE_NAMES.TEACHER.ACCESSIBILITY
  },
  {
    label: t('global.footer.links.legal'),
    to: isStudentRoute.value ? ROUTE_NAMES.STUDENT.LEGAL : ROUTE_NAMES.TEACHER.LEGAL
  },
  {
    label: t('global.footer.links.data'),
    to: isStudentRoute.value ? ROUTE_NAMES.STUDENT.PERSONNAL_DATA : ROUTE_NAMES.TEACHER.PERSONNAL_DATA
  },
  {
    label: t('global.footer.links.cookies'),
    to: isStudentRoute.value ? ROUTE_NAMES.STUDENT.COOKIES : ROUTE_NAMES.TEACHER.COOKIES
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
    class="av-footer"
    role="contentinfo"
  >
    <div class="separator" />
    <div class="line-container anr">
      <div
        class="support-logo-container"
        :class="{
          'support-logo-container--mobile': isMobile,
        }"
      >
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
      </div>

      <span class="caption-regular anr-desc">
        {{ t('global.footer.anr') }}
      </span>
    </div>

    <div
      class="main-container"
      :class="{
        'main-container--mobile': isMobile,
      }"
    >
      <div class="cofolio-container">
        <CofolioLogoSvg />
        <span class="caption-regular">
          {{ t('global.footer.instituteInfo') }}
        </span>
      </div>

      <div
        class="links-container"
        :class="{
          'links-container--mobile': isMobile,
          'links-container--tablet': isTablet,
        }"
      >
        <div class="links-column">
          <span class="b2-bold">
            {{ "Informations" }}
          </span>
          <ul class="links-list">
            <li
              v-for="(link, index) in mandatoryLinks"
              :key="index"
              class="mandatory-link"
            >
              <RouterLink
                :to="link.to"
                :title="link.label"
                class="mandatory-router-link"
              >
                <span class="caption-regular">{{ link.label }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="links-column">
          <span class="b2-bold">
            {{ "Autres sites" }}
          </span>
          <ul class="links-list">
            <li
              v-for="({ href, label, title, ...attrs }, index) in ecosystemLinks"
              :key="index"
              class="av-footer__content-item"
            >
              <a
                class="av-footer__content-link caption-regular"
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

        <div class="links-column">
          <span class="b2-bold">
            {{ "Partenaires" }}
          </span>
          <div class="partners">
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
        </div>
      </div>
    </div>

    <div class="copyright-container">
      <a
        class="caption-regular copyright"
        href="https://www.esup-portail.org/"
      >
        {{ t('global.footer.links.copyright') }}
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

.main-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: var(--spacing-xl) var(--spacing-5xl) var(--spacing-xl) var(--spacing-5xl);
  gap: var(--spacing-md);

  &--mobile {
    flex-wrap: wrap;
    justify-content: start;
  }
}

.copyright-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-5xl) var(--spacing-md) var(--spacing-5xl);
  border-top: 1px solid var(--stroke);
}

.cofolio-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: flex-start;
  width: var(--dimension-7xl);
}

.links-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
  gap: var(--spacing-5xl);
  padding-top: var(--spacing-md);

  &--tablet, &--mobile {
    flex-wrap: wrap;
    justify-content: start;
  }
}

.links-column, .links-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  justify-content: flex-start;
}

.partners {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  align-items: center;
}

.caption-regular, a {
  color: var(--text1);
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
  border-bottom: 1px solid var(--stroke);
  justify-content: center;
}

.support-logo-container {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md);

  &--mobile {
    flex-wrap: wrap;
    justify-content: start;
  }
}

.anr {
  padding: var(--spacing-xs) var(--spacing-sm);
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

a img {
  display: flex;
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
