<!-- This code is an adaptation of the source code of DsfrFooter available at:
 https://vue-ds.fr/composants/DsfrFooter -->

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import CofolioLogoSvg from '@/assets/icons/cofolio-without-baseline.svg'
import { studentAccessibilityRoute, studentCookiesRoute, studentLegalRoute, studentPersonnalDataRoute } from '@/features/student'
import { teacherAccessibilityRoute, teacherCookiesRoute, teacherLegalRoute, teacherPersonnalDataRoute } from '@/features/teacher'
import { EsupLogo } from '@/ui'
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
    to: { name: isStudentRoute.value ? studentAccessibilityRoute.name : teacherAccessibilityRoute.name },
  },
  {
    label: t('global.footer.links.legal'),
    to: { name: isStudentRoute.value ? studentLegalRoute.name : teacherLegalRoute.name },
  },
  {
    label: t('global.footer.links.data'),
    to: { name: isStudentRoute.value ? studentPersonnalDataRoute.name : teacherPersonnalDataRoute.name },
  },
  {
    label: t('global.footer.links.cookies'),
    to: { name: isStudentRoute.value ? studentCookiesRoute.name : teacherCookiesRoute.name },
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
    <div class="separator" />
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

    <div class="main-container">
      <div class="cofolio-container">
        <CofolioLogoSvg />
        <span class="caption-regular">
          {{ t('global.footer.instituteInfo') }}
        </span>
      </div>

      <div class="links-container">
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
              class="fr-footer__content-item"
            >
              <a
                class="fr-footer__content-link caption-regular"
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
.fr-footer {
  padding-top: var(--dimension-xl);
  box-shadow: none;
}

[href] {
  background-image: none;
}

.separator {
  height: var(--dimension-5xl);
  width: 100%;
  background: var(--dark-background-primary1);
}

.main-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: var(--spacing-xl) var(--spacing-5xl) var(--spacing-xl) var(--spacing-5xl);
  gap: var(--spacing-md);
}

.copyright-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  width: 100%;
  border-bottom: 1px solid var(--stroke);
  justify-content: center;
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
</style>
