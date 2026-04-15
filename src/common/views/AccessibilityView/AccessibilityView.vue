<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const route = useRoute()

const content = ref<string>('')

const isStudentRoute = computed(() => route.path.startsWith('/student'))

const homeRoute = computed(() => isStudentRoute.value
  ? ROUTES.STUDENT.HOME
  : ROUTES.STAFF.HOME)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: homeRoute.value },
  { text: t('global.views.accessibilityView.title') },
])

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
    :title="t('global.views.accessibilityView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="homeRoute"
  />

  <div
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
