<script setup lang="ts">
import { AvNavigation, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { ICONS } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ROUTES } from '@/constants'
import { nationalToolsRoutes } from '@/features/national-tools/routes'
import { termsOfServiceRoutes } from '@/features/terms-of-service/routes'
import { isRouteActive } from '@/utils/route/route'

const { t } = useI18n()
const route = useRoute()

const navItems = computed(() => [
  {
    id: 'nav-home',
    to: ROUTES.HOME,
    text: t('global.MainNavigation.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
  },
  {
    id: 'nav-national-tools',
    to: ROUTES.NATIONAL_TOOLS,
    text: t('global.MainNavigation.nationalTools').toUpperCase(),
    icon: ICONS.TOOLS,
    highlight: isRouteActive({ route, routes: nationalToolsRoutes }),
  },
  {
    id: 'nav-terms-of-service',
    to: ROUTES.TERMS_OF_SERVICE,
    text: t('global.MainNavigation.termsOfService').toUpperCase(),
    icon: MDI_ICONS.FILE_DOCUMENT_EDIT_OUTLINE,
    highlight: isRouteActive({ route, routes: termsOfServiceRoutes }),
  },
  {
    id: 'nav-global-alert',
    to: ROUTES.GLOBAL_ALERT.DETAILS,
    text: t('global.MainNavigation.globalAlert').toUpperCase(),
    icon: MDI_ICONS.ALERT_OUTLINE,
    highlight: isRouteActive({ route, routes: [ROUTES.GLOBAL_ALERT.DETAILS, ROUTES.GLOBAL_ALERT.UPDATE] }),
  }
])
</script>

<template>
  <AvNavigation
    :nav-items="navItems"
    data-testid="main-navigation"
  />
</template>
