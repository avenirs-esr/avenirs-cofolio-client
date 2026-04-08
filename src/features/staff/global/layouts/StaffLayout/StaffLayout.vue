<script setup lang="ts">
import Footer from '@/common/components/Footer/Footer.vue'
import SwitchUniverse from '@/common/components/SwitchUniverse/SwitchUniverse.vue'
import { useLanguageSwitcher } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { AvHeader, type AvHeaderProps } from '@avenirs-esr/avenirs-dsav'

const { languageSelector, selectLanguage } = useLanguageSwitcher()

const quickLinks: AvHeaderProps['quickLinks'] = [
  {
    label: 'Home',
    to: ROUTES.STAFF.HOME,
    icon: 'ri-home-4-line',
    iconAttrs: { color: 'var(--red-marianne-425-625)' },
  },
]

const searchQuery = ref('')

defineExpose({ searchQuery })
</script>

<template>
  <AvHeader
    v-model="searchQuery"
    service-title=" "
    :home-to="ROUTES.STAFF.HOME"
    show-search
    :quick-links="quickLinks"
    :language-selector="languageSelector"
    @language-select="selectLanguage($event)"
  >
    <template #serviceDescription>
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
