<script setup lang="ts">
import { ROUTES } from '@/common/constants'
import { AvNavigation, EOS_ICONS, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const homeItemId = useId()
const navItems = computed(() => [
  {
    id: homeItemId,
    to: ROUTES.STAFF.HOME,
    text: t('staff.global.navigation.tabs.home').toUpperCase(),
    icon: MDI_ICONS.HOME_VARIANT_OUTLINE,
  },
  {
    to: ROUTES.STAFF.ACTIVITIES,
    text: t('staff.global.navigation.tabs.activities.header').toUpperCase(),
    icon: EOS_ICONS.ACTION_CHAINS_OUTLINED,
  },
])
</script>

<template>
  <AvNavigation
    :nav-items="navItems"
    data-testid="main-navigation"
  />
</template>
