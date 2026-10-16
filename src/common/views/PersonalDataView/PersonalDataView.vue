<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'

const { t } = useI18n()

const title = computed(() => t('global.views.personalDataView.title'))

const trailingLinks = computed(() => [{ text: title.value }])
</script>

<template>
  <PageTitle
    :title="title"
    :trailing-links="trailingLinks"
  />
</template>
