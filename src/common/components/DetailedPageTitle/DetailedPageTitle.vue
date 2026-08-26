<script setup lang="ts">
import PageTitle, { type PageTitleProps } from '@/common/components/PageTitle/PageTitle.vue'
import { useI18n } from 'vue-i18n'

defineProps<PageTitleProps>()

const { t } = useI18n()
</script>

<template>
  <PageTitle v-bind="$props">
    <template #title>
      <h1 class="av-text-title">
        {{ t('global.detail') }}
        <span class="n4 av-max-lines">{{ title }}</span>
      </h1>
    </template>
  </PageTitle>
</template>

<style lang="scss" scoped>
.n4 {
  color: var(--dark-background-neutral)
}
</style>
