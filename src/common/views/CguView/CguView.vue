<script setup lang="ts">
import type { AvLocale } from '@/types'
import { useGetLatestCgu } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { formatDateLocalized } from '@/common/utils'
import DOMPurify from 'dompurify'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const { data: cgu, isLoading, error } = useGetLatestCgu()

const title = computed(() => t('global.views.cguView.title'))

const trailingLinks = computed(() => [{ text: title.value }])

const version = computed(() => cgu.value ? t('global.views.cguView.version', { version: cgu.value.version }) : '')

const lastPublication = computed(() => cgu.value
  ? t('global.views.cguView.lastPublication', { date: formatDateLocalized(cgu.value.uploadedAt, locale.value as AvLocale) })
  : '')

const sanitizedContent = computed(() => DOMPurify.sanitize(cgu.value?.content ?? ''))
</script>

<template>
  <PageTitle
    :title="title"
    :trailing-links="trailingLinks"
  />

  <QuerySuspense
    :error="error"
    :is-loading="isLoading"
  >
    <div
      v-if="cgu"
      class="av-col av-gap-lg"
    >
      <div class="av-row av-wrap av-align-baseline av-gap-x-md av-gap-y-xs">
        <span
          class="b2-bold"
          data-testid="cgu-version"
        >
          {{ version }}
        </span>
        <span
          class="caption-regular av-text-text2"
          data-testid="cgu-last-publication"
        >
          {{ lastPublication }}
        </span>
      </div>

      <div
        class="cgu-content"
        data-testid="cgu-content"
        data-user-content
        v-html="sanitizedContent"
      />
    </div>
  </QuerySuspense>
</template>

<style lang="scss" scoped>
.cgu-content {
  :deep() {
    a {
      color: var(--dark-background-primary1);
      text-decoration: underline;
    }
  }
}
</style>
