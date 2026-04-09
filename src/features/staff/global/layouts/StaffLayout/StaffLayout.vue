<script setup lang="ts">
import Footer from '@/common/components/Footer/Footer.vue'
import SwitchUniverse from '@/common/components/SwitchUniverse/SwitchUniverse.vue'
import { useLanguageSwitcher } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import StaffNavigation from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.vue'
import { AvHeader } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { languageSelector, selectLanguage } = useLanguageSwitcher()

const searchQuery = ref('')

defineExpose({ searchQuery })
</script>

<template>
  <AvHeader
    v-model="searchQuery"
    :home-label="t('staff.global.layout.header.home')"
    :home-to="ROUTES.STAFF.HOME"
    :language-selector="languageSelector"
    @language-select="selectLanguage($event)"
  >
    <template #mainnav>
      <StaffNavigation />
    </template>
    <template #roleContext>
      <SwitchUniverse />
    </template>
  </AvHeader>

  <main>
    <div class="av-container av-mt-md">
      <router-view />
    </div>
  </main>

  <Footer />
</template>
