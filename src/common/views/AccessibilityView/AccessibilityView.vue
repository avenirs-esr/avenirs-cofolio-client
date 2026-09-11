<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useBreadcrumb } from '@/common/composables'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const content = ref<string>('')

const title = computed(() => t('global.views.accessibilityView.title'))

const { breadcrumbLinks } = useBreadcrumb(() => [{ text: title.value }])

async function loadDeclaration (locale: string) {
  const content = await import(`@/common/views/AccessibilityView/declaration.${locale}.md?raw`)
  return content.default
}

watchEffect(() => {
  loadDeclaration(locale.value).then((declaration) => {
    content.value = declaration
  })
})
</script>

<template>
  <PageTitle
    :title="title"
    :breadcrumb-links="breadcrumbLinks"
  />

  <div
    role="document"
    class="accessibility-declaration"
    v-html="content"
  />
</template>

<style lang="scss" scoped>
.accessibility-declaration {
  :deep() {
    a {
      color: var(--dark-background-primary1);
      text-decoration: underline;
    }
    .to-update {
      background-color: var(--light-background-primary3);
    }
  }
}
</style>
