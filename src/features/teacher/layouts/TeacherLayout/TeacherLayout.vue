<script setup lang="ts">
import type { DsfrHeaderProps } from '@gouvminint/vue-dsfr'
import { useLanguageSwitcher } from '@/common/composables/'
import { teacherHomeRoute } from '@/features/teacher/routes'
import { AvHeader } from '@/ui'

const { languageSelector, selectLanguage } = useLanguageSwitcher()
const serviceTitle = 'CoFolio Enseignant'

const quickLinks: DsfrHeaderProps['quickLinks'] = [
  {
    label: 'Home',
    to: teacherHomeRoute,
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
    :service-title="serviceTitle"
    :home-to="teacherHomeRoute"
    show-search
    :quick-links="quickLinks"
    :language-selector="languageSelector"
    @language-select="selectLanguage($event)"
  />

  <main>
    <div class="fr-container  fr-mt-3w  fr-mt-md-5w  fr-mb-5w">
      <router-view />
    </div>
  </main>
</template>

<style lang="scss" scoped>
</style>
